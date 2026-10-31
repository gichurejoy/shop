import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';
import { IProduct, ProductStatus, ProductType } from '../types/product';
import { ICategory } from '../types/category';
import { IOrder, OrderStatus, PaymentStatus } from '../types/order';
import { ICoupon, CouponValidationResult } from '../types/coupon';
import { IUser } from '../types/auth';
import { IPaymentTransaction } from '../types/payment';

const DB_PATH = path.join(process.cwd(), 'data', 'store.json');

function readBackupStore(): any {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch {}
  return { products: [], categories: [], orders: [], coupons: [], users: [], transactions: [] };
}

function writeBackupStore(data: any): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to update store backup file:', err);
  }
}

function mapProduct(p: any): IProduct {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description || '',
    short_description: p.shortDescription || '',
    type: (p.type as ProductType) || ProductType.SIMPLE,
    status: (p.status as ProductStatus) || ProductStatus.ACTIVE,
    price: Number(p.price),
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    stock_quantity: p.stockQuantity ?? 10,
    sku: p.sku || `SKU-${p.id}`,
    is_visible: p.isVisible !== false,
    category: p.category ? mapCategory(p.category) : undefined,
    created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    updated_at: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
  };
}

function mapCategory(c: any): ICategory {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image_url: c.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
    sort_order: c.sortOrder ?? 0,
    created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updated_at: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  };
}

function mapOrder(o: any): IOrder {
  return {
    id: o.id,
    orderNumber: o.orderNumber || o.id,
    customerId: o.customerId || undefined,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone || '',
    items: Array.isArray(o.items)
      ? o.items.map((i: any) => ({
          id: i.id,
          productId: i.productId || i.id,
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          selectedSize: i.selectedSize || undefined,
          selectedColor: i.selectedColor || undefined,
          image: i.image || '',
        }))
      : [],
    subtotal: Number(o.subtotal),
    tax: Number(o.tax || 0),
    shippingFee: Number(o.shippingFee || 0),
    discount: Number(o.discount || 0),
    total: Number(o.total),
    status: (o.status as OrderStatus) || 'pending',
    paymentStatus: (o.paymentStatus as PaymentStatus) || 'unpaid',
    paymentMethod: o.paymentMethod || 'card',
    shippingMethod: o.shippingMethod || 'standard',
    shippingAddress: typeof o.shippingAddress === 'object' && o.shippingAddress !== null ? o.shippingAddress : {},
    trackingNumber: o.trackingNumber || undefined,
    timeline: Array.isArray(o.timeline) ? o.timeline : [],
    orderNotes: o.orderNotes || undefined,
    giftWrap: o.giftWrap || false,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const db = {
  // PRODUCTS
  products: {
    getAll: async (params?: { q?: string; category?: string; status?: string; minPrice?: number; maxPrice?: number; limit?: number; page?: number }) => {
      try {
        const where: any = {};
        if (params?.status) {
          where.status = params.status;
        }
        if (params?.category) {
          where.OR = [
            { category: { slug: params.category } },
            { categoryId: params.category },
          ];
        }
        if (params?.q) {
          where.OR = [
            { title: { contains: params.q } },
            { description: { contains: params.q } },
          ];
        }
        if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
          where.price = {};
          if (params?.minPrice !== undefined) where.price.gte = params.minPrice;
          if (params?.maxPrice !== undefined) where.price.lte = params.maxPrice;
        }

        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
          prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.product.count({ where }),
        ]);

        return { products: items.map(mapProduct), total, page, limit };
      } catch (err) {
        console.warn('MySQL product.findMany failed, falling back to backup file:', err);
        const store = readBackupStore();
        let list = [...(store.products || [])];
        if (params?.q) {
          const query = params.q.toLowerCase();
          list = list.filter((p: any) => p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query)));
        }
        if (params?.category) {
          list = list.filter((p: any) => p.category?.slug === params.category || p.category?.id === params.category);
        }
        if (params?.status) {
          list = list.filter((p: any) => p.status === params.status);
        }
        const total = list.length;
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const paginated = list.slice((page - 1) * limit, page * limit);
        return { products: paginated, total, page, limit };
      }
    },

    getByIdOrSlug: async (idOrSlug: string): Promise<IProduct | null> => {
      try {
        const item = await prisma.product.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
          include: { category: true },
        });
        return item ? mapProduct(item) : null;
      } catch (err) {
        const store = readBackupStore();
        return store.products.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug) || null;
      }
    },

    create: async (data: Partial<IProduct>): Promise<IProduct> => {
      const slug = data.slug || (data.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const categoryId = data.category?.id || (data as any).category_id || null;

      try {
        const created = await prisma.product.create({
          data: {
            id: data.id || `prod-${Date.now()}`,
            title: data.title || 'Untitled Product',
            slug,
            description: data.description || '',
            shortDescription: data.short_description || '',
            type: data.type || ProductType.SIMPLE,
            status: data.status || ProductStatus.ACTIVE,
            price: Number(data.price) || 0,
            compareAtPrice: data.compare_at_price ? Number(data.compare_at_price) : null,
            stockQuantity: data.stock_quantity !== undefined ? Number(data.stock_quantity) : 10,
            sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
            isVisible: data.is_visible !== false,
            categoryId,
          },
          include: { category: true },
        });

        // Backup sync
        const store = readBackupStore();
        store.products = [mapProduct(created), ...store.products];
        writeBackupStore(store);

        return mapProduct(created);
      } catch (err) {
        console.error('MySQL product create failed:', err);
        const store = readBackupStore();
        const fallback: IProduct = {
          id: String(Date.now()),
          title: data.title || 'Untitled Product',
          slug,
          description: data.description || '',
          short_description: data.short_description || '',
          type: data.type || ProductType.SIMPLE,
          status: data.status || ProductStatus.ACTIVE,
          price: Number(data.price) || 0,
          compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : undefined,
          stock_quantity: data.stock_quantity !== undefined ? Number(data.stock_quantity) : 10,
          sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
          is_visible: data.is_visible !== false,
          category: data.category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        store.products.unshift(fallback);
        writeBackupStore(store);
        return fallback;
      }
    },

    update: async (id: string, updates: Partial<IProduct>): Promise<IProduct | null> => {
      try {
        const updated = await prisma.product.update({
          where: { id },
          data: {
            title: updates.title,
            slug: updates.slug,
            description: updates.description,
            shortDescription: updates.short_description,
            type: updates.type,
            status: updates.status,
            price: updates.price !== undefined ? Number(updates.price) : undefined,
            compareAtPrice: updates.compare_at_price !== undefined ? Number(updates.compare_at_price) : undefined,
            stockQuantity: updates.stock_quantity !== undefined ? Number(updates.stock_quantity) : undefined,
            sku: updates.sku,
            isVisible: updates.is_visible,
            categoryId: updates.category?.id,
          },
          include: { category: true },
        });

        const store = readBackupStore();
        const idx = store.products.findIndex((p: any) => p.id === id);
        if (idx !== -1) {
          store.products[idx] = mapProduct(updated);
          writeBackupStore(store);
        }

        return mapProduct(updated);
      } catch (err) {
        const store = readBackupStore();
        const idx = store.products.findIndex((p: any) => p.id === id);
        if (idx === -1) return null;
        store.products[idx] = { ...store.products[idx], ...updates, updated_at: new Date().toISOString() };
        writeBackupStore(store);
        return store.products[idx];
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await prisma.product.delete({ where: { id } });
        const store = readBackupStore();
        store.products = store.products.filter((p: any) => p.id !== id);
        writeBackupStore(store);
        return true;
      } catch (err) {
        const store = readBackupStore();
        const initialLen = store.products.length;
        store.products = store.products.filter((p: any) => p.id !== id);
        if (store.products.length !== initialLen) {
          writeBackupStore(store);
          return true;
        }
        return false;
      }
    },
  },

  // CATEGORIES
  categories: {
    getAll: async (): Promise<ICategory[]> => {
      try {
        const categories = await prisma.category.findMany({
          orderBy: { sortOrder: 'asc' },
        });
        return categories.map(mapCategory);
      } catch {
        const store = readBackupStore();
        return store.categories || [];
      }
    },

    getByIdOrSlug: async (idOrSlug: string): Promise<ICategory | null> => {
      try {
        const cat = await prisma.category.findFirst({
          where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        });
        return cat ? mapCategory(cat) : null;
      } catch {
        const store = readBackupStore();
        return store.categories.find((c: any) => c.id === idOrSlug || c.slug === idOrSlug) || null;
      }
    },

    create: async (data: Partial<ICategory>): Promise<ICategory> => {
      const slug = data.slug || (data.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      try {
        const total = await prisma.category.count();
        const created = await prisma.category.create({
          data: {
            id: data.id || `cat-${Date.now().toString().slice(-6)}`,
            name: data.name || 'New Category',
            slug,
            description: data.description || '',
            imageUrl: data.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
            sortOrder: data.sort_order ?? total + 1,
          },
        });

        const store = readBackupStore();
        store.categories.push(mapCategory(created));
        writeBackupStore(store);

        return mapCategory(created);
      } catch (err) {
        const store = readBackupStore();
        const newCat: ICategory = {
          id: `cat-${Date.now().toString().slice(-6)}`,
          name: data.name || 'New Category',
          slug,
          description: data.description || '',
          image_url: data.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
          sort_order: store.categories.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        store.categories.push(newCat);
        writeBackupStore(store);
        return newCat;
      }
    },
  },

  // ORDERS
  orders: {
    getAll: async (params?: { status?: string; paymentStatus?: string; search?: string; limit?: number; page?: number }) => {
      try {
        const where: any = {};
        if (params?.status && params.status !== 'All') {
          where.status = params.status.toLowerCase();
        }
        if (params?.paymentStatus && params.paymentStatus !== 'All') {
          where.paymentStatus = params.paymentStatus.toLowerCase();
        }
        if (params?.search) {
          where.OR = [
            { orderNumber: { contains: params.search } },
            { customerName: { contains: params.search } },
            { customerEmail: { contains: params.search } },
          ];
        }

        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
          prisma.order.findMany({
            where,
            include: { items: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.order.count({ where }),
        ]);

        return { orders: items.map(mapOrder), total, page, limit };
      } catch (err) {
        const store = readBackupStore();
        let list = [...(store.orders || [])];
        if (params?.status && params.status !== 'All') {
          list = list.filter((o: any) => o.status.toLowerCase() === params.status!.toLowerCase());
        }
        if (params?.paymentStatus && params.paymentStatus !== 'All') {
          list = list.filter((o: any) => o.paymentStatus.toLowerCase() === params.paymentStatus!.toLowerCase());
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter((o: any) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q)
          );
        }
        const total = list.length;
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const paginated = list.slice((page - 1) * limit, page * limit);
        return { orders: paginated, total, page, limit };
      }
    },

    getById: async (id: string): Promise<IOrder | null> => {
      try {
        const order = await prisma.order.findFirst({
          where: { OR: [{ id }, { orderNumber: id }] },
          include: { items: true },
        });
        return order ? mapOrder(order) : null;
      } catch {
        const store = readBackupStore();
        return store.orders.find((o: any) => o.id === id || o.orderNumber === id) || null;
      }
    },

    create: async (orderData: Omit<IOrder, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<IOrder> => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `LK-2024-${randomNum}`;
      const now = new Date();

      const initialTimeline = [
        {
          status: orderData.status || 'pending',
          title: 'Order Placed',
          description: `Order ${orderNumber} was confirmed.`,
          timestamp: now.toISOString(),
        },
      ];

      try {
        const created = await prisma.$transaction(async (tx) => {
          const ord = await tx.order.create({
            data: {
              id: orderNumber,
              orderNumber,
              customerId: orderData.customerId || null,
              customerName: orderData.customerName,
              customerEmail: orderData.customerEmail,
              customerPhone: orderData.customerPhone || null,
              subtotal: orderData.subtotal,
              tax: orderData.tax || 0,
              shippingFee: orderData.shippingFee || 0,
              discount: orderData.discount || 0,
              total: orderData.total,
              status: orderData.status || 'pending',
              paymentStatus: orderData.paymentStatus || 'paid',
              paymentMethod: orderData.paymentMethod || 'card',
              shippingMethod: orderData.shippingMethod || 'standard',
              shippingAddress: orderData.shippingAddress as any,
              trackingNumber: orderData.trackingNumber || null,
              timeline: initialTimeline,
              orderNotes: orderData.orderNotes || null,
              giftWrap: orderData.giftWrap || false,
            },
          });

          // Insert order items and deduct inventory atomically
          for (const item of orderData.items) {
            await tx.orderItem.create({
              data: {
                orderId: ord.id,
                productId: item.productId || null,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize || null,
                selectedColor: item.selectedColor || null,
                image: item.image || null,
              },
            });

            if (item.productId) {
              await tx.product.updateMany({
                where: { id: item.productId },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                },
              });
            }
          }

          return await tx.order.findUnique({
            where: { id: ord.id },
            include: { items: true },
          });
        });

        const mapped = mapOrder(created);
        const store = readBackupStore();
        store.orders = [mapped, ...(store.orders || [])];
        writeBackupStore(store);

        return mapped;
      } catch (err) {
        console.error('MySQL order create failed:', err);
        const store = readBackupStore();
        const fallback: IOrder = {
          ...orderData,
          id: orderNumber,
          orderNumber,
          timeline: initialTimeline,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
        store.orders.unshift(fallback);
        writeBackupStore(store);
        return fallback;
      }
    },

    updateStatus: async (id: string, status: OrderStatus, paymentStatus?: PaymentStatus, trackingNumber?: string): Promise<IOrder | null> => {
      try {
        const existing = await prisma.order.findFirst({
          where: { OR: [{ id }, { orderNumber: id }] },
        });
        if (!existing) return null;

        const currentTimeline = Array.isArray(existing.timeline) ? (existing.timeline as any[]) : [];
        const newTimeline = [
          ...currentTimeline,
          {
            status,
            title: `Status changed to ${status.toUpperCase()}`,
            description: `Order status updated to ${status}.`,
            timestamp: new Date().toISOString(),
          },
        ];

        const updated = await prisma.order.update({
          where: { id: existing.id },
          data: {
            status,
            paymentStatus: paymentStatus || existing.paymentStatus,
            trackingNumber: trackingNumber || existing.trackingNumber,
            timeline: newTimeline,
          },
          include: { items: true },
        });

        const mapped = mapOrder(updated);
        const store = readBackupStore();
        const idx = store.orders.findIndex((o: any) => o.id === existing.id || o.orderNumber === existing.orderNumber);
        if (idx !== -1) {
          store.orders[idx] = mapped;
          writeBackupStore(store);
        }

        return mapped;
      } catch (err) {
        const store = readBackupStore();
        const idx = store.orders.findIndex((o: any) => o.id === id || o.orderNumber === id);
        if (idx === -1) return null;
        const order = store.orders[idx];
        order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        order.updatedAt = new Date().toISOString();
        writeBackupStore(store);
        return order;
      }
    },
  },

  // COUPONS
  coupons: {
    getAll: async (): Promise<ICoupon[]> => {
      try {
        const list = await prisma.coupon.findMany();
        return list.map((c) => ({
          id: c.id,
          code: c.code,
          discountType: c.discountType as any,
          discountValue: Number(c.discountValue),
          minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : 0,
          isActive: c.isActive,
          usageCount: c.usageCount,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : new Date().toISOString(),
        }));
      } catch {
        return readBackupStore().coupons || [];
      }
    },

    validate: async (code: string, subtotal: number): Promise<CouponValidationResult> => {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: code.trim().toUpperCase() },
        });

        if (!coupon || !coupon.isActive) {
          return { valid: false, discountAmount: 0, message: 'Invalid or inactive promo code.' };
        }

        if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
          return { valid: false, discountAmount: 0, message: 'This promo code has expired.' };
        }

        const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
        if (subtotal < minOrder) {
          return { valid: false, discountAmount: 0, message: `Minimum order amount of $${minOrder} required.` };
        }

        let discountAmount = 0;
        const val = Number(coupon.discountValue);
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * val) / 100;
        } else {
          discountAmount = Math.min(val, subtotal);
        }

        const formattedCoupon: ICoupon = {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType as any,
          discountValue: val,
          minOrderAmount: minOrder,
          isActive: coupon.isActive,
          usageCount: coupon.usageCount,
          expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : new Date().toISOString(),
        };

        return {
          valid: true,
          coupon: formattedCoupon,
          discountAmount: Number(discountAmount.toFixed(2)),
          message: `Applied ${coupon.code} (-$${discountAmount.toFixed(2)})`,
        };
      } catch {
        const store = readBackupStore();
        const coupon = store.coupons?.find((c: any) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
        if (!coupon) return { valid: false, discountAmount: 0, message: 'Invalid promo code.' };
        const discountAmount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : Math.min(coupon.discountValue, subtotal);
        return {
          valid: true,
          coupon,
          discountAmount: Number(discountAmount.toFixed(2)),
          message: `Applied ${coupon.code} (-$${discountAmount.toFixed(2)})`,
        };
      }
    },
  },

  // USERS & AUTH
  users: {
    findByEmail: async (email: string): Promise<any | null> => {
      try {
        const u = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (!u) return null;
        return {
          ...u,
          createdAt: u.createdAt.toISOString(),
        };
      } catch {
        const store = readBackupStore();
        return store.users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
      }
    },

    create: async (data: { name: string; email: string; password: string; role?: 'admin' | 'staff' | 'customer'; phone?: string }): Promise<IUser> => {
      try {
        const created = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email.toLowerCase().trim(),
            passwordHash: data.password,
            role: data.role || 'customer',
            phone: data.phone || null,
          },
        });

        const safeUser: IUser = {
          id: created.id,
          name: created.name,
          email: created.email,
          role: (created.role as any) || 'customer',
          avatar: created.avatar || undefined,
          phone: created.phone || undefined,
          createdAt: created.createdAt.toISOString(),
        };

        const store = readBackupStore();
        store.users = [...(store.users || []), created];
        writeBackupStore(store);

        return safeUser;
      } catch (err) {
        const store = readBackupStore();
        const fallback: IUser = {
          id: `usr-${Date.now()}`,
          name: data.name,
          email: data.email.toLowerCase().trim(),
          role: data.role || 'customer',
          phone: data.phone,
          createdAt: new Date().toISOString(),
        };
        store.users = [...(store.users || []), { ...fallback, passwordHash: data.password }];
        writeBackupStore(store);
        return fallback;
      }
    },
  },

  // TRANSACTIONS
  transactions: {
    create: async (tx: Omit<IPaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPaymentTransaction> => {
      try {
        const created = await prisma.paymentTransaction.create({
          data: {
            orderId: tx.orderId,
            amount: tx.amount,
            currency: tx.currency || 'USD',
            method: tx.method,
            status: tx.status || 'pending',
            reference: tx.reference || null,
            phoneNumber: tx.phoneNumber || null,
            receiptNumber: tx.receiptNumber || null,
            metadata: tx.metadata || {},
          },
        });

        return {
          id: created.id,
          orderId: created.orderId,
          amount: Number(created.amount),
          currency: created.currency,
          method: created.method as any,
          status: created.status as any,
          reference: created.reference || '',
          phoneNumber: created.phoneNumber || undefined,
          receiptNumber: created.receiptNumber || undefined,
          metadata: (created.metadata as any) || undefined,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        };
      } catch (err) {
        console.error('MySQL transaction create failed:', err);
        const store = readBackupStore();
        const fallback: IPaymentTransaction = {
          ...tx,
          reference: tx.reference || `ref-${Date.now()}`,
          id: `tx-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.transactions = [fallback, ...(store.transactions || [])];
        writeBackupStore(store);
        return fallback;
      }
    },

    getByReference: async (ref: string): Promise<IPaymentTransaction | null> => {
      try {
        const tx = await prisma.paymentTransaction.findFirst({
          where: { OR: [{ reference: ref }, { id: ref }] },
        });
        if (!tx) return null;
        return {
          id: tx.id,
          orderId: tx.orderId,
          amount: Number(tx.amount),
          currency: tx.currency,
          method: tx.method as any,
          status: tx.status as any,
          reference: tx.reference || '',
          phoneNumber: tx.phoneNumber || undefined,
          receiptNumber: tx.receiptNumber || undefined,
          metadata: (tx.metadata as any) || undefined,
          createdAt: tx.createdAt.toISOString(),
          updatedAt: tx.updatedAt.toISOString(),
        };
      } catch {
        const store = readBackupStore();
        return store.transactions?.find((t: any) => t.reference === ref || t.id === ref) || null;
      }
    },

    updateStatus: async (ref: string, status: PaymentStatus, receiptNumber?: string): Promise<IPaymentTransaction | null> => {
      try {
        const tx = await prisma.paymentTransaction.findFirst({
          where: { OR: [{ reference: ref }, { id: ref }] },
        });
        if (!tx) return null;
        const updated = await prisma.paymentTransaction.update({
          where: { id: tx.id },
          data: {
            status,
            receiptNumber: receiptNumber || tx.receiptNumber,
          },
        });
        return {
          id: updated.id,
          orderId: updated.orderId,
          amount: Number(updated.amount),
          currency: updated.currency,
          method: updated.method as any,
          status: updated.status as any,
          reference: updated.reference || '',
          phoneNumber: updated.phoneNumber || undefined,
          receiptNumber: updated.receiptNumber || undefined,
          metadata: (updated.metadata as any) || undefined,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch {
        const store = readBackupStore();
        const tx = store.transactions?.find((t: any) => t.reference === ref || t.id === ref);
        if (!tx) return null;
        tx.status = status;
        if (receiptNumber) tx.receiptNumber = receiptNumber;
        writeBackupStore(store);
        return tx;
      }
    },
  },
};

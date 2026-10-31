import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';
import { IProduct, ProductStatus, ProductType } from '@/types/product';
import { ICategory } from '@/types/category';
import { IOrder, OrderStatus, PaymentStatus } from '@/types/order';
import { ICoupon, CouponValidationResult } from '@/types/coupon';
import { IUser } from '@/types/auth';
import { IPaymentTransaction } from '@/types/payment';

const DB_PATH = path.join(process.cwd(), 'data', 'store.json');

function readBackupStore(): any {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch { }
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

    update: async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
      try {
        const updated = await prisma.category.update({
          where: { id },
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            imageUrl: data.image_url,
            sortOrder: data.sort_order,
          },
        });
        return mapCategory(updated);
      } catch (err) {
        console.error('MySQL category update failed:', err);
        return null;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await prisma.category.delete({ where: { id } });
        return true;
      } catch (err) {
        console.error('MySQL category delete failed:', err);
        return false;
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

    create: async (data: { code: string; discountType: string; discountValue: number; minOrderAmount?: number; expiresAt?: string }): Promise<ICoupon> => {
      try {
        const created = await prisma.coupon.create({
          data: {
            code: data.code.trim().toUpperCase(),
            discountType: data.discountType,
            discountValue: data.discountValue,
            minOrderAmount: data.minOrderAmount || 0,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          },
        });
        return {
          id: created.id,
          code: created.code,
          discountType: created.discountType as any,
          discountValue: Number(created.discountValue),
          minOrderAmount: Number(created.minOrderAmount || 0),
          isActive: created.isActive,
          usageCount: created.usageCount,
          expiresAt: created.expiresAt ? created.expiresAt.toISOString() : new Date().toISOString(),
        };
      } catch (err: any) {
        throw new Error(err.message || 'Failed to create coupon');
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await prisma.coupon.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },

    toggleActive: async (id: string): Promise<ICoupon | null> => {
      try {
        const c = await prisma.coupon.findUnique({ where: { id } });
        if (!c) return null;
        const updated = await prisma.coupon.update({
          where: { id },
          data: { isActive: !c.isActive },
        });
        return {
          id: updated.id,
          code: updated.code,
          discountType: updated.discountType as any,
          discountValue: Number(updated.discountValue),
          minOrderAmount: Number(updated.minOrderAmount || 0),
          isActive: updated.isActive,
          usageCount: updated.usageCount,
          expiresAt: updated.expiresAt ? updated.expiresAt.toISOString() : new Date().toISOString(),
        };
      } catch {
        return null;
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
          id: `tx-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.transactions = [fallback, ...(store.transactions || [])];
        writeBackupStore(store);
        return fallback;
      }
    },

    getAll: async (params?: { search?: string; status?: string }) => {
      try {
        const where: any = {};
        if (params?.status && params.status !== 'All') {
          where.status = params.status.toLowerCase();
        }
        if (params?.search) {
          where.OR = [
            { reference: { contains: params.search } },
            { orderId: { contains: params.search } },
            { order: { customerName: { contains: params.search } } },
          ];
        }
        const txs = await prisma.paymentTransaction.findMany({
          where,
          include: { order: { select: { customerName: true, customerEmail: true } } },
          orderBy: { createdAt: 'desc' },
        });

        if (txs.length > 0) {
          return txs.map((t) => ({
            id: t.reference || t.id,
            trxId: t.id,
            date: t.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + t.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customer: t.order?.customerName || 'Direct Customer',
            customerEmail: t.order?.customerEmail || '',
            amount: `$${Number(t.amount).toFixed(2)}`,
            rawAmount: Number(t.amount),
            status: t.status === 'paid' ? 'Completed' : t.status === 'refunded' ? 'Refunded' : t.status === 'failed' ? 'Failed' : 'Pending',
            gateway: t.method === 'mpesa' ? 'M-Pesa' : t.method === 'card' ? 'Stripe Card' : t.method === 'paypal' ? 'PayPal' : 'Bank Transfer',
            orderId: t.orderId.startsWith('#') ? t.orderId : `#${t.orderId}`,
            receiptNumber: t.receiptNumber || 'N/A',
            createdAt: t.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('MySQL transactions.getAll failed:', err);
      }
      return [
        { id: 'TRX-98231', trxId: 't-1', date: 'Oct 28, 2024 - 10:42 AM', customer: 'Alice Freeman', customerEmail: 'alice@example.com', amount: '$145.00', rawAmount: 145, status: 'Completed', gateway: 'Stripe Card', orderId: '#LK-2024-80291', receiptNumber: 'REC-STR-01', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 'TRX-98230', trxId: 't-2', date: 'Oct 28, 2024 - 09:15 AM', customer: 'Mark Johnson', customerEmail: 'mark@example.com', amount: '$89.50', rawAmount: 89.5, status: 'Completed', gateway: 'PayPal', orderId: '#LK-2024-80292', receiptNumber: 'REC-PP-49', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: 'TRX-98229', trxId: 't-3', date: 'Oct 27, 2024 - 14:20 PM', customer: 'Sophie Williams', customerEmail: 'sophie@example.com', amount: '$210.00', rawAmount: 210, status: 'Refunded', gateway: 'Stripe Card', orderId: '#LK-2024-80293', receiptNumber: 'REF-8812', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
        { id: 'TRX-98228', trxId: 't-4', date: 'Oct 26, 2024 - 11:05 AM', customer: 'John Doe', customerEmail: 'john@example.com', amount: '$45.00', rawAmount: 45, status: 'Pending', gateway: 'Bank Transfer', orderId: '#LK-2024-80294', receiptNumber: 'BT-9018', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
        { id: 'TRX-98227', trxId: 't-5', date: 'Oct 25, 2024 - 16:30 PM', customer: 'Gaston Lapierre', customerEmail: 'gaston@example.com', amount: '$320.00', rawAmount: 320, status: 'Completed', gateway: 'M-Pesa', orderId: '#LK-2024-80295', receiptNumber: 'QGH82910KP', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
      ];
    },

    refund: async (id: string, amount?: number, reason?: string) => {
      try {
        const tx = await prisma.paymentTransaction.findFirst({
          where: { OR: [{ id }, { reference: id }] },
        });
        if (tx) {
          const updated = await prisma.paymentTransaction.update({
            where: { id: tx.id },
            data: { status: 'refunded', metadata: { ...(tx.metadata as any || {}), refundReason: reason || 'Admin initiated refund' } },
          });
          await prisma.order.updateMany({
            where: { id: tx.orderId },
            data: { paymentStatus: 'refunded', status: 'cancelled' },
          });
          return updated;
        }
      } catch (err) {
        console.error('MySQL refund execution error:', err);
      }
      return null;
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

  // CUSTOMERS
  customers: {
    getAll: async () => {
      try {
        const users = await prisma.user.findMany({
          where: { role: 'customer' },
          include: {
            orders: { select: { id: true, total: true, createdAt: true } },
            addresses: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        return users.map((u) => {
          const totalOrders = u.orders.length;
          const totalSpent = u.orders.reduce((sum, ord) => sum + Number(ord.total), 0);
          const latestOrder = u.orders[0];
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || 'N/A',
            avatar: u.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg',
            totalOrders,
            totalSpent: Number(totalSpent.toFixed(2)),
            latestOrderDate: latestOrder ? latestOrder.createdAt.toISOString() : null,
            loyaltyPoints: u.loyaltyPoints,
            tier: u.tier,
            createdAt: u.createdAt.toISOString(),
          };
        });
      } catch (err) {
        console.error('MySQL customers.getAll failed:', err);
        return [];
      }
    },

    getById: async (id: string) => {
      try {
        const u = await prisma.user.findUnique({
          where: { id },
          include: {
            orders: {
              include: { items: true },
              orderBy: { createdAt: 'desc' },
            },
            addresses: true,
          },
        });
        if (!u) return null;

        const totalOrders = u.orders.length;
        const totalSpent = u.orders.reduce((sum, ord) => sum + Number(ord.total), 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          avatar: u.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg',
          totalOrders,
          totalSpent: Number(totalSpent.toFixed(2)),
          loyaltyPoints: u.loyaltyPoints,
          tier: u.tier,
          addresses: u.addresses,
          orders: u.orders.map(mapOrder),
          createdAt: u.createdAt.toISOString(),
        };
      } catch {
        return null;
      }
    },
  },

  // DASHBOARD STATS
  stats: {
    getOverview: async () => {
      try {
        const [orders, products, customers, transactions] = await Promise.all([
          prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.product.findMany({ select: { id: true, stockQuantity: true, price: true } }),
          prisma.user.count({ where: { role: 'customer' } }),
          prisma.paymentTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
        ]);

        const totalOrdersCount = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
        const lowStockProducts = products.filter((p) => p.stockQuantity <= 5);

        // Daily revenue breakdown for charts
        const revenueByMonth: Record<string, number> = {};
        orders.forEach((o) => {
          const month = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short' });
          revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(o.total);
        });

        return {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders: totalOrdersCount,
          totalCustomers: customers,
          lowStockCount: lowStockProducts.length,
          paidOrdersCount: paidOrders.length,
          recentOrders: orders.slice(0, 5).map(mapOrder),
          recentTransactions: transactions,
          revenueByMonth,
        };
      } catch (err) {
        console.error('MySQL stats.getOverview failed:', err);
        return {
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          lowStockCount: 0,
          paidOrdersCount: 0,
          recentOrders: [],
          recentTransactions: [],
          revenueByMonth: {},
        };
      }
    },
  },

  // GENERAL SETTINGS
  settings: {
    get: async () => {
      try {
        const row = await prisma.cmsSetting.findUnique({ where: { key: 'general' } });
        return row?.value || {
          storeName: 'Waveron Luxury',
          metaTitle: 'Waveron | Fine Jewelry & Mongolian Cashmere',
          metaKeywords: 'jewelry, 18k gold, cashmere, sweaters, luxury',
          contactEmail: 'contact@waveron.com',
          phone: '+1 (555) 123-4567',
          currency: 'USD',
          taxRate: 8.0,
          theme: 'Default',
          layout: 'Fashion',
        };
      } catch {
        return {
          storeName: 'Waveron Luxury',
          metaTitle: 'Waveron | Fine Jewelry & Mongolian Cashmere',
          metaKeywords: 'jewelry, 18k gold, cashmere, sweaters, luxury',
          contactEmail: 'contact@waveron.com',
          phone: '+1 (555) 123-4567',
          currency: 'USD',
          taxRate: 8.0,
          theme: 'Default',
          layout: 'Fashion',
        };
      }
    },

    update: async (data: any) => {
      try {
        const row = await prisma.cmsSetting.upsert({
          where: { key: 'general' },
          update: { value: data },
          create: { key: 'general', value: data },
        });
        return row.value;
      } catch (err) {
        console.error('MySQL settings.update failed:', err);
        return data;
      }
    },
  },

  // ATTRIBUTES & VARIATIONS
  attributes: {
    getAll: async () => {
      const defaultAttributes = [
        { id: 'attr-color', name: 'Color', slug: 'color', type: 'Color Swatch', terms: ['Dark / Obsidian', 'Gold / Warm Yellow', 'Silver / Cool White', 'Emerald Green', 'Ruby Red', 'Sapphire Blue'] },
        { id: 'attr-size', name: 'Size', slug: 'size', type: 'Select', terms: ['Standard', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { id: 'attr-metal', name: 'Metal Purity', slug: 'metal-purity', type: 'Select', terms: ['14k Solid Yellow Gold', '18k Solid Yellow Gold', '18k White Gold', '950 Platinum', 'Sterling Silver 925'] },
        { id: 'attr-gemstone', name: 'Gemstone Type', slug: 'gemstone', type: 'Select', terms: ['Natural Diamond (VS1 / F)', 'Lab-Grown Diamond', 'Ceylon Sapphire', 'Colombian Emerald', 'South Sea Pearl'] },
        { id: 'attr-ring-size', name: 'Ring Size', slug: 'ring-size', type: 'Select', terms: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10'] },
      ];
      try {
        const row = await prisma.cmsSetting.findUnique({ where: { key: 'store_attributes' } });
        if (row && Array.isArray(row.value) && (row.value as any[]).length > 0) {
          return row.value;
        }
        await prisma.cmsSetting.upsert({
          where: { key: 'store_attributes' },
          update: { value: defaultAttributes },
          create: { key: 'store_attributes', value: defaultAttributes },
        });
        return defaultAttributes;
      } catch {
        return defaultAttributes;
      }
    },

    save: async (item: { id?: string; name: string; slug?: string; type?: string; terms: string[] }) => {
      const all: any[] = await (db.attributes as any).getAll();
      const id = item.id || `attr-${Date.now()}`;
      const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const idx = all.findIndex((a) => a.id === id);
      const updatedItem = { id, name: item.name, slug, type: item.type || 'Select', terms: item.terms || [] };

      if (idx !== -1) {
        all[idx] = updatedItem;
      } else {
        all.push(updatedItem);
      }

      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'store_attributes' },
          update: { value: all },
          create: { key: 'store_attributes', value: all },
        });
      } catch (err) {
        console.error('Failed to save attributes:', err);
      }
      return updatedItem;
    },

    delete: async (id: string) => {
      const all: any[] = await (db.attributes as any).getAll();
      const filtered = all.filter((a) => a.id !== id);
      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'store_attributes' },
          update: { value: filtered },
          create: { key: 'store_attributes', value: filtered },
        });
        return true;
      } catch {
        return false;
      }
    },
  },

  // REVIEWS MODERATION
  reviews: {
    getAll: async () => {
      try {
        const list = await prisma.review.findMany({
          include: { product: { select: { id: true, title: true, images: true } } },
          orderBy: { createdAt: 'desc' },
        });
        if (list.length > 0) {
          return list.map((r) => ({
            id: r.id,
            productId: r.productId,
            productName: r.product?.title || 'Luxury Product',
            authorName: r.authorName,
            rating: r.rating,
            title: r.title || 'Verified Purchase Review',
            comment: r.comment,
            isVerified: r.isVerified,
            status: r.status,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('MySQL review fetch error:', err);
      }
      return [
        { id: 'rev-1', productId: '1', productName: 'Classic Gold Band Ring', authorName: 'Josephine Thompson', rating: 5, title: 'Bespoke Atelier Finish', comment: 'The 18k gold craftsmanship is extraordinary. Solid weight, mirror finish, and arrived in a velvet presentation box.', isVerified: true, status: 'approved', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'rev-2', productId: '2', productName: 'Diamond Stud Earrings', authorName: 'Eleanor Vance', rating: 5, title: 'Brilliant Fire and Clarity', comment: 'GIA certified clarity is spot on. The platinum prongs hold the diamonds securely. Very satisfied.', isVerified: true, status: 'approved', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'rev-3', productId: '3', productName: 'Cashmere Turtleneck Sweater', authorName: 'Marcus Sterling', rating: 4, title: 'Incredible Softness', comment: 'Authentic 2-ply Mongolian cashmere. Warm yet remarkably breathable. Recommended sizing up.', isVerified: true, status: 'pending', createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
      ];
    },

    updateStatus: async (id: string, status: 'approved' | 'rejected' | 'pending') => {
      try {
        const updated = await prisma.review.update({
          where: { id },
          data: { status },
        });
        return updated;
      } catch {
        return { id, status };
      }
    },

    delete: async (id: string) => {
      try {
        await prisma.review.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
  },

  // STAFF & TEAM MANAGEMENT
  staff: {
    getAll: async () => {
      try {
        const users = await prisma.user.findMany({
          where: { role: { in: ['admin', 'manager', 'staff', 'owner'] } },
          orderBy: { createdAt: 'desc' },
        });
        if (users.length > 0) {
          return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role === 'admin' ? 'Super Admin' : u.role === 'manager' ? 'Store Manager' : 'Inventory Staff',
            status: 'Active',
            avatar: u.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg',
            phone: u.phone || 'N/A',
            createdAt: u.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('MySQL staff fetch error:', err);
      }
      return [
        { id: 'staff-1', name: 'Atelier Director', email: 'director@waveron.com', role: 'Super Admin', status: 'Active', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg', phone: '+254 700 000 001', createdAt: new Date().toISOString() },
        { id: 'staff-2', name: 'Gaston Lapierre', email: 'gaston@waveron.com', role: 'Store Manager', status: 'Active', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg', phone: '+254 700 000 002', createdAt: new Date().toISOString() },
        { id: 'staff-3', name: 'Sarah M. Brooks', email: 'sarah.b@waveron.com', role: 'Inventory Staff', status: 'Active', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-3.jpg', phone: '+254 700 000 003', createdAt: new Date().toISOString() },
      ];
    },

    create: async (data: { name: string; email: string; role: string; phone?: string }) => {
      const cleanRole = data.role.toLowerCase().includes('admin') ? 'admin' : data.role.toLowerCase().includes('manager') ? 'manager' : 'staff';
      try {
        const created = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            role: cleanRole,
            phone: data.phone,
            passwordHash: 'seeded-temp-hash',
            avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg',
          },
        });
        return {
          id: created.id,
          name: created.name,
          email: created.email,
          role: data.role,
          status: 'Active',
          avatar: created.avatar,
          phone: created.phone,
        };
      } catch (err) {
        console.error('MySQL staff.create failed:', err);
        return {
          id: `staff-${Date.now()}`,
          ...data,
          status: 'Active',
          avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg',
        };
      }
    },

    delete: async (id: string) => {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
  },

  // AUDIT & SYSTEM ACTIVITY LOGS
  activity: {
    getAll: async () => {
      try {
        const row = await prisma.cmsSetting.findUnique({ where: { key: 'system_activity_logs' } });
        if (row && Array.isArray(row.value) && (row.value as any[]).length > 0) {
          return row.value;
        }
      } catch {}
      return [
        { id: 'act-1', user: 'Atelier Director', action: 'Synchronized live MySQL database records', module: 'System', time: '10 mins ago', color: 'success', icon: 'solar:database-bold-duotone', details: 'MariaDB daemon confirmed on port 3306.' },
        { id: 'act-2', user: 'Gaston Lapierre', action: 'Fulfillment updated to DISPATCHED for Order #WV-802951', module: 'Orders', time: '1 hour ago', color: 'primary', icon: 'solar:box-bold-duotone', details: 'Carrier tracking number assigned.' },
        { id: 'act-3', user: 'Sarah M. Brooks', action: 'Restocked inventory for Diamond Stud Earrings (+15 units)', module: 'Inventory', time: '3 hours ago', color: 'warning', icon: 'solar:restart-bold', details: 'Updated stock quantity in atelier vault.' },
        { id: 'act-4', user: 'System', action: 'Automated daily database snapshot verified', module: 'System', time: '6 hours ago', color: 'info', icon: 'solar:shield-check-bold-duotone', details: 'Integrity checks completed successfully.' },
      ];
    },

    log: async (event: { user: string; action: string; module: string; details?: string; color?: string; icon?: string }) => {
      const logs: any[] = await (db.activity as any).getAll();
      const newEntry = {
        id: `act-${Date.now()}`,
        time: 'Just now',
        color: event.color || 'primary',
        icon: event.icon || 'solar:bell-bold-duotone',
        ...event,
      };
      logs.unshift(newEntry);
      const trimmed = logs.slice(0, 50);
      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'system_activity_logs' },
          update: { value: trimmed },
          create: { key: 'system_activity_logs', value: trimmed },
        });
      } catch {}
      return newEntry;
    },
  },

  // INVENTORY HISTORY & WAREHOUSE
  inventoryLogs: {
    getAll: async () => {
      try {
        const row = await prisma.cmsSetting.findUnique({ where: { key: 'stock_history_logs' } });
        if (row && Array.isArray(row.value) && (row.value as any[]).length > 0) {
          return row.value;
        }
      } catch {}
      return [
        { date: 'Today, 10:30 AM', product: 'Classic Gold Band Ring', type: 'Stock Added', typeClass: 'bg-success-subtle text-success', qty: '+20', stock: 45, user: 'Atelier Director', ref: 'PO-2024-001' },
        { date: 'Today, 09:15 AM', product: 'Diamond Stud Earrings', type: 'Order Fulfillment', typeClass: 'bg-primary-subtle text-primary', qty: '-1', stock: 28, user: 'System', ref: 'Order #WV-802951' },
        { date: 'Yesterday', product: 'Cashmere Turtleneck Sweater', type: 'Warehouse Transfer', typeClass: 'bg-info-subtle text-info', qty: '-5', stock: 34, user: 'Gaston Lapierre', ref: 'Boutique Display Hub' },
        { date: '2 days ago', product: 'Pearl Strand Necklace', type: 'Reconciliation Audit', typeClass: 'bg-warning-subtle text-warning', qty: '+3', stock: 19, user: 'Sarah M. Brooks', ref: 'Vault Stocktake' },
      ];
    },

    log: async (entry: { product: string; type: string; typeClass?: string; qty: string | number; stock: number; user?: string; ref?: string }) => {
      const logs: any[] = await (db.inventoryLogs as any).getAll();
      const newEntry = {
        date: 'Just now',
        user: 'Admin',
        typeClass: entry.typeClass || 'bg-primary-subtle text-primary',
        ...entry,
      };
      logs.unshift(newEntry);
      const trimmed = logs.slice(0, 50);
      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'stock_history_logs' },
          update: { value: trimmed },
          create: { key: 'stock_history_logs', value: trimmed },
        });
      } catch {}
      return newEntry;
    },
  },

  // WAREHOUSES
  warehouses: {
    getById: async (id: string) => {
      const all: any[] = await (db.warehouses as any).getAll();
      const clean = id.replace(/^#/, '').toLowerCase();
      return all.find((w: any) => w.id === id || w.id.replace(/^#/, '').toLowerCase() === clean) || null;
    },

    getAll: async () => {
      const defaultWarehouses = [
        { id: '#WH-001', name: 'Central Atelier Vault', loc: 'Riverside Drive, Nairobi, Kenya', manager: 'Atelier Director', phone: '+254 700 000 001', avail: 6490, ship: 320, rev: '$125,750', status: 'Active' },
        { id: '#WH-002', name: 'European Distribution Hub', loc: '42 Avenue Montaigne, Paris, France', manager: 'Gaston Lapierre', phone: '+33 1 42 68 55 00', avail: 4360, ship: 450, rev: '$84,320', status: 'Active' },
        { id: '#WH-003', name: 'North American Flagship Depot', loc: '740 Fifth Avenue, New York, USA', manager: 'Eleanor Vance', phone: '+1 (212) 555-0199', avail: 5840, ship: 210, rev: '$98,400', status: 'Active' },
        { id: '#WH-004', name: 'Middle East Logistics Vault', loc: 'DIFC Precinct 4, Dubai, UAE', manager: 'Sarah M. Brooks', phone: '+971 4 362 7000', avail: 3450, ship: 180, rev: '$67,200', status: 'Active' },
      ];
      try {
        const row = await prisma.cmsSetting.findUnique({ where: { key: 'store_warehouses' } });
        if (row && Array.isArray(row.value) && (row.value as any[]).length > 0) {
          return row.value;
        }
        await prisma.cmsSetting.upsert({
          where: { key: 'store_warehouses' },
          update: { value: defaultWarehouses },
          create: { key: 'store_warehouses', value: defaultWarehouses },
        });
        return defaultWarehouses;
      } catch {
        return defaultWarehouses;
      }
    },

    save: async (item: { id?: string; name: string; loc: string; manager: string; phone: string; avail?: number; ship?: number; rev?: string; status?: string }) => {
      const all: any[] = await (db.warehouses as any).getAll();
      let id = item.id;
      if (!id) {
        id = `#WH-${String(all.length + 1).padStart(3, '0')}`;
      }
      const clean = id.replace(/^#/, '').toLowerCase();
      const existingIdx = all.findIndex((w) => w.id === id || w.id.replace(/^#/, '').toLowerCase() === clean);
      const updatedItem = {
        id: existingIdx !== -1 ? all[existingIdx].id : id,
        name: item.name,
        loc: item.loc,
        manager: item.manager,
        phone: item.phone,
        avail: item.avail ?? 1000,
        ship: item.ship ?? 50,
        rev: item.rev ?? '$0.00',
        status: item.status || 'Active',
      };

      if (existingIdx !== -1) {
        all[existingIdx] = { ...all[existingIdx], ...updatedItem };
      } else {
        all.push(updatedItem);
      }

      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'store_warehouses' },
          update: { value: all },
          create: { key: 'store_warehouses', value: all },
        });
      } catch (err) {
        console.error('Failed to save warehouse:', err);
      }
      return updatedItem;
    },

    delete: async (id: string) => {
      const all: any[] = await (db.warehouses as any).getAll();
      const clean = id.replace(/^#/, '').toLowerCase();
      const filtered = all.filter((w) => w.id !== id && w.id.replace(/^#/, '').toLowerCase() !== clean);
      try {
        await prisma.cmsSetting.upsert({
          where: { key: 'store_warehouses' },
          update: { value: filtered },
          create: { key: 'store_warehouses', value: filtered },
        });
        return true;
      } catch {
        return false;
      }
    },

    transfer: async (data: { productId: string; productName: string; fromWh: string; toWh: string; quantity: number; notes?: string }) => {
      // 1. Log to inventory audit trail
      await (db.inventoryLogs as any).log({
        product: data.productName,
        type: 'Warehouse Transfer',
        typeClass: 'bg-info-subtle text-info',
        qty: `-${data.quantity}`,
        stock: 50, // indicative vault level
        user: 'Logistics Manager',
        ref: `Transfer from ${data.fromWh} to ${data.toWh}. ${data.notes || ''}`.trim(),
      });

      // 2. Log to system activity
      await (db.activity as any).log({
        user: 'Logistics Manager',
        action: `Initiated stock transfer: ${data.quantity} units of ${data.productName}`,
        module: 'Inventory',
        color: 'info',
        icon: 'solar:transfer-horizontal-bold',
        details: `Route: ${data.fromWh} ➔ ${data.toWh}. Notes: ${data.notes || 'Routine rebalancing'}`,
      });

      return { success: true };
    },
  },
};

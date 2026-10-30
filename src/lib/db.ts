import fs from 'fs';
import path from 'path';
import { IProduct, ProductStatus, ProductType } from '../types/product';
import { ICategory } from '../types/category';
import { IOrder, OrderStatus, PaymentStatus } from '../types/order';
import { ICoupon, CouponValidationResult } from '../types/coupon';
import { ICustomer } from '../types/customer';
import { IUser } from '../types/auth';
import { IPaymentTransaction } from '../types/payment';

interface StoreData {
  products: IProduct[];
  categories: ICategory[];
  orders: IOrder[];
  customers: ICustomer[];
  coupons: ICoupon[];
  users: Array<IUser & { passwordHash: string }>;
  transactions: IPaymentTransaction[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'store.json');

const INITIAL_CATEGORIES: ICategory[] = [
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Artisanal rings handcrafted in 18k solid gold & gemstones.',
    image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
    sort_order: 1,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Delicate pendants and layered chains designed for timeless elegance.',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    sort_order: 2,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Diamond studs, pearls, and statement drop earrings.',
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
    sort_order: 3,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat-sweaters',
    name: 'Knitwear & Sweaters',
    slug: 'sweaters',
    description: 'Luxurious 100% Mongolian cashmere and merino wool knitwear.',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop',
    sort_order: 4,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Scarves, leather goods, and premium seasonal accoutrements.',
    image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    sort_order: 5,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  }
];

const INITIAL_PRODUCTS: IProduct[] = [
  {
    id: '1',
    title: 'Classic Gold Band Ring',
    slug: 'classic-gold-band-ring',
    description: 'A minimalist 18k solid gold band ring with a comfort fit, perfect for everyday wear.',
    short_description: 'Timeless solid 18k gold band with satin finish.',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 299,
    compare_at_price: 399,
    stock_quantity: 45,
    sku: 'RNG-GLD-01',
    is_visible: true,
    category: INITIAL_CATEGORIES[0],
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    title: 'Diamond Stud Earrings',
    slug: 'diamond-stud-earrings',
    description: 'Brilliant round-cut conflict-free diamonds set in a secure 4-prong platinum basket.',
    short_description: 'Round brilliant lab diamonds in platinum prongs.',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 499,
    compare_at_price: 649,
    stock_quantity: 28,
    sku: 'EAR-DIA-02',
    is_visible: true,
    category: INITIAL_CATEGORIES[2],
    created_at: new Date('2024-01-12').toISOString(),
    updated_at: new Date('2024-01-12').toISOString(),
  },
  {
    id: '3',
    title: 'Cashmere Turtleneck Sweater',
    slug: 'cashmere-turtleneck-sweater',
    description: 'Ultra-soft 2-ply pure Mongolian cashmere turtleneck sweater designed for effortless winter warmth.',
    short_description: '100% Grade-A Mongolian cashmere.',
    type: ProductType.VARIABLE,
    status: ProductStatus.ACTIVE,
    price: 189,
    compare_at_price: 249,
    stock_quantity: 34,
    sku: 'SWT-CSH-03',
    is_visible: true,
    category: INITIAL_CATEGORIES[3],
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: '4',
    title: 'Pearl Strand Necklace',
    slug: 'pearl-strand-necklace',
    description: 'Lustrous Freshwater cultured pearls carefully hand-knotted on pure silk cord with a 14k gold filigree clasp.',
    short_description: 'Hand-knotted cultured freshwater pearls.',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 349,
    compare_at_price: 449,
    stock_quantity: 19,
    sku: 'NCK-PRL-04',
    is_visible: true,
    category: INITIAL_CATEGORIES[1],
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: '5',
    title: 'Cable Knit Cardigan',
    slug: 'cable-knit-cardigan',
    description: 'Chunky cable knit cardigan with genuine horn buttons, spun from heavy Australian merino wool.',
    short_description: '100% Merino wool with genuine horn buttons.',
    type: ProductType.VARIABLE,
    status: ProductStatus.ACTIVE,
    price: 159,
    compare_at_price: 199,
    stock_quantity: 50,
    sku: 'SWT-CBL-05',
    is_visible: true,
    category: INITIAL_CATEGORIES[3],
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: '6',
    title: 'Emerald Cut Ring',
    slug: 'emerald-cut-ring',
    description: 'A striking emerald-cut lab-grown Colombian emerald flanked by tapered baguette side stones in 18k yellow gold.',
    short_description: 'Colombian emerald with baguette side stones.',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 599,
    compare_at_price: 799,
    stock_quantity: 12,
    sku: 'RNG-EMR-06',
    is_visible: true,
    category: INITIAL_CATEGORIES[0],
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  }
];

const INITIAL_COUPONS: ICoupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    usageCount: 14,
  },
  {
    id: 'coup-2',
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 100,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    usageCount: 29,
  },
  {
    id: 'coup-3',
    code: 'GOLD25',
    discountType: 'fixed',
    discountValue: 25,
    minOrderAmount: 150,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    usageCount: 8,
  }
];

const INITIAL_USERS: Array<IUser & { passwordHash: string }> = [
  {
    id: 'usr-admin-1',
    name: 'Waveron Admin',
    email: 'admin@waveron.com',
    role: 'admin',
    avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg',
    passwordHash: 'admin123', // Demo plain for straightforward setup
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'usr-cust-1',
    name: 'Sarah Johnson',
    email: 'customer@waveron.com',
    role: 'customer',
    phone: '+1 (555) 123-4567',
    avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg',
    passwordHash: 'customer123',
    createdAt: new Date('2024-01-05').toISOString(),
  }
];

const INITIAL_ORDERS: IOrder[] = [
  {
    id: 'LK-2024-58291',
    orderNumber: 'LK-2024-58291',
    customerId: 'usr-cust-1',
    customerName: 'Sarah Johnson',
    customerEmail: 'customer@waveron.com',
    customerPhone: '+1 (555) 123-4567',
    items: [
      {
        id: 'item-1',
        productId: '1',
        name: 'Classic Gold Band Ring',
        price: 299,
        quantity: 1,
        selectedSize: 'M',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
      }
    ],
    subtotal: 299,
    tax: 23.92,
    shippingFee: 0,
    discount: 0,
    total: 322.92,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    shippingMethod: 'standard',
    shippingAddress: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      line1: '123 Maple Street',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'United States'
    },
    trackingNumber: 'TRK-983271-US',
    timeline: [
      { status: 'pending', title: 'Order Placed', description: 'Order was placed successfully.', timestamp: '2024-04-20T10:00:00.000Z' },
      { status: 'processing', title: 'Payment Confirmed', description: 'Credit card payment verified.', timestamp: '2024-04-20T10:05:00.000Z' },
      { status: 'shipped', title: 'Package Dispatched', description: 'Carrier picked up parcel from warehouse.', timestamp: '2024-04-21T09:30:00.000Z' },
      { status: 'delivered', title: 'Delivered', description: 'Delivered to recipient address.', timestamp: '2024-04-24T14:15:00.000Z' }
    ],
    createdAt: '2024-04-20T10:00:00.000Z',
    updatedAt: '2024-04-24T14:15:00.000Z'
  },
  {
    id: 'LK-2024-69214',
    orderNumber: 'LK-2024-69214',
    customerName: 'Judith H. Fritsche',
    customerEmail: 'judith@example.com',
    customerPhone: '+1 (555) 987-6543',
    items: [
      {
        id: 'item-2',
        productId: '3',
        name: 'Cashmere Turtleneck Sweater',
        price: 189,
        quantity: 1,
        selectedSize: 'L',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'
      }
    ],
    subtotal: 189,
    tax: 15.12,
    shippingFee: 0,
    discount: 0,
    total: 204.12,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'mpesa',
    shippingMethod: 'express',
    shippingAddress: {
      name: 'Judith H. Fritsche',
      phone: '+1 (555) 987-6543',
      line1: '456 Oak Avenue',
      city: 'Portland',
      state: 'OR',
      zip: '97204',
      country: 'United States'
    },
    trackingNumber: 'TRK-551029-US',
    timeline: [
      { status: 'pending', title: 'Order Placed', description: 'Order was placed successfully.', timestamp: '2024-04-25T11:00:00.000Z' },
      { status: 'processing', title: 'Payment Confirmed', description: 'M-Pesa STK push confirmed.', timestamp: '2024-04-25T11:02:00.000Z' }
    ],
    createdAt: '2024-04-25T11:00:00.000Z',
    updatedAt: '2024-04-25T11:02:00.000Z'
  }
];

function readStore(): StoreData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial: StoreData = {
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        orders: INITIAL_ORDERS,
        customers: [
          {
            id: 'usr-cust-1',
            name: 'Sarah Johnson',
            email: 'customer@waveron.com',
            phone: '+1 (555) 123-4567',
            addresses: [INITIAL_ORDERS[0].shippingAddress],
            totalOrders: 1,
            totalSpent: 322.92,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-04-24').toISOString(),
          }
        ],
        coupons: INITIAL_COUPONS,
        users: INITIAL_USERS,
        transactions: []
      };
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store database:', err);
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      customers: [],
      coupons: INITIAL_COUPONS,
      users: INITIAL_USERS,
      transactions: []
    };
  }
}

function writeStore(data: StoreData): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, DB_PATH);
}

export const db = {
  // PRODUCTS
  products: {
    getAll: (params?: { q?: string; category?: string; status?: string; minPrice?: number; maxPrice?: number; limit?: number; page?: number }) => {
      const store = readStore();
      let list = [...store.products];

      if (params?.q) {
        const query = params.q.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query)));
      }
      if (params?.category) {
        list = list.filter(p => p.category?.slug === params.category || p.category?.id === params.category);
      }
      if (params?.status) {
        list = list.filter(p => p.status === params.status);
      }
      if (params?.minPrice !== undefined) {
        list = list.filter(p => p.price >= params.minPrice!);
      }
      if (params?.maxPrice !== undefined) {
        list = list.filter(p => p.price <= params.maxPrice!);
      }

      const total = list.length;
      const page = params?.page || 1;
      const limit = params?.limit || 50;
      const paginated = list.slice((page - 1) * limit, page * limit);

      return { products: paginated, total, page, limit };
    },

    getByIdOrSlug: (idOrSlug: string): IProduct | null => {
      const store = readStore();
      return store.products.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    },

    create: (data: Partial<IProduct>): IProduct => {
      const store = readStore();
      const slug = data.slug || (data.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProduct: IProduct = {
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
        is_visible: data.is_visible !== undefined ? data.is_visible : true,
        category: data.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.products.unshift(newProduct);
      writeStore(store);
      return newProduct;
    },

    update: (id: string, updates: Partial<IProduct>): IProduct | null => {
      const store = readStore();
      const idx = store.products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      store.products[idx] = {
        ...store.products[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      writeStore(store);
      return store.products[idx];
    },

    delete: (id: string): boolean => {
      const store = readStore();
      const initialLen = store.products.length;
      store.products = store.products.filter(p => p.id !== id);
      if (store.products.length !== initialLen) {
        writeStore(store);
        return true;
      }
      return false;
    }
  },

  // CATEGORIES
  categories: {
    getAll: (): ICategory[] => {
      const store = readStore();
      return store.categories.sort((a, b) => a.sort_order - b.sort_order);
    },

    getByIdOrSlug: (idOrSlug: string): ICategory | null => {
      const store = readStore();
      return store.categories.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
    },

    create: (data: Partial<ICategory>): ICategory => {
      const store = readStore();
      const slug = data.slug || (data.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCategory: ICategory = {
        id: `cat-${Date.now().toString().slice(-6)}`,
        name: data.name || 'New Category',
        slug,
        description: data.description || '',
        image_url: data.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
        sort_order: store.categories.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.categories.push(newCategory);
      writeStore(store);
      return newCategory;
    }
  },

  // ORDERS
  orders: {
    getAll: (params?: { status?: string; paymentStatus?: string; search?: string; limit?: number; page?: number }) => {
      const store = readStore();
      let list = [...store.orders];

      if (params?.status && params.status !== 'All') {
        list = list.filter(o => o.status.toLowerCase() === params.status!.toLowerCase());
      }
      if (params?.paymentStatus && params.paymentStatus !== 'All') {
        list = list.filter(o => o.paymentStatus.toLowerCase() === params.paymentStatus!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
        );
      }

      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = list.length;
      const page = params?.page || 1;
      const limit = params?.limit || 50;
      const paginated = list.slice((page - 1) * limit, page * limit);

      return { orders: paginated, total, page, limit };
    },

    getById: (id: string): IOrder | null => {
      const store = readStore();
      return store.orders.find(o => o.id === id || o.orderNumber === id) || null;
    },

    create: (orderData: Omit<IOrder, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'>): IOrder => {
      const store = readStore();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `LK-2024-${randomNum}`;
      const now = new Date().toISOString();

      const newOrder: IOrder = {
        ...orderData,
        id: orderNumber,
        orderNumber,
        timeline: [
          {
            status: orderData.status || 'pending',
            title: 'Order Placed',
            description: `Order ${orderNumber} was confirmed.`,
            timestamp: now
          }
        ],
        createdAt: now,
        updatedAt: now,
      };

      // Deduct inventory
      for (const item of orderData.items) {
        const prod = store.products.find(p => p.id === item.productId);
        if (prod && prod.stock_quantity !== undefined) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        }
      }

      store.orders.unshift(newOrder);
      writeStore(store);
      return newOrder;
    },

    updateStatus: (id: string, status: OrderStatus, paymentStatus?: PaymentStatus, trackingNumber?: string): IOrder | null => {
      const store = readStore();
      const idx = store.orders.findIndex(o => o.id === id || o.orderNumber === id);
      if (idx === -1) return null;

      const order = store.orders[idx];
      order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date().toISOString();

      order.timeline.push({
        status,
        title: `Status changed to ${status.toUpperCase()}`,
        description: `Order status updated to ${status}.`,
        timestamp: new Date().toISOString(),
      });

      writeStore(store);
      return order;
    }
  },

  // COUPONS
  coupons: {
    getAll: () => readStore().coupons,

    validate: (code: string, subtotal: number): CouponValidationResult => {
      const store = readStore();
      const coupon = store.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

      if (!coupon) {
        return { valid: false, discountAmount: 0, message: 'Invalid or inactive promo code.' };
      }

      if (new Date(coupon.expiresAt).getTime() < Date.now()) {
        return { valid: false, discountAmount: 0, message: 'This promo code has expired.' };
      }

      if (subtotal < coupon.minOrderAmount) {
        return { valid: false, discountAmount: 0, message: `Minimum order amount of $${coupon.minOrderAmount} required.` };
      }

      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }

      return {
        valid: true,
        coupon,
        discountAmount: Number(discountAmount.toFixed(2)),
        message: `Applied ${coupon.code} (-$${discountAmount.toFixed(2)})`
      };
    }
  },

  // AUTH & USERS
  users: {
    findByEmail: (email: string) => {
      const store = readStore();
      return store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
    },

    create: (data: { name: string; email: string; password: string; role?: 'admin' | 'staff' | 'customer'; phone?: string }): IUser => {
      const store = readStore();
      const newUser = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        role: data.role || 'customer',
        phone: data.phone,
        passwordHash: data.password, // In production, bcrypt.hash
        createdAt: new Date().toISOString()
      };
      store.users.push(newUser);
      writeStore(store);
      const { passwordHash: _, ...safeUser } = newUser;
      return safeUser;
    }
  },

  // TRANSACTIONS
  transactions: {
    create: (tx: Omit<IPaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): IPaymentTransaction => {
      const store = readStore();
      const newTx: IPaymentTransaction = {
        ...tx,
        id: `tx-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.transactions.unshift(newTx);
      writeStore(store);
      return newTx;
    },

    getByReference: (ref: string): IPaymentTransaction | null => {
      const store = readStore();
      return store.transactions.find(t => t.reference === ref || t.id === ref) || null;
    },

    updateStatus: (ref: string, status: PaymentStatus, receiptNumber?: string): IPaymentTransaction | null => {
      const store = readStore();
      const tx = store.transactions.find(t => t.reference === ref || t.id === ref);
      if (!tx) return null;
      tx.status = status;
      if (receiptNumber) tx.receiptNumber = receiptNumber;
      tx.updatedAt = new Date().toISOString();
      writeStore(store);
      return tx;
    }
  }
};

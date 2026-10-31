import { IProduct } from '../types/product';
import { ICategory } from '../types/category';
import { IOrder, OrderStatus, PaymentStatus } from '../types/order';
import { CouponValidationResult, ICoupon } from '../types/coupon';
import { IUser, LoginCredentials, RegisterCredentials } from '../types/auth';
import { MpesaStkPushResponse, CardPaymentResponse } from '../types/payment';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Network request failed');
  }
  return data as T;
}

export const apiClient = {
  products: {
    list: (params?: { q?: string; category?: string; status?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.q) searchParams.set('q', params.q);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const query = searchParams.toString();
      return fetchJson<{ products: IProduct[]; total: number; page: number; limit: number }>(`/api/products${query ? `?${query}` : ''}`);
    },

    get: (id: string) => fetchJson<IProduct>(`/api/products/${id}`),

    create: (data: Partial<IProduct>) => fetchJson<IProduct>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id: string, data: Partial<IProduct>) => fetchJson<IProduct>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    delete: (id: string) => fetchJson<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },

  categories: {
    list: () => fetchJson<{ categories: ICategory[] }>('/api/categories'),

    get: (id: string) => fetchJson<ICategory>(`/api/categories/${id}`),

    create: (data: Partial<ICategory>) => fetchJson<ICategory>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id: string, data: Partial<ICategory>) => fetchJson<ICategory>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    delete: (id: string) => fetchJson<{ success: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
  },

  orders: {
    list: (params?: { status?: string; paymentStatus?: string; search?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.paymentStatus) searchParams.set('paymentStatus', params.paymentStatus);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const query = searchParams.toString();
      return fetchJson<{ orders: IOrder[]; total: number; page: number; limit: number }>(`/api/orders${query ? `?${query}` : ''}`);
    },

    get: (id: string) => fetchJson<IOrder>(`/api/orders/${id}`),

    create: (orderData: Partial<IOrder>) => fetchJson<IOrder>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

    updateStatus: (id: string, status: OrderStatus, paymentStatus?: PaymentStatus, trackingNumber?: string) =>
      fetchJson<IOrder>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, paymentStatus, trackingNumber }),
      }),
  },

  coupons: {
    list: () => fetchJson<{ coupons: ICoupon[] }>('/api/coupons'),

    create: (data: { code: string; discountType: string; discountValue: number; minOrderAmount?: number; expiresAt?: string }) =>
      fetchJson<ICoupon>('/api/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    delete: (id: string) => fetchJson<{ success: boolean }>(`/api/coupons/${id}`, {
      method: 'DELETE',
    }),

    toggleActive: (id: string) => fetchJson<ICoupon>(`/api/coupons/${id}`, {
      method: 'PATCH',
    }),

    apply: (code: string, subtotal: number) => fetchJson<CouponValidationResult>('/api/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
  },

  customers: {
    list: () => fetchJson<{ customers: any[] }>('/api/customers'),
    get: (id: string) => fetchJson<{ customer: any }>(`/api/customers/${id}`),
  },

  stats: {
    overview: () => fetchJson<any>('/api/stats/overview'),
  },

  settings: {
    get: () => fetchJson<{ settings: any }>('/api/settings'),
    update: (data: any) => fetchJson<{ settings: any; success: boolean }>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  payments: {
    mpesaStk: (data: { orderId: string; phoneNumber: string; amount: number }) =>
      fetchJson<MpesaStkPushResponse>('/api/payments/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    card: (data: { orderId: string; amount: number; cardNumber: string; cardHolder: string; expiryMonth: string; expiryYear: string; cvv: string }) =>
      fetchJson<CardPaymentResponse>('/api/payments/card', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getStatus: (reference: string) => fetchJson<{ status: string; receiptNumber?: string }>(`/api/payments/status/${reference}`),
  },

  auth: {
    login: (credentials: LoginCredentials) => fetchJson<{ user: IUser; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

    register: (data: RegisterCredentials) => fetchJson<{ user: IUser; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    me: () => fetchJson<{ user: IUser | null }>('/api/auth/me'),

    logout: () => fetchJson<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    }),
  }
};

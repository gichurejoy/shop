'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IOrder, PaymentMethod, PaymentStatus } from '@/types/order';

interface ICartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  img: string;
}

export default function OrderCheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Customer & Shipping Info
  const [customer, setCustomer] = useState({
    firstName: 'Gaston',
    lastName: 'Lapierre',
    email: 'gaston@waveron.com',
    phone: '+254 700 123 456',
    address: '42 Avenue Montaigne, Atelier Suite 4B',
    city: 'Paris',
    zip: '75008',
    country: 'France',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('admin_pos_cart') : null;
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {}
    } else {
      // Fallback sample items
      setCartItems([
        {
          id: 'ci-1',
          productId: '1',
          name: 'Classic Gold Band Ring',
          size: 'US 7',
          color: '18k Solid Yellow Gold',
          price: 450,
          qty: 1,
          img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
        },
      ]);
    }
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Cart is empty. Please add items before checking out.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload: Partial<IOrder> = {
        customerName: `${customer.firstName} ${customer.lastName}`.trim(),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cartItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          selectedSize: item.size,
          selectedColor: item.color,
          image: item.img,
        })),
        subtotal,
        tax,
        shippingFee: shipping,
        discount: 0,
        total,
        status: 'processing',
        paymentStatus,
        paymentMethod,
        shippingMethod: 'standard',
        shippingAddress: {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone,
          line1: customer.address,
          city: customer.city,
          state: customer.city,
          zip: customer.zip,
          country: customer.country,
        },
        orderNotes: 'Placed via Admin Point-of-Sale Terminal',
      };

      const res = await apiClient.orders.create(orderPayload);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_pos_cart');
      }
      toast.success(`Order #${res.orderNumber} placed successfully!`);
      router.push(`/admin/orders/${res.id}`);
    } catch (err: any) {
      toast.error('Failed to place order: ' + (err?.message || 'Database error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-3">
        <div className="text-muted fs-13 mb-1">
          <Link href="/admin/orders" className="text-muted text-decoration-none">Orders</Link> › <Link href="/admin/orders/cart" className="text-muted text-decoration-none">Cart</Link> › <span className="text-primary">Manual Checkout</span>
        </div>
        <h3 className="fw-bold text-dark mb-0">Confirm &amp; Place Order</h3>
      </div>

      <form onSubmit={handleCreateOrder}>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Customer Details */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header border-bottom bg-transparent">
                <h5 className="card-title mb-0">Customer Dossier</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header border-bottom bg-transparent">
                <h5 className="card-title mb-0">Delivery Address</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Street / Suite Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Postal / Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.zip}
                      onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Settlement Method */}
            <div className="card shadow-sm border-0">
              <div className="card-header border-bottom bg-transparent">
                <h5 className="card-title mb-0">Payment &amp; Settlement Method</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Payment Channel</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    >
                      <option value="card">Credit / Debit Card (Stripe)</option>
                      <option value="mpesa">M-Pesa Express</option>
                      <option value="bank_transfer">Bank Wire Transfer</option>
                      <option value="cod">Cash on Delivery / In-Store POS</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Payment Status</label>
                    <select
                      className="form-select"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    >
                      <option value="paid">Paid &amp; Confirmed (Instant Settlement)</option>
                      <option value="unpaid">Unpaid / Awaiting Wire Transfer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header border-bottom bg-transparent">
                <h5 className="card-title mb-0">Order Review ({cartItems.length} items)</h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3 mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-medium text-dark fs-13 text-truncate" style={{ maxWidth: '160px' }}>
                            {item.name}
                          </div>
                          <small className="text-muted">Qty: {item.qty} × ${item.price}</small>
                        </div>
                      </div>
                      <span className="fw-semibold text-dark fs-14">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2 fs-13 text-muted">
                    <span>Subtotal:</span>
                    <span className="fw-medium text-dark">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 fs-13 text-muted">
                    <span>Shipping:</span>
                    <span className="fw-medium text-dark">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 fs-13 text-muted">
                    <span>Tax (8%):</span>
                    <span className="fw-medium text-dark">${tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top fs-16 fw-bold text-dark">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 d-flex flex-column gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting || cartItems.length === 0}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <iconify-icon icon="solar:check-circle-bold" className="fs-18"></iconify-icon>
                        Place Order Directly
                      </>
                    )}
                  </button>
                  <Link href="/admin/orders/cart" className="btn btn-outline-secondary w-100 text-center">
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

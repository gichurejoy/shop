'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IOrder } from '@/types/order';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await apiClient.orders.get(orderId);
        setOrder(data);
      } catch (err: any) {
        toast.error('Failed to load invoice: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading invoice...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <iconify-icon icon="solar:bill-cross-bold-duotone" className="fs-50 text-warning mb-3"></iconify-icon>
          <h4>Invoice Not Found</h4>
          <p className="text-muted">No invoice record exists matching order ID &quot;{orderId}&quot;.</p>
          <Link href="/admin/invoices" className="btn btn-primary mt-2">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const issueDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const invoiceNumber = `INV-${order.orderNumber || order.id.slice(0, 8)}`;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
            <Link href="/admin/invoices" style={{ color: '#64748b', textDecoration: 'none' }}>Invoices</Link> › <span style={{ color: '#ff6c2f' }}>{invoiceNumber}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Invoice {invoiceNumber}</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <iconify-icon icon="solar:printer-bold-duotone" /> Print
          </button>
          <Link
            href={`/admin/orders/${order.id}`}
            style={{ padding: '8px 16px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <iconify-icon icon="solar:bag-bold-duotone" /> Manage Fulfillment
          </Link>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', maxWidth: '860px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg,#ff6c2f,#ff8f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <iconify-icon icon="solar:shop-bold-duotone" style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Waveron Atelier</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              Waveron Fine Commerce LTD<br />
              Atelier Support: concierge@waveron.com<br />
              Nairobi &bull; London &bull; New York
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff6c2f', letterSpacing: '-1px' }}>INVOICE</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>#{invoiceNumber}</div>
            <div style={{ marginTop: '12px', padding: '4px 14px', borderRadius: '20px', background: isPaid ? '#dcfce7' : '#fef9c3', color: isPaid ? '#16a34a' : '#ca8a04', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>
              {isPaid ? 'PAID & SETTLED' : 'PAYMENT PENDING'}
            </div>
          </div>
        </div>

        {/* Bill to / dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Bill To</div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>{order.customerName}</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              {order.customerEmail}<br />
              {order.shippingAddress?.line1 || 'Primary Client Address'}<br />
              {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zip, order.shippingAddress?.country].filter(Boolean).join(', ')}<br />
              {order.customerPhone || ''}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Invoice Details</div>
            {[
              ['Issue Date', issueDate],
              ['Payment Method', order.paymentMethod.toUpperCase()],
              ['Order Ref', `#${order.orderNumber || order.id}`],
              ['Tracking No.', order.trackingNumber || 'Pending Dispatch'],
            ].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{l}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'Item Spec', 'Qty', 'Unit Price', 'Total'].map((h) => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px', color: '#94a3b8' }}>{i + 1}</td>
                <td style={{ padding: '14px', fontWeight: 600, color: '#0f172a' }}>
                  {item.name}
                  {item.selectedSize && <span className="text-muted fw-normal ms-2">({item.selectedSize})</span>}
                </td>
                <td style={{ padding: '14px', color: '#64748b' }}>{item.quantity}</td>
                <td style={{ padding: '14px', color: '#64748b' }}>${Number(item.price).toFixed(2)}</td>
                <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>${Number(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {order.discount && order.discount > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#ef4444' }}>
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>-${Number(order.discount).toFixed(2)}</span>
              </div>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#64748b' }}>
              <span>Shipping:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{order.shippingFee ? `$${Number(order.shippingFee).toFixed(2)}` : 'Free'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#64748b' }}>
              <span>Tax:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>${Number(order.tax || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', marginTop: '6px', borderTop: '2px solid #e2e8f0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#ff6c2f' }}>${Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

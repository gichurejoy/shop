'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      try {
        setLoading(true);
        const res = await apiClient.customers.get(customerId);
        if (res && res.customer) {
          setCustomer(res.customer);
        } else {
          setCustomer(null);
        }
      } catch (err: any) {
        toast.error('Failed to load customer details: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading customer details...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <iconify-icon icon="solar:user-broken" className="fs-50 text-warning mb-3"></iconify-icon>
          <h4>Customer Not Found</h4>
          <p className="text-muted">No customer record exists matching this ID.</p>
          <Link href="/admin/customers" className="btn btn-primary mt-2">
            Back to Customers List
          </Link>
        </div>
      </div>
    );
  }

  const primaryAddress = customer.addresses?.[0] || customer.shippingAddress || {};
  const formattedAddress = [
    primaryAddress.line1,
    primaryAddress.city,
    primaryAddress.state,
    primaryAddress.country,
  ]
    .filter(Boolean)
    .join(', ') || 'Primary shipping address on file';

  const orders = customer.orders || [];
  const totalSpent = customer.totalSpent ?? orders.reduce((s: number, o: any) => s + Number(o.total || 0), 0);

  return (
    <div className="row g-3">
      {/* Left Column */}
      <div className="col-lg-4">
        {/* Profile Card */}
        <div className="card overflow-hidden mb-3">
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: '100px', position: 'relative' }}>
            <img
              alt={customer.name}
              src={customer.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg'}
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fff', position: 'absolute', bottom: '-36px', left: '24px', objectFit: 'cover' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=3b82f6&color=fff&size=80`;
              }}
            />
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <span className="badge bg-success text-capitalize">{customer.tier || 'Verified Client'}</span>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: '44px' }}>
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              {customer.name}
              <iconify-icon icon="solar:verified-check-bold-duotone" style={{ color: '#22c55e', fontSize: '18px' }}></iconify-icon>
            </h5>
            <span className="text-primary" style={{ fontSize: '13px' }}>
              {customer.tier ? `${customer.tier.toUpperCase()} Member` : 'Client Account'}
            </span>
            <div className="mt-2">
              <p className="mb-1" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:letter-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <a href={`mailto:${customer.email}`} className="text-muted text-decoration-none">
                  {customer.email}
                </a>
              </p>
              <p className="mb-0" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:phone-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <span className="text-muted">{customer.phone || 'Phone not provided'}</span>
              </p>
            </div>
          </div>
          <div className="card-footer d-flex gap-2">
            <a href={`mailto:${customer.email}`} className="btn btn-primary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
              <iconify-icon icon="solar:letter-bold-duotone"></iconify-icon> Email Client
            </a>
            <Link href="/admin/customers" className="btn btn-outline-secondary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
              <iconify-icon icon="solar:users-group-two-rounded-bold-duotone"></iconify-icon> All Clients
            </Link>
          </div>
        </div>

        {/* Customer Details */}
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:user-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Client Dossier
            </h5>
            <span className="badge bg-success-subtle text-success">Active</span>
          </div>
          <div className="card-body p-0">
            <table className="table mb-0" style={{ fontSize: '13px' }}>
              <tbody>
                {[
                  { label: 'Customer ID', value: customer.id.slice(0, 8), icon: 'solar:key-bold-duotone' },
                  { label: 'Invoice Email', value: customer.email, icon: 'solar:letter-bold-duotone' },
                  { label: 'Delivery Address', value: formattedAddress, icon: 'solar:map-point-bold-duotone' },
                  { label: 'Loyalty Points', value: `${customer.loyaltyPoints ?? 0} pts`, icon: 'solar:cup-star-bold-duotone' },
                  { label: 'Total Orders', value: `${orders.length} orders placed`, icon: 'solar:bag-bold-duotone' },
                ].map((r) => (
                  <tr key={r.label}>
                    <td className="px-3 py-2 text-muted" style={{ width: '44%', whiteSpace: 'nowrap' }}>
                      <iconify-icon icon={r.icon} style={{ color: '#94a3b8', marginRight: '5px' }}></iconify-icon>
                      {r.label}
                    </td>
                    <td className="px-3 py-2 fw-medium text-dark text-break">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-lg-8">
        {/* Stat Cards */}
        <div className="row g-3 mb-3">
          {[
            { label: 'Total Orders', value: String(orders.length), icon: 'solar:box-bold-duotone', color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Total Spent', value: `$${Number(totalSpent).toFixed(2)}`, icon: 'solar:chat-round-money-bold-duotone', color: '#8b5cf6', bg: '#f5f3ff' },
            { label: 'Loyalty Tier', value: customer.tier ? customer.tier.toUpperCase() : 'STANDARD', icon: 'solar:medal-ribbons-star-bold-duotone', color: '#16a34a', bg: '#f0fdf4' },
          ].map((s) => (
            <div key={s.label} className="col-md-4">
              <div className="card">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon={s.icon} style={{ fontSize: '24px', color: s.color }}></iconify-icon>
                  </div>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{s.label}</p>
                    <h4 className="fw-bold mb-0">{s.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:bag-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Order History ({orders.length})
            </h5>
            <Link href="/admin/orders" className="btn btn-sm btn-outline-secondary">
              All Store Orders
            </Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No orders recorded for this customer yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o: any) => (
                      <tr key={o.id}>
                        <td>
                          <Link href={`/admin/orders/${o.id}`} className="fw-medium link-primary">
                            #{o.orderNumber || o.id}
                          </Link>
                        </td>
                        <td>
                          {new Date(o.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td>{o.items?.length || 1} items</td>
                        <td className="fw-bold">${Number(o.total).toFixed(2)}</td>
                        <td className="text-capitalize">{o.paymentMethod || 'Card'}</td>
                        <td>
                          <span className={`badge ${
                            o.status === 'delivered' ? 'bg-success-subtle text-success' :
                            o.status === 'shipped' ? 'bg-primary-subtle text-primary' :
                            o.status === 'processing' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'
                          } text-capitalize`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <Link href={`/admin/orders/${o.id}`} className="btn btn-sm btn-light">
                            <iconify-icon icon="solar:eye-broken" className="align-middle fs-16"></iconify-icon>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

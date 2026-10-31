'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IOrder } from '@/types/order';

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-success-subtle text-success',
  Completed: 'bg-success-subtle text-success',
  delivered: 'bg-success-subtle text-success',
  unpaid: 'bg-warning-subtle text-warning',
  Pending: 'bg-warning-subtle text-warning',
  pending: 'bg-warning-subtle text-warning',
  cancelled: 'bg-danger-subtle text-danger',
  Cancel: 'bg-danger-subtle text-danger',
};

export default function InvoiceListPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.orders.list({ limit: 100 });
      setOrders(res.orders || []);
    } catch (err: any) {
      toast.error('Failed to load invoices: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.customerName.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Paid' && o.paymentStatus === 'paid') ||
      (statusFilter === 'Pending' && o.paymentStatus === 'unpaid') ||
      (statusFilter === 'Cancelled' && o.status === 'cancelled');
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? Number(o.total) : 0), 0);
  const paidCount = orders.filter((o) => o.paymentStatus === 'paid').length;
  const pendingCount = orders.filter((o) => o.paymentStatus === 'unpaid').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div>
      <div className="row g-3 mb-3">
        {[
          { label: 'Settled Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'solar:bill-list-bold-duotone', color: 'primary' },
          { label: 'Paid Invoices', value: paidCount, icon: 'solar:check-circle-bold-duotone', color: 'success' },
          { label: 'Pending Settlement', value: pendingCount, icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
          { label: 'Cancelled / Void', value: cancelledCount, icon: 'solar:close-circle-bold-duotone', color: 'danger' },
        ].map((s) => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3 py-3">
                <div className={`avatar-md bg-${s.color} bg-opacity-10 rounded d-flex align-items-center justify-content-center`} style={{ minWidth: '52px', height: '52px' }}>
                  <iconify-icon className={`fs-28 text-${s.color}`} icon={s.icon}></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{s.label}</p>
                  <h4 className="fw-bold mb-0">{s.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0">Official Store Invoices ({orders.length})</h4>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="position-relative">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search invoice, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '30px', minWidth: '200px' }}
              />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={fetchInvoices} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:refresh-broken"></iconify-icon> Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover table-centered mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th><input type="checkbox" className="form-check-input" /></th>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Issue Date</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading order invoices...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const invoiceId = `INV-${inv.orderNumber || inv.id.slice(0, 8)}`;
                  const dateStr = new Date(inv.createdAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });
                  const isPaid = inv.paymentStatus === 'paid';

                  return (
                    <tr key={inv.id}>
                      <td><input type="checkbox" className="form-check-input" /></td>
                      <td>
                        <Link href={`/admin/invoices/${inv.id}`} className="text-primary fw-medium font-monospace text-decoration-none">
                          #{invoiceId}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg"
                            alt={inv.customerName}
                            className="rounded-circle"
                            style={{ width: '34px', height: '34px' }}
                          />
                          <div>
                            <span className="fw-medium text-dark d-block">{inv.customerName}</span>
                            <span className="text-muted fs-11">{inv.customerEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{dateStr}</td>
                      <td className="fw-bold text-dark">${Number(inv.total).toFixed(2)}</td>
                      <td className="text-muted">${Number(inv.tax || 0).toFixed(2)}</td>
                      <td>
                        <span className="text-capitalize badge bg-light text-dark border">
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_STYLE[isPaid ? 'paid' : inv.status] || 'bg-secondary-subtle text-secondary'} text-capitalize`}>
                          {isPaid ? 'Paid' : inv.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link href={`/admin/invoices/${inv.id}`} className="btn btn-soft-primary btn-sm" title="View Printable Invoice">
                            <iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon>
                          </Link>
                          <Link href={`/admin/orders/${inv.id}`} className="btn btn-soft-secondary btn-sm" title="Go to Order Hub">
                            <iconify-icon className="align-middle fs-18" icon="solar:bag-bold-duotone"></iconify-icon>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0 fs-13">Showing {filtered.length} of {orders.length} order invoices</p>
        </div>
      </div>
    </div>
  );
}

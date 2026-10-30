'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api-client';
import { IOrder } from '../../../../types/order';

const DEFAULT_ORDERS: any[] = [
  { id: '#RB5625', date: '29 Apr 2024', customer: 'Anna M. Hines', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg', total: '$124.00', qty: 3, payment: 'Credit Card', status: 'Delivered' },
  { id: '#RB9652', date: '25 Apr 2024', customer: 'Judith H. Fritsche', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-3.jpg', total: '$248.50', qty: 1, payment: 'PayPal', status: 'Processing' },
  { id: '#RB5984', date: '25 Apr 2024', customer: 'Peter T. Smith', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg', total: '$89.00', qty: 2, payment: 'PayPal', status: 'Delivered' },
  { id: '#RB3625', date: '23 Apr 2024', customer: 'Mary L. Johnson', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-5.jpg', total: '$312.00', qty: 4, payment: 'Credit Card', status: 'Pending' },
  { id: '#RB7411', date: '22 Apr 2024', customer: 'Robert A. Davis', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-6.jpg', total: '$55.00', qty: 1, payment: 'Stripe', status: 'Cancelled' },
];

const STATUS_BADGE: Record<string, string> = {
  Delivered: 'badge bg-success-subtle text-success py-1 px-2',
  delivered: 'badge bg-success-subtle text-success py-1 px-2',
  Processing: 'badge bg-info-subtle text-info py-1 px-2',
  processing: 'badge bg-info-subtle text-info py-1 px-2',
  Pending: 'badge bg-warning-subtle text-warning py-1 px-2',
  pending: 'badge bg-warning-subtle text-warning py-1 px-2',
  Cancelled: 'badge bg-danger-subtle text-danger py-1 px-2',
  cancelled: 'badge bg-danger-subtle text-danger py-1 px-2',
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState<any[]>(DEFAULT_ORDERS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = () => {
    setLoading(true);
    apiClient.orders.list()
      .then(res => {
        if (res.orders && res.orders.length > 0) {
          const formatted = res.orders.map(o => ({
            id: o.orderNumber || o.id,
            rawId: o.id,
            date: new Date(o.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            customer: o.customerName || 'Customer',
            avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg',
            total: `$${o.total.toFixed(2)}`,
            qty: o.items.reduce((s, i) => s + i.quantity, 0),
            payment: o.paymentMethod.toUpperCase() + (o.paymentStatus === 'paid' ? ' (Paid)' : ' (Unpaid)'),
            status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
          }));
          setOrders(formatted);
        }
      })
      .catch(() => {
        // keep defaults
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter(o =>
    (statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase()) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const statuses = ['All', 'Delivered', 'Processing', 'Pending', 'Cancelled'];

  const stats = [
    { label: 'Total Orders', value: String(orders.length), icon: 'solar:bag-smile-bold-duotone', color: 'primary' },
    { label: 'Delivered', value: String(orders.filter(o => o.status.toLowerCase() === 'delivered').length), icon: 'solar:delivery-bold-duotone', color: 'success' },
    { label: 'Pending', value: String(orders.filter(o => o.status.toLowerCase() === 'pending').length), icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
    { label: 'Cancelled', value: String(orders.filter(o => o.status.toLowerCase() === 'cancelled').length), icon: 'solar:close-circle-bold-duotone', color: 'danger' },
  ];

  return (
    <div>
      {/* Stats cards */}
      <div className="row mb-3">
        {stats.map(s => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className={`avatar-md bg-${s.color} bg-opacity-10 rounded`}>
                    <iconify-icon className={`fs-32 text-${s.color} avatar-title`} icon={s.icon}></iconify-icon>
                  </div>
                  <div><h4 className="mb-0">{s.label}</h4></div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="text-muted fw-medium fs-22 mb-0">{s.value}</p>
                  <span className={`badge text-${s.color} bg-${s.color}-subtle fs-12`}>
                    <iconify-icon icon="solar:arrow-up-broken"></iconify-icon> Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Order List</h4>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <input type="search" className="form-control form-control-sm" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
            <button onClick={fetchOrders} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:refresh-broken"></iconify-icon> Refresh
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="d-flex border-bottom px-3" style={{ overflowX: 'auto' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="btn btn-link text-decoration-none px-3 py-2" style={{ borderBottom: statusFilter === s ? '2px solid #ff6c2f' : '2px solid transparent', color: statusFilter === s ? '#ff6c2f' : '#64748b', fontWeight: statusFilter === s ? 600 : 400, borderRadius: 0, whiteSpace: 'nowrap' }}>{s}</button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th><div className="form-check"><input className="form-check-input" type="checkbox" id="ordersAllCheck" /><label className="form-check-label" htmlFor="ordersAllCheck"></label></div></th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id}>
                  <td><div className="form-check"><input className="form-check-input" type="checkbox" id={`orderCheck${i}`} /><label className="form-check-label" htmlFor={`orderCheck${i}`}></label></div></td>
                  <td><span className="text-body fw-medium">{o.id}</span></td>
                  <td>
                    <img alt={o.customer} className="avatar-sm rounded-circle me-2" src={o.avatar} />
                    {o.customer}
                  </td>
                  <td>{o.date}</td>
                  <td>{o.payment}</td>
                  <td className="fw-medium">{o.total}</td>
                  <td><span className={STATUS_BADGE[o.status] || 'badge bg-secondary-subtle text-secondary py-1 px-2'}>{o.status}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/tracking/${o.rawId || o.id}`} className="btn btn-light btn-sm" title="Track Live Order">
                        <iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center">
          <span className="text-muted fs-13">Showing {filtered.length} of {orders.length} orders</span>
          <nav>
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item disabled"><a className="page-link" href="#!">Previous</a></li>
              <li className="page-item active"><a className="page-link" href="#!">1</a></li>
              <li className="page-item disabled"><a className="page-link" href="#!">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

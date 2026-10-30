'use client';

import { useState } from 'react';
import Link from 'next/link';

const INVOICES = [
  { id: 'INV1695', customer: 'Mark Williams', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg', date: '10 Aug, 2023', amount: 9457, tax: 3928, status: 'Pending',   payment: 'Mastercard' },
  { id: 'INV8473', customer: 'Victor Lawson',  avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-3.jpg', date: '22 May, 2023', amount: 4214, tax: 9814, status: 'Cancel',    payment: 'Visa' },
  { id: 'INV2150', customer: 'Lena Ryan',      avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg', date: '15 Mar, 2023', amount: 2513, tax: 5891, status: 'Completed', payment: 'PayPal' },
  { id: 'INV3642', customer: 'Sophia Turner',  avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-5.jpg', date: '01 Feb, 2023', amount: 7841, tax: 2104, status: 'Completed', payment: 'Stripe' },
  { id: 'INV5091', customer: 'James Chen',     avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-6.jpg', date: '18 Jan, 2023', amount: 3329, tax: 6747, status: 'Pending',   payment: 'Mastercard' },
  { id: 'INV7782', customer: 'Olivia Scott',   avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-7.jpg', date: '05 Dec, 2022', amount: 5618, tax: 1380, status: 'Completed', payment: 'Visa' },
  { id: 'INV9341', customer: 'Noah Harris',    avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-8.jpg', date: '29 Nov, 2022', amount: 1942, tax: 4256, status: 'Cancel',    payment: 'PayPal' },
  { id: 'INV4417', customer: 'Emma Brown',     avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg', date: '14 Oct, 2022', amount: 8273, tax: 3019, status: 'Completed', payment: 'Stripe' },
];

const STATUS_STYLE: Record<string, string> = {
  Pending:   'bg-warning-subtle text-warning',
  Cancel:    'bg-danger-subtle text-danger',
  Completed: 'bg-success-subtle text-success',
};

export default function InvoiceListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = INVOICES.filter(inv => {
    const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = INVOICES.reduce((sum, i) => sum + i.amount, 0);
  const paid = INVOICES.filter(i => i.status === 'Completed').length;
  const pending = INVOICES.filter(i => i.status === 'Pending').length;
  const cancelled = INVOICES.filter(i => i.status === 'Cancel').length;

  return (
    <div>
      <div className="row g-3 mb-3">
        {[
          { label: 'Total Revenue',    value: `$${totalRevenue.toLocaleString()}`, icon: 'solar:bill-list-bold-duotone',   color: 'primary' },
          { label: 'Paid Invoices',    value: paid,   icon: 'solar:check-circle-bold-duotone', color: 'success' },
          { label: 'Pending',          value: pending, icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
          { label: 'Cancelled',        value: cancelled, icon: 'solar:close-circle-bold-duotone', color: 'danger' },
        ].map(s => (
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
          <h4 className="card-title mb-0">Invoice List</h4>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="position-relative">
              <input type="search" className="form-control form-control-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px', minWidth: '180px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
            <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="All">All Status</option>
              <option>Completed</option><option>Pending</option><option>Cancel</option>
            </select>
            <Link href="/admin/invoices/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Invoice
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover table-centered mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th><input type="checkbox" className="form-check-input" /></th>
                <th>Invoice ID</th>
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
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td><input type="checkbox" className="form-check-input" /></td>
                  <td><Link href={`/admin/invoices/${inv.id}`} className="text-primary fw-medium text-decoration-none">#{inv.id}</Link></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={inv.avatar} alt={inv.customer} className="rounded-circle" style={{ width: '34px', height: '34px' }} />
                      <span className="fw-medium">{inv.customer}</span>
                    </div>
                  </td>
                  <td className="text-muted">{inv.date}</td>
                  <td className="fw-bold">${inv.amount.toLocaleString()}</td>
                  <td className="text-muted">${inv.tax.toLocaleString()}</td>
                  <td><span className="text-muted" style={{ fontSize: '13px' }}>{inv.payment}</span></td>
                  <td><span className={`badge ${STATUS_STYLE[inv.status]}`}>{inv.status}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link href={`/admin/invoices/${inv.id}`} className="btn btn-soft-primary btn-sm">
                        <iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon>
                      </Link>
                      <button className="btn btn-soft-warning btn-sm">
                        <iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon>
                      </button>
                      <button className="btn btn-soft-danger btn-sm">
                        <iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Showing {filtered.length} of {INVOICES.length}</p>
          <nav><ul className="pagination pagination-sm mb-0 gap-1">
            {['«','1','2','3','»'].map(p => (
              <li key={p} className={`page-item ${p==='1'?'active':''}`}><button className="page-link">{p}</button></li>
            ))}
          </ul></nav>
        </div>
      </div>
    </div>
  );
}

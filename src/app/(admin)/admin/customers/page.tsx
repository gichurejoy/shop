'use client';

import { useState } from 'react';
import Link from 'next/link';

const CUSTOMERS = [
  { id: 1, name: 'Michael A. Miner',  invoice: 'INV2540', status: 'Completed', amount: 4521,  due: 8901,  date: '07 Jan, 2023', payment: 'Mastercard', avatar: 'https://i.pravatar.cc/40?img=11' },
  { id: 2, name: 'Theresa T. Brose',  invoice: 'INV3924', status: 'Cancel',    amount: 7836,  due: 9902,  date: '03 Dec, 2023', payment: 'Visa',       avatar: 'https://i.pravatar.cc/40?img=47' },
  { id: 3, name: 'James L. Erickson', invoice: 'INV5032', status: 'Completed', amount: 1347,  due: 6718,  date: '28 Sep, 2023', payment: 'PayPal',     avatar: 'https://i.pravatar.cc/40?img=15' },
  { id: 4, name: 'Lily W. Wilson',    invoice: 'INV1695', status: 'Pending',   amount: 9457,  due: 3928,  date: '10 Aug, 2023', payment: 'Mastercard', avatar: 'https://i.pravatar.cc/40?img=44' },
  { id: 5, name: 'Sarah M. Brooks',   invoice: 'INV8473', status: 'Cancel',    amount: 4214,  due: 9814,  date: '22 May, 2023', payment: 'Visa',       avatar: 'https://i.pravatar.cc/40?img=32' },
  { id: 6, name: 'Joe K. Hall',       invoice: 'INV2150', status: 'Completed', amount: 2513,  due: 5891,  date: '15 Mar, 2023', payment: 'PayPal',     avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 7, name: 'Ralph Hueber',      invoice: 'INV5636', status: 'Completed', amount: 3103,  due: 8415,  date: '15 Mar, 2023', payment: 'Visa',       avatar: 'https://i.pravatar.cc/40?img=18' },
  { id: 8, name: 'Sarah Drescher',    invoice: 'INV2940', status: 'Completed', amount: 2416,  due: 7715,  date: '15 Mar, 2023', payment: 'Mastercard', avatar: 'https://i.pravatar.cc/40?img=25' },
  { id: 9, name: 'Leonie Meister',    invoice: 'INV9027', status: 'Pending',   amount: 1367,  due: 3651,  date: '15 Mar, 2023', payment: 'PayPal',     avatar: 'https://i.pravatar.cc/40?img=9'  },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Completed: { bg: '#f0fdf4', color: '#16a34a' },
  Cancel:    { bg: '#fef2f2', color: '#ef4444' },
  Pending:   { bg: '#fffbeb', color: '#d97706' },
};

const PAYMENT_ICON: Record<string, string> = {
  Mastercard: 'solar:card-bold-duotone',
  Visa:       'solar:card-bold-duotone',
  PayPal:     'solar:dollar-minimalistic-bold-duotone',
};

export default function CustomerListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = CUSTOMERS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.invoice.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total    = CUSTOMERS.length;
  const orders   = CUSTOMERS.reduce((s) => s + 1, 0);   // demo
  const services = 1030;
  const revenue  = CUSTOMERS.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-3">
        {[
          { label: 'All Customers',      value: `+${(total * 1000).toLocaleString()}`,   trend: '+34.4%', up: true,  icon: 'solar:users-group-two-rounded-bold-duotone', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Orders',             value: `+${(orders * 500).toLocaleString()}`,   trend: '-8.1%',  up: false, icon: 'solar:box-bold-duotone',                    color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Service Requests',   value: `+${services.toLocaleString()}`,         trend: '+12.6%', up: true,  icon: 'solar:headphones-round-sound-bold-duotone',  color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Invoice & Payment',  value: `$${revenue.toLocaleString()}`,          trend: '+45.9%', up: true,  icon: 'solar:bill-list-bold-duotone',               color: '#16a34a', bg: '#f0fdf4' },
        ].map(s => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <iconify-icon icon={s.icon} style={{ fontSize: '26px', color: s.color }}></iconify-icon>
                </div>
                <div className="flex-grow-1 min-width-0">
                  <p className="text-muted mb-1" style={{ fontSize: '13px' }}>{s.label}</p>
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="fw-bold mb-0">{s.value}</h4>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: s.up ? '#16a34a' : '#ef4444', background: s.up ? '#f0fdf4' : '#fef2f2', padding: '2px 7px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <iconify-icon icon={s.up ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} style={{ fontSize: '11px' }}></iconify-icon>
                      {s.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Customer Table ── */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0 d-flex align-items-center gap-2">
            <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
            All Customers List
          </h4>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', minWidth: '200px' }}
              />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}></iconify-icon>
            </div>

            {/* Status filter */}
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Cancel</option>
            </select>

            {/* Actions */}
            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:export-bold"></iconify-icon> Export
            </button>
            <Link href="/admin/customers/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Customer
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" className="form-check-input" /></th>
                <th>Customer</th>
                <th>Invoice ID</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Amount Due</th>
                <th>Due Date</th>
                <th>Payment</th>
                <th style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" style={{ fontSize: '40px', display: 'block', margin: '0 auto 8px' }}></iconify-icon>
                    No customers match your search
                  </td>
                </tr>
              )}
              {filtered.map(c => {
                const st = STATUS_STYLE[c.status];
                return (
                  <tr key={c.id}>
                    <td><input type="checkbox" className="form-check-input" /></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }}
                          onError={e => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=ff6c2f&color=fff&size=36`;
                          }}
                        />
                        <div>
                          <Link href={`/admin/customers/${c.id}`} className="text-decoration-none text-dark fw-medium" style={{ fontSize: '14px' }}>
                            {c.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/invoices/${c.invoice}`} className="text-primary text-decoration-none fw-medium" style={{ fontSize: '13px' }}>
                        #{c.invoice}
                      </Link>
                    </td>
                    <td>
                      <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="fw-bold" style={{ fontSize: '13px' }}>${c.amount.toLocaleString()}</td>
                    <td className="text-muted" style={{ fontSize: '13px' }}>${c.due.toLocaleString()}</td>
                    <td className="text-muted" style={{ fontSize: '13px' }}>{c.date}</td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <iconify-icon icon={PAYMENT_ICON[c.payment] || 'solar:card-bold-duotone'} style={{ fontSize: '15px', color: '#64748b' }}></iconify-icon>
                        <span className="text-muted" style={{ fontSize: '13px' }}>{c.payment}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link href={`/admin/customers/${c.id}`} className="btn btn-soft-primary btn-sm" title="View">
                          <iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon>
                        </Link>
                        <button className="btn btn-soft-warning btn-sm" title="Edit">
                          <iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon>
                        </button>
                        <button className="btn btn-soft-danger btn-sm" title="Delete">
                          <iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{CUSTOMERS.length}</strong> customers
          </p>
          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              {['«', '1', '2', '3', '»'].map((p, i) => (
                <li key={i} className={`page-item ${p === '1' ? 'active' : ''}`}>
                  <button className="page-link">{p}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

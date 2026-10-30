'use client';

import { useState } from 'react';
import Link from 'next/link';

const COUPONS = [
  { id: 1, code: 'SUMMER24', type: 'Percentage', value: '20%', status: 'Active', usage: '45 / 100', expiry: '31 Aug 2024' },
  { id: 2, code: 'WELCOME10', type: 'Fixed Amount', value: '$10.00', status: 'Active', usage: '12 / ∞', expiry: 'Never' },
  { id: 3, code: 'FREESHIP', type: 'Free Shipping', value: 'N/A', status: 'Expired', usage: '50 / 50', expiry: '15 May 2024' },
  { id: 4, code: 'FLASH50', type: 'Percentage', value: '50%', status: 'Inactive', usage: '0 / 20', expiry: '01 Jun 2024' },
];

const STATUS_BADGE: Record<string, string> = {
  Active: 'badge bg-success-subtle text-success py-1 px-2',
  Expired: 'badge bg-danger-subtle text-danger py-1 px-2',
  Inactive: 'badge bg-secondary-subtle text-secondary py-1 px-2',
};

export default function CouponsListPage() {
  const [search, setSearch] = useState('');
  const filtered = COUPONS.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title">Coupons</h4>
        <div className="d-flex gap-2">
          <div className="position-relative">
            <input type="search" className="form-control form-control-sm" placeholder="Search coupons..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px' }} />
            <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
          </div>
          <Link href="/admin/coupons/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
            <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Coupon
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0 table-hover table-centered">
          <thead className="bg-light-subtle">
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Usage / Limit</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="fw-bold text-primary">{c.code}</td>
                <td>{c.type}</td>
                <td className="fw-medium">{c.value}</td>
                <td>{c.usage}</td>
                <td>{c.expiry}</td>
                <td><span className={STATUS_BADGE[c.status]}>{c.status}</span></td>
                <td>
                  <div className="d-flex gap-2">
                    <a className="btn btn-light btn-sm" href="#!"><iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon></a>
                    <Link href="/admin/coupons/new" className="btn btn-soft-primary btn-sm"><iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon></Link>
                    <a className="btn btn-soft-danger btn-sm" href="#!"><iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-footer border-top">
        <nav>
          <ul className="pagination justify-content-end mb-0">
            <li className="page-item"><a className="page-link" href="#!">Previous</a></li>
            <li className="page-item active"><a className="page-link" href="#!">1</a></li>
            <li className="page-item"><a className="page-link" href="#!">2</a></li>
            <li className="page-item"><a className="page-link" href="#!">Next</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

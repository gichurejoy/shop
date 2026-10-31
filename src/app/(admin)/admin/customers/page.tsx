'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active: { bg: '#f0fdf4', color: '#16a34a' },
  Completed: { bg: '#f0fdf4', color: '#16a34a' },
  Cancel: { bg: '#fef2f2', color: '#ef4444' },
  Pending: { bg: '#fffbeb', color: '#d97706' },
};

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.customers.list();
      setCustomers(res.customers || []);
    } catch (err: any) {
      toast.error('Failed to load customers: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'All' || (c.tier && c.tier.toLowerCase() === statusFilter.toLowerCase());
    return matchSearch && matchStatus;
  });

  const total = customers.length;
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-3">
        {[
          { label: 'All Customers', value: total.toLocaleString(), trend: 'Live', up: true, icon: 'solar:users-group-two-rounded-bold-duotone', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Total Placed Orders', value: totalOrders.toLocaleString(), trend: 'Orders', up: true, icon: 'solar:box-bold-duotone', color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Client Value', value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: 'Sales', up: true, icon: 'solar:bill-list-bold-duotone', color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Active Tiers', value: 'Silver / Gold / VIP', trend: 'Loyalty', up: true, icon: 'solar:medal-ribbons-star-bold-duotone', color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((s) => (
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
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 7px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <iconify-icon icon="solar:arrow-up-bold" style={{ fontSize: '11px' }}></iconify-icon>
                      {s.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0 d-flex align-items-center gap-2">
            <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
            All Customers List ({customers.length})
          </h4>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search by name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', minWidth: '220px' }}
              />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}></iconify-icon>
            </div>

            {/* Refresh */}
            <button onClick={fetchCustomers} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:refresh-broken"></iconify-icon> Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" className="form-check-input" /></th>
                <th>Customer</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Tier</th>
                <th>Orders Count</th>
                <th>Total Spent</th>
                <th>Member Since</th>
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading customers from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" style={{ fontSize: '40px', display: 'block', margin: '0 auto 8px' }}></iconify-icon>
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const memberDate = new Date(c.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  return (
                    <tr key={c.id}>
                      <td><input type="checkbox" className="form-check-input" /></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={c.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg'}
                            alt={c.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=ff6c2f&color=fff&size=36`;
                            }}
                          />
                          <div>
                            <Link href={`/admin/customers/${c.id}`} className="text-dark fw-medium text-decoration-none link-primary">
                              {c.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{c.email}</span>
                      </td>
                      <td>
                        <span className="text-muted">{c.phone || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary text-capitalize px-2 py-1">
                          {c.tier || 'Standard'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">{c.totalOrders ?? 0}</span> orders
                      </td>
                      <td>
                        <span className="fw-bold text-dark">${Number(c.totalSpent || 0).toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="text-muted fs-12">{memberDate}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link href={`/admin/customers/${c.id}`} className="btn btn-light btn-sm" title="View Dossier">
                            <iconify-icon icon="solar:eye-broken" className="align-middle fs-18"></iconify-icon>
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
          <p className="mb-0 text-muted fs-13">Showing {filtered.length} of {customers.length} registered customers</p>
        </div>
      </div>
    </div>
  );
}

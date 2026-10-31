'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ICoupon } from '@/types/coupon';

export default function CouponsListPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await apiClient.coupons.list();
      setCoupons(res.coupons || []);
    } catch (err: any) {
      toast.error('Failed to load coupons: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (coupon: ICoupon) => {
    try {
      setActionId(coupon.id);
      const updated = await apiClient.coupons.toggleActive(coupon.id);
      toast.success(`Coupon ${updated.code} is now ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}`);
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updated.isActive } : c))
      );
    } catch (err: any) {
      toast.error('Failed to toggle coupon: ' + (err.message || 'Unknown error'));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (coupon: ICoupon) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) return;
    try {
      setActionId(coupon.id);
      await apiClient.coupons.delete(coupon.id);
      toast.success(`Coupon ${coupon.code} deleted.`);
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    } catch (err: any) {
      toast.error('Failed to delete coupon: ' + (err.message || 'Unknown error'));
    } finally {
      setActionId(null);
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 className="card-title mb-0">Coupons &amp; Promotional Codes ({coupons.length})</h4>
        <div className="d-flex gap-2">
          <div className="position-relative">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '30px', minWidth: '200px' }}
            />
            <iconify-icon
              icon="solar:magnifer-linear"
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            ></iconify-icon>
          </div>
          <button
            type="button"
            onClick={fetchCoupons}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <iconify-icon icon="solar:refresh-broken"></iconify-icon> Refresh
          </button>
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
              <th>Min Order</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                  Loading coupons from database...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-muted">
                  No promotional coupons found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                const displayType = c.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount';
                const displayValue = c.discountType === 'percentage' ? `${c.discountValue}%` : `$${Number(c.discountValue).toFixed(2)}`;
                const expiryLabel = c.expiresAt
                  ? new Date(c.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Never Expires';

                return (
                  <tr key={c.id}>
                    <td>
                      <span className="fw-bold text-primary font-monospace fs-14">{c.code}</span>
                    </td>
                    <td>{displayType}</td>
                    <td className="fw-bold text-dark">{displayValue}</td>
                    <td>
                      {c.minOrderAmount && c.minOrderAmount > 0 ? `$${Number(c.minOrderAmount).toFixed(2)}` : 'None'}
                    </td>
                    <td>
                      <span className={isExpired ? 'text-danger' : 'text-muted'}>{expiryLabel}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isExpired
                            ? 'bg-danger-subtle text-danger'
                            : c.isActive
                            ? 'bg-success-subtle text-success'
                            : 'bg-secondary-subtle text-secondary'
                        } py-1 px-2`}
                      >
                        {isExpired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(c)}
                          disabled={actionId === c.id}
                          className={`btn btn-sm ${c.isActive ? 'btn-soft-warning' : 'btn-soft-success'}`}
                          title={c.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                        >
                          <iconify-icon
                            icon={c.isActive ? 'solar:eye-closed-broken' : 'solar:check-circle-broken'}
                            className="align-middle fs-16"
                          ></iconify-icon>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          disabled={actionId === c.id}
                          className="btn btn-soft-danger btn-sm"
                          title="Delete Coupon"
                        >
                          <iconify-icon
                            className="align-middle fs-16"
                            icon="solar:trash-bin-minimalistic-2-broken"
                          ></iconify-icon>
                        </button>
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
        <p className="mb-0 text-muted fs-13">Showing {filtered.length} of {coupons.length} coupons</p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EditWarehousePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const decodedId = decodeURIComponent(rawId || '');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    loc: '',
    manager: '',
    phone: '',
    avail: 5000,
    ship: 150,
    rev: '$45,000',
    status: 'Active' as 'Active' | 'Maintenance',
  });

  useEffect(() => {
    async function fetchWarehouse() {
      try {
        setLoading(true);
        const res = await apiClient.warehouses.get(decodedId);
        if (res.warehouse) {
          setFormData({
            id: res.warehouse.id,
            name: res.warehouse.name,
            loc: res.warehouse.loc,
            manager: res.warehouse.manager || '',
            phone: res.warehouse.phone || '',
            avail: res.warehouse.avail ?? 5000,
            ship: res.warehouse.ship ?? 150,
            rev: res.warehouse.rev || '$0.00',
            status: res.warehouse.status || 'Active',
          });
        } else {
          toast.error('Warehouse facility not found');
        }
      } catch (err: any) {
        toast.error('Failed to load facility data: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }

    if (decodedId) {
      fetchWarehouse();
    }
  }, [decodedId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.loc.trim()) {
      toast.error('Facility name and location are required');
      return;
    }

    setSaving(true);
    try {
      await apiClient.warehouses.save(formData);
      toast.success(`Warehouse "${formData.name}" updated successfully!`);
      const cleanId = formData.id.replace(/^#/, '');
      router.push(`/admin/inventory/warehouse/${cleanId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update warehouse');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading facility details...</p>
      </div>
    );
  }

  const cleanId = formData.id ? formData.id.replace(/^#/, '') : decodedId;

  return (
    <div className="container-fluid">
      {/* Header and Breadcrumbs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-sm-0 fw-bold">Edit Facility: {formData.name || decodedId}</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/inventory/warehouse">Warehouse &amp; Logistics</Link></li>
                  <li className="breadcrumb-item"><Link href={`/admin/inventory/warehouse/${cleanId}`}>{formData.name || cleanId}</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Edit</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href={`/admin/inventory/warehouse/${cleanId}`} className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Cancel &amp; Return
              </Link>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-xl-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Depot Information &amp; Address</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Facility ID</label>
                    <input
                      type="text"
                      className="form-control font-monospace bg-light"
                      value={formData.id}
                      disabled
                    />
                    <div className="form-text text-muted">Permanent system identifier.</div>
                  </div>

                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Facility Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Physical Location / Address <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formData.loc}
                      onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Supervising Manager</label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:user-broken"></iconify-icon></span>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Telephone</label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:phone-broken"></iconify-icon></span>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Capacity &amp; Valuations</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Available Units</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={formData.avail}
                      onChange={(e) => setFormData({ ...formData, avail: Number(e.target.value) })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">In-Transit Units</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={formData.ship}
                      onChange={(e) => setFormData({ ...formData, ship: Number(e.target.value) })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Valuation Managed ($)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.rev}
                      onChange={(e) => setFormData({ ...formData, rev: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Operational Status</h5>
              </div>
              <div className="card-body p-4">
                <label className="form-label fw-semibold">Current State</label>
                <select
                  className="form-select mb-3"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Active">Active (Receiving &amp; Dispatching)</option>
                  <option value="Maintenance">Maintenance (Temporary Hold)</option>
                </select>

                <p className="text-muted fs-12 mb-0">
                  Changing status to Maintenance will temporarily prevent automated order dispatching from this hub.
                </p>
              </div>
              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:diskette-bold" className="fs-18"></iconify-icon> Save Facility Changes
                    </>
                  )}
                </button>
                <Link href={`/admin/inventory/warehouse/${cleanId}`} className="btn btn-light w-100">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

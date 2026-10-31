'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function NewWarehousePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    loc: '',
    manager: '',
    phone: '',
    avail: 5000,
    ship: 120,
    rev: '$45,000',
    status: 'Active' as 'Active' | 'Maintenance',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.loc.trim()) {
      toast.error('Facility name and physical address are required');
      return;
    }

    setSaving(true);
    try {
      await apiClient.warehouses.save(formData);
      toast.success(`Warehouse hub "${formData.name}" established successfully!`);
      router.push('/admin/inventory/warehouse');
    } catch (err: any) {
      toast.error(err.message || 'Failed to establish warehouse hub');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Title & Breadcrumb */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 className="mb-sm-0 fw-bold">Establish New Warehouse Facility</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/inventory/warehouse">Warehouse &amp; Logistics</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">New Hub</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/inventory/warehouse" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Facilities
              </Link>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Main Form Information */}
          <div className="col-xl-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Facility Information</h5>
                <p className="text-muted fs-13 mb-0">Enter the official depot identification, physical location, and logistics manager details.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Facility / Warehouse Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tokyo Regional Distribution Centre"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <div className="form-text text-muted">A clear, recognizable facility name for inventory allocations.</div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Physical Location / Address <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Chuo-ku, Ginza 6-Chome, Tokyo 104-0061, Japan"
                      value={formData.loc}
                      onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
                      required
                    />
                    <div className="form-text text-muted">Complete shipping address for freight intake and customs documentation.</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Assigned Depot Manager</label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:user-broken"></iconify-icon></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Kenji Takahashi"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Direct Contact Phone</label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:phone-broken"></iconify-icon></span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +81 3 5555 0142"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Operational Logistics */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Capacity &amp; Operational Metrics</h5>
                <p className="text-muted fs-13 mb-0">Initial vault storage capacity and baseline dispatch parameters.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Available Capacity (Units)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={formData.avail}
                      onChange={(e) => setFormData({ ...formData, avail: Number(e.target.value) })}
                    />
                    <div className="form-text text-muted">Total unit storage limit.</div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Initial In-Transit Units</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={formData.ship}
                      onChange={(e) => setFormData({ ...formData, ship: Number(e.target.value) })}
                    />
                    <div className="form-text text-muted">Units currently in transit.</div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Managed Valuation ($)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="$45,000"
                      value={formData.rev}
                      onChange={(e) => setFormData({ ...formData, rev: e.target.value })}
                    />
                    <div className="form-text text-muted">Estimated inventory value.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Status & Guidance */}
          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Facility Operational Status</h5>
              </div>
              <div className="card-body p-4">
                <label className="form-label fw-semibold">Operating State</label>
                <select
                  className="form-select mb-3"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Active">Active (Receiving &amp; Dispatching)</option>
                  <option value="Maintenance">Maintenance (Temporary Hold)</option>
                </select>

                <div className="alert alert-light border p-3 rounded mb-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <iconify-icon icon="solar:shield-check-bold" className="text-success fs-18"></iconify-icon>
                    <span className="fw-semibold text-dark">Automated Synchronization</span>
                  </div>
                  <p className="text-muted fs-12 mb-0">
                    Once established, this facility will immediately be available for inter-hub transfers, stock intake, and regional order fulfillment.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Establishing Hub...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:diskette-bold" className="fs-18"></iconify-icon> Establish Warehouse Hub
                    </>
                  )}
                </button>
                <Link href="/admin/inventory/warehouse" className="btn btn-light w-100">
                  Cancel &amp; Return
                </Link>
              </div>
            </div>

            <div className="card shadow-sm border-0 bg-primary bg-opacity-10 text-primary">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <iconify-icon icon="solar:info-circle-bold" className="fs-20"></iconify-icon>
                  <h6 className="fw-bold mb-0">Multi-Depot Routing</h6>
                </div>
                <p className="fs-13 mb-0 text-dark">
                  Hubs can be assigned to regional customer fulfillment rules. Ensure physical addresses are validated with local freight carriers for courier pickup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

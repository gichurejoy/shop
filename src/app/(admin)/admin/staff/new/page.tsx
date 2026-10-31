'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function NewStaffPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store Manager',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Full name and email address are required');
      return;
    }

    setSaving(true);
    try {
      await apiClient.staff.create(formData);
      toast.success(`Team member ${formData.name} added successfully!`);
      router.push('/admin/staff');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create staff member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Title & Breadcrumb */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-sm-0 fw-bold">Add Atelier Team Member</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/staff">Staff &amp; Team</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">New Member</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/staff" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Staff List
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
                <h5 className="card-title mb-0 fw-semibold">Personal &amp; Contact Information</h5>
                <p className="text-muted fs-13 mb-0">Create administrative credentials and assign operational roles.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. eleanor@atelier-larkon.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Direct Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +1 (212) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Assigned Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Inventory Specialist">Inventory Specialist</option>
                      <option value="Customer Support Lead">Customer Support Lead</option>
                      <option value="Logistics Coordinator">Logistics Coordinator</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Access Permissions</h5>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-light border p-3 rounded mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <iconify-icon icon="solar:shield-check-bold" className="text-success fs-18"></iconify-icon>
                    <span className="fw-semibold text-dark">Role Authorization</span>
                  </div>
                  <p className="text-muted fs-12 mb-0">
                    The chosen role determines administrative dashboard access, customer record visibility, and catalog modification rights.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:user-plus-bold" className="fs-18"></iconify-icon> Create Staff Account
                    </>
                  )}
                </button>
                <Link href="/admin/staff" className="btn btn-light w-100">
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

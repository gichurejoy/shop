'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface IStaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<IStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store Manager',
    phone: '',
  });

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await apiClient.staff.list();
      setStaff(res.staff || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleOpenModal = () => {
    setFormData({ name: '', email: '', role: 'Store Manager', phone: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSaving(true);
    try {
      const res = await apiClient.staff.create(formData);
      setStaff([res.member, ...staff]);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save staff member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from atelier staff?`)) return;
    try {
      await apiClient.staff.delete(id);
      setStaff(staff.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete staff member');
    }
  };

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row g-3">
      {/* KPI Cards */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Total Team Members</p>
                  <h4 className="fw-bold mb-0">{staff.length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-success-subtle text-success rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:shield-check-bold" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Active Admin Seats</p>
                  <h4 className="fw-bold mb-0 text-success">{staff.filter(s => s.role.includes('Admin')).length || 1}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-info-subtle text-info rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:user-hand-up-bold" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Store Operations Staff</p>
                  <h4 className="fw-bold mb-0 text-info">{staff.filter(s => !s.role.includes('Admin')).length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="card-title mb-1">Staff &amp; Team Management</h4>
              <p className="text-muted fs-13 mb-0">Role-based access permissions and administrative profiles.</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: '220px' }}
                />
              </div>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={handleOpenModal}>
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Team Member
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover table-centered mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Staff Member</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading team members from MySQL...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No team members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={member.avatar || 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg'}
                              alt=""
                              className="avatar-sm rounded-circle"
                              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-0 text-dark fw-semibold">{member.name}</h6>
                              <small className="text-muted">ID: {member.id.slice(0, 8)}</small>
                            </div>
                          </div>
                        </td>
                        <td>{member.email}</td>
                        <td>
                          <span
                            className={`badge px-2 py-1 fs-12 ${
                              member.role.includes('Admin')
                                ? 'bg-primary-subtle text-primary'
                                : member.role.includes('Manager')
                                ? 'bg-info-subtle text-info'
                                : 'bg-secondary-subtle text-secondary'
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="text-muted fs-13">{member.phone || 'N/A'}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success px-2 py-1 fs-12">
                            Active
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-soft-danger"
                            onClick={() => handleDelete(member.id, member.name)}
                            title="Remove Staff"
                          >
                            <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">Showing {filtered.length} staff accounts</span>
            <span className="text-muted fs-12">Stored in MySQL `users` table</span>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Atelier Team Member</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Marie Antoinette"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. marie@waveron.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+254 700 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Assigned Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Store Manager">Store Manager</option>
                      <option value="Inventory Staff">Inventory Staff</option>
                      <option value="Support Agent">Customer Support Agent</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Creating...' : 'Create Staff Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

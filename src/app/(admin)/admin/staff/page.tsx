'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
};

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Store Manager', status: 'Active', lastActive: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Inventory Manager', status: 'Inactive', lastActive: '3 days ago', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Support Agent', status: 'Active', lastActive: '15 mins ago', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', role: 'Marketing', status: 'Active', lastActive: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store Manager',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filtered = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (member?: StaffMember) => {
    if (member) {
      setEditId(member.id);
      setFormData({ name: member.name, email: member.email, role: member.role, status: member.status });
    } else {
      setEditId(null);
      setFormData({ name: '', email: '', role: 'Store Manager', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      setStaff(staff.map(s => s.id === editId ? { ...s, ...formData } : s));
    } else {
      setStaff([...staff, {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        lastActive: 'Just now',
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Staff Management</h4>
            <div className="d-flex gap-2 align-items-center">
              <div className="position-relative">
                <input 
                  type="search" 
                  className="form-control form-control-sm" 
                  placeholder="Search staff..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  style={{ paddingLeft: '30px', minWidth: '220px' }} 
                />
                <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
              </div>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => handleOpenModal()}>
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Staff
              </button>
            </div>
          </div>
          
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-hover table-centered mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Staff Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={s.avatar} alt={s.name} className="avatar-sm rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                          <span className="fw-medium text-dark">{s.name}</span>
                        </div>
                      </td>
                      <td>{s.email}</td>
                      <td>
                        <span className={`badge px-2 py-1 fs-12 ${s.role === 'Super Admin' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                          {s.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 fs-12 ${s.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="text-muted fs-13">{s.lastActive}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-soft-primary btn-sm" onClick={() => handleOpenModal(s)}><iconify-icon icon="solar:pen-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                          <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(s.id)}><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center p-4 text-muted">No staff found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '500px' }}>
            <div className="card-header d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">{editId ? 'Edit Staff Member' : 'Add New Staff'}</h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Full Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Email Address</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Role</label>
                <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Order Fulfillment">Order Fulfillment</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support Agent">Support Agent</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium text-dark">Account Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" className="btn btn-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Send Invite'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

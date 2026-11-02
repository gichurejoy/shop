'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const MODULES = [
  'Storefront Builder',
  'Product Catalog',
  'Inventory Management',
  'Order Processing',
  'Customers',
  'Marketing & SEO',
  'Communications & Chat',
  'Reports & Analytics',
  'Settings & Staff',
];

const ACTIONS = ['Create', 'Read', 'Update', 'Delete'];

export default function PermissionsPage() {
  const [perms, setPerms] = useState<Record<string, Record<string, boolean>>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState('Store Manager');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.roles.get();
      setRoles(res.roles || []);
      const mat = res.matrix || {};
      setPerms(mat[activeRole] || {});
    } catch (err: any) {
      toast.error('Failed to load permissions: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const toggle = (mod: string, action: string) => {
    setPerms((prev) => {
      const current = prev[mod] || { Create: false, Read: true, Update: false, Delete: false };
      return {
        ...prev,
        [mod]: {
          ...current,
          [action]: !current[action],
        },
      };
    });
  };

  const toggleAll = (action: string, val: boolean) => {
    setPerms((prev) => {
      const next = { ...prev };
      MODULES.forEach((m) => {
        next[m] = { ...(next[m] || {}), [action]: val };
      });
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.roles.save({ role: activeRole, permissions: perms });
      toast.success(`Role permissions for "${activeRole}" saved successfully!`);
    } catch (err: any) {
      toast.error('Failed to save permissions: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const filtered = MODULES.filter((m) => m.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Top Banner & Role Filter */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <span className="fw-bold text-dark">Viewing Permissions For:</span>
              <select
                className="form-select form-select-sm fw-bold w-auto"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/roles" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
                <iconify-icon icon="solar:shield-check-bold"></iconify-icon> Manage Role Matrix
              </Link>
              <Link href="/admin/staff" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                <iconify-icon icon="solar:users-group-two-rounded-broken"></iconify-icon> Team Staff List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions table */}
      <div className="card shadow-sm border-0">
        <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
          <div>
            <h4 className="card-title mb-1 fw-bold">Active System Authorizations</h4>
            <p className="text-muted fs-12 mb-0">Live permission records stored in MySQL.</p>
          </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '180px' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ minWidth: '220px' }}>Module Name</th>
                {ACTIONS.map((action) => (
                  <th key={action} className="text-center" style={{ width: '120px' }}>
                    <div className="d-flex flex-column align-items-center gap-1">
                      <span>{action}</span>
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          onClick={() => toggleAll(action, true)}
                          className="btn btn-xs px-1 py-0 text-success border-0 bg-success-subtle rounded"
                          style={{ fontSize: '10px' }}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAll(action, false)}
                          className="btn btn-xs px-1 py-0 text-danger border-0 bg-danger-subtle rounded"
                          style={{ fontSize: '10px' }}
                        >
                          None
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading authorizations...
                  </td>
                </tr>
              ) : (
                filtered.map((mod) => (
                  <tr key={mod}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <iconify-icon icon="solar:shield-check-bold" className="text-primary fs-18"></iconify-icon>
                        </div>
                        <span className="fw-semibold text-dark">{mod}</span>
                      </div>
                    </td>
                    {ACTIONS.map((action) => (
                      <td key={action} className="text-center">
                        <div className="form-check d-inline-block mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`perm-${mod}-${action}`}
                            checked={!!perms[mod]?.[action]}
                            onChange={() => toggle(mod, action)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top bg-transparent d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
          <p className="text-muted mb-0 fs-13">Showing {filtered.length} of {MODULES.length} modules</p>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={loadData}
            >
              Reset to Saved
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <iconify-icon icon="solar:diskette-bold" className="fs-16"></iconify-icon>
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

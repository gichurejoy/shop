'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>({});
  const [modules, setModules] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>(['Create', 'Read', 'Update', 'Delete']);
  const [activeRole, setActiveRole] = useState('Store Manager');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.roles.get();
      setRoles(res.roles || []);
      setMatrix(res.matrix || {});
      setModules(res.modules || []);
      setActions(res.actions || ['Create', 'Read', 'Update', 'Delete']);
      if (res.roles && res.roles.length > 0 && !res.roles.includes(activeRole)) {
        setActiveRole(res.roles[0]);
      }
    } catch (err: any) {
      toast.error('Failed to load role permissions: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentRolePerms = matrix[activeRole] || {};

  const toggle = (mod: string, action: string) => {
    setMatrix((prev) => {
      const rolePerms = prev[activeRole] || {};
      const modPerms = rolePerms[mod] || { Create: false, Read: true, Update: false, Delete: false };
      return {
        ...prev,
        [activeRole]: {
          ...rolePerms,
          [mod]: {
            ...modPerms,
            [action]: !modPerms[action],
          },
        },
      };
    });
  };

  const toggleAllAction = (action: string, val: boolean) => {
    setMatrix((prev) => {
      const rolePerms = prev[activeRole] || {};
      const nextRolePerms: Record<string, any> = { ...rolePerms };
      modules.forEach((mod) => {
        nextRolePerms[mod] = { ...(nextRolePerms[mod] || {}), [action]: val };
      });
      return {
        ...prev,
        [activeRole]: nextRolePerms,
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.roles.save({ role: activeRole, permissions: matrix[activeRole] });
      toast.success(`Permissions for "${activeRole}" saved to database!`);
    } catch (err: any) {
      toast.error('Failed to save permissions: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = () => {
    const roleName = prompt('Enter the name for the new operational role:');
    if (!roleName || !roleName.trim()) return;
    const clean = roleName.trim();
    if (roles.includes(clean)) {
      toast.error('A role with this name already exists.');
      return;
    }

    const defaultPerms: Record<string, any> = {};
    modules.forEach((m) => {
      defaultPerms[m] = { Create: false, Read: true, Update: false, Delete: false };
    });

    const newRoles = [...roles, clean];
    const newMatrix = { ...matrix, [clean]: defaultPerms };
    setRoles(newRoles);
    setMatrix(newMatrix);
    setActiveRole(clean);
    toast.success(`Role "${clean}" created! Adjust its permissions and click Save.`);
  };

  const handleDuplicateRole = () => {
    const copyName = `${activeRole} (Copy)`;
    const newRoles = [...roles, copyName];
    const newMatrix = { ...matrix, [copyName]: { ...matrix[activeRole] } };
    setRoles(newRoles);
    setMatrix(newMatrix);
    setActiveRole(copyName);
    toast.success(`Duplicated "${activeRole}" as "${copyName}"! Click Save to persist.`);
  };

  const filteredModules = modules.filter((m) => m.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading roles &amp; permissions matrix...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Role Picker Card */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h5 className="card-title mb-0 flex-shrink-0 fw-bold">Active Role:</h5>
            <select
              className="form-select form-select-md fw-bold"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              style={{ maxWidth: '300px', backgroundColor: '#f8fafc' }}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="ms-auto d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center gap-1 btn-sm"
                onClick={handleDuplicateRole}
              >
                <iconify-icon icon="solar:copy-bold-duotone"></iconify-icon> Duplicate Role
              </button>
              <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center gap-1 btn-sm"
                onClick={handleCreateRole}
              >
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add New Role
              </button>
              <Link href="/admin/staff" className="btn btn-light btn-sm d-flex align-items-center gap-1">
                <iconify-icon icon="solar:users-group-two-rounded-broken"></iconify-icon> View Staff Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="card shadow-sm border-0">
        <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
          <div>
            <h4 className="card-title mb-1 fw-bold">{activeRole} Permission Matrix</h4>
            <p className="text-muted fs-12 mb-0">Define specific create, read, update, and delete authorizations across all store modules.</p>
          </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '200px' }}
            />
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => actions.forEach((a) => toggleAllAction(a, true))}
                title="Grant All Permissions"
              >
                Grant All
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => actions.forEach((a) => toggleAllAction(a, false))}
                title="Revoke All"
              >
                Revoke All
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ width: '38%' }}>Module / Sub-system</th>
                {actions.map((act) => (
                  <th key={act} className="text-center" style={{ width: '15%' }}>
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <span>{act}</span>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-muted fs-11"
                        onClick={() => toggleAllAction(act, true)}
                        title={`Select all ${act}`}
                      >
                        (All)
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((mod, i) => (
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
                  {actions.map((act) => {
                    const isChecked = !!currentRolePerms[mod]?.[act];
                    return (
                      <td key={act} className="text-center">
                        <div className="form-check d-inline-block mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`perm-${mod}-${act}`}
                            checked={isChecked}
                            onChange={() => toggle(mod, act)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top bg-transparent d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
          <span className="text-muted fs-13">Showing {filteredModules.length} store modules</span>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={loadData}
            >
              Reset to Stored
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
                  Saving Matrix...
                </>
              ) : (
                <>
                  <iconify-icon icon="solar:diskette-bold" className="fs-16"></iconify-icon>
                  Save Role Permissions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

const MODULES = [
  'User Management',
  'Financial Management',
  'Content Management',
  'Payroll',
  'Reporting',
  'API Controls',
  'Disputes Management',
  'Database Management',
  'Repository Management',
];

const ACTIONS = ['Create', 'Read', 'Update', 'Delete'];

type PermMatrix = Record<string, Record<string, boolean>>;

const initialPerms = (): PermMatrix => {
  const m: PermMatrix = {};
  MODULES.forEach(mod => {
    m[mod] = { Create: false, Read: true, Update: false, Delete: false };
  });
  m['User Management'] = { Create: true, Read: true, Update: true, Delete: false };
  m['Financial Management'] = { Create: true, Read: true, Update: true, Delete: true };
  m['Reporting'] = { Create: false, Read: true, Update: false, Delete: false };
  return m;
};

export default function PermissionsPage() {
  const [perms, setPerms] = useState<PermMatrix>(initialPerms);
  const [search, setSearch] = useState('');

  const toggle = (mod: string, action: string) => {
    setPerms(p => ({ ...p, [mod]: { ...p[mod], [action]: !p[mod][action] } }));
  };

  const toggleAll = (action: string, val: boolean) => {
    setPerms(p => {
      const next = { ...p };
      MODULES.forEach(m => { next[m] = { ...next[m], [action]: val }; });
      return next;
    });
  };

  const filtered = MODULES.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    employees: 54,
    managers: 13,
    projects: 19,
    licenses: '36/50',
  };

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-3">
        {[
          { label: 'Employees',        value: stats.employees, icon: 'solar:users-group-two-rounded-bold-duotone', color: 'primary' },
          { label: 'Assigned Manager', value: stats.managers,  icon: 'solar:user-check-bold-duotone',             color: 'success' },
          { label: 'Projects',         value: stats.projects,  icon: 'solar:layers-bold-duotone',                 color: 'info'    },
          { label: 'License Used',     value: stats.licenses,  icon: 'solar:key-bold-duotone',                    color: 'warning' },
        ].map(s => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3 py-3">
                <div className={`avatar-md bg-${s.color} bg-opacity-10 rounded d-flex align-items-center justify-content-center`} style={{ minWidth: '52px', height: '52px' }}>
                  <iconify-icon className={`fs-28 text-${s.color}`} icon={s.icon}></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{s.label}</p>
                  <h4 className="fw-bold mb-0">{s.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0">All Permissions List</h4>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <div className="position-relative">
              <input type="search" className="form-control form-control-sm" placeholder="Search module..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px', minWidth: '180px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:export-bold"></iconify-icon> Export
            </button>
            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:import-bold"></iconify-icon> Import
            </button>
            <button className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Permission
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0" style={{ fontSize: '14px' }}>
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ minWidth: '200px' }}>Module Name</th>
                {ACTIONS.map(action => (
                  <th key={action} className="text-center" style={{ width: '110px' }}>
                    <div className="d-flex flex-column align-items-center gap-1">
                      <span>{action}</span>
                      <div className="d-flex gap-1">
                        <button onClick={() => toggleAll(action, true)}  className="btn btn-xs px-1 py-0" style={{ fontSize: '10px', color: '#22c55e', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px' }}>All</button>
                        <button onClick={() => toggleAll(action, false)} className="btn btn-xs px-1 py-0" style={{ fontSize: '10px', color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>None</button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mod, i) => (
                <tr key={mod}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: ['#eff6ff','#f0fdf4','#fffbeb','#fef2f2','#f5f3ff','#ecfeff','#fff7ed','#f8fafc','#f0fdf4'][i % 9], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <iconify-icon icon={['solar:users-group-two-rounded-bold-duotone','solar:dollar-bold-duotone','solar:document-bold-duotone','solar:bill-list-bold-duotone','solar:chart-bold-duotone','solar:code-bold-duotone','solar:danger-bold-duotone','solar:database-bold-duotone','solar:code-square-bold-duotone'][i % 9]} style={{ fontSize: '18px', color: ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ff6c2f','#64748b','#22c55e'][i % 9] }}></iconify-icon>
                      </div>
                      <span className="fw-medium">{mod}</span>
                    </div>
                  </td>
                  {ACTIONS.map(action => (
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
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-1">
                      <button className="btn btn-soft-primary btn-sm">
                        <iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon>
                      </button>
                      <button className="btn btn-soft-danger btn-sm">
                        <iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Showing {filtered.length} of {MODULES.length} modules</p>
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm d-flex align-items-center gap-2">
              <iconify-icon icon="solar:close-circle-bold"></iconify-icon> Reset
            </button>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
              <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon> Save Permissions
            </button>
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              {['«','1','2','3','»'].map(p => (
                <li key={p} className={`page-item ${p==='1'?'active':''}`}><button className="page-link">{p}</button></li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

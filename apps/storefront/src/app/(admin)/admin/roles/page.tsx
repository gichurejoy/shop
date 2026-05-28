'use client';

import { useState } from 'react';

const ROLES = [
  'Super Admin',
  'Store Manager',
  'Inventory Manager',
  'Order Fulfillment',
  'Marketing',
  'Support Agent',
];

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

type PermMatrix = Record<string, Record<string, boolean>>;

const getInitialPermsForRole = (role: string): PermMatrix => {
  const m: PermMatrix = {};
  MODULES.forEach(mod => {
    // default
    m[mod] = { Create: false, Read: true, Update: false, Delete: false };
  });

  if (role === 'Super Admin') {
    MODULES.forEach(mod => {
      m[mod] = { Create: true, Read: true, Update: true, Delete: true };
    });
  } else if (role === 'Store Manager') {
    MODULES.forEach(mod => {
      m[mod] = { Create: true, Read: true, Update: true, Delete: false };
    });
    m['Settings & Staff'] = { Create: false, Read: true, Update: false, Delete: false };
  } else if (role === 'Inventory Manager') {
    m['Inventory Management'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Product Catalog'] = { Create: false, Read: true, Update: true, Delete: false };
  } else if (role === 'Order Fulfillment') {
    m['Order Processing'] = { Create: true, Read: true, Update: true, Delete: false };
    m['Customers'] = { Create: false, Read: true, Update: false, Delete: false };
    m['Inventory Management'] = { Create: false, Read: true, Update: true, Delete: false };
  } else if (role === 'Marketing') {
    m['Storefront Builder'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Marketing & SEO'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Communications & Chat'] = { Create: true, Read: true, Update: true, Delete: false };
    m['Reports & Analytics'] = { Create: false, Read: true, Update: false, Delete: false };
  } else if (role === 'Support Agent') {
    m['Customers'] = { Create: true, Read: true, Update: true, Delete: false };
    m['Order Processing'] = { Create: false, Read: true, Update: true, Delete: false };
    m['Communications & Chat'] = { Create: true, Read: true, Update: true, Delete: false };
  }

  return m;
};

export default function RolesPage() {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [perms, setPerms] = useState<PermMatrix>(getInitialPermsForRole(ROLES[0]));
  const [search, setSearch] = useState('');

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setPerms(getInitialPermsForRole(role));
  };

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

  return (
    <div>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <h4 className="card-title mb-0 flex-shrink-0">Editing Role:</h4>
            <select 
              className="form-select form-select-lg fw-bold" 
              value={activeRole} 
              onChange={e => handleRoleChange(e.target.value)}
              style={{ maxWidth: '300px', backgroundColor: '#f8fafc' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="ms-auto d-flex gap-2">
              <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                <iconify-icon icon="solar:copy-bold-duotone"></iconify-icon> Duplicate Role
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2">
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Create New Role
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0">Role Permissions Matrix</h4>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <div className="position-relative">
              <input type="search" className="form-control form-control-sm" placeholder="Search module..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px', minWidth: '180px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0" style={{ fontSize: '14px' }}>
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ minWidth: '200px' }}>Module Area</th>
                {ACTIONS.map(action => (
                  <th key={action} className="text-center" style={{ width: '120px' }}>
                    <div className="d-flex flex-column align-items-center gap-1">
                      <span>{action}</span>
                      <div className="d-flex gap-1">
                        <button onClick={() => toggleAll(action, true)}  className="btn btn-xs px-1 py-0" style={{ fontSize: '10px', color: '#22c55e', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px' }}>All</button>
                        <button onClick={() => toggleAll(action, false)} className="btn btn-xs px-1 py-0" style={{ fontSize: '10px', color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>None</button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((mod, i) => (
                <tr key={mod}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: ['#eff6ff','#f0fdf4','#fffbeb','#fef2f2','#f5f3ff','#ecfeff','#fff7ed','#f8fafc','#f0fdf4'][i % 9], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <iconify-icon icon={['solar:monitor-smartphone-bold-duotone','solar:t-shirt-bold-duotone','solar:box-bold-duotone','solar:bag-smile-bold-duotone','solar:users-group-two-rounded-bold-duotone','solar:global-bold-duotone','solar:chat-round-line-bold-duotone','solar:chart-square-bold-duotone','solar:settings-bold-duotone'][i % 9]} style={{ fontSize: '18px', color: ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ff6c2f','#64748b','#22c55e'][i % 9] }}></iconify-icon>
                      </div>
                      <span className="fw-medium text-dark">{mod}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Showing {filtered.length} of {MODULES.length} modules</p>
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm d-flex align-items-center gap-2" onClick={() => setPerms(getInitialPermsForRole(activeRole))}>
              <iconify-icon icon="solar:close-circle-bold"></iconify-icon> Reset to Defaults
            </button>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
              <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon> Save Role Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

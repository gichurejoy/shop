'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const CUSTOMERS: Record<string, { name: string; username: string; email: string; phone: string; avatar: string; address: string; language: string; latestInvoice: string; accountId: string }> = {
  '1': { name: 'Michael A. Miner',  username: '@michael_cus_2024', email: 'michaelaminer@dayrep.com',    phone: '+28 (57) 760-010-27', avatar: 'https://i.pravatar.cc/80?img=11', address: '62 rue des Nations Unies, SAINT-BRIEUC', language: 'English',  latestInvoice: 'INV2540', accountId: '#AC-278699' },
  '2': { name: 'Theresa T. Brose',  username: '@theresa_brose',    email: 'theresa.brose@example.com',   phone: '+44 (20) 712-345-67', avatar: 'https://i.pravatar.cc/80?img=47', address: '14 Baker Street, London, UK',            language: 'English',  latestInvoice: 'INV3924', accountId: '#AC-394721' },
  '3': { name: 'James L. Erickson', username: '@james_erickson',   email: 'james.erickson@example.com',  phone: '+1 (415) 555-0198',   avatar: 'https://i.pravatar.cc/80?img=15', address: '300 Market St, San Francisco, CA',       language: 'English',  latestInvoice: 'INV5032', accountId: '#AC-503281' },
  '4': { name: 'Lily W. Wilson',    username: '@lily_wilson',       email: 'lily.wilson@example.com',     phone: '+1 (212) 555-0142',   avatar: 'https://i.pravatar.cc/80?img=44', address: '1600 Pennsylvania Ave, Washington DC',  language: 'English',  latestInvoice: 'INV1695', accountId: '#AC-169541' },
  '5': { name: 'Sarah M. Brooks',   username: '@sarah_brooks',      email: 'sarah.brooks@example.com',    phone: '+61 (2) 9374-4000',   avatar: 'https://i.pravatar.cc/80?img=32', address: '55 Collins St, Melbourne, Australia',   language: 'English',  latestInvoice: 'INV8473', accountId: '#AC-847302' },
};

const TRANSACTIONS = [
  { id: 'INV2540', status: 'Completed', amount: '$421.00', date: '07 Jan, 2023', payment: 'Mastercard' },
  { id: 'INV3924', status: 'Cancel',    amount: '$736.00', date: '03 Dec, 2023', payment: 'Visa'       },
  { id: 'INV5032', status: 'Completed', amount: '$347.00', date: '28 Sep, 2023', payment: 'Paypal'     },
  { id: 'INV1695', status: 'Pending',   amount: '$457.00', date: '10 Aug, 2023', payment: 'Mastercard' },
  { id: 'INV8473', status: 'Completed', amount: '$414.00', date: '22 May, 2023', payment: 'Visa'       },
];

const INVOICES = [
  { id: 'INV2540', date: '16 May 2024', amount: '$421.00', status: 'Completed' },
  { id: 'INV0914', date: '17 Jan 2024', amount: '$736.00', status: 'Cancel'    },
  { id: 'INV3801', date: '09 Nov 2023', amount: '$347.00', status: 'Completed' },
  { id: 'INV4782', date: '21 Aug 2023', amount: '$457.00', status: 'Pending'   },
];

function statusStyle(s: string) {
  if (s === 'Completed') return { bg: '#f0fdf4', c: '#16a34a' };
  if (s === 'Cancel')    return { bg: '#fef2f2', c: '#ef4444' };
  return { bg: '#fffbeb', c: '#d97706' };
}

export default function CustomerDetailDynamicPage() {
  const params = useParams();
  const id = String(params?.id ?? '1');
  const c = CUSTOMERS[id] ?? CUSTOMERS['1'];

  return (
    <div className="row g-3">
      {/* ── Left Column ── */}
      <div className="col-lg-4">
        {/* Profile */}
        <div className="card overflow-hidden mb-3">
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: '100px', position: 'relative' }}>
            <img
              src={c.avatar}
              alt={c.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fff', position: 'absolute', bottom: '-36px', left: '24px', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=3b82f6&color=fff&size=80`; }}
            />
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <span className="badge bg-success">Active</span>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: '44px' }}>
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              {c.name}
              <iconify-icon icon="solar:verified-check-bold-duotone" style={{ color: '#22c55e', fontSize: '18px' }}></iconify-icon>
            </h5>
            <a href="#!" className="text-primary" style={{ fontSize: '13px' }}>{c.username}</a>
            <div className="mt-2">
              <p className="mb-1" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:letter-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <span className="text-muted">{c.email}</span>
              </p>
              <p className="mb-0" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:phone-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <span className="text-muted">{c.phone}</span>
              </p>
            </div>
          </div>
          <div className="card-footer d-flex gap-2">
            <button className="btn btn-primary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
              <iconify-icon icon="solar:chat-round-bold-duotone"></iconify-icon> Message
            </button>
            <button className="btn btn-outline-secondary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
              <iconify-icon icon="solar:chart-bold-duotone"></iconify-icon> Analytics
            </button>
            <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{ minWidth: '36px' }}>
              <iconify-icon icon="solar:pen-2-bold-duotone" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
          </div>
        </div>

        {/* Details table */}
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:user-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Customer Details
            </h5>
            <span className="badge bg-success-subtle text-success">Active User</span>
          </div>
          <div className="card-body p-0">
            <table className="table mb-0" style={{ fontSize: '13px' }}>
              <tbody>
                {[
                  { label: 'Account ID',       value: c.accountId,        icon: 'solar:key-bold-duotone'       },
                  { label: 'Invoice Email',    value: c.email,            icon: 'solar:letter-bold-duotone'    },
                  { label: 'Delivery Address', value: c.address,          icon: 'solar:map-point-bold-duotone' },
                  { label: 'Language',         value: c.language,         icon: 'solar:global-bold-duotone'    },
                  { label: 'Latest Invoice',   value: `#${c.latestInvoice}`, icon: 'solar:bill-list-bold-duotone' },
                ].map(r => (
                  <tr key={r.label}>
                    <td className="px-3 py-2 text-muted" style={{ width: '44%', whiteSpace: 'nowrap' }}>
                      <iconify-icon icon={r.icon} style={{ color: '#94a3b8', marginRight: '5px' }}></iconify-icon>
                      {r.label}
                    </td>
                    <td className="px-3 py-2 fw-medium text-dark">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest invoices */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:bill-list-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Latest Invoices
            </h5>
            <Link href="/admin/invoices" className="btn btn-sm btn-primary">View All</Link>
          </div>
          <div className="card-body">
            {INVOICES.map(inv => {
              const sc = statusStyle(inv.status);
              return (
                <div key={inv.id} className="d-flex align-items-center gap-2 p-2 rounded mb-2" style={{ background: '#f8fafc' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon="solar:file-download-bold-duotone" style={{ color: '#3b82f6', fontSize: '18px' }}></iconify-icon>
                  </div>
                  <div className="flex-grow-1">
                    <Link href={`/admin/invoices/${inv.id}`} className="text-dark fw-medium text-decoration-none" style={{ fontSize: '13px' }}>#{inv.id}</Link>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{inv.date}</p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-0" style={{ fontSize: '13px' }}>{inv.amount}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: sc.c }}>{inv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="col-lg-8">
        {/* Stat cards */}
        <div className="row g-3 mb-3">
          {[
            { label: 'Total Invoice', value: '234',    icon: 'solar:bill-list-bold-duotone',        color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Total Orders',  value: '219',    icon: 'solar:box-bold-duotone',              color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Total Expense', value: '$2,189', icon: 'solar:chat-round-money-bold-duotone', color: '#8b5cf6', bg: '#f5f3ff' },
          ].map(s => (
            <div key={s.label} className="col-md-4">
              <div className="card">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon={s.icon} style={{ fontSize: '24px', color: s.color }}></iconify-icon>
                  </div>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{s.label}</p>
                    <h4 className="fw-bold mb-0">{s.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:history-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Transaction History
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0" style={{ fontSize: '13px' }}>
              <thead className="bg-light-subtle">
                <tr>
                  <th>Invoice ID</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Due Date</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map(t => {
                  const sc = statusStyle(t.status);
                  return (
                    <tr key={t.id}>
                      <td>
                        <Link href={`/admin/invoices/${t.id}`} className="text-primary text-decoration-none fw-medium">#{t.id}</Link>
                      </td>
                      <td>
                        <span style={{ background: sc.bg, color: sc.c, padding: '2px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '12px' }}>{t.status}</span>
                      </td>
                      <td className="fw-bold">{t.amount}</td>
                      <td className="text-muted">{t.date}</td>
                      <td className="text-muted">{t.payment}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link href={`/admin/invoices/${t.id}`} className="btn btn-soft-primary btn-sm">
                            <iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon>
                          </Link>
                          <button className="btn btn-soft-danger btn-sm">
                            <iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card-footer border-top d-flex justify-content-end">
            <nav><ul className="pagination pagination-sm mb-0 gap-1">
              {['«','1','2','3','»'].map(p => (
                <li key={p} className={`page-item ${p==='1'?'active':''}`}><button className="page-link">{p}</button></li>
              ))}
            </ul></nav>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="card h-100">
              <div className="card-body text-center">
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <iconify-icon icon="solar:star-bold-duotone" style={{ fontSize: '32px', color: '#fff' }}></iconify-icon>
                </div>
                <h5 className="fw-bold mb-1">
                  <iconify-icon icon="solar:medal-ribbon-bold-duotone" style={{ color: '#f59e0b', fontSize: '18px' }}></iconify-icon>
                  {' '}3,764 <span className="text-muted fw-normal" style={{ fontSize: '14px' }}>Points</span>
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Collect reward points with each purchase.</p>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-primary flex-fill btn-sm">Earn Points</button>
                <button className="btn btn-light flex-fill btn-sm">View Items</button>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon="solar:arrow-down-bold-duotone" style={{ color: '#16a34a', fontSize: '20px' }}></iconify-icon>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0">Payment Arrived</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>23 min ago</p>
                  </div>
                  <h5 className="fw-bold mb-0 text-success">+$1,340</h5>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src={c.avatar} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=3b82f6&color=fff&size=38`; }} />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0">{c.name}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Welcome Back</p>
                  </div>
                  <a href="#!" className="text-muted">
                    <iconify-icon icon="solar:settings-bold-duotone" style={{ fontSize: '18px' }}></iconify-icon>
                  </a>
                </div>
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: '12px' }}>Total Balance</p>
                  <h3 className="fw-bold mb-0">$4,700 <span className="text-muted fw-normal ms-1" style={{ fontSize: '14px' }}>+$232</span></h3>
                </div>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-primary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
                  <iconify-icon icon="solar:arrow-up-bold"></iconify-icon> Send
                </button>
                <button className="btn btn-light flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
                  <iconify-icon icon="solar:arrow-down-bold"></iconify-icon> Receive
                </button>
                <button className="btn btn-light btn-sm" style={{ minWidth: '36px' }}>
                  <iconify-icon icon="solar:add-circle-bold"></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

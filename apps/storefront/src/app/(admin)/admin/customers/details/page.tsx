'use client';

import Link from 'next/link';

export default function CustomerDetailPage() {
  return (
    <div className="row g-3">
      {/* ── Left Column ── */}
      <div className="col-lg-4">
        {/* Profile Card */}
        <div className="card overflow-hidden mb-3">
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: '100px', position: 'relative' }}>
            <img
              alt="Michael A. Miner"
              src="https://i.pravatar.cc/80?img=11"
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fff', position: 'absolute', bottom: '-36px', left: '24px', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Michael+Miner&background=3b82f6&color=fff&size=80'; }}
            />
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <span className="badge bg-success">Active</span>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: '44px' }}>
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              Michael A. Miner
              <iconify-icon icon="solar:verified-check-bold-duotone" style={{ color: '#22c55e', fontSize: '18px' }}></iconify-icon>
            </h5>
            <a href="#!" className="text-primary" style={{ fontSize: '13px' }}>@michael_cus_2024</a>
            <div className="mt-2">
              <p className="mb-1" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:letter-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <span className="text-muted">michaelaminer@dayrep.com</span>
              </p>
              <p className="mb-0" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:phone-bold-duotone" style={{ color: '#64748b', marginRight: '6px' }}></iconify-icon>
                <span className="text-muted">+28 (57) 760-010-27</span>
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

        {/* Customer Details */}
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
                  { label: 'Account ID',       value: '#AC-278699',                              icon: 'solar:key-bold-duotone'           },
                  { label: 'Invoice Email',    value: 'michaelaminer@dayrep.com',                icon: 'solar:letter-bold-duotone'        },
                  { label: 'Delivery Address', value: '62 rue des Nations Unies, SAINT-BRIEUC',  icon: 'solar:map-point-bold-duotone'     },
                  { label: 'Language',         value: 'English',                                  icon: 'solar:global-bold-duotone'        },
                  { label: 'Latest Invoice',   value: '#INV2540',                                 icon: 'solar:bill-list-bold-duotone'     },
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

        {/* Latest Invoices */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:bill-list-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
              Latest Invoices
            </h5>
            <Link href="/admin/invoices" className="btn btn-sm btn-primary">View All</Link>
          </div>
          <div className="card-body">
            {[
              { id: 'INV2540', date: '16 May 2024', amount: '$421.00', status: 'Completed' },
              { id: 'INV0914', date: '17 Jan 2024', amount: '$736.00', status: 'Cancel'    },
              { id: 'INV3801', date: '09 Nov 2023', amount: '$347.00', status: 'Completed' },
              { id: 'INV4782', date: '21 Aug 2023', amount: '$457.00', status: 'Pending'   },
            ].map(inv => (
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
                  <span style={{ fontSize: '11px', fontWeight: 600, color: inv.status === 'Completed' ? '#16a34a' : inv.status === 'Cancel' ? '#ef4444' : '#d97706' }}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="col-lg-8">
        {/* Stat Cards */}
        <div className="row g-3 mb-3">
          {[
            { label: 'Total Invoice', value: '234',     icon: 'solar:bill-list-bold-duotone',          color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Total Orders',  value: '219',     icon: 'solar:box-bold-duotone',                color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Total Expense', value: '$2,189',  icon: 'solar:chat-round-money-bold-duotone',   color: '#8b5cf6', bg: '#f5f3ff' },
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
                {[
                  { id: 'INV2540', status: 'Completed', amount: '$421.00', date: '07 Jan, 2023', payment: 'Mastercard' },
                  { id: 'INV3924', status: 'Cancel',    amount: '$736.00', date: '03 Dec, 2023', payment: 'Visa'       },
                  { id: 'INV5032', status: 'Completed', amount: '$347.00', date: '28 Sep, 2023', payment: 'Paypal'     },
                  { id: 'INV1695', status: 'Pending',   amount: '$457.00', date: '10 Aug, 2023', payment: 'Mastercard' },
                  { id: 'INV8473', status: 'Completed', amount: '$414.00', date: '22 May, 2023', payment: 'Visa'       },
                ].map(t => {
                  const sc = t.status === 'Completed' ? { bg: '#f0fdf4', c: '#16a34a' } : t.status === 'Cancel' ? { bg: '#fef2f2', c: '#ef4444' } : { bg: '#fffbeb', c: '#d97706' };
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
          {/* Loyalty Points */}
          <div className="col-lg-5">
            <div className="card h-100">
              <div className="card-body text-center">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <iconify-icon icon="solar:star-bold-duotone" style={{ fontSize: '36px', color: '#fff' }}></iconify-icon>
                </div>
                <h4 className="fw-bold mb-1">
                  <iconify-icon icon="solar:medal-ribbon-bold-duotone" style={{ color: '#f59e0b', fontSize: '20px' }}></iconify-icon>
                  {' '}3,764{' '}
                  <span className="text-muted fw-normal fs-15">Points Earned</span>
                </h4>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Collect reward points with each purchase.</p>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-primary flex-fill btn-sm">Earn Points</button>
                <button className="btn btn-light flex-fill btn-sm">View Items</button>
              </div>
            </div>
          </div>

          {/* Account Balance */}
          <div className="col-lg-7">
            <div className="card h-100">
              <div className="card-body">
                {/* Recent Payment */}
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon="solar:arrow-down-bold-duotone" style={{ color: '#16a34a', fontSize: '20px' }}></iconify-icon>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0">Payment Arrived</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>23 min ago</p>
                  </div>
                  <h5 className="fw-bold mb-0 text-success">+$1,340</h5>
                </div>

                {/* User */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src="https://i.pravatar.cc/40?img=11" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0">Michael A. Miner</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Welcome Back</p>
                  </div>
                  <a href="#!" className="text-muted"><iconify-icon icon="solar:settings-bold-duotone" style={{ fontSize: '20px' }}></iconify-icon></a>
                </div>

                {/* Balance */}
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: '12px' }}>Total Balance</p>
                  <h3 className="fw-bold mb-0">$4,700 <span className="fs-15 text-muted fw-normal ms-1">+$232</span></h3>
                </div>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-primary flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
                  <iconify-icon icon="solar:arrow-up-bold"></iconify-icon> Send
                </button>
                <button className="btn btn-light flex-fill btn-sm d-flex align-items-center justify-content-center gap-1">
                  <iconify-icon icon="solar:arrow-down-bold"></iconify-icon> Receive
                </button>
                <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{ minWidth: '36px' }}>
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

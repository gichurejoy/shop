'use client';

import React, { useState } from 'react';

type RefundRequest = {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  dateRequested: string;
  reason: string;
  status: 'Pending' | 'Processed' | 'Rejected';
};

const MOCK_REFUNDS: RefundRequest[] = [
  { id: 'REF-5421', orderId: '#ORD-10045', customer: 'Alice Freeman', amount: '$45.00', dateRequested: '2 hours ago', reason: 'Item arrived damaged', status: 'Pending' },
  { id: 'REF-5420', orderId: '#ORD-10032', customer: 'John Doe', amount: '$120.00', dateRequested: 'Yesterday', reason: 'Changed mind', status: 'Pending' },
  { id: 'REF-5419', orderId: '#ORD-9980', customer: 'Sophie Williams', amount: '$210.00', dateRequested: 'Oct 10, 2023', reason: 'Wrong size', status: 'Processed' },
  { id: 'REF-5418', orderId: '#ORD-9975', customer: 'Mark Johnson', amount: '$15.00', dateRequested: 'Oct 09, 2023', reason: 'Late delivery', status: 'Rejected' },
];

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>(MOCK_REFUNDS);
  const [activeTab, setActiveTab] = useState<'Pending' | 'All'>('Pending');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  
  const [refundAmount, setRefundAmount] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const filtered = activeTab === 'Pending' 
    ? refunds.filter(r => r.status === 'Pending')
    : refunds;

  const handleAction = (status: 'Processed' | 'Rejected') => {
    if (!selectedRefund) return;
    setRefunds(refunds.map(r => r.id === selectedRefund.id ? { ...r, status } : r));
    setSelectedRefund(null);
  };

  const openProcessModal = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setRefundAmount(refund.amount.replace('$', ''));
    setAdminNote('');
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between align-items-end">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button className={`nav-link fw-medium ${activeTab === 'Pending' ? 'active border-bottom-0 bg-light-subtle text-primary' : 'text-muted'}`} onClick={() => setActiveTab('Pending')}>
                  Pending Requests <span className="badge bg-danger ms-1">{refunds.filter(r => r.status === 'Pending').length}</span>
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link fw-medium ${activeTab === 'All' ? 'active border-bottom-0 bg-light-subtle text-primary' : 'text-muted'}`} onClick={() => setActiveTab('All')}>
                  All Refunds
                </button>
              </li>
            </ul>
            <div className="pb-2">
              <div className="position-relative">
                <input type="search" className="form-control form-control-sm" placeholder="Search refunds..." style={{ paddingLeft: '30px' }} />
                <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
              </div>
            </div>
          </div>
          
          <div className="card-body bg-light-subtle border-top pt-3 rounded-bottom">
            <div className="table-responsive">
              <table className="table bg-white rounded shadow-sm align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Refund ID</th>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Reason</th>
                    <th>Amount</th>
                    <th>Date Requested</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ref => (
                    <tr key={ref.id}>
                      <td className="fw-medium text-dark">{ref.id}</td>
                      <td><a href="#!" className="text-primary text-decoration-none">{ref.orderId}</a></td>
                      <td>{ref.customer}</td>
                      <td className="text-muted fs-13" style={{ maxWidth: '200px' }}><div className="text-truncate">{ref.reason}</div></td>
                      <td className="fw-bold">{ref.amount}</td>
                      <td className="text-muted fs-13">{ref.dateRequested}</td>
                      <td>
                        <span className={`badge ${
                          ref.status === 'Processed' ? 'bg-success-subtle text-success' :
                          ref.status === 'Rejected' ? 'bg-danger-subtle text-danger' :
                          'bg-warning-subtle text-warning'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {ref.status === 'Pending' ? (
                          <button className="btn btn-sm btn-primary" onClick={() => openProcessModal(ref)}>Process</button>
                        ) : (
                          <button className="btn btn-soft-secondary btn-sm"><iconify-icon icon="solar:eye-bold-duotone" className="align-middle"></iconify-icon></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center p-4 text-muted">No {activeTab.toLowerCase()} refunds found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Process Refund Modal */}
      {selectedRefund && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '550px' }}>
            <div className="card-header d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">Process Refund {selectedRefund.id}</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedRefund(null)}></button>
            </div>
            <div className="card-body">
              
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded border">
                    <span className="d-block text-muted fs-12 text-uppercase mb-1">Customer</span>
                    <span className="fw-medium text-dark">{selectedRefund.customer}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded border">
                    <span className="d-block text-muted fs-12 text-uppercase mb-1">Order Total</span>
                    <span className="fw-medium text-dark">{selectedRefund.amount}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 bg-warning-subtle text-warning-emphasis rounded border border-warning-subtle">
                    <span className="d-block fw-bold fs-13 mb-1">Customer Reason:</span>
                    <span className="fs-14">"{selectedRefund.reason}"</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Refund Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control fw-bold" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} />
                </div>
                <div className="form-text mt-1 text-muted">You can process a partial refund by changing this amount.</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-dark">Admin Note (Internal only)</label>
                <textarea className="form-control" rows={2} placeholder="Add a note about this decision..." value={adminNote} onChange={e => setAdminNote(e.target.value)}></textarea>
              </div>

              <div className="d-flex justify-content-between gap-2 pt-3 border-top">
                <button type="button" className="btn btn-outline-danger" onClick={() => handleAction('Rejected')}>Reject Refund</button>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setSelectedRefund(null)}>Cancel</button>
                  <button type="button" className="btn btn-success d-flex align-items-center gap-2" onClick={() => handleAction('Processed')}>
                    <iconify-icon icon="solar:check-circle-bold-duotone"></iconify-icon> Approve Refund
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

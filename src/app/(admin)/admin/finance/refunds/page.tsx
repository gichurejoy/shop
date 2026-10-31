'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface IRefundItem {
  id: string;
  trxId?: string;
  orderId: string;
  customer: string;
  amount: string;
  rawAmount?: number;
  dateRequested: string;
  reason: string;
  status: 'Pending' | 'Processed' | 'Rejected';
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<IRefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Pending' | 'All'>('Pending');
  const [selectedRefund, setSelectedRefund] = useState<IRefundItem | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState('');

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const res = await apiClient.transactions.list();
      const allTx = res.transactions || [];
      // Map transactions to refund candidate requests
      const list: IRefundItem[] = allTx.map((t) => ({
        id: `REF-${t.id.replace(/[^0-9]/g, '').slice(-4) || '5421'}`,
        trxId: t.id,
        orderId: t.orderId,
        customer: t.customer,
        amount: t.amount,
        rawAmount: t.rawAmount,
        dateRequested: t.date,
        reason: t.status === 'Refunded' ? 'Customer requested return / approved' : 'Dispute / return requested',
        status: t.status === 'Refunded' ? 'Processed' : 'Pending',
      }));
      setRefunds(list);
    } catch (err) {
      console.error('Failed to load refunds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleAction = async (status: 'Processed' | 'Rejected') => {
    if (!selectedRefund) return;
    setProcessing(true);
    try {
      if (status === 'Processed') {
        await apiClient.transactions.refund(selectedRefund.trxId || selectedRefund.id, selectedRefund.rawAmount, adminNote);
      }
      setRefunds(refunds.map(r => r.id === selectedRefund.id ? { ...r, status } : r));
      setSelectedRefund(null);
      setAdminNote('');
    } catch (err) {
      alert('Failed to process refund');
    } finally {
      setProcessing(false);
    }
  };

  const openProcessModal = (refund: IRefundItem) => {
    setSelectedRefund(refund);
    setAdminNote('Customer return received and verified in atelier.');
  };

  const filtered = refunds.filter((r) => {
    const matchesTab = activeTab === 'Pending' ? r.status === 'Pending' : true;
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = refunds.filter(r => r.status === 'Pending').length;

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between align-items-end flex-wrap gap-2">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'Pending' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('Pending')}
                >
                  Pending Requests <span className="badge bg-danger ms-1">{pendingCount}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'All' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('All')}
                >
                  All Refunds ({refunds.length})
                </button>
              </li>
            </ul>
            <div className="pb-2 d-flex gap-2">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search refunds..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: '220px' }}
                />
              </div>
              <button onClick={loadRefunds} className="btn btn-sm btn-outline-light text-dark">
                <iconify-icon icon="solar:restart-bold" className="align-middle"></iconify-icon>
              </button>
            </div>
          </div>

          <div className="card-body p-0 border-top">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Refund ID</th>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Reason / Notes</th>
                    <th>Amount</th>
                    <th>Date Requested</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading refunds from MySQL...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted">
                        No refunds found matching this view.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((ref) => (
                      <tr key={ref.id}>
                        <td className="fw-medium text-dark">{ref.id}</td>
                        <td>
                          <Link href={`/admin/orders/${ref.orderId.replace('#', '')}`} className="text-primary text-decoration-none fw-semibold">
                            {ref.orderId}
                          </Link>
                        </td>
                        <td>{ref.customer}</td>
                        <td className="text-muted fs-13" style={{ maxWidth: '240px' }}>
                          <div className="text-truncate" title={ref.reason}>{ref.reason}</div>
                        </td>
                        <td className="fw-bold text-dark">{ref.amount}</td>
                        <td className="text-muted fs-13">{ref.dateRequested}</td>
                        <td>
                          <span className={`badge px-2 py-1 fs-12 ${
                            ref.status === 'Processed'
                              ? 'bg-success-subtle text-success'
                              : ref.status === 'Rejected'
                              ? 'bg-danger-subtle text-danger'
                              : 'bg-warning-subtle text-warning'
                          }`}>
                            {ref.status}
                          </span>
                        </td>
                        <td className="text-end">
                          {ref.status === 'Pending' ? (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => openProcessModal(ref)}
                            >
                              Process Refund
                            </button>
                          ) : (
                            <span className="text-muted fs-12">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">Showing {filtered.length} refund requests</span>
            <span className="text-muted fs-12">Integrated with MySQL transactions</span>
          </div>
        </div>
      </div>

      {/* Process Refund Modal */}
      {selectedRefund && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Review & Settle Refund #{selectedRefund.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRefund(null)}></button>
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fs-13">Customer:</span>
                    <strong className="text-dark">{selectedRefund.customer}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted fs-13">Order:</span>
                    <strong className="text-primary">{selectedRefund.orderId}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fs-13">Refund Total:</span>
                    <strong className="text-danger fs-16">{selectedRefund.amount}</strong>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Settlement Verification Note</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter reason or vault restocking confirmation..."
                  />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-soft-danger"
                  onClick={() => handleAction('Rejected')}
                  disabled={processing}
                >
                  Reject Claim
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedRefund(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleAction('Processed')}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Approve & Refund'}
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

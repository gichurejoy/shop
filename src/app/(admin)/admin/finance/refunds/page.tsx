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
  const [search, setSearch] = useState('');

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const res = await apiClient.transactions.list();
      const allTx = res.transactions || [];
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
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between align-items-end flex-wrap gap-2">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'Pending' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('Pending')}
                >
                  Pending Review <span className="badge bg-warning-subtle text-warning ms-1">{pendingCount}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'All' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('All')}
                >
                  All Requests ({refunds.length})
                </button>
              </li>
            </ul>

            <div className="pb-2">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search refund, client, order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: '240px' }}
              />
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Refund ID</th>
                    <th>Order Reference</th>
                    <th>Customer Name</th>
                    <th>Return Reason</th>
                    <th>Amount</th>
                    <th>Date Requested</th>
                    <th>Current Status</th>
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
                            <Link
                              href={`/admin/finance/refunds/${ref.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              Process Refund
                            </Link>
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
    </div>
  );
}

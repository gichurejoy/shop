'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface ITransaction {
  id: string;
  trxId?: string;
  date: string;
  customer: string;
  customerEmail?: string;
  amount: string;
  rawAmount?: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  gateway: string;
  orderId: string;
  receiptNumber?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    customer: '',
    orderId: '',
    gateway: 'Bank Transfer',
    status: 'paid',
  });

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.transactions.list();
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.customer) return;
    setSaving(true);
    try {
      await apiClient.transactions.create({
        amount: parseFloat(formData.amount),
        orderId: formData.orderId || `ORD-${Date.now().toString().slice(-5)}`,
        method: formData.gateway.toLowerCase().includes('mpesa') ? 'mpesa' : formData.gateway.toLowerCase().includes('stripe') ? 'card' : 'bank_transfer',
        status: formData.status,
        reference: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
        metadata: { customerName: formData.customer },
      });
      setIsModalOpen(false);
      setFormData({ amount: '', customer: '', orderId: '', gateway: 'Bank Transfer', status: 'paid' });
      await loadTransactions();
    } catch (err) {
      alert('Failed to record transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Customer', 'Amount', 'Status', 'Gateway', 'Order ID', 'Receipt Number'];
    const rows = filtered.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.customer.replace(/"/g, '""')}"`,
      `"${t.amount}"`,
      `"${t.status}"`,
      `"${t.gateway}"`,
      `"${t.orderId}"`,
      `"${t.receiptNumber || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalVolume = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + (t.rawAmount || parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0), 0);

  return (
    <div className="row g-3">
      {/* KPI Cards */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-success-subtle text-success rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Completed Ledger Volume</p>
                  <h4 className="fw-bold mb-0 text-success">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:card-2-bold-duotone" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Total Transactions</p>
                  <h4 className="fw-bold mb-0">{transactions.length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-warning-subtle text-warning rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:clock-circle-bold" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Pending Settlements</p>
                  <h4 className="fw-bold mb-0 text-warning">{transactions.filter(t => t.status === 'Pending').length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-info-subtle text-info rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:restart-circle-bold" className="fs-24 text-info"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Refunded Payments</p>
                  <h4 className="fw-bold mb-0">{transactions.filter(t => t.status === 'Refunded').length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="card-title mb-1">Financial Transactions Ledger</h4>
              <p className="text-muted fs-13 mb-0">Audited payment receipts across Stripe, M-Pesa, PayPal and Wire.</p>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search TRX, Order, Client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: '220px' }}
                />
              </div>
              <select className="form-select form-select-sm w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={handleExportCSV}>
                <iconify-icon icon="solar:export-bold"></iconify-icon> Export CSV
              </button>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Record Manual Payment
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Transaction Reference</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Gateway</th>
                    <th>Order Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading financial ledger from MySQL...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No transactions found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <code className="fw-bold">{t.id}</code>
                          {t.receiptNumber && t.receiptNumber !== 'N/A' && (
                            <div className="text-muted fs-11">Rec: {t.receiptNumber}</div>
                          )}
                        </td>
                        <td className="text-muted fs-13">{t.date}</td>
                        <td>
                          <span className="fw-medium text-dark">{t.customer}</span>
                        </td>
                        <td className="fw-bold text-dark">{t.amount}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{t.gateway}</span>
                        </td>
                        <td>
                          <span className="text-primary fw-medium">{t.orderId}</span>
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 fs-12 ${
                              t.status === 'Completed'
                                ? 'bg-success-subtle text-success'
                                : t.status === 'Refunded'
                                ? 'bg-danger-subtle text-danger'
                                : t.status === 'Failed'
                                ? 'bg-secondary-subtle text-secondary'
                                : 'bg-warning-subtle text-warning'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">Showing {filtered.length} transactions</span>
            <span className="text-muted fs-12">Synced with MySQL `payment_transactions`</span>
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Manual Payment Receipt</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold">Customer Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Payment Amount ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Associated Order ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="#LK-2024-XXXX"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Payment Method</label>
                    <select
                      className="form-select"
                      value={formData.gateway}
                      onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                    >
                      <option value="Bank Transfer">Bank Wire Transfer</option>
                      <option value="M-Pesa">M-Pesa Express</option>
                      <option value="Stripe Card">Stripe Credit Card</option>
                      <option value="Cash / POS">Boutique Cash / POS Terminal</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Recording...' : 'Record Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

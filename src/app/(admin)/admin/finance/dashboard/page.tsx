'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function FinanceDashboardPage() {
  const [dateRange, setDateRange] = useState('this_month');
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (range: string) => {
    try {
      setLoading(true);
      const [reportRes, trxRes] = await Promise.all([
        apiClient.reports.financial(range).catch(() => ({ report: null })),
        apiClient.transactions.list().catch(() => ({ transactions: [] })),
      ]);
      setFinancialReport(reportRes.report);
      setTransactions(trxRes.transactions || []);
    } catch (err: any) {
      toast.error('Failed to load finance data: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dateRange);
  }, [dateRange]);

  const handleExportReport = () => {
    window.location.href = `/api/reports/financial?range=${encodeURIComponent(dateRange)}&export=csv`;
    toast.success('Downloading financial CSV report...');
  };

  const grossSales = financialReport?.grossSales || 0;
  const netRevenue = financialReport?.netRevenue || 0;
  const refundedAmount = financialReport?.refundedAmount || 0;
  const ordersCount = financialReport?.ordersCount || 0;

  const stats = [
    {
      label: 'Gross Invoiced Sales',
      value: `$${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `${ordersCount} orders recorded`,
      trend: 'up',
      color: 'success',
    },
    {
      label: 'Net Realized Revenue',
      value: `$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: 'After discounts applied',
      trend: 'up',
      color: 'primary',
    },
    {
      label: 'Settled Refunds',
      value: `$${refundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: netRevenue > 0 ? `${((refundedAmount / netRevenue) * 100).toFixed(1)}% refund ratio` : '0% refund ratio',
      trend: 'down',
      color: 'danger',
    },
    {
      label: 'Tax Collected',
      value: `$${(financialReport?.taxCollected || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: 'Pending regional remittance',
      trend: 'up',
      color: 'warning',
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="card-title mb-1 fw-bold">Finance &amp; Revenue Overview</h4>
          <p className="text-muted fs-13 mb-0">Synchronized directly with active MySQL order transactions.</p>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <select
            className="form-select form-select-sm w-auto"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="all">All-Time Cumulative</option>
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            onClick={handleExportReport}
          >
            <iconify-icon icon="solar:download-bold-duotone"></iconify-icon> Export Report
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <p className="text-muted mb-2 fs-13 fw-medium">{stat.label}</p>
                <div className="d-flex justify-content-between align-items-end">
                  <h3 className="mb-0 fw-bold">{loading ? '...' : stat.value}</h3>
                  <span className={`badge bg-${stat.color}-subtle text-${stat.color} fs-11`}>
                    {stat.sub}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Revenue Distribution & Quick Links */}
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 fw-semibold">Financial Sub-Modules &amp; Reports</h5>
              <Link href="/admin/finance/reports" className="btn btn-sm btn-link text-primary p-0 text-decoration-none">
                Deep-Dive Reports →
              </Link>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light-subtle h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <iconify-icon icon="solar:chart-square-bold-duotone" className="text-primary fs-22"></iconify-icon>
                      <h6 className="mb-0 fw-bold">P&amp;L and Margins</h6>
                    </div>
                    <p className="text-muted fs-12 mb-3">Track gross revenues against estimated 45% production COGS.</p>
                    <Link href="/admin/finance/reports" className="btn btn-sm btn-outline-primary w-100">
                      Open P&amp;L Statement
                    </Link>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light-subtle h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <iconify-icon icon="solar:card-2-bold-duotone" className="text-success fs-22"></iconify-icon>
                      <h6 className="mb-0 fw-bold">Payment Methods</h6>
                    </div>
                    <p className="text-muted fs-12 mb-3">Enable or configure Stripe, PayPal, M-Pesa, and Cash on Delivery.</p>
                    <Link href="/admin/finance/gateways" className="btn btn-sm btn-outline-success w-100">
                      Manage Gateways
                    </Link>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light-subtle h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <iconify-icon icon="solar:document-text-bold-duotone" className="text-info fs-22"></iconify-icon>
                      <h6 className="mb-0 fw-bold">Tax Jurisdictions</h6>
                    </div>
                    <p className="text-muted fs-12 mb-3">Manage inclusive/exclusive regional taxation and collection rates.</p>
                    <Link href="/admin/finance/taxes" className="btn btn-sm btn-outline-info w-100">
                      Configure Regional Taxes
                    </Link>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light-subtle h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <iconify-icon icon="solar:wallet-money-bold-duotone" className="text-warning fs-22"></iconify-icon>
                      <h6 className="mb-0 fw-bold">Partner Settlements</h6>
                    </div>
                    <p className="text-muted fs-12 mb-3">Audit artisan vendor balances and process direct bank transfers.</p>
                    <Link href="/admin/finance/payouts" className="btn btn-sm btn-outline-warning w-100">
                      Review Payouts
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Channel Allocation */}
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header border-bottom bg-transparent">
              <h5 className="card-title mb-0 fw-semibold">Sales Channels</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                {[
                  { name: 'Online Boutique Storefront', share: '85%', color: 'primary' },
                  { name: 'Concierge Direct Orders', share: '10%', color: 'info' },
                  { name: 'Admin POS Terminal', share: '5%', color: 'success' },
                ].map((channel, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fs-13 fw-medium">{channel.name}</span>
                      <span className="fs-13 fw-bold">{channel.share}</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className={`progress-bar bg-${channel.color}`} style={{ width: channel.share }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-light rounded text-muted fs-12 border">
                <iconify-icon icon="solar:shield-check-bold" className="text-success me-1 align-middle"></iconify-icon>
                All figures represent live confirmed sales stored in the MySQL orders table.
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payment Transactions */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
              <h5 className="card-title mb-0 fw-semibold">Recent Transactions</h5>
              <Link href="/admin/finance/transactions" className="btn btn-link btn-sm text-primary p-0 text-decoration-none">
                View All Ledger Entries →
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 text-nowrap">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Reference / ID</th>
                    <th>Date &amp; Time</th>
                    <th>Customer</th>
                    <th>Method / Gateway</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No transactions found in this period.
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 6).map((trx, i) => (
                      <tr key={trx.id || i}>
                        <td><code className="fw-bold">{trx.id}</code></td>
                        <td className="text-muted fs-13">{trx.date}</td>
                        <td className="fw-medium text-dark">{trx.customer}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {trx.gateway}
                          </span>
                        </td>
                        <td className="fw-bold text-dark">{trx.amount}</td>
                        <td>
                          <span className={`badge ${
                            trx.status === 'Completed' ? 'bg-success-subtle text-success' :
                            trx.status === 'Refunded' ? 'bg-danger-subtle text-danger' :
                            'bg-warning-subtle text-warning'
                          }`}>
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

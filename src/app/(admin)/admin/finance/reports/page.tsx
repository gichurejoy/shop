'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const REPORTS = [
  { id: 'revenue', name: 'Revenue Report', description: 'Detailed breakdown of gross and net revenue over time.', icon: 'solar:chart-square-bold-duotone', color: 'primary' },
  { id: 'tax', name: 'Tax Liability Report', description: 'Collected taxes broken down by customer region and tax rate.', icon: 'solar:document-text-bold-duotone', color: 'info' },
  { id: 'refunds', name: 'Refunds & Returns', description: 'Analysis of refunded transactions and settled returns.', icon: 'solar:round-transfer-horizontal-bold-duotone', color: 'danger' },
  { id: 'pnl', name: 'Profit & Loss (P&L)', description: 'Revenue minus estimated COGS and operational fulfillment costs.', icon: 'solar:wad-of-money-bold-duotone', color: 'success' },
];

export default function FinancialReportsPage() {
  const [activeReport, setActiveReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('this_month');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (range: string) => {
    try {
      setLoading(true);
      const res = await apiClient.reports.financial(range);
      setReportData(res.report);
    } catch (err: any) {
      toast.error('Failed to load financial report: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dateRange);
  }, [dateRange]);

  const handleExportCSV = () => {
    window.location.href = `/api/reports/financial?range=${encodeURIComponent(dateRange)}&export=csv`;
    toast.success('Downloading financial CSV report...');
  };

  const grossSales = reportData?.grossSales || 0;
  const discounts = reportData?.discounts || 0;
  const netRevenue = reportData?.netRevenue || 0;
  const taxCollected = reportData?.taxCollected || 0;
  const shippingCollected = reportData?.shippingCollected || 0;
  const refundedAmount = reportData?.refundedAmount || 0;
  const estimatedCogs = netRevenue * 0.45; // 45% standard luxury production COGS
  const grossProfit = netRevenue - estimatedCogs;
  const netMargin = netRevenue > 0 ? ((grossProfit / netRevenue) * 100).toFixed(1) : '0.0';

  return (
    <div className="row g-3">
      {/* Sidebar Report Selectors */}
      <div className="col-lg-3">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-bottom bg-transparent py-3">
            <h5 className="card-title mb-0 fw-semibold">Report Categories</h5>
          </div>
          <div className="card-body p-2">
            <div className="d-flex flex-column gap-1">
              {REPORTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`btn text-start p-3 border-0 rounded ${activeReport === r.id ? `bg-${r.color}-subtle` : 'hover-bg-light'}`}
                  onClick={() => setActiveReport(r.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <iconify-icon icon={r.icon} className={`fs-24 text-${r.color}`}></iconify-icon>
                    <div>
                      <h6 className={`mb-1 fw-bold ${activeReport === r.id ? `text-${r.color}` : 'text-dark'}`}>{r.name}</h6>
                      <p className="text-muted fs-12 mb-0" style={{ whiteSpace: 'normal', lineHeight: '1.3' }}>{r.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="col-lg-9">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
            <div>
              <h4 className="card-title mb-1 fw-bold">{REPORTS.find((r) => r.id === activeReport)?.name}</h4>
              <p className="text-muted fs-12 mb-0">Live calculation synchronized from MySQL order transactions.</p>
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
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={handleExportCSV}
              >
                <iconify-icon icon="solar:export-bold"></iconify-icon> Export CSV
              </button>
            </div>
          </div>

          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Calculating live financial metrics from database...
              </div>
            ) : (
              <>
                {/* 1. REVENUE REPORT */}
                {activeReport === 'revenue' && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Gross Invoiced Sales</span>
                          <h4 className="fw-bold mb-0 text-dark">${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Discounts &amp; Promos</span>
                          <h4 className="fw-bold mb-0 text-danger">-${discounts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-primary bg-opacity-10 text-center border-primary border-opacity-25">
                          <span className="text-primary fs-13 d-block mb-1 fw-semibold">Net Realized Revenue</span>
                          <h4 className="fw-bold mb-0 text-primary">${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-light border-0 p-3 mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold text-dark">Completed Orders in Period</span>
                        <span className="badge bg-primary text-white fs-12">{reportData?.ordersCount || 0} Orders</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fs-13">Shipping Courier Income</span>
                        <span className="fw-medium text-dark">${shippingCollected.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted fs-13">Sales Tax Collected</span>
                        <span className="fw-medium text-dark">${taxCollected.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="table-responsive border rounded">
                      <table className="table align-middle table-hover mb-0 text-nowrap">
                        <thead className="bg-light-subtle">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Subtotal</th>
                            <th>Total Charged</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(reportData?.orders || []).slice(0, 8).map((o: any) => (
                            <tr key={o.id}>
                              <td><code className="fw-bold">{o.orderNumber || o.id}</code></td>
                              <td className="text-muted fs-13">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="fw-medium text-dark">{o.customerName}</td>
                              <td>${Number(o.subtotal || 0).toFixed(2)}</td>
                              <td className="fw-bold text-dark">${Number(o.total || 0).toFixed(2)}</td>
                              <td>
                                <span className={`badge ${o.status === 'delivered' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
                                  {(o.status || 'completed').toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. TAX LIABILITY REPORT */}
                {activeReport === 'tax' && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-6">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Total Sales Tax Collected</span>
                          <h4 className="fw-bold mb-0 text-info">${taxCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Jurisdictions Registered</span>
                          <h4 className="fw-bold mb-0 text-dark">{reportData?.taxBreakdown?.length || 1} Regions</h4>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive border rounded">
                      <table className="table align-middle table-hover mb-0 text-nowrap">
                        <thead className="bg-light-subtle">
                          <tr>
                            <th>Region / Destination</th>
                            <th>Effective Rate</th>
                            <th>Taxable Sales</th>
                            <th>Tax Collected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(reportData?.taxBreakdown || []).map((t: any, i: number) => (
                            <tr key={i}>
                              <td className="fw-semibold text-dark">{t.region}</td>
                              <td><span className="badge bg-light text-dark border">{t.rate}</span></td>
                              <td>${Number(t.taxableSales).toFixed(2)}</td>
                              <td className="fw-bold text-info">${Number(t.taxCollected).toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-light fw-bold">
                            <td colSpan={3} className="text-end">Total Remittance Liability:</td>
                            <td className="text-primary">${taxCollected.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. REFUNDS REPORT */}
                {activeReport === 'refunds' && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-6">
                        <div className="border rounded p-3 bg-danger bg-opacity-10 text-center border-danger border-opacity-25">
                          <span className="text-danger fs-13 d-block mb-1 fw-semibold">Settled Refund Outflows</span>
                          <h4 className="fw-bold mb-0 text-danger">${refundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Return Ratio to Revenue</span>
                          <h4 className="fw-bold mb-0 text-dark">
                            {netRevenue > 0 ? ((refundedAmount / netRevenue) * 100).toFixed(2) : '0.00'}%
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-light border p-3 rounded">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <iconify-icon icon="solar:shield-check-bold" className="text-success fs-18"></iconify-icon>
                        <strong className="text-dark">Audit Consistency</strong>
                      </div>
                      <p className="text-muted fs-13 mb-0">
                        Refunded sums are subtracted from the gross store ledger and recorded directly against customer bank references in the payment transactions register.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. PROFIT & LOSS (P&L) */}
                {activeReport === 'pnl' && (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Net Realized Revenue</span>
                          <h4 className="fw-bold mb-0 text-dark">${netRevenue.toFixed(2)}</h4>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-light-subtle text-center">
                          <span className="text-muted fs-13 d-block mb-1">Estimated Artisan COGS</span>
                          <h4 className="fw-bold mb-0 text-secondary">-${estimatedCogs.toFixed(2)}</h4>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="border rounded p-3 bg-success bg-opacity-10 text-center border-success border-opacity-25">
                          <span className="text-success fs-13 d-block mb-1 fw-semibold">Gross Profit Margin ({netMargin}%)</span>
                          <h4 className="fw-bold mb-0 text-success">${grossProfit.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-light rounded border">
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-dark fw-medium">Gross Invoiced Revenue</span>
                        <strong>${grossSales.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom text-danger">
                        <span>Less Promotional Discounts</span>
                        <strong>-${discounts.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom text-danger">
                        <span>Less Refund Dispatches</span>
                        <strong>-${refundedAmount.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom text-secondary">
                        <span>Estimated Cost of Goods Sold (45%)</span>
                        <strong>-${estimatedCogs.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-2 fs-16 fw-bold text-success">
                        <span>Operating Contribution</span>
                        <span>${(grossProfit - refundedAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

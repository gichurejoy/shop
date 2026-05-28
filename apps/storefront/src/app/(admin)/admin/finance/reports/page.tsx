'use client';

import React, { useState } from 'react';

const REPORTS = [
  { id: 'revenue', name: 'Revenue Report', description: 'Detailed breakdown of gross and net revenue over time.', icon: 'solar:chart-square-bold-duotone', color: 'primary' },
  { id: 'tax', name: 'Tax Liability Report', description: 'Collected taxes broken down by region and rate.', icon: 'solar:document-text-bold-duotone', color: 'info' },
  { id: 'refunds', name: 'Refunds & Returns', description: 'Analysis of refunded orders and return reasons.', icon: 'solar:round-transfer-horizontal-bold-duotone', color: 'danger' },
  { id: 'pnl', name: 'Profit & Loss (P&L)', description: 'Comprehensive view of revenue minus costs (COGS) and fees.', icon: 'solar:wad-of-money-bold-duotone', color: 'success' },
];

export default function FinancialReportsPage() {
  const [activeReport, setActiveReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('This Month');

  return (
    <div className="row">
      <div className="col-lg-3">
        <div className="card h-100">
          <div className="card-header border-bottom">
            <h5 className="card-title mb-0">Report Types</h5>
          </div>
          <div className="card-body p-2">
            <div className="d-flex flex-column gap-1">
              {REPORTS.map(r => (
                <button 
                  key={r.id}
                  className={`btn text-start p-3 border-0 rounded ${activeReport === r.id ? `bg-${r.color}-subtle` : 'hover-bg-light'}`}
                  onClick={() => setActiveReport(r.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <iconify-icon icon={r.icon} className={`fs-24 text-${r.color}`}></iconify-icon>
                    <div>
                      <h6 className={`mb-1 ${activeReport === r.id ? `text-${r.color}` : 'text-dark'}`}>{r.name}</h6>
                      <p className="text-muted fs-12 mb-0" style={{ whiteSpace: 'normal' }}>{r.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-9">
        <div className="card h-100">
          <div className="card-header border-bottom d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0">{REPORTS.find(r => r.id === activeReport)?.name}</h4>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-2">
                <iconify-icon icon="solar:export-bold"></iconify-icon> Export CSV
              </button>
            </div>
          </div>
          <div className="card-body">
            
            {activeReport === 'revenue' && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-sm-4">
                    <div className="border rounded p-3 bg-light-subtle text-center">
                      <span className="text-muted fs-13 d-block mb-1">Gross Sales</span>
                      <h4 className="fw-bold mb-0">$45,200.00</h4>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="border rounded p-3 bg-light-subtle text-center">
                      <span className="text-muted fs-13 d-block mb-1">Discounts</span>
                      <h4 className="fw-bold mb-0 text-danger">-$1,250.00</h4>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="border rounded p-3 bg-light-subtle text-center border-primary border-opacity-25">
                      <span className="text-muted fs-13 d-block mb-1">Net Revenue</span>
                      <h4 className="fw-bold mb-0 text-primary">$43,950.00</h4>
                    </div>
                  </div>
                </div>
                
                <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{ height: '300px' }}>
                  <div className="text-muted text-center">
                    <iconify-icon icon="solar:chart-square-bold-duotone" className="fs-48 opacity-25 mb-2"></iconify-icon>
                    <p className="fs-14">Revenue Line Chart will render here</p>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'tax' && (
              <div>
                <div className="alert alert-info border-0 bg-info-subtle text-info-emphasis fs-13 d-flex align-items-center gap-2 mb-4">
                  <iconify-icon icon="solar:info-circle-bold-duotone" className="fs-18"></iconify-icon>
                  Tax liabilities are calculated based on the order's shipping destination and your configured regional rates.
                </div>
                
                <div className="table-responsive border rounded">
                  <table className="table align-middle table-hover mb-0 text-nowrap">
                    <thead className="bg-light-subtle">
                      <tr>
                        <th>Region / Country</th>
                        <th>Tax Rate applied</th>
                        <th>Taxable Sales</th>
                        <th>Tax Collected</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>California, US</td>
                        <td>7.25%</td>
                        <td>$12,500.00</td>
                        <td className="fw-bold">$906.25</td>
                      </tr>
                      <tr>
                        <td>New York, US</td>
                        <td>4.00%</td>
                        <td>$8,200.00</td>
                        <td className="fw-bold">$328.00</td>
                      </tr>
                      <tr>
                        <td>Texas, US</td>
                        <td>6.25%</td>
                        <td>$15,000.00</td>
                        <td className="fw-bold">$937.50</td>
                      </tr>
                      <tr className="bg-light fw-bold">
                        <td colSpan={3} className="text-end">Total Tax Collected:</td>
                        <td className="text-primary">$2,171.75</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReport === 'refunds' && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="border rounded p-3 text-center">
                      <span className="text-muted fs-13 d-block mb-1">Total Refunded</span>
                      <h4 className="fw-bold text-danger mb-0">$3,450.00</h4>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="border rounded p-3 text-center">
                      <span className="text-muted fs-13 d-block mb-1">Return Rate</span>
                      <h4 className="fw-bold mb-0">2.4%</h4>
                    </div>
                  </div>
                </div>

                <h6 className="fs-14 fw-bold mb-3">Top Return Reasons</h6>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="d-flex justify-content-between mb-1 fs-13"><span>Wrong Size</span><span>45%</span></div>
                    <div className="progress" style={{ height: '6px' }}><div className="progress-bar bg-warning" style={{ width: '45%' }}></div></div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1 fs-13"><span>Item Defective</span><span>25%</span></div>
                    <div className="progress" style={{ height: '6px' }}><div className="progress-bar bg-danger" style={{ width: '25%' }}></div></div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1 fs-13"><span>Changed Mind</span><span>20%</span></div>
                    <div className="progress" style={{ height: '6px' }}><div className="progress-bar bg-info" style={{ width: '20%' }}></div></div>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'pnl' && (
              <div>
                <div className="table-responsive border rounded">
                  <table className="table mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-medium text-dark py-3">Gross Sales</td>
                        <td className="text-end py-3 fw-medium">$45,200.00</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2 ps-4">- Discounts</td>
                        <td className="text-end text-muted py-2">-$1,250.00</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2 ps-4">- Refunds</td>
                        <td className="text-end text-muted py-2">-$3,450.00</td>
                      </tr>
                      <tr className="bg-light-subtle border-top border-bottom">
                        <td className="fw-bold text-dark py-3">Net Sales</td>
                        <td className="text-end fw-bold text-dark py-3">$40,500.00</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2 ps-4">- Cost of Goods Sold (COGS)</td>
                        <td className="text-end text-muted py-2">-$15,000.00</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2 ps-4">- Shipping Costs</td>
                        <td className="text-end text-muted py-2">-$2,100.00</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2 ps-4">- Payment Gateway Fees</td>
                        <td className="text-end text-muted py-2">-$1,215.00</td>
                      </tr>
                      <tr className="bg-success-subtle border-top">
                        <td className="fw-bold text-success-emphasis py-3 fs-15">Gross Profit</td>
                        <td className="text-end fw-bold text-success-emphasis py-3 fs-15">$22,185.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-end text-muted fs-12">
                  * Operating expenses (e.g. payroll, rent) are not included in this P&L.
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

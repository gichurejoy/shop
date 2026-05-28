'use client';

import React from 'react';

export default function FinanceDashboardPage() {
  const stats = [
    { label: 'Total Gross Revenue', value: '$124,500.00', change: '+14.5%', trend: 'up', color: 'success' },
    { label: 'Net Revenue', value: '$118,200.00', change: '+12.1%', trend: 'up', color: 'primary' },
    { label: 'Refunded Amount', value: '$3,450.00', change: '-2.4%', trend: 'down', color: 'danger' },
    { label: 'Pending Payouts', value: '$12,850.00', change: '+5.2%', trend: 'up', color: 'warning' },
  ];

  const recentTransactions = [
    { id: 'TRX-98231', date: 'Today, 10:42 AM', customer: 'Alice Freeman', amount: '$145.00', status: 'Completed', gateway: 'Stripe' },
    { id: 'TRX-98230', date: 'Today, 09:15 AM', customer: 'Mark Johnson', amount: '$89.50', status: 'Completed', gateway: 'PayPal' },
    { id: 'TRX-98229', date: 'Yesterday', customer: 'Sophie Williams', amount: '$210.00', status: 'Refunded', gateway: 'Stripe' },
    { id: 'TRX-98228', date: 'Yesterday', customer: 'John Doe', amount: '$45.00', status: 'Pending', gateway: 'Bank Transfer' },
    { id: 'TRX-98227', date: 'Oct 12, 2023', customer: 'Jane Smith', amount: '$320.00', status: 'Completed', gateway: 'M-Pesa' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="card-title mb-0">Finance & Revenue Dashboard</h4>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" defaultValue="30">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
            <iconify-icon icon="solar:download-bold-duotone"></iconify-icon> Export Report
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="col-md-6 col-xl-3">
            <div className="card h-100">
              <div className="card-body">
                <p className="text-muted mb-2 fs-14 fw-medium">{stat.label}</p>
                <div className="d-flex justify-content-between align-items-end">
                  <h3 className="mb-0 fw-bold">{stat.value}</h3>
                  <span className={`badge bg-${stat.color}-subtle text-${stat.color} fs-12 d-flex align-items-center gap-1`}>
                    <iconify-icon icon={`solar:trend-${stat.trend}-square-bold-duotone`}></iconify-icon>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Revenue Overview</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center bg-light-subtle" style={{ minHeight: '300px' }}>
              {/* Placeholder for Chart */}
              <div className="text-center text-muted">
                <iconify-icon icon="solar:chart-square-bold-duotone" style={{ fontSize: '64px', opacity: 0.2 }}></iconify-icon>
                <p className="mt-2 fs-14">Revenue Chart Visualization Area</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header border-bottom">
              <h5 className="card-title mb-0">Revenue by Channel</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {[
                  { name: 'Online Storefront', value: '$85,200', percent: 68, color: 'primary' },
                  { name: 'Mobile App', value: '$24,100', percent: 19, color: 'info' },
                  { name: 'Marketplace Integration', value: '$12,500', percent: 10, color: 'success' },
                  { name: 'Manual POS', value: '$2,700', percent: 3, color: 'warning' },
                ].map((channel, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fs-13 fw-medium">{channel.name}</span>
                      <span className="fs-13 fw-bold">{channel.value}</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className={`progress-bar bg-${channel.color}`} style={{ width: `${channel.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Transactions</h5>
              <a href="/admin/finance/transactions" className="btn btn-link btn-sm text-primary p-0">View All</a>
            </div>
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Gateway</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((trx, i) => (
                    <tr key={i}>
                      <td><span className="fw-medium text-dark">{trx.id}</span></td>
                      <td className="text-muted fs-13">{trx.date}</td>
                      <td>{trx.customer}</td>
                      <td>{trx.gateway}</td>
                      <td className="fw-bold">{trx.amount}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

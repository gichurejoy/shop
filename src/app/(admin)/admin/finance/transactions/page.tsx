'use client';

import React, { useState } from 'react';

type Transaction = {
  id: string;
  date: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  gateway: string;
  orderId: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-98231', date: 'Oct 12, 2023 - 10:42 AM', customer: 'Alice Freeman', amount: '$145.00', status: 'Completed', gateway: 'Stripe', orderId: '#ORD-10023' },
  { id: 'TRX-98230', date: 'Oct 12, 2023 - 09:15 AM', customer: 'Mark Johnson', amount: '$89.50', status: 'Completed', gateway: 'PayPal', orderId: '#ORD-10022' },
  { id: 'TRX-98229', date: 'Oct 11, 2023 - 14:20 PM', customer: 'Sophie Williams', amount: '$210.00', status: 'Refunded', gateway: 'Stripe', orderId: '#ORD-10021' },
  { id: 'TRX-98228', date: 'Oct 11, 2023 - 11:05 AM', customer: 'John Doe', amount: '$45.00', status: 'Pending', gateway: 'Bank Transfer', orderId: '#ORD-10020' },
  { id: 'TRX-98227', date: 'Oct 10, 2023 - 16:30 PM', customer: 'Jane Smith', amount: '$320.00', status: 'Completed', gateway: 'M-Pesa', orderId: '#ORD-10019' },
  { id: 'TRX-98226', date: 'Oct 10, 2023 - 10:15 AM', customer: 'Bob Brown', amount: '$15.00', status: 'Failed', gateway: 'Stripe', orderId: '#ORD-10018' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    customer: '',
    orderId: '',
    gateway: 'Bank Transfer',
    date: new Date().toISOString().slice(0, 10),
  });

  const filtered = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                          t.customer.toLowerCase().includes(search.toLowerCase()) ||
                          t.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSave = () => {
    setTransactions([{
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: formData.date + ' - Just now',
      customer: formData.customer,
      amount: `$${parseFloat(formData.amount).toFixed(2)}`,
      status: 'Completed',
      gateway: formData.gateway,
      orderId: formData.orderId || '#ORD-MANUAL'
    }, ...transactions]);
    setIsModalOpen(false);
    setFormData({ amount: '', customer: '', orderId: '', gateway: 'Bank Transfer', date: new Date().toISOString().slice(0, 10) });
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="card-title mb-0">All Transactions</h4>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className="position-relative">
                <input 
                  type="search" 
                  className="form-control form-control-sm" 
                  placeholder="Search TRX, Order, Customer..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  style={{ paddingLeft: '30px', minWidth: '240px' }} 
                />
                <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
              </div>
              <select className="form-select form-select-sm w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:export-bold"></iconify-icon> Export CSV
              </button>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Record Manual Payment
              </button>
            </div>
          </div>
          
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Order Ref</th>
                    <th>Gateway</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(trx => (
                    <tr key={trx.id}>
                      <td><span className="fw-bold text-dark">{trx.id}</span></td>
                      <td className="text-muted fs-13">{trx.date}</td>
                      <td>{trx.customer}</td>
                      <td><a href="#!" className="text-primary text-decoration-none">{trx.orderId}</a></td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <iconify-icon icon={
                            trx.gateway === 'Stripe' ? 'fa6-brands:stripe' : 
                            trx.gateway === 'PayPal' ? 'fa6-brands:paypal' : 
                            trx.gateway === 'M-Pesa' ? 'solar:smartphone-bold-duotone' : 
                            'solar:banknote-bold-duotone'
                          } className={`fs-16 ${trx.gateway === 'Stripe' ? 'text-primary' : trx.gateway === 'PayPal' ? 'text-info' : trx.gateway === 'M-Pesa' ? 'text-success' : 'text-muted'}`}></iconify-icon>
                          {trx.gateway}
                        </div>
                      </td>
                      <td className="fw-bold">{trx.amount}</td>
                      <td>
                        <span className={`badge ${
                          trx.status === 'Completed' ? 'bg-success-subtle text-success' :
                          trx.status === 'Refunded' ? 'bg-danger-subtle text-danger' :
                          trx.status === 'Failed' ? 'bg-secondary-subtle text-secondary' :
                          'bg-warning-subtle text-warning'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-soft-secondary btn-sm"><iconify-icon icon="solar:eye-bold-duotone" className="align-middle"></iconify-icon></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center p-4 text-muted">No transactions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <span className="text-muted fs-13">Showing {filtered.length} of {transactions.length} transactions</span>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled"><a className="page-link" href="#!">Previous</a></li>
                <li className="page-item active"><a className="page-link" href="#!">1</a></li>
                <li className="page-item"><a className="page-link" href="#!">2</a></li>
                <li className="page-item"><a className="page-link" href="#!">Next</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {isModalOpen && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '500px' }}>
            <div className="card-header d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">Record Manual Payment</h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="card-body">
              <div className="alert alert-info fs-13 py-2 mb-3">
                <iconify-icon icon="solar:info-circle-bold-duotone" className="me-1 align-middle"></iconify-icon>
                Use this form to log payments received outside the standard digital checkout flow (e.g. Cash, Wire Transfer, manual M-Pesa).
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium text-dark">Amount Received</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark">Customer Name / Email</label>
                  <input type="text" className="form-control" placeholder="Search or enter customer details..." value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Payment Method</label>
                  <select className="form-select" value={formData.gateway} onChange={e => setFormData({...formData, gateway: e.target.value})}>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Manual M-Pesa">Manual M-Pesa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Date Received</label>
                  <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark">Order Reference (Optional)</label>
                  <input type="text" className="form-control" placeholder="e.g. #ORD-10045" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2 pt-4 mt-2 border-top">
                <button type="button" className="btn btn-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!formData.amount || !formData.customer}>Record Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface IInventoryLog {
  date: string;
  product: string;
  type: string;
  typeClass: string;
  qty: string | number;
  stock: number;
  user: string;
  ref: string;
}

export default function StockHistoryPage() {
  const [logs, setLogs] = useState<IInventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.inventory.getHistory();
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load inventory history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Date & Time', 'Product', 'Transaction Type', 'Quantity Change', 'Remaining Stock', 'User', 'Reference'];
    const rows = logs.map(l => [
      `"${l.date}"`,
      `"${l.product.replace(/"/g, '""')}"`,
      `"${l.type}"`,
      `"${l.qty}"`,
      l.stock,
      `"${l.user}"`,
      `"${l.ref}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `stock_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = logs.filter(log => {
    const matchesSearch =
      log.product.toLowerCase().includes(search.toLowerCase()) ||
      log.ref.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || log.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h4 className="card-title mb-1">Stock History & Audit Trail</h4>
                <p className="text-muted fs-13 mb-0">Complete chronological record of vault adjustments, intakes, and sales fulfillment.</p>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search product, SKU, ref..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="form-select"
                  style={{ width: '180px' }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Transactions</option>
                  <option value="Added">Stock Added / Intake</option>
                  <option value="Deducted">Stock Deducted</option>
                  <option value="Fulfillment">Order Fulfillment</option>
                  <option value="Transfer">Warehouse Transfer</option>
                </select>
                <button className="btn btn-outline-secondary" onClick={loadLogs} title="Refresh">
                  <iconify-icon icon="solar:restart-bold" className="align-middle"></iconify-icon>
                </button>
                <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleExportCSV}>
                  <iconify-icon icon="solar:export-bold-duotone" className="align-middle fs-18"></iconify-icon> Export Log
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Date & Time</th>
                    <th>Product</th>
                    <th>Transaction Type</th>
                    <th>Quantity Change</th>
                    <th>Vault Stock</th>
                    <th>User / System</th>
                    <th>Reference / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading stock logs...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No inventory log events found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log, i) => (
                      <tr key={i}>
                        <td className="text-muted fs-13">{log.date}</td>
                        <td>
                          <span className="text-dark fw-medium">{log.product}</span>
                        </td>
                        <td>
                          <span className={`badge ${log.typeClass || 'bg-light text-dark'} px-2 py-1 fs-12`}>
                            {log.type}
                          </span>
                        </td>
                        <td>
                          <span className={String(log.qty).startsWith('+') ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                            {log.qty}
                          </span>
                        </td>
                        <td className="fw-semibold text-dark">{log.stock}</td>
                        <td>{log.user}</td>
                        <td>
                          <span className="text-muted fs-13">{log.ref}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
            <p className="mb-0 text-muted fs-13">Showing {filtered.length} of {logs.length} audit records</p>
            <span className="text-muted fs-12">Persisted in MySQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

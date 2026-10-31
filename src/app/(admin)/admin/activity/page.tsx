'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface IActivityEvent {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
  color: string;
  icon: string;
  details?: string;
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<IActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.activity.list();
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = filter === 'All'
    ? logs
    : logs.filter((a) => a.module.toLowerCase() === filter.toLowerCase());

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="card-title mb-1">Administrative Audit &amp; System Activity Log</h4>
              <p className="text-muted fs-13 mb-0">Immutable chronological events recorded across all store modules.</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select form-select-sm w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Modules</option>
                <option value="Orders">Orders</option>
                <option value="Finance">Finance</option>
                <option value="Inventory">Inventory</option>
                <option value="Marketing">Marketing</option>
                <option value="Content">Content</option>
                <option value="Settings">Settings</option>
                <option value="System">System</option>
              </select>
              <button onClick={loadLogs} className="btn btn-sm btn-outline-light text-dark">
                <iconify-icon icon="solar:restart-bold" className="align-middle"></iconify-icon> Refresh
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4 text-muted">
                <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                Loading system audit logs...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-4 text-muted">No activity events recorded for this module.</div>
            ) : (
              <div className="position-relative ms-3">
                <div className="position-absolute border-start border-2 h-100" style={{ left: '16px', top: 0, borderColor: '#e2e8f0' }}></div>

                <div className="d-flex flex-column gap-4 position-relative z-1">
                  {filtered.map((event) => (
                    <div key={event.id} className="d-flex gap-3">
                      <div
                        className={`rounded-circle bg-${event.color || 'primary'}-subtle d-flex align-items-center justify-content-center flex-shrink-0`}
                        style={{ width: '34px', height: '34px', border: '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }}
                      >
                        <iconify-icon icon={event.icon || 'solar:bell-bold'} className={`text-${event.color || 'primary'} fs-18`}></iconify-icon>
                      </div>
                      <div className="flex-grow-1 bg-light rounded-3 p-3">
                        <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                          <div>
                            <span className="fw-semibold text-dark">{event.user}</span>
                            <span className="text-muted mx-2">•</span>
                            <span className="fw-medium text-dark">{event.action}</span>
                          </div>
                          <span className="text-muted fs-13">{event.time}</span>
                        </div>

                        {event.details && (
                          <div className="mt-2 p-2 bg-white rounded border fs-13 text-muted">
                            {event.details}
                          </div>
                        )}

                        <div className="mt-2">
                          <span className="badge bg-secondary-subtle text-secondary fs-12">{event.module}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">Showing {filtered.length} audit entries</span>
            <span className="text-muted fs-12">Persisted in MySQL `cms_settings` table</span>
          </div>
        </div>
      </div>
    </div>
  );
}

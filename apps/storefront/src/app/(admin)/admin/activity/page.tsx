'use client';

import React, { useState } from 'react';

type ActivityEvent = {
  id: string;
  user: string;
  avatar: string;
  action: string;
  module: string;
  time: string;
  color: string;
  icon: string;
  details?: string;
};

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: '1', user: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', action: 'Approved refund for Order #9021', module: 'Orders', time: '10 mins ago', color: 'success', icon: 'solar:wallet-money-bold-duotone', details: 'Refund amount: $45.00. Reason: Customer request.' },
  { id: '2', user: 'Tom Brown', avatar: 'https://i.pravatar.cc/150?u=5', action: 'Created new Email Flow "Summer Sale"', module: 'Marketing', time: '1 hour ago', color: 'primary', icon: 'solar:letter-bold-duotone' },
  { id: '3', user: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', action: 'Changed permissions for "Store Manager" role', module: 'Settings', time: '3 hours ago', color: 'warning', icon: 'solar:shield-keyhole-bold-duotone', details: 'Added Create/Update access to Settings module.' },
  { id: '4', user: 'System', avatar: 'https://i.pravatar.cc/150?u=sys', action: 'Automated database backup completed', module: 'System', time: '5 hours ago', color: 'info', icon: 'solar:database-bold-duotone' },
  { id: '5', user: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', action: 'Published new CMS Page "About Us"', module: 'Content', time: 'Yesterday', color: 'success', icon: 'solar:document-text-bold-duotone' },
  { id: '6', user: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3', action: 'Updated stock count for "Wireless Earbuds"', module: 'Inventory', time: 'Yesterday', color: 'primary', icon: 'solar:box-bold-duotone', details: 'Stock changed from 12 to 50.' },
  { id: '7', user: 'Tom Brown', avatar: 'https://i.pravatar.cc/150?u=5', action: 'Deleted Coupon Code "SPRINGSALE"', module: 'Marketing', time: '2 days ago', color: 'danger', icon: 'solar:trash-bin-minimalistic-2-bold-duotone' },
];

export default function ActivityLogPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' 
    ? MOCK_ACTIVITY 
    : MOCK_ACTIVITY.filter(a => a.module === filter);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Staff Activity Log</h4>
            <select className="form-select form-select-sm w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All Modules</option>
              <option value="Orders">Orders</option>
              <option value="Marketing">Marketing</option>
              <option value="Inventory">Inventory</option>
              <option value="Content">Content</option>
              <option value="Settings">Settings</option>
            </select>
          </div>
          
          <div className="card-body">
            <div className="position-relative ms-3">
              {/* Vertical line */}
              <div className="position-absolute border-start border-2 h-100" style={{ left: '16px', top: 0, borderColor: '#e2e8f0' }}></div>
              
              <div className="d-flex flex-column gap-4 position-relative z-1">
                {filtered.map(event => (
                  <div key={event.id} className="d-flex gap-3">
                    <div className={`rounded-circle bg-${event.color}-subtle d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '34px', height: '34px', border: `2px solid #fff`, boxShadow: '0 0 0 1px #e2e8f0' }}>
                      <iconify-icon icon={event.icon} className={`text-${event.color} fs-18`}></iconify-icon>
                    </div>
                    <div className="flex-grow-1 bg-light rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <span className="fw-semibold text-dark">{event.user}</span>
                          <span className="text-muted mx-2">•</span>
                          <span className="fw-medium text-dark">{event.action}</span>
                        </div>
                        <span className="text-muted fs-13 whitespace-nowrap">{event.time}</span>
                      </div>
                      
                      {event.details && (
                        <div className="mt-2 p-2 bg-white rounded border fs-14 text-muted">
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
            
            <div className="text-center mt-4">
              <button className="btn btn-soft-primary btn-sm">Load More Activity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

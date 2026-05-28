'use client';

import React, { useState } from 'react';

type Payout = {
  id: string;
  vendor: string;
  balance: string;
  status: 'Pending' | 'Paid' | 'Processing';
  lastPayoutDate: string;
  bankInfo: string;
};

const MOCK_PAYOUTS: Payout[] = [
  { id: 'PAY-8821', vendor: 'Nike Official Store', balance: '$4,250.00', status: 'Pending', lastPayoutDate: 'Oct 01, 2023', bankInfo: 'Chase **** 4421' },
  { id: 'PAY-8822', vendor: 'Adidas Originals', balance: '$2,100.50', status: 'Processing', lastPayoutDate: 'Oct 05, 2023', bankInfo: 'Wells Fargo **** 1120' },
  { id: 'PAY-8823', vendor: 'Puma Central', balance: '$850.00', status: 'Paid', lastPayoutDate: 'Today', bankInfo: 'Citi **** 9088' },
  { id: 'PAY-8824', vendor: 'Reebok Outlet', balance: '$1,400.00', status: 'Pending', lastPayoutDate: 'Sep 15, 2023', bankInfo: 'Bank of America **** 5566' },
];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const openProcessModal = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  const handleProcess = () => {
    if (!selectedPayout) return;
    setPayouts(payouts.map(p => p.id === selectedPayout.id ? { ...p, status: 'Paid', lastPayoutDate: 'Just now', balance: '$0.00' } : p));
    setIsModalOpen(false);
    setSelectedPayout(null);
  };

  return (
    <div className="row">
      <div className="col-12">
        
        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card h-100 bg-primary-subtle border-0">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-primary text-white rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-24"></iconify-icon>
                  </div>
                  <div>
                    <h5 className="mb-1 text-primary fw-bold">$5,650.00</h5>
                    <span className="text-primary-emphasis fs-14 fw-medium">Total Pending Payouts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-success-subtle border-0">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-success text-white rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <iconify-icon icon="solar:check-circle-bold-duotone" className="fs-24"></iconify-icon>
                  </div>
                  <div>
                    <h5 className="mb-1 text-success fw-bold">$18,450.00</h5>
                    <span className="text-success-emphasis fs-14 fw-medium">Paid This Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-light border-0">
              <div className="card-body d-flex flex-column justify-content-center">
                <h6 className="fs-14 fw-semibold text-dark mb-2">Next Scheduled Payout</h6>
                <div className="d-flex align-items-center gap-2">
                  <iconify-icon icon="solar:calendar-bold-duotone" className="text-muted fs-20"></iconify-icon>
                  <span className="fw-bold text-dark fs-15">Friday, Oct 20th</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="card-title mb-0">Vendor Payouts</h4>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
              <iconify-icon icon="solar:play-circle-bold-duotone"></iconify-icon> Run Payouts Batch
            </button>
          </div>
          
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Payout ID</th>
                    <th>Vendor Name</th>
                    <th>Current Balance</th>
                    <th>Bank Info</th>
                    <th>Last Payout</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(payout => (
                    <tr key={payout.id}>
                      <td className="fw-medium text-dark">{payout.id}</td>
                      <td className="fw-medium">{payout.vendor}</td>
                      <td className="fw-bold text-dark">{payout.balance}</td>
                      <td>
                        <span className="text-muted fs-13 d-flex align-items-center gap-1">
                          <iconify-icon icon="solar:card-2-bold-duotone" className="fs-16"></iconify-icon> {payout.bankInfo}
                        </span>
                      </td>
                      <td className="text-muted fs-13">{payout.lastPayoutDate}</td>
                      <td>
                        <span className={`badge ${
                          payout.status === 'Paid' ? 'bg-success-subtle text-success' :
                          payout.status === 'Processing' ? 'bg-info-subtle text-info' :
                          'bg-warning-subtle text-warning'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {payout.status === 'Pending' && payout.balance !== '$0.00' ? (
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openProcessModal(payout)}>Pay Now</button>
                        ) : (
                          <button className="btn btn-soft-secondary btn-sm" disabled>Paid</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Process Payout Modal */}
      {isModalOpen && selectedPayout && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">Confirm Payout</h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="card-body text-center py-4">
              <div className="avatar-lg bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-32"></iconify-icon>
              </div>
              <h3 className="fw-bold mb-1">{selectedPayout.balance}</h3>
              <p className="text-muted fs-14 mb-4">You are about to transfer the total balance to <strong>{selectedPayout.vendor}</strong>.</p>
              
              <div className="p-3 bg-light rounded text-start fs-13 text-muted mb-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span>Destination:</span>
                  <span className="fw-medium text-dark">{selectedPayout.bankInfo}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Transfer Fee:</span>
                  <span className="fw-medium text-dark">$0.00</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light flex-1 w-50" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary flex-1 w-50 d-flex align-items-center justify-content-center gap-2" onClick={handleProcess}>
                  <iconify-icon icon="solar:plain-2-bold-duotone"></iconify-icon> Send Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

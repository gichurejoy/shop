'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

type Payout = {
  id: string;
  vendor: string;
  balance: number;
  status: 'Pending' | 'Paid' | 'Processing';
  lastPayoutDate: string;
  bankInfo: string;
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmingPayout, setConfirmingPayout] = useState<Payout | null>(null);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.payouts.get();
      setPayouts(res.payouts || []);
    } catch (err: any) {
      toast.error('Failed to load payouts: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleProcess = async (payout: Payout) => {
    setProcessingId(payout.id);
    try {
      const updated = payouts.map((p) =>
        p.id === payout.id
          ? { ...p, status: 'Paid' as const, lastPayoutDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), balance: 0.0 }
          : p
      );
      await apiClient.payouts.save(updated);
      setPayouts(updated);
      setConfirmingPayout(null);
      toast.success(`Settlement of $${payout.balance.toFixed(2)} sent to ${payout.vendor}! Recorded in MySQL.`);
    } catch (err: any) {
      toast.error('Failed to process payout: ' + (err.message || 'Error'));
    } finally {
      setProcessingId(null);
    }
  };

  const totalPending = payouts
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + Number(p.balance), 0);

  const totalProcessing = payouts
    .filter((p) => p.status === 'Processing')
    .reduce((sum, p) => sum + Number(p.balance), 0);

  const totalPaid = payouts
    .filter((p) => p.status === 'Paid')
    .length;

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading partner settlements from database...</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="card-title mb-1 fw-bold">Artisan &amp; Supplier Settlements</h4>
            <p className="text-muted fs-13 mb-0">Audit accounts payable and process bank dispatches stored in MySQL.</p>
          </div>
          <Link href="/admin/finance/transactions" className="btn btn-outline-secondary btn-sm">
            View Transactions Register →
          </Link>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 bg-primary bg-opacity-10 border border-primary border-opacity-25">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-primary text-white rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-24"></iconify-icon>
                  </div>
                  <div>
                    <h4 className="mb-1 text-primary fw-bold">
                      ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <span className="text-primary fs-13 fw-medium">Total Pending Payouts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 bg-warning bg-opacity-10 border border-warning border-opacity-25">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-warning text-white rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <iconify-icon icon="solar:history-bold-duotone" className="fs-24"></iconify-icon>
                  </div>
                  <div>
                    <h4 className="mb-1 text-warning fw-bold">
                      ${totalProcessing.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <span className="text-warning fs-13 fw-medium">In Clearing / Bank Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 bg-success bg-opacity-10 border border-success border-opacity-25">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-success text-white rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <iconify-icon icon="solar:check-circle-bold-duotone" className="fs-24"></iconify-icon>
                  </div>
                  <div>
                    <h4 className="mb-1 text-success fw-bold">{totalPaid} Partners</h4>
                    <span className="text-success fs-13 fw-medium">Settled &amp; Fully Cleared</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Confirmation Card (No Popups!) */}
        {confirmingPayout && (
          <div className="card shadow-sm border border-primary mb-4 bg-primary bg-opacity-10">
            <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
              <h5 className="card-title mb-0 fw-bold text-primary">Confirm Partner Dispatch: {confirmingPayout.vendor}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setConfirmingPayout(null)}
                aria-label="Close"
              ></button>
            </div>
            <div className="card-body p-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-lg bg-white rounded-circle d-flex align-items-center justify-content-center border shadow-xs" style={{ width: '56px', height: '56px' }}>
                      <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-28 text-primary"></iconify-icon>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1 text-dark">${Number(confirmingPayout.balance).toFixed(2)}</h4>
                      <p className="text-muted fs-13 mb-0">
                        Transfer to <strong>{confirmingPayout.bankInfo}</strong> on behalf of <strong>{confirmingPayout.vendor}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setConfirmingPayout(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => handleProcess(confirmingPayout)}
                    disabled={processingId === confirmingPayout.id}
                  >
                    {processingId === confirmingPayout.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <iconify-icon icon="solar:plain-2-bold-duotone" className="fs-18"></iconify-icon>
                        Dispatch Funds &amp; Clear Balance
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payouts Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom bg-transparent py-3">
            <h5 className="card-title mb-0 fw-semibold">Partner Settlement Records</h5>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0 text-nowrap">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Settlement ID</th>
                  <th>Vendor / Workshop</th>
                  <th>Receiving Bank Account</th>
                  <th>Pending Balance</th>
                  <th>Last Settlement</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td><code className="fw-bold">{p.id}</code></td>
                    <td className="fw-semibold text-dark">{p.vendor}</td>
                    <td className="text-muted fs-13">{p.bankInfo}</td>
                    <td className="fw-bold text-dark">${Number(p.balance).toFixed(2)}</td>
                    <td className="text-muted fs-13">{p.lastPayoutDate}</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'Paid' ? 'bg-success-subtle text-success' :
                        p.status === 'Processing' ? 'bg-warning-subtle text-warning' :
                        'bg-danger-subtle text-danger'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {p.status !== 'Paid' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => setConfirmingPayout(p)}
                        >
                          Process Payout
                        </button>
                      ) : (
                        <span className="text-success fs-13 fw-semibold">
                          <iconify-icon icon="solar:check-circle-bold" className="align-middle me-1"></iconify-icon>
                          Cleared
                        </span>
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
  );
}

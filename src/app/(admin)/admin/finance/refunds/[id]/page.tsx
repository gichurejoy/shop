'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function ProcessRefundPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const refundId = decodeURIComponent(rawId || '');

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState('Customer return received and verified in atelier.');
  const [refundItem, setRefundItem] = useState<{
    id: string;
    trxId: string;
    orderId: string;
    customer: string;
    amount: string;
    rawAmount?: number;
    date: string;
    gateway: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiClient.transactions.list();
        const txList = res.transactions || [];
        const found = txList.find((t: any) =>
          t.id === refundId ||
          `REF-${t.id.replace(/[^0-9]/g, '').slice(-4)}` === refundId ||
          t.orderId === refundId
        );

        if (found) {
          setRefundItem({
            id: refundId,
            trxId: found.id,
            orderId: found.orderId,
            customer: found.customer,
            amount: found.amount,
            rawAmount: found.rawAmount,
            date: found.date,
            gateway: found.gateway,
            status: found.status === 'Refunded' ? 'Processed' : 'Pending',
          });
        } else {
          toast.error('Refund candidate record not found');
        }
      } catch (err: any) {
        toast.error('Failed to load transaction data: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }

    if (refundId) {
      loadData();
    }
  }, [refundId]);

  const handleAction = async (decision: 'Processed' | 'Rejected') => {
    if (!refundItem) return;
    setProcessing(true);
    try {
      if (decision === 'Processed') {
        await apiClient.transactions.refund(refundItem.trxId, refundItem.rawAmount, adminNote);
        toast.success(`Refund for ${refundItem.customer} processed successfully!`);
      } else {
        toast.success(`Refund claim rejected.`);
      }
      router.push('/admin/finance/refunds');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process refund decision');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading refund dossier...</p>
      </div>
    );
  }

  if (!refundItem) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="avatar-lg bg-danger-subtle text-danger rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
          <iconify-icon icon="solar:danger-triangle-bold" className="fs-32"></iconify-icon>
        </div>
        <h4 className="fw-bold">Refund Record Not Found</h4>
        <p className="text-muted">No pending transaction matching reference "{refundId}" was located.</p>
        <Link href="/admin/finance/refunds" className="btn btn-primary mt-2">
          Return to Refunds
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page Title & Breadcrumb */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h4 className="mb-0 fw-bold">Review &amp; Settle Refund #{refundItem.id}</h4>
                <span className={`badge ${refundItem.status === 'Processed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                  {refundItem.status}
                </span>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/finance/refunds">Refunds</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{refundItem.id}</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/finance/refunds" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Disputed Transaction Details</h5>
              <p className="text-muted fs-13 mb-0">Original order and payment settlement information.</p>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Customer</label>
                  <div className="fw-bold fs-16 text-dark">{refundItem.customer}</div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Refund Amount</label>
                  <div className="fw-bold fs-18 text-danger">{refundItem.amount}</div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Associated Order</label>
                  <div>
                    <Link href={`/admin/orders/${refundItem.orderId}`} className="text-primary fw-bold font-monospace">
                      {refundItem.orderId}
                    </Link>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Original Gateway</label>
                  <div>
                    <span className="badge bg-light text-dark border px-2 py-1">{refundItem.gateway}</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Transaction Reference</label>
                  <div className="font-monospace text-muted">{refundItem.trxId}</div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted fs-12 text-uppercase fw-semibold">Date of Transaction</label>
                  <div className="text-dark">{refundItem.date}</div>
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <label className="form-label fw-semibold">Settlement / Authorization Note</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Reason for approval or rejection..."
                />
                <div className="form-text text-muted">This justification will be permanently stored on the transaction ledger.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Decision &amp; Settle</h5>
            </div>
            <div className="card-body p-4">
              <div className="alert alert-light border p-3 rounded mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <iconify-icon icon="solar:shield-warning-bold" className="text-warning fs-18"></iconify-icon>
                  <span className="fw-semibold text-dark">Clearing Impact</span>
                </div>
                <p className="text-muted fs-12 mb-0">
                  Approving will adjust the financial ledger, mark the transaction as Refunded, and adjust net revenue reports.
                </p>
              </div>

              <div className="d-flex flex-column gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-primary py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleAction('Processed')}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Settling...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:check-circle-bold" className="fs-18"></iconify-icon> Approve &amp; Settle Refund
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleAction('Rejected')}
                  disabled={processing}
                >
                  <iconify-icon icon="solar:close-circle-bold" className="fs-18"></iconify-icon> Reject Refund Claim
                </button>

                <Link href="/admin/finance/refunds" className="btn btn-light w-100 mt-2">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

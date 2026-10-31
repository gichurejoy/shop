'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function NewTransactionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    customer: '',
    orderId: '',
    gateway: 'Bank Transfer',
    status: 'paid',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.customer.trim()) {
      toast.error('Amount and customer name are required');
      return;
    }

    setSaving(true);
    try {
      await apiClient.transactions.create({
        amount: parseFloat(formData.amount),
        orderId: formData.orderId || `ORD-${Date.now().toString().slice(-5)}`,
        method: formData.gateway.toLowerCase().includes('mpesa') ? 'mpesa' : formData.gateway.toLowerCase().includes('stripe') ? 'card' : 'bank_transfer',
        status: formData.status,
        reference: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
        metadata: { customerName: formData.customer },
      });
      toast.success('Manual payment recorded successfully!');
      router.push('/admin/finance/transactions');
    } catch (err: any) {
      toast.error(err.message || 'Failed to record manual payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Title & Breadcrumb */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-sm-0 fw-bold">Record Manual Payment Receipt</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/finance/transactions">Transactions</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Record Payment</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/finance/transactions" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-xl-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Payment Details</h5>
                <p className="text-muted fs-13 mb-0">Record bank wire transfers, offline concierge orders, and manual settlements.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer Full Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Lady Genevieve Vance"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Associated Order ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. LK-2024-89210 (or leave blank to auto-generate)"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Amount Received ($) <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control"
                        placeholder="250.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Settlement Channel</label>
                    <select
                      className="form-select"
                      value={formData.gateway}
                      onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                    >
                      <option value="Bank Transfer">Direct Wire / Swift Transfer</option>
                      <option value="M-Pesa">M-Pesa Paybill / Till</option>
                      <option value="Stripe POS">Atelier POS Terminal (Card)</option>
                      <option value="Cash/Check">Cash / Certified Cheque</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Audit Verification</h5>
              </div>
              <div className="card-body p-4">
                <label className="form-label fw-semibold">Payment Status</label>
                <select
                  className="form-select mb-3"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="paid">Paid &amp; Cleared (Settled)</option>
                  <option value="pending">Pending Bank Verification</option>
                </select>

                <div className="alert alert-light border p-3 rounded mb-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <iconify-icon icon="solar:shield-check-bold" className="text-success fs-18"></iconify-icon>
                    <span className="fw-semibold text-dark">Immutable Transaction Log</span>
                  </div>
                  <p className="text-muted fs-12 mb-0">
                    Recording this manual payment creates an entry in the MySQL transactions table with a unique system reference token.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Recording Payment...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:card-2-bold" className="fs-18"></iconify-icon> Record Payment
                    </>
                  )}
                </button>
                <Link href="/admin/finance/transactions" className="btn btn-light w-100">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface IReview {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'approved' | 'rejected' | 'pending';
  createdAt: string;
}

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await apiClient.reviews.list();
      setReviews(res.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setActionInProgress(id);
    try {
      await apiClient.reviews.updateStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      alert('Failed to update review status');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this review?')) return;
    setActionInProgress(id);
    try {
      await apiClient.reviews.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete review');
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesTab = activeTab === 'all' || r.status === activeTab;
    const matchesSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.authorName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (r.title && r.title.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="row g-3">
      {/* KPI Cards */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:chat-round-dots-bold-duotone" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Total Reviews</p>
                  <h4 className="fw-bold mb-0">{reviews.length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-warning-subtle text-warning rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:hourglass-line-bold" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Pending Moderation</p>
                  <h4 className="fw-bold mb-0 text-warning">{pendingCount}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-success-subtle text-success rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:check-circle-bold-duotone" className="fs-24"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Approved & Published</p>
                  <h4 className="fw-bold mb-0 text-success">{approvedCount}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="avatar-md bg-info-subtle text-info rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <iconify-icon icon="solar:star-bold" className="fs-24 text-warning"></iconify-icon>
                </div>
                <div>
                  <p className="text-muted mb-0 fs-13">Average Store Rating</p>
                  <h4 className="fw-bold mb-0">{avgRating} / 5.0</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reviews Moderation Panel */}
      <div className="col-12">
        <div className="card">
          <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'all' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Reviews ({reviews.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'pending' ? 'active text-warning' : 'text-muted'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending ({pendingCount})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'approved' ? 'active text-success' : 'text-muted'}`}
                  onClick={() => setActiveTab('approved')}
                >
                  Approved ({approvedCount})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-medium ${activeTab === 'rejected' ? 'active text-danger' : 'text-muted'}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  Rejected
                </button>
              </li>
            </ul>

            <div className="pb-2 d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search reviews or products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: '220px' }}
              />
              <button onClick={loadReviews} className="btn btn-sm btn-outline-light text-dark">
                <iconify-icon icon="solar:restart-bold" className="align-middle"></iconify-icon>
              </button>
            </div>
          </div>

          <div className="card-body p-0 border-top">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review Content</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-end">Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading reviews from MySQL...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No reviews found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link href={`/admin/products/${r.productId}`} className="fw-medium text-dark text-decoration-none">
                            {r.productName}
                          </Link>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span className="fw-medium text-dark">{r.authorName}</span>
                            {r.isVerified && (
                              <span className="badge bg-success-subtle text-success fs-11" title="Verified Buyer">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center text-warning">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <iconify-icon
                                key={i}
                                icon={i < r.rating ? 'solar:star-bold' : 'solar:star-linear'}
                                className="fs-15"
                              ></iconify-icon>
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          {r.title && <div className="fw-semibold text-dark fs-13">{r.title}</div>}
                          <p className="text-muted fs-13 mb-0 text-truncate" title={r.comment}>
                            {r.comment}
                          </p>
                        </td>
                        <td className="text-muted fs-13">
                          {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 fs-12 ${
                              r.status === 'approved'
                                ? 'bg-success-subtle text-success'
                                : r.status === 'rejected'
                                ? 'bg-danger-subtle text-danger'
                                : 'bg-warning-subtle text-warning'
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            {r.status !== 'approved' && (
                              <button
                                className="btn btn-sm btn-soft-success"
                                title="Approve Review"
                                onClick={() => handleUpdateStatus(r.id, 'approved')}
                                disabled={actionInProgress === r.id}
                              >
                                <iconify-icon icon="solar:check-circle-bold" className="fs-16"></iconify-icon> Approve
                              </button>
                            )}
                            {r.status !== 'rejected' && (
                              <button
                                className="btn btn-sm btn-soft-warning"
                                title="Reject Review"
                                onClick={() => handleUpdateStatus(r.id, 'rejected')}
                                disabled={actionInProgress === r.id}
                              >
                                <iconify-icon icon="solar:close-circle-bold" className="fs-16"></iconify-icon> Reject
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-soft-danger"
                              title="Delete Review"
                              onClick={() => handleDelete(r.id)}
                              disabled={actionInProgress === r.id}
                            >
                              <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">Showing {filtered.length} of {reviews.length} total reviews</span>
            <span className="text-muted fs-12">Synced with MySQL database</span>
          </div>
        </div>
      </div>
    </div>
  );
}


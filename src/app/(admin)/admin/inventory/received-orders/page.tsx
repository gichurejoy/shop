'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { IOrder } from '@/types/order';
import { IProduct } from '@/types/product';

export default function InventoryReceivedOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Intake modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [receiveQty, setReceiveQty] = useState('10');
  const [shipmentNotes, setShipmentNotes] = useState('Supplier Delivery Batch PO-2024');
  const [submittingIntake, setSubmittingIntake] = useState(false);
  const [intakeSuccess, setIntakeSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes] = await Promise.all([
        apiClient.orders.list(),
        apiClient.products.list({ limit: 100 }),
      ]);
      setOrders(orderRes.orders || []);
      setProducts(prodRes.products || []);
      if (prodRes.products?.length > 0 && !selectedProductId) {
        setSelectedProductId(prodRes.products[0].id);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReceiveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !receiveQty || Number(receiveQty) <= 0) return;
    setSubmittingIntake(true);
    setIntakeSuccess(null);

    try {
      await apiClient.inventory.receive({
        productId: selectedProductId,
        quantity: Number(receiveQty),
        notes: shipmentNotes,
      });
      setIntakeSuccess(`Successfully received ${receiveQty} units into inventory!`);
      // Refresh products
      const prodRes = await apiClient.products.list({ limit: 100 });
      setProducts(prodRes.products || []);
      setTimeout(() => {
        setIsModalOpen(false);
        setIntakeSuccess(null);
      }, 1500);
    } catch (err) {
      alert('Failed to process shipment intake');
    } finally {
      setSubmittingIntake(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const pendingReviewCount = orders.filter((o) => o.status === 'pending').length;
  const pendingPaymentCount = orders.filter((o) => (o.paymentStatus as any) === 'unpaid' || (o.paymentStatus as any) === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const inProgressCount = orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length;

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:clipboard-remove-broken" className="fs-28 text-warning"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Pending Review</p>
                <h4 className="fw-bold mb-0">{pendingReviewCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-danger bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:clock-circle-broken" className="fs-28 text-danger"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Pending Payment</p>
                <h4 className="fw-bold mb-0">{pendingPaymentCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:clipboard-check-broken" className="fs-28 text-success"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Delivered Orders</p>
                <h4 className="fw-bold mb-0 text-success">{deliveredCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:inbox-line-broken" className="fs-28 text-primary"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">In Fulfillment</p>
                <h4 className="fw-bold mb-0 text-primary">{inProgressCount}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="card-title mb-1">Incoming Shipments & Received Orders</h4>
                <p className="text-muted fs-13 mb-0">Record restock intakes and track order fulfillment statuses.</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search order or client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: '220px' }}
                />
                <select
                  className="form-select form-select-sm"
                  style={{ width: '150px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button
                  className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                  onClick={() => setIsModalOpen(true)}
                >
                  <iconify-icon icon="solar:box-bold" className="fs-16"></iconify-icon> Receive Shipment
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items Count</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Fulfillment Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading received orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No orders matching this criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <Link href={`/admin/orders/${ord.id}`} className="text-dark fw-bold">
                            {ord.orderNumber}
                          </Link>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium text-dark">{ord.customerName}</div>
                            <small className="text-muted">{ord.customerEmail}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {ord.items?.length || 1} items
                          </span>
                        </td>
                        <td className="fw-bold">${Number(ord.total).toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge px-2 py-1 fs-12 ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-success-subtle text-success'
                                : ord.paymentStatus === 'refunded'
                                ? 'bg-danger-subtle text-danger'
                                : 'bg-warning-subtle text-warning'
                            }`}
                          >
                            {ord.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 fs-12 ${
                              ord.status === 'delivered'
                                ? 'bg-success-subtle text-success'
                                : ord.status === 'shipped'
                                ? 'bg-info-subtle text-info'
                                : ord.status === 'processing'
                                ? 'bg-primary-subtle text-primary'
                                : 'bg-secondary-subtle text-secondary'
                            }`}
                          >
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link href={`/admin/orders/${ord.id}`} className="btn btn-sm btn-soft-primary">
                            <iconify-icon icon="solar:eye-broken" className="fs-16 align-middle me-1"></iconify-icon> Inspect
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer border-top d-flex justify-content-between align-items-center">
              <span className="text-muted fs-13">Showing {filteredOrders.length} orders</span>
              <Link href="/admin/inventory/history" className="btn btn-sm btn-outline-secondary">
                View Stock History →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Restock Intake Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Incoming Shipment (Restock)</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleReceiveStock}>
                <div className="modal-body d-flex flex-column gap-3">
                  {intakeSuccess && (
                    <div className="alert alert-success py-2 fs-14">
                      <iconify-icon icon="solar:check-circle-bold" className="align-middle me-1"></iconify-icon>
                      {intakeSuccess}
                    </div>
                  )}

                  <div>
                    <label className="form-label fw-semibold">Select Catalog Item *</label>
                    <select
                      className="form-select"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      required
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (Current Vault Stock: {p.stock_quantity ?? (p as any).stockQuantity ?? 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-semibold">Received Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={receiveQty}
                      onChange={(e) => setReceiveQty(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold">Shipment Ref / Vendor Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shipmentNotes}
                      onChange={(e) => setShipmentNotes(e.target.value)}
                      placeholder="e.g. Supplier Batch PO-2024-819"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submittingIntake}>
                    {submittingIntake ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Recording Restock...
                      </>
                    ) : 'Confirm Restock & Update Vault'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

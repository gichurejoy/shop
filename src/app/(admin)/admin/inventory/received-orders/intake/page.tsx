'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';

export default function ShipmentIntakePage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    quantity: '25',
    notes: 'Supplier Delivery Batch PO-2024',
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await apiClient.products.list({ limit: 100 });
        const list = res.products || [];
        setProducts(list);
        if (list.length > 0) {
          setFormData(prev => ({ ...prev, productId: list[0].id }));
        }
      } catch (err: any) {
        toast.error('Failed to load products: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantity);
    if (!formData.productId) {
      toast.error('Please choose a catalog SKU');
      return;
    }
    if (!qty || qty <= 0) {
      toast.error('Please specify a positive intake quantity');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.inventory.receive({
        productId: formData.productId,
        quantity: qty,
        notes: formData.notes,
      });

      toast.success(`Successfully received ${qty} units of "${selectedProduct?.title || 'Product'}" into inventory!`);
      router.push('/admin/inventory/received-orders');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process shipment intake');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading catalog items for restock intake...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header and Breadcrumb */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-sm-0 fw-bold">Record Incoming Shipment (Restock Intake)</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/inventory/received-orders">Received Orders</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Shipment Intake</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/inventory/received-orders" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Orders
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
                <h5 className="card-title mb-0 fw-semibold">Shipment &amp; SKU Allocation</h5>
                <p className="text-muted fs-13 mb-0">Record physical delivery receipts from suppliers or atelier production runs.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Target Product SKU <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      required
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — Current Vault: {p.stock_quantity ?? 0} units (${Number(p.price || 0).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProduct && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded border d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                          {selectedProduct.images && selectedProduct.images[0] ? (
                            <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="rounded" width="48" height="48" style={{ objectFit: 'cover' }} />
                          ) : (
                            <div className="avatar-md bg-white rounded border d-flex align-items-center justify-content-center">
                              <iconify-icon icon="solar:box-broken" className="fs-24"></iconify-icon>
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0 fw-bold">{selectedProduct.title}</h6>
                            <span className="text-muted fs-12">
                              Category: {typeof selectedProduct.category === 'object' && selectedProduct.category !== null ? (selectedProduct.category as any).name : (selectedProduct.category || 'Atelier Collection')} | SKU: {selectedProduct.id}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-primary-subtle text-primary fs-13 px-3 py-1">
                            Current Stock: {selectedProduct.stock_quantity ?? 0} Units
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Received Quantity (Units) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                    <div className="form-text text-muted">Total units verified from freight bill of lading.</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Supplier / PO Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Batch PO-2024-08A, Milan Freight"
                    />
                    <div className="form-text text-muted">Traceability manifest number for stock audit logs.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Intake Manifest Summary</h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                  <span className="text-muted fs-13">New Stock Increment</span>
                  <strong className="text-success fs-16">+{formData.quantity} Units</strong>
                </div>

                {selectedProduct && (
                  <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                    <span className="text-muted fs-13">Resulting Total Vault Stock</span>
                    <strong className="text-dark fs-16">
                      {(selectedProduct.stock_quantity ?? 0) + Number(formData.quantity || 0)} Units
                    </strong>
                  </div>
                )}

                <div className="alert alert-light border p-3 rounded mb-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <iconify-icon icon="solar:check-circle-bold" className="text-success fs-18"></iconify-icon>
                    <span className="fw-semibold text-dark">Live Inventory Update</span>
                  </div>
                  <p className="text-muted fs-12 mb-0">
                    Once recorded, stock is instantly available on the customer storefront and logged in the warehouse audit trail.
                  </p>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Recording Intake...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:box-bold" className="fs-18"></iconify-icon> Confirm Shipment Intake
                    </>
                  )}
                </button>
                <Link href="/admin/inventory/received-orders" className="btn btn-light w-100">
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

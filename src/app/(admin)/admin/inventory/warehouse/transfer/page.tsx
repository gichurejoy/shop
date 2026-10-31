'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';

interface IWarehouse {
  id: string;
  name: string;
  loc: string;
  manager: string;
  phone: string;
  avail: number;
  ship: number;
  rev: string;
  status: 'Active' | 'Maintenance';
}

function WarehouseTransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get('from') || '';
  const initialProductId = searchParams.get('product') || '';

  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  const [transferData, setTransferData] = useState({
    productId: initialProductId,
    fromWh: initialFrom,
    toWh: '',
    quantity: '10',
    notes: 'Inter-hub inventory rebalancing and catalog replenishment',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [whRes, prodRes] = await Promise.all([
          apiClient.warehouses.list(),
          apiClient.products.list({ limit: 100 }),
        ]);

        const whList: IWarehouse[] = whRes.warehouses || [];
        const prodList: IProduct[] = prodRes.products || [];

        setWarehouses(whList);
        setProducts(prodList);

        const defaultFrom = initialFrom || whList[0]?.name || '';
        const defaultTo = whList.find(w => w.name !== defaultFrom)?.name || whList[1]?.name || '';
        const defaultProd = initialProductId || prodList[0]?.id || '';

        setTransferData(prev => ({
          ...prev,
          productId: prev.productId || defaultProd,
          fromWh: prev.fromWh || defaultFrom,
          toWh: prev.toWh || defaultTo,
        }));
      } catch (err: any) {
        toast.error('Failed to load transfer dependencies: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialFrom, initialProductId]);

  const selectedProduct = products.find(p => p.id === transferData.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(transferData.quantity);
    if (!transferData.productId) {
      toast.error('Please select a product to transfer');
      return;
    }
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid transfer quantity');
      return;
    }
    if (transferData.fromWh === transferData.toWh) {
      toast.error('Source and destination warehouses cannot be the same facility');
      return;
    }

    setTransferring(true);
    try {
      await apiClient.inventory.transfer({
        productId: transferData.productId,
        productName: selectedProduct?.title || 'Luxury Product',
        fromWh: transferData.fromWh,
        toWh: transferData.toWh,
        quantity: qty,
        notes: transferData.notes,
      });

      toast.success(`Successfully dispatched ${qty} units of "${selectedProduct?.title || 'Product'}" from ${transferData.fromWh} to ${transferData.toWh}!`);
      router.push('/admin/inventory/warehouse');
    } catch (err: any) {
      toast.error(err.message || 'Failed to execute transfer');
    } finally {
      setTransferring(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading inventory transfer routing...</p>
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
              <h4 className="mb-sm-0 fw-bold">Inter-Hub Stock Movement</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/inventory/warehouse">Warehouse &amp; Logistics</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Transfer Stock</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/inventory/warehouse" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back to Warehouses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Main Transfer Configuration */}
          <div className="col-xl-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Transfer Routing Details</h5>
                <p className="text-muted fs-13 mb-0">Select origin hub, destination facility, and allocate catalog inventory.</p>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Product Selection */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Select Catalog SKU <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={transferData.productId}
                      onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
                      required
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — (Current Stock: {p.stock_quantity ?? 0} units, ${Number(p.price || 0).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Product Banner */}
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
                          <span className="badge bg-success-subtle text-success fs-13 px-3 py-1">
                            {selectedProduct.stock_quantity ?? 0} Units in Stock
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hub Routing Selectors */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Source Facility (Origin) <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:point-on-map-broken"></iconify-icon></span>
                      <select
                        className="form-select"
                        value={transferData.fromWh}
                        onChange={(e) => setTransferData({ ...transferData, fromWh: e.target.value })}
                        required
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name} ({w.loc})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Destination Facility (Target) <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text"><iconify-icon icon="solar:delivery-bold"></iconify-icon></span>
                      <select
                        className="form-select"
                        value={transferData.toWh}
                        onChange={(e) => setTransferData({ ...transferData, toWh: e.target.value })}
                        required
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name} ({w.loc})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity to Transfer */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Units to Dispatch <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={transferData.quantity}
                      onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
                      required
                    />
                    <div className="form-text text-muted">Total units to decrement from source and add to destination in-transit.</div>
                  </div>

                  {/* Reference Notes */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Transfer Reference / Manifest Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      value={transferData.notes}
                      onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                      placeholder="e.g. Replenishing high seasonal velocity in Europe"
                    />
                    <div className="form-text text-muted">Will be recorded in the official inventory movement audit log.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Execution & Summary */}
          <div className="col-xl-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-semibold">Transfer Manifest Summary</h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <span className="text-muted fs-13">Dispatched Units</span>
                  <strong className="text-dark fs-16">{transferData.quantity} Units</strong>
                </div>

                <div className="mb-3">
                  <div className="text-muted fs-12 mb-1">Routing Trajectory:</div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary">{transferData.fromWh || 'Origin'}</span>
                    <iconify-icon icon="solar:arrow-right-broken" className="text-muted fs-16"></iconify-icon>
                    <span className="badge bg-success-subtle text-success">{transferData.toWh || 'Destination'}</span>
                  </div>
                </div>

                <div className="alert alert-light border p-3 rounded mb-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <iconify-icon icon="solar:clipboard-check-bold" className="text-primary fs-18"></iconify-icon>
                    <strong className="text-dark fs-13">Audit Trail Guarantee</strong>
                  </div>
                  <p className="text-muted fs-12 mb-0">
                    Executing this transfer will record an immutable entry in the MySQL inventory audit history and store activity feed.
                  </p>
                </div>
              </div>

              <div className="card-footer bg-transparent border-top p-3 d-flex flex-column gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={transferring}
                >
                  {transferring ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Executing Movement...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:transfer-horizontal-bold" className="fs-18"></iconify-icon> Dispatch Inter-Hub Transfer
                    </>
                  )}
                </button>
                <Link href="/admin/inventory/warehouse" className="btn btn-light w-100">
                  Cancel Movement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function WarehouseTransferPage() {
  return (
    <Suspense fallback={
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading transfer parameters...</p>
      </div>
    }>
      <WarehouseTransferContent />
    </Suspense>
  );
}

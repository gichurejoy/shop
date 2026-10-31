'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const decodedId = decodeURIComponent(rawId || '');

  const [warehouse, setWarehouse] = useState<IWarehouse | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [whRes, prodRes] = await Promise.all([
          apiClient.warehouses.get(decodedId),
          apiClient.products.list({ limit: 10 }),
        ]);
        if (whRes.warehouse) {
          setWarehouse(whRes.warehouse);
        } else {
          toast.error('Warehouse facility not found');
        }
        setProducts(prodRes.products || []);
      } catch (err: any) {
        toast.error('Failed to load facility dossier: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }

    if (decodedId) {
      loadData();
    }
  }, [decodedId]);

  const cleanId = warehouse ? warehouse.id.replace(/^#/, '') : decodedId;

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading facility dossier from database...</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="avatar-lg bg-danger-subtle text-danger rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
          <iconify-icon icon="solar:danger-triangle-bold" className="fs-32"></iconify-icon>
        </div>
        <h4 className="fw-bold">Warehouse Facility Not Found</h4>
        <p className="text-muted">The facility ID "{decodedId}" does not exist in the active fulfillment registry.</p>
        <Link href="/admin/inventory/warehouse" className="btn btn-primary mt-2">
          Return to Warehouses List
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header and Breadcrumbs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h4 className="mb-0 fw-bold">{warehouse.name}</h4>
                <span className={`badge ${warehouse.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                  {warehouse.status}
                </span>
                <code className="bg-light px-2 py-1 rounded text-dark fs-12">{warehouse.id}</code>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/inventory/warehouse">Warehouse &amp; Logistics</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{warehouse.name}</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap mt-3 mt-sm-0">
              <Link href="/admin/inventory/warehouse" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:arrow-left-broken" className="fs-16"></iconify-icon> Back
              </Link>
              <Link
                href={`/admin/inventory/warehouse/transfer?from=${encodeURIComponent(warehouse.name)}`}
                className="btn btn-soft-warning d-flex align-items-center gap-1"
              >
                <iconify-icon icon="solar:transfer-horizontal-broken" className="fs-16"></iconify-icon> Transfer Stock
              </Link>
              <Link
                href={`/admin/inventory/warehouse/${cleanId}/edit`}
                className="btn btn-primary d-flex align-items-center gap-1"
              >
                <iconify-icon icon="solar:pen-2-broken" className="fs-16"></iconify-icon> Edit Facility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '48px', height: '48px' }}>
                <iconify-icon icon="solar:box-minimalistic-bold-duotone" className="fs-26 text-success"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Available Capacity</p>
                <h4 className="fw-bold mb-0 text-success">{Number(warehouse.avail).toLocaleString()} <span className="fs-12 text-muted fw-normal">Units</span></h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-info bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '48px', height: '48px' }}>
                <iconify-icon icon="solar:delivery-bold-duotone" className="fs-26 text-info"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">In-Transit Freight</p>
                <h4 className="fw-bold mb-0 text-info">{Number(warehouse.ship).toLocaleString()} <span className="fs-12 text-muted fw-normal">Units</span></h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '48px', height: '48px' }}>
                <iconify-icon icon="solar:dollar-minimalistic-bold-duotone" className="fs-26 text-primary"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Total Dispatched Value</p>
                <h4 className="fw-bold mb-0 text-primary">{warehouse.rev}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '48px', height: '48px' }}>
                <iconify-icon icon="solar:shield-check-bold-duotone" className="fs-26 text-warning"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Logistics Status</p>
                <h4 className="fw-bold mb-0 text-dark">{warehouse.status}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Dossier Details & Depot Manager */}
        <div className="col-xl-5">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-transparent border-bottom py-3">
              <h5 className="card-title mb-0 fw-semibold">Facility Dossier &amp; Contact</h5>
            </div>
            <div className="card-body p-4">
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-start border-0">
                  <span className="text-muted fs-13">Depot Code</span>
                  <strong className="text-dark font-monospace">{warehouse.id}</strong>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-start border-top">
                  <span className="text-muted fs-13">Physical Location</span>
                  <strong className="text-dark text-end ms-3">{warehouse.loc}</strong>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-top">
                  <span className="text-muted fs-13">Supervising Manager</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-xs bg-light rounded-circle d-flex align-items-center justify-content-center">
                      <iconify-icon icon="solar:user-bold" className="text-primary"></iconify-icon>
                    </div>
                    <strong className="text-dark">{warehouse.manager || 'Unassigned'}</strong>
                  </div>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-top">
                  <span className="text-muted fs-13">Emergency Contact</span>
                  <strong className="text-dark font-monospace">{warehouse.phone || 'N/A'}</strong>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-top">
                  <span className="text-muted fs-13">Operating Status</span>
                  <span className={`badge ${warehouse.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                    {warehouse.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex gap-2">
                <Link
                  href={`/admin/inventory/warehouse/${cleanId}/edit`}
                  className="btn btn-outline-primary flex-grow-1"
                >
                  <iconify-icon icon="solar:pen-2-broken" className="me-1"></iconify-icon> Edit Details
                </Link>
                <Link
                  href={`/admin/inventory/warehouse/transfer?from=${encodeURIComponent(warehouse.name)}`}
                  className="btn btn-warning flex-grow-1"
                >
                  <iconify-icon icon="solar:transfer-horizontal-broken" className="me-1"></iconify-icon> Transfer Stock
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Stored / Associated SKUs */}
        <div className="col-xl-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-transparent border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0 fw-semibold">Inventory Allocation Sample</h5>
                <p className="text-muted fs-13 mb-0">High-velocity products stocked or fulfilled through this facility.</p>
              </div>
              <Link href="/admin/products/list" className="btn btn-sm btn-outline-secondary">
                View All Catalog SKUs →
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Vault Stock</th>
                    <th>Unit Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.title} className="rounded" width="36" height="36" style={{ objectFit: 'cover' }} />
                          ) : (
                            <div className="avatar-xs bg-light rounded d-flex align-items-center justify-content-center">
                              <iconify-icon icon="solar:box-broken"></iconify-icon>
                            </div>
                          )}
                          <div>
                            <Link href={`/admin/products/${p.id}`} className="fw-semibold text-dark text-decoration-none">
                              {p.title}
                            </Link>
                            <div className="text-muted fs-11">SKU: {p.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted fs-13">
                        {typeof p.category === 'object' && p.category !== null ? (p.category as any).name : (p.category || 'Luxury Goods')}
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          {p.stock_quantity ?? 0} units
                        </span>
                      </td>
                      <td className="fw-bold">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="text-end">
                        <Link
                          href={`/admin/inventory/warehouse/transfer?from=${encodeURIComponent(warehouse.name)}&product=${p.id}`}
                          className="btn btn-sm btn-light"
                          title="Transfer this SKU"
                        >
                          <iconify-icon icon="solar:transfer-horizontal-broken"></iconify-icon>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-transparent border-top p-3 d-flex justify-content-between align-items-center">
              <span className="text-muted fs-13">Showing top 6 catalog SKUs available in fulfillment network</span>
              <Link href="/admin/inventory/history" className="btn btn-sm btn-outline-secondary">
                View Movement Audit Logs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

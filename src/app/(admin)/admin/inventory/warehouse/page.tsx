'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function InventoryWarehouse() {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
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
    } catch (err: any) {
      toast.error('Failed to load warehouse data: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteWarehouse = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to decommission warehouse facility "${name}"?`)) return;
    try {
      await apiClient.warehouses.delete(id);
      toast.success(`Warehouse "${name}" deleted successfully.`);
      setWarehouses(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      toast.error('Failed to delete warehouse: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Warehouse ID', 'Warehouse Name', 'Location', 'Manager', 'Phone', 'Stock Available', 'Stock Shipping', 'Revenue', 'Status'];
    const rows = warehouses.map(w => [
      `"${w.id}"`,
      `"${w.name.replace(/"/g, '""')}"`,
      `"${w.loc.replace(/"/g, '""')}"`,
      `"${w.manager.replace(/"/g, '""')}"`,
      `"${w.phone}"`,
      w.avail,
      w.ship,
      `"${w.rev}"`,
      `"${w.status}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `warehouses_facilities_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.loc.toLowerCase().includes(search.toLowerCase()) ||
    w.manager.toLowerCase().includes(search.toLowerCase()) ||
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalVaultUnits = products.reduce((sum, p) => sum + (p.stock_quantity ?? 0), 0);
  const inStockCount = products.filter(p => (p.stock_quantity ?? 0) > 0).length;
  const outOfStockCount = products.filter(p => (p.stock_quantity ?? 0) === 0).length;

  return (
    <>
      {/* Live Warehouse KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:box-broken" className="fs-28 text-primary"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Total Catalog SKUs</p>
                <h4 className="fw-bold mb-0">{products.length} <span className="fs-12 text-muted fw-normal">({totalVaultUnits} Units)</span></h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:reorder-broken" className="fs-28 text-success"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">In-Stock Lines</p>
                <h4 className="fw-bold mb-0 text-success">{inStockCount} <span className="fs-12 text-muted fw-normal">({Math.round((inStockCount / (products.length || 1)) * 100)}%)</span></h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-danger bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:bag-cross-broken" className="fs-28 text-danger"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Out of Stock</p>
                <h4 className="fw-bold mb-0 text-danger">{outOfStockCount} <span className="fs-12 text-muted fw-normal">Lines</span></h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="avatar-md bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                <iconify-icon icon="solar:shop-2-bold-duotone" className="fs-28 text-warning"></iconify-icon>
              </div>
              <div>
                <p className="text-muted mb-0 fs-13">Fulfillment Depots</p>
                <h4 className="fw-bold mb-0">{warehouses.length} <span className="badge text-success bg-success-subtle fs-12 ms-1">Active</span></h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Warehouses Facilities Table */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow-sm border-0">
            <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="card-title mb-1">Global Fulfillment &amp; Warehouse Vaults</h4>
                <p className="text-muted fs-13 mb-0">Multinational atelier depots, inventory allocation, and inter-hub transfers.</p>
              </div>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className="position-relative">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search warehouse, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ minWidth: '220px' }}
                  />
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={handleExportCSV}>
                  <iconify-icon icon="solar:export-bold"></iconify-icon> Export CSV
                </button>
                <Link href="/admin/inventory/warehouse/transfer" className="btn btn-sm btn-soft-warning d-flex align-items-center gap-1">
                  <iconify-icon icon="solar:transfer-horizontal-broken"></iconify-icon> Transfer Stock
                </Link>
                <Link href="/admin/inventory/warehouse/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                  <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Warehouse
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Warehouse ID</th>
                    <th>Facility Name</th>
                    <th>Location / Address</th>
                    <th>Manager</th>
                    <th>Contact Phone</th>
                    <th>Stock Available</th>
                    <th>Stock In-Transit</th>
                    <th>Dispatched Value</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                        Loading warehouse facilities from MySQL...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        No warehouse facilities found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((wh) => {
                      const cleanId = wh.id.replace(/^#/, '');
                      return (
                        <tr key={wh.id}>
                          <td><code className="fw-bold">{wh.id}</code></td>
                          <td>
                            <Link
                              href={`/admin/inventory/warehouse/${cleanId}`}
                              className="text-dark fw-bold text-decoration-none hover-primary"
                            >
                              {wh.name}
                            </Link>
                          </td>
                          <td className="text-muted fs-13">{wh.loc}</td>
                          <td><span className="fw-medium text-dark">{wh.manager}</span></td>
                          <td className="text-muted fs-13">{wh.phone}</td>
                          <td>
                            <span className="badge bg-success-subtle text-success px-2 py-1 fs-12">
                              {Number(wh.avail).toLocaleString()} units
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info-subtle text-info px-2 py-1 fs-12">
                              {Number(wh.ship).toLocaleString()} units
                            </span>
                          </td>
                          <td className="fw-bold text-dark">{wh.rev}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <Link
                                href={`/admin/inventory/warehouse/${cleanId}`}
                                className="btn btn-light btn-sm"
                                title="View Facility Dossier"
                              >
                                <iconify-icon icon="solar:eye-broken" className="align-middle fs-16"></iconify-icon>
                              </Link>
                              <Link
                                href={`/admin/inventory/warehouse/${cleanId}/edit`}
                                className="btn btn-soft-primary btn-sm"
                                title="Edit Warehouse Hub"
                              >
                                <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-16"></iconify-icon>
                              </Link>
                              <Link
                                href={`/admin/inventory/warehouse/transfer?from=${encodeURIComponent(wh.name)}`}
                                className="btn btn-soft-warning btn-sm"
                                title="Transfer Stock to Other Facility"
                              >
                                <iconify-icon icon="solar:transfer-horizontal-broken" className="align-middle fs-16"></iconify-icon>
                              </Link>
                              <button
                                type="button"
                                className="btn btn-soft-danger btn-sm"
                                title="Delete Facility"
                                onClick={() => handleDeleteWarehouse(wh.id, wh.name)}
                              >
                                <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-16"></iconify-icon>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer border-top d-flex justify-content-between align-items-center">
              <span className="text-muted fs-13">Showing {filtered.length} of {warehouses.length} active fulfillment centers</span>
              <Link href="/admin/inventory/history" className="btn btn-sm btn-outline-secondary">
                View Stock History Audit →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

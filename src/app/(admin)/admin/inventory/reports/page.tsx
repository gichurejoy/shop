'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function InventoryReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.reports.inventory();
      setReportData(res.report);
    } catch (err: any) {
      toast.error('Failed to load inventory valuation report: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    window.location.href = '/api/reports/inventory?export=csv';
    toast.success('Downloading inventory valuation CSV report...');
  };

  const totalRetailVal = reportData?.totalRetailVal || 0;
  const estimatedCostVal = reportData?.estimatedCostVal || 0;
  const lowStockRiskVal = reportData?.lowStockRiskVal || 0;
  const totalUnits = reportData?.totalUnits || 0;
  const totalSkus = reportData?.totalSkus || 0;
  const outOfStockCount = reportData?.outOfStockCount || 0;
  const lowStockCount = reportData?.lowStockCount || 0;

  return (
    <>
      {/* Valuation Dashboard Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body py-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fs-13">Estimated Vault Cost Value</span>
                <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-22 text-primary"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">
                ${estimatedCostVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-muted mb-0 fs-12">Based on estimated 55% artisan cost basis</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body py-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fs-13">Potential Storefront Retail Value</span>
                <div className="avatar-sm bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <iconify-icon icon="solar:wad-of-money-bold-duotone" className="fs-22 text-success"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-success">
                ${totalRetailVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-muted mb-0 fs-12">{totalUnits.toLocaleString()} total units across {totalSkus} active SKUs</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body py-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fs-13">Low Stock Value at Risk</span>
                <div className="avatar-sm bg-danger bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <iconify-icon icon="solar:danger-triangle-bold-duotone" className="fs-22 text-danger"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-danger">
                ${lowStockRiskVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-muted mb-0 fs-12">{outOfStockCount} out of stock &bull; {lowStockCount} below threshold</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Category Valuation Breakdown */}
        <div className="col-xl-7">
          <div className="card shadow-sm border-0 mb-4 h-100">
            <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="card-title mb-1 fw-bold">Inventory Valuation by Collection</h5>
                <p className="text-muted fs-12 mb-0">Total stock distribution grouped by catalog category.</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={handleExportCSV}
              >
                <iconify-icon icon="solar:export-bold"></iconify-icon> Export Valuation CSV
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0 text-nowrap">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Category Name</th>
                    <th>SKU Lines</th>
                    <th>Units in Stock</th>
                    <th>Inventory Value ($)</th>
                    <th className="text-end">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        Calculating category valuations...
                      </td>
                    </tr>
                  ) : (reportData?.categoryBreakdown || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No category inventory found.
                      </td>
                    </tr>
                  ) : (
                    (reportData?.categoryBreakdown || []).map((cat: any) => {
                      const share = totalRetailVal > 0 ? ((cat.value / totalRetailVal) * 100).toFixed(1) : '0';
                      return (
                        <tr key={cat.category}>
                          <td className="fw-semibold text-dark">{cat.category}</td>
                          <td>{cat.count} SKUs</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {cat.units.toLocaleString()} units
                            </span>
                          </td>
                          <td className="fw-bold text-dark">${Number(cat.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="text-end">
                            <span className="badge bg-primary-subtle text-primary">{share}%</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer border-top bg-transparent d-flex justify-content-between align-items-center py-3">
              <span className="text-muted fs-12">Synchronized with active MySQL catalog</span>
              <Link href="/admin/inventory/stock" className="btn btn-sm btn-link text-primary text-decoration-none">
                Adjust Unit Counts →
              </Link>
            </div>
          </div>
        </div>

        {/* Low Stock Items Attention Box */}
        <div className="col-xl-5">
          <div className="card shadow-sm border-0 mb-4 h-100">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-1 fw-bold">Critical Stock Items (≤ 5 Units)</h5>
              <p className="text-muted fs-12 mb-0">High priority inventory requiring imminent restock.</p>
            </div>

            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {(reportData?.lowStockList || []).length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <iconify-icon icon="solar:check-circle-bold" className="text-success fs-32 mb-1"></iconify-icon>
                    <p className="mb-0">All active products maintain healthy stock buffers.</p>
                  </div>
                ) : (
                  (reportData?.lowStockList || []).slice(0, 6).map((item: any) => (
                    <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                      <div>
                        <h6 className="mb-1 text-dark fw-bold text-truncate" style={{ maxWidth: '220px' }}>{item.title}</h6>
                        <span className="text-muted fs-12">Unit Price: ${Number(item.price).toFixed(2)}</span>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-danger-subtle text-danger fs-12 px-2 py-1 mb-1 d-block">
                          {item.stock} left
                        </span>
                        <Link href="/admin/inventory/received-orders/intake" className="btn btn-sm btn-light py-0 px-2 fs-11">
                          Restock
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card-footer border-top bg-transparent p-3 d-flex justify-content-between align-items-center">
              <span className="text-muted fs-12">Total {lowStockCount} lines below threshold</span>
              <Link href="/admin/inventory/received-orders/intake" className="btn btn-sm btn-primary">
                Record Restock Shipment →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

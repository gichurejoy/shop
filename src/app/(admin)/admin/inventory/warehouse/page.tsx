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

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Warehouse Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    loc: '',
    manager: '',
    phone: '',
    avail: 5000,
    ship: 150,
    rev: '$45,000',
    status: 'Active' as 'Active' | 'Maintenance',
  });
  const [savingWarehouse, setSavingWarehouse] = useState(false);

  // Transfer Form State
  const [transferData, setTransferData] = useState({
    productId: '',
    fromWh: '',
    toWh: '',
    quantity: '10',
    notes: 'Routine inter-hub inventory rebalancing',
  });
  const [transferring, setTransferring] = useState(false);

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

      if (prodList.length > 0 && !transferData.productId) {
        setTransferData(prev => ({
          ...prev,
          productId: prodList[0].id,
          fromWh: whList[0]?.name || 'Central Atelier Vault',
          toWh: whList[1]?.name || 'European Distribution Hub',
        }));
      }
    } catch (err: any) {
      toast.error('Failed to load warehouse data: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      loc: '',
      manager: '',
      phone: '',
      avail: 5000,
      ship: 150,
      rev: '$25,000',
      status: 'Active',
    });
    setShowAddModal(true);
  };

  const openEditModal = (wh: IWarehouse) => {
    setIsEditing(true);
    setFormData({ ...wh });
    setShowAddModal(true);
  };

  const openViewModal = (wh: IWarehouse) => {
    setSelectedWarehouse(wh);
    setShowViewModal(true);
  };

  const openTransferModalFor = (wh: IWarehouse) => {
    const destination = warehouses.find(w => w.id !== wh.id)?.name || 'Central Atelier Vault';
    setTransferData(prev => ({
      ...prev,
      fromWh: wh.name,
      toWh: destination,
    }));
    setShowTransferModal(true);
  };

  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.loc) {
      toast.error('Warehouse name and location are required');
      return;
    }
    setSavingWarehouse(true);
    try {
      const res = await apiClient.warehouses.save(formData);
      toast.success(isEditing ? 'Warehouse updated successfully!' : 'New warehouse hub established!');
      setShowAddModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save warehouse');
    } finally {
      setSavingWarehouse(false);
    }
  };

  const handleDeleteWarehouse = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to decommission warehouse "${name}"?`)) return;
    try {
      await apiClient.warehouses.delete(id);
      toast.success(`Warehouse ${name} deleted.`);
      setWarehouses(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      toast.error('Failed to delete warehouse: ' + err.message);
    }
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.productId || !transferData.quantity || Number(transferData.quantity) <= 0) {
      toast.error('Please enter a valid transfer quantity');
      return;
    }
    if (transferData.fromWh === transferData.toWh) {
      toast.error('Source and destination warehouses cannot be the same');
      return;
    }

    setTransferring(true);
    try {
      const product = products.find(p => p.id === transferData.productId);
      await apiClient.inventory.transfer({
        productId: transferData.productId,
        productName: product?.title || 'Luxury Product',
        fromWh: transferData.fromWh,
        toWh: transferData.toWh,
        quantity: Number(transferData.quantity),
        notes: transferData.notes,
      });

      toast.success(`Successfully dispatched ${transferData.quantity} units from ${transferData.fromWh} to ${transferData.toWh}!`);
      setShowTransferModal(false);
    } catch (err: any) {
      toast.error('Failed to execute stock transfer: ' + err.message);
    } finally {
      setTransferring(false);
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
          <div className="card">
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
          <div className="card">
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
          <div className="card">
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
          <div className="card">
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
          <div className="card">
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
                <button type="button" className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
                  <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Warehouse
                </button>
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
                    filtered.map((wh) => (
                      <tr key={wh.id}>
                        <td><code className="fw-bold">{wh.id}</code></td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-link p-0 text-dark fw-bold text-decoration-none"
                            onClick={() => openViewModal(wh)}
                          >
                            {wh.name}
                          </button>
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
                            <button
                              type="button"
                              className="btn btn-light btn-sm"
                              title="View Facility Dossier"
                              onClick={() => openViewModal(wh)}
                            >
                              <iconify-icon icon="solar:eye-broken" className="align-middle fs-16"></iconify-icon>
                            </button>
                            <button
                              type="button"
                              className="btn btn-soft-primary btn-sm"
                              title="Edit Warehouse Hub"
                              onClick={() => openEditModal(wh)}
                            >
                              <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-16"></iconify-icon>
                            </button>
                            <button
                              type="button"
                              className="btn btn-soft-warning btn-sm"
                              title="Transfer Stock to Other Facility"
                              onClick={() => openTransferModalFor(wh)}
                            >
                              <iconify-icon icon="solar:transfer-horizontal-broken" className="align-middle fs-16"></iconify-icon>
                            </button>
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
                    ))
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

      {/* Add / Edit Warehouse Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Warehouse Depot' : 'Add New Fulfillment Hub'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleSaveWarehouse}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold">Warehouse Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Middle East Atelier Hub"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Physical Location / Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. DIFC Precinct 4, Dubai, UAE"
                      value={formData.loc}
                      onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Assigned Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sarah M. Brooks"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+971 4 362 7000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Available Capacity (Units)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.avail}
                        onChange={(e) => setFormData({ ...formData, avail: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Operating Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingWarehouse}>
                    {savingWarehouse ? 'Saving...' : isEditing ? 'Save Changes' : 'Establish Warehouse'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal */}
      {showTransferModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transfer Stock Between Fulfillment Hubs</h5>
                <button type="button" className="btn-close" onClick={() => setShowTransferModal(false)}></button>
              </div>
              <form onSubmit={handleExecuteTransfer}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold">Product to Transfer *</label>
                    <select
                      className="form-select"
                      value={transferData.productId}
                      onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
                      required
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (Stock: {p.stock_quantity ?? 0} units)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Source Warehouse</label>
                      <select
                        className="form-select"
                        value={transferData.fromWh}
                        onChange={(e) => setTransferData({ ...transferData, fromWh: e.target.value })}
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Destination Warehouse</label>
                      <select
                        className="form-select"
                        value={transferData.toWh}
                        onChange={(e) => setTransferData({ ...transferData, toWh: e.target.value })}
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label fw-semibold">Quantity to Transfer *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={transferData.quantity}
                      onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold">Transfer Reason / Reference Notes</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={transferData.notes}
                      onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                      placeholder="e.g. Seasonal display replenishment..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowTransferModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={transferring}>
                    {transferring ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Dispatching Transfer...
                      </>
                    ) : (
                      'Initiate Inter-Hub Transfer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse View Dossier Modal */}
      {showViewModal && selectedWarehouse && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Warehouse Dossier: {selectedWarehouse.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="p-3 bg-light rounded border mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Facility ID:</span>
                    <strong className="text-dark font-monospace">{selectedWarehouse.id}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Facility Manager:</span>
                    <strong className="text-dark">{selectedWarehouse.manager}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Location:</span>
                    <strong className="text-dark">{selectedWarehouse.loc}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Contact Phone:</span>
                    <strong className="text-dark">{selectedWarehouse.phone}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Status:</span>
                    <span className="badge bg-success-subtle text-success">{selectedWarehouse.status}</span>
                  </div>
                </div>

                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="p-2 border rounded">
                      <div className="text-muted fs-12">Available Stock</div>
                      <div className="fs-16 fw-bold text-success">{Number(selectedWarehouse.avail).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded">
                      <div className="text-muted fs-12">In-Transit</div>
                      <div className="fs-16 fw-bold text-info">{Number(selectedWarehouse.ship).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded">
                      <div className="text-muted fs-12">Total Dispatched</div>
                      <div className="fs-16 fw-bold text-dark">{selectedWarehouse.rev}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowViewModal(false)}>
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

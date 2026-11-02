'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function InventorySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    outOfStockBehavior: 'show_unavailable',
    lowStockThreshold: 5,
    notifyOnLowStock: true,
    notifyEmail: 'logistics@waveron.com',
    barcodeFormat: 'Code-128',
    autoGenerateBarcodes: true,
    reserveStockOnCheckout: true,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiClient.inventorySettings.get();
        if (res.settings) {
          setSettings(res.settings);
        }
      } catch (err: any) {
        toast.error('Failed to load inventory settings: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.inventorySettings.save(settings);
      toast.success('Inventory rules and operational settings saved to database!');
    } catch (err: any) {
      toast.error('Failed to save settings: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading inventory settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <div className="row g-4">
        {/* Navigation / Links Left */}
        <div className="col-xl-3 col-lg-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Inventory Sub-Modules</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <span className="list-group-item list-group-item-action active bg-primary border-primary">
                  <iconify-icon icon="solar:settings-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Operational Rules
                </span>
                <Link href="/admin/inventory/warehouse" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:shop-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Warehouse Vaults
                </Link>
                <Link href="/admin/inventory/history" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:history-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Movement Audit Trail
                </Link>
                <Link href="/admin/inventory/reports" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:chart-square-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Valuation Reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Right */}
        <div className="col-xl-9 col-lg-8">
          {/* Out of Stock Behavior */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Out of Stock Storefront Behavior</h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted fs-13 mb-3">Configure what occurs on the public boutique storefront when a SKU's stock drops to zero.</p>
              
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="outOfStockBehavior"
                  id="behaviorHide"
                  checked={settings.outOfStockBehavior === 'hide'}
                  onChange={() => setSettings({ ...settings, outOfStockBehavior: 'hide' })}
                />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorHide">
                  Hide Product Automatically
                </label>
                <p className="text-muted fs-12 mb-0">The item is hidden from category catalog listings and public search results.</p>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="outOfStockBehavior"
                  id="behaviorShow"
                  checked={settings.outOfStockBehavior === 'show_unavailable'}
                  onChange={() => setSettings({ ...settings, outOfStockBehavior: 'show_unavailable' })}
                />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorShow">
                  Show as Unavailable / Sold Out
                </label>
                <p className="text-muted fs-12 mb-0">The item remains visible for discovery, but the "Add to Bag" action is replaced with "Sold Out".</p>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="outOfStockBehavior"
                  id="behaviorBackorder"
                  checked={settings.outOfStockBehavior === 'allow_backorders'}
                  onChange={() => setSettings({ ...settings, outOfStockBehavior: 'allow_backorders' })}
                />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorBackorder">
                  Allow Atelier Pre-Orders (Backorders)
                </label>
                <p className="text-muted fs-12 mb-0">Clients may place orders for artisan production; items are flagged as custom lead-time delivery.</p>
              </div>
            </div>
          </div>

          {/* Thresholds & Stock Alerts */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Low Stock Thresholds &amp; Alerts</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Low Stock Trigger (Units)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="form-control"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                    required
                  />
                  <div className="form-text text-muted">SKUs with stock at or below this count appear on urgent restock alerts.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Alert Notification Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={settings.notifyEmail}
                    onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
                    required
                  />
                  <div className="form-text text-muted">Recipient for daily critical restock digests.</div>
                </div>

                <div className="col-12">
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="notifySwitch"
                      checked={settings.notifyOnLowStock}
                      onChange={(e) => setSettings({ ...settings, notifyOnLowStock: e.target.checked })}
                    />
                    <label className="form-check-label fw-medium text-dark" htmlFor="notifySwitch">
                      Enable automated email alerts when items enter low stock
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & Logistics Identifiers */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Logistics &amp; Barcode Identification</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Standard Barcode Symbology</label>
                  <select
                    className="form-select"
                    value={settings.barcodeFormat}
                    onChange={(e) => setSettings({ ...settings, barcodeFormat: e.target.value })}
                  >
                    <option value="Code-128">Code-128 (Standard Industrial / Multi-Depot)</option>
                    <option value="EAN-13">EAN-13 (European International Retail)</option>
                    <option value="UPC-A">UPC-A (North American Retail Standard)</option>
                  </select>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check form-switch pt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="barcodeGenSwitch"
                      checked={settings.autoGenerateBarcodes}
                      onChange={(e) => setSettings({ ...settings, autoGenerateBarcodes: e.target.checked })}
                    />
                    <label className="form-check-label fw-medium text-dark" htmlFor="barcodeGenSwitch">
                      Auto-generate SKU barcode tokens on new product intake
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer border-top bg-transparent p-3 d-flex justify-content-end gap-2">
              <Link href="/admin/inventory/warehouse" className="btn btn-light">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <iconify-icon icon="solar:diskette-bold" className="fs-18"></iconify-icon>
                    Save Operational Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

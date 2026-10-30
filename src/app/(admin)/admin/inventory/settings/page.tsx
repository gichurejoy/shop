'use client';

import Link from 'next/link';

export default function InventorySettingsPage() {
  return (
    <>
      <div className="row">
        <div className="col-xl-3 col-lg-4">
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Settings Navigation</h4>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <a href="#!" className="list-group-item list-group-item-action active">
                  <iconify-icon icon="solar:box-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Inventory & Stock
                </a>
                <a href="#!" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:shop-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Warehouses
                </a>
                <a href="#!" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:bell-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Notifications
                </a>
                <a href="#!" className="list-group-item list-group-item-action">
                  <iconify-icon icon="solar:printer-bold-duotone" className="align-middle fs-18 me-2"></iconify-icon>
                  Barcode Settings
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-9 col-lg-8">
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Out of Stock Behavior</h4>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">Configure what happens when a product's stock reaches zero.</p>
              
              <div className="form-check mb-3">
                <input className="form-check-input" type="radio" name="outOfStockBehavior" id="behaviorHide" />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorHide">
                  Hide Product
                </label>
                <p className="text-muted fs-13 mb-0">The product will be completely hidden from the storefront catalog.</p>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="radio" name="outOfStockBehavior" id="behaviorShow" defaultChecked />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorShow">
                  Show as Unavailable
                </label>
                <p className="text-muted fs-13 mb-0">The product remains visible but the "Add to Cart" button is disabled and marked as "Sold Out".</p>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="outOfStockBehavior" id="behaviorBackorder" />
                <label className="form-check-label fw-medium text-dark" htmlFor="behaviorBackorder">
                  Allow Backorders
                </label>
                <p className="text-muted fs-13 mb-0">Customers can continue to purchase the product. It will be marked as "On Backorder".</p>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Backorder Management</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label htmlFor="maxBackorders" className="form-label">Maximum Backorder Quantity</label>
                  <input type="number" id="maxBackorders" className="form-control" placeholder="e.g. 50" defaultValue="50" />
                  <div className="form-text">The maximum number of units that can be sold on backorder. Leave empty for unlimited.</div>
                </div>
                <div className="col-lg-6">
                  <label htmlFor="restockDate" className="form-label">Default Estimated Restock Date (Days)</label>
                  <input type="number" id="restockDate" className="form-control" placeholder="e.g. 14" defaultValue="14" />
                  <div className="form-text">Automatically calculate restock date based on these days if not manually set.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Low Stock Alerts</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label htmlFor="globalThreshold" className="form-label">Global Low Stock Threshold</label>
                  <input type="number" id="globalThreshold" className="form-control" placeholder="e.g. 10" defaultValue="10" />
                  <div className="form-text">Trigger an alert when stock falls below this number (can be overridden per product).</div>
                </div>
                <div className="col-lg-12 mt-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="emailAlerts" defaultChecked />
                    <label className="form-check-label" htmlFor="emailAlerts">Send Email Notifications for Low Stock</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-light-subtle d-flex justify-content-end gap-2 border-top">
              <Link href="/admin/inventory/stock" className="btn btn-outline-secondary">Cancel</Link>
              <button type="button" className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

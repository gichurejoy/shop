'use client';

export default function InventoryReportsPage() {
  return (
    <>
      {/* Valuation Dashboard Cards */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="card h-100 mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title mb-0">Total Inventory Value</h5>
                <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                  <iconify-icon icon="solar:wallet-money-bold-duotone" className="fs-24 text-primary"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-2">$145,200.00</h3>
              <p className="text-muted mb-0 fs-13">Based on average cost price</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title mb-0">Potential Retail Value</h5>
                <div className="avatar-sm bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                  <iconify-icon icon="solar:wad-of-money-bold-duotone" className="fs-24 text-success"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-2">$310,450.00</h3>
              <p className="text-muted mb-0 fs-13">Based on current selling price</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title mb-0">Low Stock Value Risk</h5>
                <div className="avatar-sm bg-danger bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                  <iconify-icon icon="solar:danger-triangle-bold-duotone" className="fs-24 text-danger"></iconify-icon>
                </div>
              </div>
              <h3 className="fw-bold mb-2">$12,800.00</h3>
              <p className="text-muted mb-0 fs-13">Value of items currently below threshold</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Bulk Actions & Import */}
        <div className="col-xl-6">
          <div className="card mb-3 h-100">
            <div className="card-header">
              <h4 className="card-title">Bulk Import / Update Stock</h4>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">Upload a CSV file to bulk update inventory quantities, add new variants, or modify stock thresholds.</p>
              
              <div className="border border-dashed rounded p-5 d-flex flex-column align-items-center justify-content-center text-center bg-light-subtle mb-4" style={{ cursor: 'pointer' }}>
                <iconify-icon icon="solar:cloud-upload-bold-duotone" className="fs-50 text-primary mb-3"></iconify-icon>
                <h5>Click or drag CSV file to upload</h5>
                <p className="text-muted mb-0">Only .csv files are supported. Max file size 5MB.</p>
              </div>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <button className="btn btn-primary px-4">Upload File</button>
                <a href="#!" className="link-primary fw-medium d-flex align-items-center gap-1">
                  <iconify-icon icon="solar:download-square-broken" className="fs-18"></iconify-icon>
                  Download CSV Template
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="col-xl-6">
          <div className="card mb-3 h-100">
            <div className="card-header">
              <h4 className="card-title">Export Inventory Reports</h4>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">Generate and download detailed inventory reports for accounting, reconciliation, or external system sync.</p>

              <div className="mb-4">
                <label className="form-label">Report Type</label>
                <select className="form-select">
                  <option value="valuation">Full Inventory Valuation Report</option>
                  <option value="low_stock">Low Stock & Out of Stock Items</option>
                  <option value="warehouse">Stock by Warehouse Breakdown</option>
                  <option value="history">Stock Movement History (Last 30 Days)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Format</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="exportFormat" id="formatCsv" defaultChecked />
                    <label className="form-check-label" htmlFor="formatCsv">CSV</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="exportFormat" id="formatExcel" />
                    <label className="form-check-label" htmlFor="formatExcel">Excel (XLSX)</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="exportFormat" id="formatPdf" />
                    <label className="form-check-label" htmlFor="formatPdf">PDF</label>
                  </div>
                </div>
              </div>

              <button className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2">
                <iconify-icon icon="solar:document-bold-duotone" className="fs-18"></iconify-icon>
                Generate & Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

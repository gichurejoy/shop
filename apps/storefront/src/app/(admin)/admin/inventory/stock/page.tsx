'use client';

import Link from 'next/link';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

export default function InventoryStockPage() {
  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <h4 className="card-title mb-0">Stock Management</h4>
                  <span className="badge bg-danger-subtle text-danger px-2 py-1 fs-13">12 Low Stock</span>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="search-box">
                    <input type="text" className="form-control" placeholder="Search product, SKU..." />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                  <select className="form-select" style={{ width: '150px' }}>
                    <option value="">All Categories</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                  </select>
                  <select className="form-select" style={{ width: '150px' }}>
                    <option value="">Stock Status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                  <Link href="/admin/inventory/settings" className="btn btn-primary">
                    <iconify-icon icon="solar:settings-bold-duotone" className="align-middle me-1 fs-18"></iconify-icon> Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: '40px' }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkAll" />
                          <label className="form-check-label" htmlFor="checkAll"></label>
                        </div>
                      </th>
                      <th>Product & Variant</th>
                      <th>SKU</th>
                      <th>Barcode</th>
                      <th>Stock Level</th>
                      <th>Threshold</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { img: 'p-1.png', name: 'Men Black Slim Fit T-shirt', variant: 'Size: M, Color: Black', sku: 'TS-BLK-M-001', barcode: '8901234567890', stock: 450, threshold: 50, status: 'In Stock', statusClass: 'bg-success-subtle text-success' },
                      { img: 'p-1.png', name: 'Men Black Slim Fit T-shirt', variant: 'Size: S, Color: Black', sku: 'TS-BLK-S-001', barcode: '8901234567891', stock: 12, threshold: 20, status: 'Low Stock', statusClass: 'bg-warning-subtle text-warning' },
                      { img: 'p-5.png', name: 'Dark Green Cargo Pent', variant: 'Size: L, Color: Green', sku: 'CG-GRN-L-002', barcode: '8901234567892', stock: 0, threshold: 15, status: 'Out of Stock', statusClass: 'bg-danger-subtle text-danger' },
                      { img: 'p-8.png', name: 'Men Dark Brown Wallet', variant: 'Standard', sku: 'WL-BRN-STD-003', barcode: '8901234567893', stock: 125, threshold: 30, status: 'In Stock', statusClass: 'bg-success-subtle text-success' },
                      { img: 'p-10.png', name: "Kid's Yellow T-shirt", variant: 'Size: S, Color: Yellow', sku: 'TS-KID-YEL-S', barcode: '8901234567894', stock: 5, threshold: 10, status: 'Low Stock', statusClass: 'bg-warning-subtle text-warning' },
                    ].map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`check${i}`} />
                            <label className="form-check-label" htmlFor={`check${i}`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                              <img src={`${BASE}/product/${item.img}`} alt="" className="avatar-md" />
                            </div>
                            <div>
                              <a href="#!" className="text-dark fw-medium fs-15">{item.name}</a>
                              <p className="text-muted mb-0 mt-1 fs-13">{item.variant}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-medium">{item.sku}</span>
                            <a href="#!" className="text-muted" title="Copy SKU"><i className="bx bx-copy"></i></a>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="text-dark">{item.barcode}</span>
                            <a href="#!" className="text-primary fs-12 mt-1">Generate New</a>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <input type="number" className="form-control form-control-sm" defaultValue={item.stock} style={{ width: '80px' }} />
                            {item.stock <= item.threshold && item.stock > 0 && (
                              <iconify-icon icon="solar:danger-triangle-bold-duotone" className="text-warning fs-18" title="Low Stock Warning"></iconify-icon>
                            )}
                            {item.stock === 0 && (
                              <iconify-icon icon="solar:close-circle-bold-duotone" className="text-danger fs-18" title="Out of Stock"></iconify-icon>
                            )}
                          </div>
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm" defaultValue={item.threshold} style={{ width: '80px' }} />
                        </td>
                        <td>
                          <span className={`badge ${item.statusClass} px-2 py-1 fs-13`}>{item.status}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <a href="#!" className="btn btn-soft-primary btn-sm" title="Edit Stock Details">
                              <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-18"></iconify-icon>
                            </a>
                            <Link href="/admin/inventory/history" className="btn btn-soft-secondary btn-sm" title="View Stock History">
                              <iconify-icon icon="solar:history-broken" className="align-middle fs-18"></iconify-icon>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer border-top">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">Showing 1 to 5 of 3521 entries</p>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-end mb-0">
                    <li className="page-item"><a className="page-link" href="#!">Previous</a></li>
                    <li className="page-item active"><a className="page-link" href="#!">1</a></li>
                    <li className="page-item"><a className="page-link" href="#!">2</a></li>
                    <li className="page-item"><a className="page-link" href="#!">3</a></li>
                    <li className="page-item"><a className="page-link" href="#!">Next</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

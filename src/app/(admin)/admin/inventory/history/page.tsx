'use client';


export default function StockHistoryPage() {
  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h4 className="card-title mb-0">Stock History Log</h4>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="search-box">
                    <input type="text" className="form-control" placeholder="Search product, SKU..." />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                  <input type="date" className="form-control" style={{ width: '150px' }} />
                  <select className="form-select" style={{ width: '160px' }}>
                    <option value="">Transaction Type</option>
                    <option value="addition">Stock Added</option>
                    <option value="deduction">Stock Deducted</option>
                    <option value="sale">Order Fulfillment</option>
                    <option value="transfer">Warehouse Transfer</option>
                  </select>
                  <button className="btn btn-primary">
                    <iconify-icon icon="solar:export-bold-duotone" className="align-middle me-1"></iconify-icon> Export Log
                  </button>
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
                      <th>Date & Time</th>
                      <th>Product</th>
                      <th>Transaction Type</th>
                      <th>Quantity Change</th>
                      <th>Remaining Stock</th>
                      <th>User / System</th>
                      <th>Reference / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Apr 24, 2024 14:30', product: 'Men Black Slim Fit T-shirt (M)', type: 'Order Fulfillment', typeClass: 'bg-primary-subtle text-primary', qty: -2, stock: 448, user: 'System', ref: 'Order #0758267/90' },
                      { date: 'Apr 24, 2024 10:15', product: 'Dark Green Cargo Pent (L)', type: 'Stock Added', typeClass: 'bg-success-subtle text-success', qty: '+50', stock: 50, user: 'John Doe', ref: 'PO #49281' },
                      { date: 'Apr 23, 2024 16:45', product: 'Men Dark Brown Wallet', type: 'Warehouse Transfer', typeClass: 'bg-info-subtle text-info', qty: -25, stock: 125, user: 'Jane Smith', ref: 'Transfer to East Coast Hub' },
                      { date: 'Apr 23, 2024 09:20', product: "Kid's Yellow T-shirt (S)", type: 'Stock Deducted', typeClass: 'bg-danger-subtle text-danger', qty: -5, stock: 5, user: 'Admin', ref: 'Damaged goods return' },
                      { date: 'Apr 22, 2024 11:10', product: 'Men Black Slim Fit T-shirt (M)', type: 'Stock Added', typeClass: 'bg-success-subtle text-success', qty: '+200', stock: 450, user: 'John Doe', ref: 'PO #49250' },
                      { date: 'Apr 21, 2024 18:05', product: 'Men Dark Brown Wallet', type: 'Order Fulfillment', typeClass: 'bg-primary-subtle text-primary', qty: -1, stock: 150, user: 'System', ref: 'Order #0758190/45' },
                      { date: 'Apr 20, 2024 08:30', product: 'Dark Green Cargo Pent (L)', type: 'Stock Deducted', typeClass: 'bg-danger-subtle text-danger', qty: -12, stock: 0, user: 'System', ref: 'Inventory Reconciliation' },
                    ].map((log, i) => (
                      <tr key={i}>
                        <td>{log.date}</td>
                        <td><a href="#!" className="text-dark fw-medium">{log.product}</a></td>
                        <td><span className={`badge ${log.typeClass} px-2 py-1 fs-12`}>{log.type}</span></td>
                        <td>
                          <span className={String(log.qty).startsWith('+') ? 'text-success fw-medium' : 'text-danger fw-medium'}>
                            {log.qty}
                          </span>
                        </td>
                        <td>{log.stock}</td>
                        <td>{log.user}</td>
                        <td><span className="text-muted fs-13">{log.ref}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer border-top">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">Showing 1 to 7 of 1,204 logs</p>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-end mb-0">
                    <li className="page-item disabled"><a className="page-link" href="#!">Previous</a></li>
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

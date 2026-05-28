import Link from "next/link";

export default function InventoryWarehouse() {
     return (
          <>
               <div className="row g-3 mb-4">
                    <div className="col-md-6 col-xl-3">
                         <div className="card">
                              <div className="card-body d-flex align-items-center gap-3 py-3">
                                   <div className="avatar-md bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                                        <iconify-icon icon="solar:box-broken" className="fs-28 text-primary"></iconify-icon>
                                   </div>
                                   <div>
                                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Total Product Items</p>
                                        <h4 className="fw-bold mb-0">3521 <span className="fs-12 text-muted fw-normal">(Items)</span></h4>
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
                                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>In Stock Product</p>
                                        <h4 className="fw-bold mb-0">1311 <span className="fs-12 text-muted fw-normal">(Items)</span></h4>
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
                                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Out Of Stock Product</p>
                                        <h4 className="fw-bold mb-0">231 <span className="fs-12 text-muted fw-normal">(Items)</span></h4>
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                         <div className="card">
                              <div className="card-body d-flex align-items-center gap-3 py-3">
                                   <div className="avatar-md bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ minWidth: '52px', height: '52px' }}>
                                        <iconify-icon icon="solar:users-group-two-rounded-broken" className="fs-28 text-warning"></iconify-icon>
                                   </div>
                                   <div>
                                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Total Visited Customer</p>
                                        <h4 className="fw-bold mb-0">2334 <span className="badge text-danger bg-danger-subtle fs-12 ms-1"><i className="bx bx-down-arrow-alt"></i>4.5%</span></h4>
                                   </div>
                              </div>
                         </div>
                    </div>

               </div>

               <div className="row">
                    <div className="col-xl-12">
                         <div className="card">
                              <div className="d-flex card-header justify-content-between align-items-center">
                                   <div>
                                        <h4 className="card-title">All Warehouse List</h4>
                                   </div>
                                   <div className="dropdown">
                                        <a href="#" className="dropdown-toggle btn btn-sm btn-outline-light rounded" data-bs-toggle="dropdown" aria-expanded="false">
                                             This Month
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                             {/*  item */}
                                             <a href="#!" className="dropdown-item">Download</a>
                                             {/*  item */}
                                             <a href="#!" className="dropdown-item">Export</a>
                                             {/*  item */}
                                             <a href="#!" className="dropdown-item">Import</a>
                                        </div>
                                   </div>
                              </div>
                              <div>
                                   <div className="table-responsive">
                                        <table className="table align-middle mb-0 table-hover table-centered">
                                             <thead className="bg-light-subtle">
                                                  <tr>
                                                       <th style={{ "width": "20px" }}>
                                                            <div className="form-check">
                                                                 <input type="checkbox" className="form-check-input" id="customCheck1" />
                                                                 <label className="form-check-label" htmlFor="customCheck1"></label>
                                                            </div>
                                                       </th>
                                                       <th>Warehouse ID</th>
                                                       <th>Warehouse Name</th>
                                                       <th>Location</th>
                                                       <th>Manager</th>
                                                       <th>Contact Number</th>
                                                       <th>Stock Available </th>
                                                       <th>Stock Shipping</th>
                                                       <th>Warehouse Revenue</th>
                                                       <th>Action</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {[
                                                    { id: '#WH-001', name: 'Central Fulfillment', loc: '123 Commerce St, NY', manager: 'John Doe', phone: '+1 (555) 123-4567', avail: 6490, ship: 3022, rev: '$25,737' },
                                                    { id: '#WH-002', name: 'East Coast Hub', loc: '456 Market Ave, NY', manager: 'Jane Smith', phone: '+1 (555) 234-5678', avail: 7362, ship: 4253, rev: '$67,351' },
                                                    { id: '#WH-003', name: 'West Coast Depot', loc: '789 Trade Blvd, CA', manager: 'Richard Roe', phone: '+1 (555) 345-6789', avail: 8842, ship: 3221, rev: '$45,865' },
                                                    { id: '#WH-004', name: 'Southern Distribution', loc: '101 Supply Rd, TX', manager: 'Alice Johnson', phone: '+1 (555) 456-7890', avail: 5463, ship: 2100, rev: '$54,655' },
                                                    { id: '#WH-005', name: 'Northern Fulfillment', loc: '202 Logistics Ln, IL', manager: 'Michael Brown', phone: '+1 (555) 567-8901', avail: 12643, ship: 7008, rev: '$92,533' },
                                                  ].map((wh, i) => (
                                                    <tr key={i}>
                                                         <td>
                                                              <div className="form-check">
                                                                   <input type="checkbox" className="form-check-input" id={`customCheckWH${i}`} />
                                                                   <label className="form-check-label" htmlFor={`customCheckWH${i}`}></label>
                                                              </div>
                                                         </td>
                                                         <td>{wh.id}</td>
                                                         <td>{wh.name}</td>
                                                         <td>{wh.loc}</td>
                                                         <td>{wh.manager}</td>
                                                         <td>{wh.phone}</td>
                                                         <td>{wh.avail}</td>
                                                         <td>{wh.ship}</td>
                                                         <td>{wh.rev}</td>
                                                         <td>
                                                              <div className="d-flex gap-2">
                                                                   <a href="#!" className="btn btn-light btn-sm" title="View"><iconify-icon icon="solar:eye-broken" className="align-middle fs-18"></iconify-icon></a>
                                                                   <a href="#!" className="btn btn-soft-primary btn-sm" title="Edit"><iconify-icon icon="solar:pen-2-broken" className="align-middle fs-18"></iconify-icon></a>
                                                                   <a href="#!" className="btn btn-soft-warning btn-sm" data-bs-toggle="modal" data-bs-target="#transferModal" title="Transfer Stock"><iconify-icon icon="solar:transfer-horizontal-broken" className="align-middle fs-18"></iconify-icon></a>
                                                                   <a href="#!" className="btn btn-soft-danger btn-sm" title="Delete"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18"></iconify-icon></a>
                                                              </div>
                                                         </td>
                                                    </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>
                                   {/*  end table-responsive  */}
                              </div>
                              <div className="card-footer border-top">
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

               {/* Stock Transfer Modal */}
               <div className="modal fade" id="transferModal" tabIndex={-1} aria-labelledby="transferModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h5 className="modal-title" id="transferModalLabel">Transfer Stock Between Warehouses</h5>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                   <form>
                                        <div className="mb-3">
                                             <label className="form-label">Product to Transfer</label>
                                             <select className="form-select">
                                                  <option value="">Select Product...</option>
                                                  <option value="1">Men Black Slim Fit T-shirt (Size: M) - 450 in stock</option>
                                                  <option value="2">Men Dark Brown Wallet - 125 in stock</option>
                                             </select>
                                        </div>
                                        <div className="row g-3 mb-3">
                                             <div className="col-md-6">
                                                  <label className="form-label">From Warehouse</label>
                                                  <select className="form-select">
                                                       <option value="WH-001">Central Fulfillment</option>
                                                       <option value="WH-002">East Coast Hub</option>
                                                  </select>
                                             </div>
                                             <div className="col-md-6">
                                                  <label className="form-label">To Warehouse</label>
                                                  <select className="form-select">
                                                       <option value="WH-002">East Coast Hub</option>
                                                       <option value="WH-003">West Coast Depot</option>
                                                  </select>
                                             </div>
                                        </div>
                                        <div className="mb-3">
                                             <label className="form-label">Quantity</label>
                                             <input type="number" className="form-control" placeholder="Enter quantity to transfer" />
                                        </div>
                                        <div className="mb-3">
                                             <label className="form-label">Transfer Reason / Notes</label>
                                             <textarea className="form-control" rows={3} placeholder="Optional notes..."></textarea>
                                        </div>
                                   </form>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                   <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Initiate Transfer</button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

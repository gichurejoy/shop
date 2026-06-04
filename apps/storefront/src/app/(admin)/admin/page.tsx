'use client';


import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="row mb-4">
      <div className="col-xxl-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-primary text-truncate mb-3" role="alert">
              We regret to inform you that our server is currently experiencing technical difficulties.
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Total Orders</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">13, 647</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:cart-5-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-success"> <i className="bx bxs-up-arrow fs-12"></i> 2.3%</span>
                    <span className="text-muted ms-1 fs-12">Last Week</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">New Leads</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">9, 526</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-success"> <i className="bx bxs-up-arrow fs-12"></i> 8.1%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Deals</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">976</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:backpack-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-danger"> <i className="bx bxs-down-arrow fs-12"></i> 0.3%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Booked Revenue</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">$123.6k</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:wallet-money-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-danger"> <i className="bx bxs-down-arrow fs-12"></i> 10.6%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xxl-7">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">Performance</h4>
              <div>
                <button type="button" className="btn btn-sm btn-outline-light me-1">ALL</button>
                <button type="button" className="btn btn-sm btn-outline-light me-1">1M</button>
                <button type="button" className="btn btn-sm btn-outline-light me-1">6M</button>
                <button type="button" className="btn btn-sm btn-primary">1Y</button>
              </div>
            </div>

            <div className="mt-4" style={{ height: '320px', width: '100%' }}>
              {mounted && <ReactApexChart 
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: false },
                    fontFamily: 'inherit',
                    parentHeightOffset: 0,
                  },
                  stroke: {
                    width: [0, 3],
                    curve: 'smooth'
                  },
                  colors: ['#ff6c2f', '#10b981'],
                  fill: {
                    type: ['gradient', 'gradient'],
                    gradient: {
                      shade: 'light',
                      type: "vertical",
                      opacityFrom: [0.85, 0.6],
                      opacityTo: [0.3, 0.05],
                      stops: [0, 100]
                    }
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: '35%',
                      borderRadius: 4,
                      borderRadiusApplication: 'end',
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  xaxis: {
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: { style: { colors: '#64748b', fontSize: '12px' } }
                  },
                  yaxis: {
                    min: 0,
                    max: 80,
                    tickAmount: 4,
                    labels: {
                      style: { colors: '#64748b', fontSize: '12px' },
                      formatter: (value) => `${value}k`
                    }
                  },
                  grid: {
                    borderColor: '#f1f5f9',
                    strokeDashArray: 4,
                    padding: { top: 10, bottom: 0, right: 10, left: 10 }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    offsetY: -10,
                    markers: { strokeWidth: 0, size: 6, radius: 12 },
                    itemMargin: { horizontal: 10, vertical: 0 }
                  },
                  tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                      formatter: (y) => {
                        if (typeof y !== "undefined") {
                          return y.toFixed(0) + "k";
                        }
                        return y;
                      }
                    }
                  }
                }} 
                series={[
                  {
                    name: 'Page Views',
                    type: 'column',
                    data: [35, 65, 45, 68, 48, 60, 42, 44, 78, 52, 62, 66]
                  },
                  {
                    name: 'Clicks',
                    type: 'area',
                    data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 28, 12, 34]
                  }
                ]}
                type="line"
                height="100%"
                width="100%"
              />}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Conversions</h5>
              <div className="mb-2 mt-n2 d-flex justify-content-center align-items-center" style={{ height: '235px' }}>
                <div className="w-100 h-100">
                  {mounted && <ReactApexChart
                    options={{
                      chart: {
                        height: 220,
                        type: 'radialBar',
                        sparkline: { enabled: true }
                      },
                      plotOptions: {
                        radialBar: {
                          startAngle: -135,
                          endAngle: 135,
                          hollow: {
                            size: '70%',
                          },
                          track: {
                            background: '#f1f5f9',
                            strokeWidth: '100%',
                          },
                          dataLabels: {
                            name: {
                              show: true,
                              fontSize: '13px',
                              color: '#64748b',
                              offsetY: 60
                            },
                            value: {
                              offsetY: 15,
                              fontSize: '24px',
                              color: '#1e293b',
                              fontWeight: '600',
                              formatter: (val) => `${val}%`
                            }
                          }
                        }
                      },
                      colors: ['#ff6c2f'],
                      labels: ['Returning Customer']
                    }}
                    series={[65.2]}
                    type="radialBar"
                    height="100%"
                    width="100%"
                  />}
                </div>
              </div>
              <div className="row text-center mt-3">
                <div className="col-6">
                  <p className="text-muted mb-2">This Week</p>
                  <h3 className="text-dark mb-3">23.5k</h3>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-2">Last Week</p>
                  <h3 className="text-dark mb-3">41.05k</h3>
                </div>
              </div>
              <div className="text-center">
                <button type="button" className="btn bg-light bg-opacity-50 text-dark border-0 shadow-none w-100 py-2 fw-medium">View Details</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sessions by Country</h5>
              <div className="position-relative d-flex justify-content-center align-items-center rounded bg-light bg-opacity-10" style={{ height: '316px', backgroundImage: 'url("/assets/images/world-map.svg")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.9 }}>
                {/* Custom Map Markers */}
                <div className="position-absolute" style={{ top: '35%', left: '20%' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-secondary bg-opacity-50 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px' }}><div className="rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }}></div></div>
                    <span className="text-muted" style={{ fontSize: '12px' }}>Canada</span>
                  </div>
                </div>
                <div className="position-absolute" style={{ top: '45%', left: '25%' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-secondary bg-opacity-50 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px' }}><div className="rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }}></div></div>
                    <span className="text-muted" style={{ fontSize: '12px' }}>United States</span>
                  </div>
                </div>
                <div className="position-absolute" style={{ top: '65%', left: '33%' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-secondary bg-opacity-50 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px' }}><div className="rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }}></div></div>
                    <span className="text-muted" style={{ fontSize: '12px' }}>Brazil</span>
                  </div>
                </div>
                <div className="position-absolute" style={{ top: '30%', right: '25%' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-secondary bg-opacity-50 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px' }}><div className="rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }}></div></div>
                    <span className="text-muted" style={{ fontSize: '12px' }}>Russia</span>
                  </div>
                </div>
                <div className="position-absolute" style={{ top: '45%', right: '25%' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-secondary bg-opacity-50 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px' }}><div className="rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }}></div></div>
                    <span className="text-muted" style={{ fontSize: '12px' }}>China</span>
                  </div>
                </div>
              </div>
              <div className="row text-center mt-3">
                <div className="col-6">
                  <p className="text-muted mb-2">This Week</p>
                  <h3 className="text-dark mb-3">23.5k</h3>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-2">Last Week</p>
                  <h3 className="text-dark mb-3">41.05k</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card card-height-100">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h4 className="card-title flex-grow-1">Top Pages</h4>
              <a href="#" className="btn btn-sm btn-soft-primary">View All</a>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap table-centered m-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="text-muted ps-3">Page Path</th>
                    <th className="text-muted">Page Views</th>
                    <th className="text-muted">Exit Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/ecommerce.html</a></td>
                    <td>465 </td>
                    <td><span className="badge bg-success-subtle text-success">4.4%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/dashboard.html</a></td>
                    <td> 426</td>
                    <td><span className="badge bg-danger-subtle text-danger">20.4%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/chat.html</a></td>
                    <td>254 </td>
                    <td><span className="badge bg-warning-subtle text-warning">12.25%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/auth-login.html</a></td>
                    <td> 3369</td>
                    <td><span className="badge bg-success-subtle text-success">5.2%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/email.html</a></td>
                    <td>985 </td>
                    <td><span className="badge bg-danger-subtle text-danger">64.2%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/social.html</a></td>
                    <td>653 </td>
                    <td><span className="badge bg-success-subtle text-success">2.4%</span></td>
                  </tr>
                  <tr>
                    <td className="ps-3"><a href="#" className="text-muted">larkon/blog.html</a></td>
                    <td>478 </td>
                    <td><span className="badge bg-danger-subtle text-danger">1.4%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-0">
        <div className="col">
          <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Recent Orders</h4>
            <Link href="/admin/orders" className="btn btn-sm btn-soft-primary">View All</Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Customer Name</th>
                    <th>Email ID</th>
                    <th>Phone No.</th>
                    <th>Address</th>
                    <th>Payment Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#RB5625', date: '29 April 2024', customer: 'Anna M. Hines', email: 'anna.hines@mail.com', phone: '(+1)-555-1564-261', address: 'Burr Ridge/Illinois', payment: 'Credit Card', status: 'Completed' },
                    { id: '#RB9652', date: '25 April 2024', customer: 'Judith H. Fritsche', email: 'judith.fritsche.com', phone: '(+57)-305-5579-759', address: 'SULLIVAN/Kentucky', payment: 'Credit Card', status: 'Completed' },
                    { id: '#RB5984', date: '25 April 2024', customer: 'Peter T. Smith', email: 'peter.smith@mail.com', phone: '(+33)-655-5187-93', address: 'Yreka/California', payment: 'Pay Pal', status: 'Completed' },
                  ].map((order, i) => (
                    <tr key={i}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td><iconify-icon icon="solar:laptop-bold-duotone" class="fs-20"></iconify-icon></td>
                      <td>{order.customer}</td>
                      <td>{order.email}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>{order.payment}</td>
                      <td><span className="badge bg-success-subtle text-success">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

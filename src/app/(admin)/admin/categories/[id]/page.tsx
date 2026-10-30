'use client';

import Link from 'next/link';

// Mock Category Data
const CATEGORY = {
  id: 'FS16276',
  name: "Fashion Men , Women & Kid's",
  createdBy: 'Seller',
  stock: 46233,
  description: 'Aurora Fashion has once again captivated fashion enthusiasts with its latest collection, seamlessly blending elegance with comfort in a range of exquisite designs.',
  img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
  status: 'Published'
};

// Mock Products in this Category
const CATEGORY_PRODUCTS = [
  { id: 1, name: 'Men Black Slim Fit T-shirt', price: 80, stock: 142, rating: 4.5, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png' },
  { id: 2, name: 'Gray Cap For Men', price: 76, stock: 321, rating: 4.2, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png' },
  { id: 3, name: 'Dark Green Cargo Pent', price: 110, stock: 109, rating: 4.4, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-5.png' },
];

export default function CategoryDetail() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-4 text-muted" style={{ fontSize: '13px' }}>
        <Link href="/admin" className="text-muted text-decoration-none">Dashboard</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <Link href="/admin/categories" className="text-muted text-decoration-none">Categories</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <span className="text-dark fw-medium">{CATEGORY.name}</span>
      </div>

      <div className="row">
        {/* ── Left Column ── */}
        <div className="col-lg-4 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="bg-light rounded text-center p-3">
                <img src={CATEGORY.img} alt={CATEGORY.name} className="avatar-xxl" />
              </div>

              <div className="mt-3">
                <h5 className="mb-1 fw-semibold">{CATEGORY.name}</h5>
                <span className="badge bg-success-subtle text-success fs-12 mb-3">{CATEGORY.status}</span>

                <div className="row mt-3">
                  <div className="col-12 mb-2">
                    <p className="text-muted mb-0 fs-13">Created By :</p>
                    <h6 className="mb-0 fw-semibold">{CATEGORY.createdBy}</h6>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-0 fs-13">Stock :</p>
                    <h6 className="mb-0 fw-semibold">{CATEGORY.stock}</h6>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-0 fs-13">ID :</p>
                    <h6 className="mb-0 fw-semibold">{CATEGORY.id}</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-light-subtle d-flex gap-2">
              <Link href={`/admin/categories/1/edit`} className="btn btn-primary flex-fill btn-sm">
                <iconify-icon icon="solar:pen-2-broken" className="align-middle me-1"></iconify-icon>
                Edit Category
              </Link>
              <Link href="/admin/categories" className="btn btn-outline-light flex-fill btn-sm">Back</Link>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="col-lg-8 col-xl-9">
          {/* General Info */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">General Information</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <p className="text-muted mb-1 fs-13">Category Title</p>
                  <h6 className="mb-0 text-dark fw-semibold">{CATEGORY.name}</h6>
                </div>

                <div className="col-lg-6">
                  <p className="text-muted mb-1 fs-13">Created By</p>
                  <h6 className="mb-0 text-dark fw-semibold">{CATEGORY.createdBy}</h6>
                </div>

                <div className="col-lg-6">
                  <p className="text-muted mb-1 fs-13">Stock</p>
                  <h6 className="mb-0 text-dark fw-semibold">{CATEGORY.stock} items</h6>
                </div>

                <div className="col-lg-6">
                  <p className="text-muted mb-1 fs-13">Tag ID</p>
                  <h6 className="mb-0 text-dark fw-semibold">{CATEGORY.id}</h6>
                </div>

                <div className="col-lg-12">
                  <p className="text-muted mb-1 fs-13">Description</p>
                  <p className="mb-0 text-muted fs-14" style={{ lineHeight: '1.6' }}>{CATEGORY.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products in this category */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Products in this Category</h4>
              <span className="badge bg-primary-subtle text-primary">{CATEGORY_PRODUCTS.length} Products</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th style={{ width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORY_PRODUCTS.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                              <img src={p.img} alt={p.name} className="avatar-md" />
                            </div>
                            <span className="text-dark fw-medium fs-14">{p.name}</span>
                          </div>
                        </td>
                        <td className="fw-semibold text-dark">${p.price}</td>
                        <td>{p.stock} items</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <iconify-icon icon="solar:star-bold" className="text-warning"></iconify-icon>
                            <span className="fw-medium text-dark">{p.rating}</span>
                          </div>
                        </td>
                        <td>
                          <Link href={`/admin/products/${p.id}`} className="btn btn-light btn-sm">
                            <iconify-icon icon="solar:eye-broken" className="align-middle fs-16"></iconify-icon>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const INITIAL_CATEGORIES = [
  { id: 'FS16276', name: "Fashion Men , Women & Kid's", priceRange: '$80 to $400', createdBy: 'Seller', stock: 46233, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png' },
  { id: 'HB73029', name: 'Women Hand Bag', priceRange: '$120 to $500', createdBy: 'Admin', stock: 2739, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png' },
  { id: 'CH492-9', name: 'Cap and Hat', priceRange: '$50 to $200', createdBy: 'Admin', stock: 1829, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png' },
  { id: 'EC23818', name: 'Electronics Headphone', priceRange: '$100 to $700', createdBy: 'Seller', stock: 1902, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-6.png' },
  { id: 'FW11009', name: 'Foot Wares', priceRange: '$70 to $400', createdBy: 'Seller', stock: 2733, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-7.png' },
  { id: 'WL38299', name: 'Wallet Categories', priceRange: '$120 to $300', createdBy: 'Admin', stock: 890, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-8.png' },
  { id: 'SM37817', name: 'Electronics Watch', priceRange: '$60 to $400', createdBy: 'Seller', stock: 250, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-11.png' },
  { id: 'EG37878', name: 'Eye Ware & Sunglass', priceRange: '$70 to $500', createdBy: 'Admin', stock: 1900, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-9.png' },
];

export default function CategoryList() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete category #${id}?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body text-center">
              <div className="rounded bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <img src="https://techzaa.in/larkon/admin/assets/images/product/p-1.png" alt="" className="img-fluid p-2" style={{ maxHeight: '70px', objectFit: 'contain' }} />
              </div>
              <h4 className="mt-3 mb-0 fs-16 fw-semibold">Fashion Categories</h4>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body text-center">
              <div className="rounded bg-primary-subtle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <img src="https://techzaa.in/larkon/admin/assets/images/product/p-6.png" alt="" className="img-fluid p-2" style={{ maxHeight: '70px', objectFit: 'contain' }} />
              </div>
              <h4 className="mt-3 mb-0 fs-16 fw-semibold">Electronics Headphone</h4>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body text-center">
              <div className="rounded bg-warning-subtle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <img src="https://techzaa.in/larkon/admin/assets/images/product/p-7.png" alt="" className="img-fluid p-2" style={{ maxHeight: '70px', objectFit: 'contain' }} />
              </div>
              <h4 className="mt-3 mb-0 fs-16 fw-semibold">Foot Wares</h4>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body text-center">
              <div className="rounded bg-info-subtle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <img src="https://techzaa.in/larkon/admin/assets/images/product/p-9.png" alt="" className="img-fluid p-2" style={{ maxHeight: '70px', objectFit: 'contain' }} />
              </div>
              <h4 className="mt-3 mb-0 fs-16 fw-semibold">Eye Ware & Sunglass</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center gap-1">
              <h4 className="card-title flex-grow-1 mb-0">All Categories List</h4>

              <Link href="/admin/categories/new" className="btn btn-sm btn-primary">
                Add Category
              </Link>

              <div className="dropdown">
                <a href="#" className="dropdown-toggle btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-expanded="false">
                  This Month
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="#!" className="dropdown-item">Download</a>
                  <a href="#!" className="dropdown-item">Export</a>
                  <a href="#!" className="dropdown-item">Import</a>
                </div>
              </div>
            </div>
            <div>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: "20px" }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1"></label>
                        </div>
                      </th>
                      <th>Categories</th>
                      <th>Starting Price</th>
                      <th>Create by</th>
                      <th>ID</th>
                      <th>Product Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`check-${cat.id}`} />
                            <label className="form-check-label" htmlFor={`check-${cat.id}`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                              <img src={cat.img} alt="" className="img-fluid p-1" style={{ maxHeight: '44px', objectFit: 'contain' }} />
                            </div>
                            <p className="text-dark fw-medium fs-15 mb-0">{cat.name}</p>
                          </div>
                        </td>
                        <td>{cat.priceRange}</td>
                        <td>{cat.createdBy}</td>
                        <td>{cat.id}</td>
                        <td>{cat.stock}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link href={`/admin/categories/${cat.id}`} className="btn btn-light btn-sm">
                              <iconify-icon icon="solar:eye-broken" className="align-middle fs-18"></iconify-icon>
                            </Link>
                            <Link href={`/admin/categories/${cat.id}/edit`} className="btn btn-soft-primary btn-sm">
                              <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-18"></iconify-icon>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id)}
                              className="btn btn-soft-danger btn-sm"
                            >
                              <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18"></iconify-icon>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </>
  );
}

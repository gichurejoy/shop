'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/types/category';

const DEFAULT_CATEGORY_IMAGES = [
  'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-6.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-7.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-9.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-2.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-4.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-8.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-11.png',
];

export default function CategoryList() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.categories.list();
      setCategories(res.categories || []);
    } catch (err: any) {
      toast.error('Failed to load categories: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await apiClient.categories.delete(id);
      toast.success(`Category "${name}" deleted successfully.`);
      fetchCategories();
    } catch (err: any) {
      toast.error('Failed to delete category: ' + (err.message || 'Unknown error'));
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Top 4 Quick Category Cards */}
      <div className="row g-3 mb-4">
        {categories.slice(0, 4).map((cat, idx) => {
          const colors = ['secondary', 'primary', 'warning', 'info'];
          const color = colors[idx % colors.length];
          const img = cat.image || DEFAULT_CATEGORY_IMAGES[idx % DEFAULT_CATEGORY_IMAGES.length];
          return (
            <div key={cat.id} className="col-md-6 col-xl-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div
                    className={`rounded bg-${color}-subtle d-flex align-items-center justify-content-center mx-auto overflow-hidden`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <img
                      src={img}
                      alt={cat.name}
                      className="img-fluid p-2"
                      style={{ maxHeight: '70px', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_CATEGORY_IMAGES[0];
                      }}
                    />
                  </div>
                  <h4 className="mt-3 mb-1 fs-16 fw-semibold">{cat.name}</h4>
                  <p className="text-muted fs-12 mb-0">{cat.product_count ?? 0} active products</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div className="row mb-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h4 className="card-title flex-grow-1 mb-0">All Categories ({categories.length})</h4>

              <div className="d-flex align-items-center gap-2">
                <div className="position-relative">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '30px', minWidth: '200px' }}
                  />
                  <iconify-icon
                    icon="solar:magnifer-linear"
                    style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  ></iconify-icon>
                </div>

                <button
                  type="button"
                  onClick={fetchCategories}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                >
                  <iconify-icon icon="solar:refresh-broken"></iconify-icon>
                  Refresh
                </button>

                <Link href="/admin/categories/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                  <iconify-icon icon="solar:add-circle-bold"></iconify-icon>
                  Add Category
                </Link>
              </div>
            </div>

            <div>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: '20px' }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1"></label>
                        </div>
                      </th>
                      <th>Category</th>
                      <th>Slug</th>
                      <th>Created By</th>
                      <th>ID</th>
                      <th>Product Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                          Loading categories from database...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          No categories found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((cat, idx) => {
                        const img = cat.image || DEFAULT_CATEGORY_IMAGES[idx % DEFAULT_CATEGORY_IMAGES.length];
                        return (
                          <tr key={cat.id}>
                            <td>
                              <div className="form-check">
                                <input type="checkbox" className="form-check-input" id={`check-${cat.id}`} />
                                <label className="form-check-label" htmlFor={`check-${cat.id}`}></label>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded bg-light avatar-md d-flex align-items-center justify-content-center overflow-hidden border"
                                  style={{ width: '52px', height: '52px' }}
                                >
                                  <img
                                    src={img}
                                    alt={cat.name}
                                    className="img-fluid p-1"
                                    style={{ maxHeight: '44px', objectFit: 'contain' }}
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = DEFAULT_CATEGORY_IMAGES[0];
                                    }}
                                  />
                                </div>
                                <div>
                                  <Link href={`/admin/categories/${cat.id}/edit`} className="text-dark fw-medium fs-15 mb-0 link-primary">
                                    {cat.name}
                                  </Link>
                                  {cat.description && (
                                    <p className="text-muted fs-12 mb-0 text-truncate" style={{ maxWidth: '240px' }}>
                                      {cat.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <code>{cat.slug}</code>
                            </td>
                            <td>Admin</td>
                            <td>
                              <span className="text-muted fs-13">{cat.id.substring(0, 8)}</span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border px-2 py-1">
                                {cat.product_count ?? 0} Products
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/categories/${cat.slug}`}
                                  target="_blank"
                                  className="btn btn-light btn-sm"
                                  title="View Storefront Category"
                                >
                                  <iconify-icon icon="solar:eye-broken" className="align-middle fs-18"></iconify-icon>
                                </Link>
                                <Link
                                  href={`/admin/categories/${cat.id}/edit`}
                                  className="btn btn-soft-primary btn-sm"
                                  title="Edit Category"
                                >
                                  <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-18"></iconify-icon>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(cat.id, cat.name)}
                                  className="btn btn-soft-danger btn-sm"
                                  title="Delete Category"
                                >
                                  <iconify-icon
                                    icon="solar:trash-bin-minimalistic-2-broken"
                                    className="align-middle fs-18"
                                  ></iconify-icon>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer border-top d-flex justify-content-between align-items-center">
              <span className="text-muted fs-13">Showing {filtered.length} of {categories.length} categories</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

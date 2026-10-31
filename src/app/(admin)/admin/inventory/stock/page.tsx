'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';
import { ICategory } from '@/types/category';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

export default function InventoryStockPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        apiClient.products.list({ limit: 100 }),
        apiClient.categories.list().catch(() => ({ categories: [] })),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);

      // initialize local stock state
      const initialStock: Record<string, number> = {};
      (prodRes.products || []).forEach((p) => {
        initialStock[p.id] = p.stock_quantity ?? 0;
      });
      setEditingStock(initialStock);
    } catch (err: any) {
      toast.error('Failed to load inventory: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleStockChange = (productId: string, val: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (product: IProduct) => {
    const newQty = editingStock[product.id] ?? product.stock_quantity ?? 0;
    try {
      setSavingId(product.id);
      await apiClient.products.update(product.id, {
        stock_quantity: newQty,
      });
      toast.success(`Stock for "${product.title}" updated to ${newQty} units!`);
      // Update local product array
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_quantity: newQty } : p))
      );
    } catch (err: any) {
      toast.error('Failed to update stock: ' + (err.message || 'Unknown error'));
    } finally {
      setSavingId(null);
    }
  };

  const lowStockCount = products.filter((p) => (p.stock_quantity ?? 0) <= 5).length;

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      !selectedCategory ||
      p.category?.id === selectedCategory ||
      p.category?.slug === selectedCategory;

    const stock = p.stock_quantity ?? 0;
    let matchesStatus = true;
    if (statusFilter === 'in_stock') matchesStatus = stock > 5;
    else if (statusFilter === 'low_stock') matchesStatus = stock > 0 && stock <= 5;
    else if (statusFilter === 'out_of_stock') matchesStatus = stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          {/* Header Controls Card */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <h4 className="card-title mb-0">Stock Management</h4>
                  <span className={`badge ${lowStockCount > 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} px-2 py-1 fs-13`}>
                    {lowStockCount} Low Stock
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search product, SKU..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ paddingLeft: '32px' }}
                    />
                    <iconify-icon
                      icon="solar:magnifer-linear"
                      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                    ></iconify-icon>
                  </div>

                  <select
                    className="form-select"
                    style={{ width: '170px' }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select"
                    style={{ width: '150px' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Stock Status</option>
                    <option value="in_stock">In Stock (&gt;5)</option>
                    <option value="low_stock">Low Stock (1-5)</option>
                    <option value="out_of_stock">Out of Stock (0)</option>
                  </select>

                  <button
                    type="button"
                    onClick={fetchStock}
                    className="btn btn-outline-secondary d-flex align-items-center gap-1"
                  >
                    <iconify-icon icon="solar:refresh-broken"></iconify-icon> Refresh
                  </button>

                  <Link href="/admin/products/new" className="btn btn-primary d-flex align-items-center gap-1">
                    <iconify-icon icon="solar:add-circle-bold"></iconify-icon> New Product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
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
                      <th>Product &amp; Category</th>
                      <th>SKU</th>
                      <th>Stock Level</th>
                      <th>Threshold</th>
                      <th>Status</th>
                      <th>Quick Save</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-5">
                          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                          Loading live stock levels...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-5 text-muted">
                          No inventory items found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item, i) => {
                        const currentStock = editingStock[item.id] ?? item.stock_quantity ?? 0;
                        const threshold = 5;
                        const isOutOfStock = currentStock === 0;
                        const isLowStock = currentStock > 0 && currentStock <= threshold;
                        const statusClass = isOutOfStock
                          ? 'bg-danger-subtle text-danger'
                          : isLowStock
                          ? 'bg-warning-subtle text-warning'
                          : 'bg-success-subtle text-success';
                        const statusText = isOutOfStock
                          ? 'Out of Stock'
                          : isLowStock
                          ? 'Low Stock'
                          : 'In Stock';

                        const img = (item as any).image || `${BASE}/product/p-1.png`;
                        const isSaving = savingId === item.id;
                        const hasModified = currentStock !== (item.stock_quantity ?? 0);

                        return (
                          <tr key={item.id || i}>
                            <td>
                              <div className="form-check">
                                <input type="checkbox" className="form-check-input" id={`check${i}`} />
                                <label className="form-check-label" htmlFor={`check${i}`}></label>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center overflow-hidden border">
                                  <img
                                    src={img}
                                    alt={item.title}
                                    className="avatar-md object-fit-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
                                    }}
                                  />
                                </div>
                                <div>
                                  <Link href={`/admin/products/${item.id}`} className="text-dark fw-medium fs-15 link-primary">
                                    {item.title}
                                  </Link>
                                  <p className="text-muted mb-0 mt-1 fs-13">
                                    <span>Category: </span>
                                    {item.category?.name || 'General'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-medium font-monospace">{item.sku || `SKU-${item.id.slice(0, 6).toUpperCase()}`}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  className={`form-control form-control-sm ${hasModified ? 'border-primary bg-primary-subtle' : ''}`}
                                  value={currentStock}
                                  onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                                  style={{ width: '85px' }}
                                />
                                {isLowStock && (
                                  <iconify-icon
                                    icon="solar:danger-triangle-bold-duotone"
                                    className="text-warning fs-18"
                                    title="Low Stock Warning (<= 5 units)"
                                  ></iconify-icon>
                                )}
                                {isOutOfStock && (
                                  <iconify-icon
                                    icon="solar:close-circle-bold-duotone"
                                    className="text-danger fs-18"
                                    title="Out of Stock (0 units)"
                                  ></iconify-icon>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="text-muted fs-13">&le; {threshold} units</span>
                            </td>
                            <td>
                              <span className={`badge ${statusClass} px-2 py-1 fs-13`}>
                                {statusText}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleSaveStock(item)}
                                disabled={isSaving}
                                className={`btn btn-sm ${hasModified ? 'btn-primary' : 'btn-outline-secondary'}`}
                                title="Persist stock change to MySQL"
                              >
                                {isSaving ? (
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                  <iconify-icon icon="solar:check-read-linear" className="fs-16 align-middle"></iconify-icon>
                                )}
                                <span className="ms-1">{hasModified ? 'Save' : 'Synced'}</span>
                              </button>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/admin/products/${item.id}/edit`}
                                  className="btn btn-soft-primary btn-sm"
                                  title="Edit Product Details"
                                >
                                  <iconify-icon icon="solar:pen-2-broken" className="align-middle fs-18"></iconify-icon>
                                </Link>
                                <Link
                                  href={`/products/${item.slug || item.id}`}
                                  target="_blank"
                                  className="btn btn-soft-secondary btn-sm"
                                  title="View on Storefront"
                                >
                                  <iconify-icon icon="solar:eye-broken" className="align-middle fs-18"></iconify-icon>
                                </Link>
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
              <p className="mb-0 text-muted fs-13">Showing {filtered.length} of {products.length} inventory products</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';
import { ICategory } from '@/types/category';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

// Collapsible filter section
function FilterSection({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={className}>
      <a
        href="#!"
        className="btn-link d-flex align-items-center text-dark bg-light p-2 rounded fw-medium fs-16 mb-0 text-decoration-none"
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
      >
        {title}
        <i className={`bx bx-chevron-${open ? 'down' : 'up'} ms-auto fs-20`}></i>
      </a>
      <div style={{ display: open ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

// Product Card
function ProductCard({ product, onDelete }: { product: IProduct; onDelete: (id: string) => void }) {
  const [wishlisted, setWishlisted] = useState(false);
  const img = (product as any).image || (product.images && product.images[0]) || `${BASE}/product/p-1.png`;
  const price = Number(product.price);
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : null;
  const discount = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : null;

  return (
    <div className="card h-100 overflow-hidden" style={{ position: 'relative' }}>
      <div style={{ height: '220px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src={img}
          alt={product.title}
          style={{ maxHeight: '180px', maxWidth: '85%', objectFit: 'contain' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
          }}
        />
      </div>
      <div className="card-body bg-light-subtle rounded-bottom d-flex flex-column justify-content-between">
        <div>
          <span className="badge bg-secondary-subtle text-secondary fs-11 mb-1">
            {product.category?.name || 'General'}
          </span>
          <Link href={`/admin/products/${product.id}`} className="text-dark fw-medium fs-15 text-decoration-none d-block text-truncate">
            {product.title}
          </Link>
          <div className="my-1">
            <div className="d-flex gap-2 align-items-center">
              <span className="text-warning fs-14">
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star-half"></i>
              </span>
              <p className="mb-0 fw-medium fs-13 text-dark">
                4.8 <span className="text-muted fs-12">(Atelier Edition)</span>
              </p>
            </div>
          </div>
          <h5 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-2 mb-0">
            ${price.toFixed(2)}{' '}
            {compareAt && (
              <span className="text-muted text-decoration-line-through fs-13">${compareAt.toFixed(2)}</span>
            )}
            {discount && <small className="badge bg-danger-subtle text-danger fs-11">{discount}% Off</small>}
          </h5>
        </div>

        <div className="mt-3 pt-2 border-top">
          <div className="d-flex gap-2">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="btn btn-sm btn-soft-primary border border-primary-subtle flex-fill d-flex align-items-center justify-content-center gap-1"
            >
              <iconify-icon icon="solar:pen-2-broken" className="fs-16"></iconify-icon> Edit
            </Link>
            <Link
              href={`/admin/products/${product.id}`}
              className="btn btn-sm btn-light border flex-fill d-flex align-items-center justify-content-center gap-1"
            >
              <iconify-icon icon="solar:eye-broken" className="fs-16"></iconify-icon> View
            </Link>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="btn btn-sm btn-soft-danger border border-danger-subtle px-2"
              title="Delete Product"
            >
              <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      <span className="position-absolute top-0 end-0 p-2">
        <button
          type="button"
          onClick={() => setWishlisted(!wishlisted)}
          className="btn btn-soft-danger avatar-sm d-inline-flex align-items-center justify-content-center fs-18 rounded-circle"
          style={{ width: '32px', height: '32px' }}
        >
          <iconify-icon icon={wishlisted ? 'solar:heart-bold' : 'solar:heart-broken'}></iconify-icon>
        </button>
      </span>
    </div>
  );
}

export default function ProductGridPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        apiClient.products.list({ limit: 100 }),
        apiClient.categories.list().catch(() => ({ categories: [] })),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err: any) {
      toast.error('Failed to load products: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.products.delete(id);
      toast.success('Product deleted.');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error('Failed to delete product: ' + err.message);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      p.category?.id === selectedCategory ||
      p.category?.slug === selectedCategory;

    const matchesPrice = Number(p.price) <= maxPriceFilter;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="row">
      {/* Left Sidebar */}
      <div className="col-lg-3">
        {/* Search bar card */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Search Products</h4>
          </div>
          <div className="card-body">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <iconify-icon
                icon="solar:magnifer-linear"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              ></iconify-icon>
            </div>
          </div>
        </div>

        {/* Filter categories */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Categories</h4>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="catRadio"
                  id="catAll"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                />
                <label className="form-check-label fw-medium" htmlFor="catAll">
                  All Collections ({products.length})
                </label>
              </div>
              {categories.map((c) => (
                <div key={c.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="catRadio"
                    id={`cat-${c.id}`}
                    checked={selectedCategory === c.id || selectedCategory === c.slug}
                    onChange={() => setSelectedCategory(c.id)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${c.id}`}>
                    {c.name} {c.product_count !== undefined && <span className="text-muted fs-12">({c.product_count})</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price filter */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Max Price: ${maxPriceFilter}</h4>
          </div>
          <div className="card-body">
            <input
              type="range"
              className="form-range"
              min="50"
              max="2000"
              step="50"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted fs-12 mt-1">
              <span>$50</span>
              <span>$1,000</span>
              <span>$2,000+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Grid and Toolbar */}
      <div className="col-lg-9">
        {/* Top Controls Toolbar */}
        <div className="card mb-3">
          <div className="card-body py-2">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <p className="mb-0 text-muted fs-14">
                  Showing <strong className="text-dark">{filtered.length}</strong> of {products.length} catalog items
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Link href="/admin/products" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" title="Table View">
                  <iconify-icon icon="solar:list-bold"></iconify-icon> Table View
                </Link>
                <Link href="/admin/products/new" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
                  <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Cards */}
        {loading ? (
          <div className="card py-5 text-center">
            <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
            <p className="text-muted mb-0">Loading products from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card py-5 text-center">
            <iconify-icon icon="solar:box-minimalistic-broken" className="fs-48 text-muted mb-2"></iconify-icon>
            <h5>No products found</h5>
            <p className="text-muted fs-13 mb-0">Try clearing your search query or adjusting your filters.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mb-4">
            {filtered.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

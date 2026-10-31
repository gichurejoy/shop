'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

const COLORS = [
  { id: 'dark',   label: 'Dark',   hex: '#1e293b' },
  { id: 'yellow', label: 'Gold',   hex: '#f59e0b' },
  { id: 'white',  label: 'Silver', hex: '#f8fafc', border: '#e2e8f0' },
  { id: 'green',  label: 'Emerald',hex: '#22c55e' },
];
const SIZES = ['Standard', 'S', 'M', 'L', 'XL'];

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b', fontSize: '16px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <iconify-icon key={i} icon={i < Math.floor(count) ? 'solar:star-bold' : i < count ? 'solar:star-half-bold' : 'solar:star-linear'} />
      ))}
    </span>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('dark');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await apiClient.products.get(productId);
        setProduct(data);
      } catch (err: any) {
        toast.error('Failed to load product: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <iconify-icon icon="solar:box-minimalistic-bold-duotone" className="fs-50 text-warning mb-3"></iconify-icon>
          <h4>Product Not Found</h4>
          <p className="text-muted">The requested product could not be found in the database.</p>
          <Link href="/admin/products" className="btn btn-primary mt-2">
            Back to Products List
          </Link>
        </div>
      </div>
    );
  }

  const rawImages: string[] = (product as any).images?.length
    ? (product as any).images
    : (product as any).image
    ? [(product as any).image]
    : [`${BASE}/product/p-1.png`];

  const images = rawImages.length > 0 ? rawImages : [`${BASE}/product/p-1.png`];

  const discountPercent =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
      ? Math.round(((Number(product.compare_at_price) - Number(product.price)) / Number(product.compare_at_price)) * 100)
      : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-3 text-muted" style={{ fontSize: '13px' }}>
        <Link href="/admin" className="text-muted text-decoration-none">Dashboard</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <Link href="/admin/products" className="text-muted text-decoration-none">Products</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <span className="text-dark fw-medium">{product.title}</span>
      </div>

      <div className="row g-3">
        {/* Left: Image gallery */}
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              {/* Main image */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  height: '340px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={images[activeImg] || images[0]}
                  alt={product.title}
                  style={{ maxHeight: '300px', maxWidth: '90%', objectFit: 'contain', transition: 'opacity 0.2s' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
                  }}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{
                        padding: '4px',
                        borderRadius: '8px',
                        border: `2px solid ${activeImg === i ? '#ff6c2f' : '#e2e8f0'}`,
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="card-footer border-top">
              <div className="row g-2">
                <div className="col-6">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <iconify-icon icon="solar:pen-2-bold-duotone" style={{ fontSize: '18px' }}></iconify-icon> Edit Product
                  </Link>
                </div>
                <div className="col-6">
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    target="_blank"
                    className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <iconify-icon icon="solar:link-circle-bold-duotone" style={{ fontSize: '18px' }}></iconify-icon> View Storefront
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product info */}
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-body">
              <span className="badge bg-success-subtle text-success fs-12 mb-2 text-capitalize">
                {product.status || 'Active'}
              </span>
              <h4 className="fw-bold mb-1 text-dark">{product.title}</h4>

              {/* Category & SKU */}
              <p className="text-muted mb-2 fs-13">
                Category:{' '}
                <strong className="text-dark">{product.category?.name || 'General Collection'}</strong>
                {product.sku && <span className="ms-3">SKU: <strong className="text-dark">{product.sku}</strong></span>}
              </p>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <Stars count={4.8} />
                <span className="fw-medium text-dark">4.8</span>
                <span className="text-muted">(Verified Atelier Edition)</span>
              </div>

              {/* Price */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <h2 className="fw-bold mb-0" style={{ color: '#ff6c2f' }}>
                  ${Number(product.price).toFixed(2)}
                </h2>
                {product.compare_at_price && (
                  <span className="text-muted text-decoration-line-through fs-16">
                    ${Number(product.compare_at_price).toFixed(2)}
                  </span>
                )}
                {discountPercent && (
                  <span className="badge bg-danger-subtle text-danger">{discountPercent}% Off</span>
                )}
              </div>

              <hr />

              {/* Inventory Stock */}
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <iconify-icon
                    icon="solar:box-bold-duotone"
                    className={`fs-20 ${
                      (product.stock_quantity ?? 0) > 5 ? 'text-success' : 'text-danger'
                    }`}
                  ></iconify-icon>
                  <span className="fw-medium text-dark">
                    Stock Level: <strong>{product.stock_quantity ?? 0} units</strong> available in inventory
                  </span>
                </div>
              </div>

              {/* Color selector */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">
                  Color: <span className="text-muted fw-normal">{COLORS.find((c) => c.id === selectedColor)?.label}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      title={c.label}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: c.hex,
                        border: selectedColor === c.id ? '3px solid #ff6c2f' : `2px solid ${c.border || c.hex}`,
                        cursor: 'pointer',
                        outline: selectedColor === c.id ? '2px solid #ff6c2f' : 'none',
                        outlineOffset: '2px',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">
                  Size: <span className="text-muted fw-normal">{selectedSize}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        width: 'auto',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: selectedSize === s ? '2px solid #ff6c2f' : '1px solid #e2e8f0',
                        background: selectedSize === s ? '#ff6c2f' : '#fff',
                        color: selectedSize === s ? '#fff' : '#334155',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short description */}
              {product.short_description && (
                <div className="p-3 bg-light-subtle rounded mb-3 border">
                  <p className="mb-0 text-muted fs-13">{product.short_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Details */}
      <div className="card mt-3">
        <div className="card-header p-0">
          <div className="d-flex border-bottom">
            {[
              { key: 'description', label: 'Full Description' },
              { key: 'inventory', label: 'Inventory & Logistics' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '14px 24px',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? '#ff6c2f' : '#64748b',
                  borderBottom: activeTab === tab.key ? '3px solid #ff6c2f' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {activeTab === 'description' && (
            <div>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {product.description || 'No detailed editorial description provided yet.'}
              </p>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded border">
                  <h6 className="fw-bold mb-1">SKU / Barcode</h6>
                  <p className="text-muted mb-0">{product.sku || 'N/A'}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded border">
                  <h6 className="fw-bold mb-1">Stock on Hand</h6>
                  <p className="text-muted mb-0">{product.stock_quantity ?? 0} units</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded border">
                  <h6 className="fw-bold mb-1">Publish Status</h6>
                  <p className="text-muted mb-0 text-capitalize">{product.status || 'Active'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IProduct, ProductStatus } from '@/types/product';
import { ICategory } from '@/types/category';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

const COLORS = [
  { id: 'e-dark',   hex: '#1e293b', label: 'Dark' },
  { id: 'e-yellow', hex: '#f59e0b', label: 'Gold / Yellow' },
  { id: 'e-white',  hex: '#f8fafc', label: 'Silver / White', border: '#e2e8f0' },
  { id: 'e-red',    hex: '#ef4444', label: 'Ruby / Red' },
  { id: 'e-green',  hex: '#22c55e', label: 'Emerald / Green' },
  { id: 'e-blue',   hex: '#3b82f6', label: 'Sapphire / Blue' },
];

const SIZES = ['Standard', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>('');
  const [stockQuantity, setStockQuantity] = useState<number | string>('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['Standard']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['e-dark']);

  useEffect(() => {
    async function loadProductAndCategories() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          apiClient.products.get(productId),
          apiClient.categories.list().catch(() => ({ categories: [] })),
        ]);

        if (catData.categories) {
          setCategories(catData.categories);
        }

        if (prodData) {
          setTitle(prodData.title || '');
          setSlug(prodData.slug || '');
          setCategoryId(prodData.category?.id || '');
          setDescription(prodData.description || '');
          setShortDescription(prodData.short_description || '');
          setPrice(prodData.price ?? '');
          setCompareAtPrice(prodData.compare_at_price ?? '');
          setStockQuantity(prodData.stock_quantity ?? '');
          setSku(prodData.sku || '');
          setStatus((prodData.status as any) || 'active');
          const img = (prodData as any).image || (prodData.images && prodData.images[0]) || '';
          setImageUrl(img);
        }
      } catch (err: any) {
        toast.error('Failed to load product details: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProductAndCategories();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Product title is required');
      return;
    }

    try {
      setSaving(true);
      const selectedCategoryObj = categories.find((c) => c.id === categoryId);

      const updatePayload: Partial<IProduct> = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description.trim(),
        short_description: shortDescription.trim(),
        price: Number(price) || 0,
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock_quantity: Number(stockQuantity) || 0,
        sku: sku.trim(),
        status: status as ProductStatus,
        category: selectedCategoryObj,
      };

      if (imageUrl) {
        (updatePayload as any).image = imageUrl;
        (updatePayload as any).images = [imageUrl];
      }

      await apiClient.products.update(productId, updatePayload);
      toast.success('Product updated and saved successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (s: string) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleColor = (cId: string) => {
    setSelectedColors((prev) =>
      prev.includes(cId) ? prev.filter((item) => item !== cId) : [...prev, cId]
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  const discountPercent =
    compareAtPrice && Number(compareAtPrice) > Number(price)
      ? Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)
      : null;

  const currentCategoryName =
    categories.find((c) => c.id === categoryId)?.name || 'General';

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Left sidebar preview */}
        <div className="col-xl-3 col-lg-4">
          <div className="card sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  minHeight: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={imageUrl || `${BASE}/product/p-1.png`}
                  alt="Preview"
                  style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
                  }}
                />
              </div>
              <h5 className="fw-bold mb-1">
                {title || 'Untitled Product'}{' '}
                <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>
                  ({currentCategoryName})
                </span>
              </h5>
              <div className="d-flex align-items-center gap-2 mt-2 mb-3">
                {compareAtPrice ? (
                  <span className="text-muted text-decoration-line-through">${Number(compareAtPrice).toFixed(2)}</span>
                ) : null}
                <span className="fw-bold fs-18 text-dark">
                  ${price ? Number(price).toFixed(2) : '0.00'}
                </span>
                {discountPercent ? (
                  <span className="badge bg-danger-subtle text-danger">{discountPercent}% Off</span>
                ) : null}
              </div>
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Sizes:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {selectedSizes.map((s) => (
                    <span key={s} className="badge bg-light text-dark border" style={{ padding: '6px 10px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="fw-bold mb-2">Status:</h6>
                <span
                  className={`badge ${
                    status === 'active' ? 'bg-success-subtle text-success' :
                    status === 'draft' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'
                  } px-2 py-1 text-capitalize`}
                >
                  {status}
                </span>
              </div>
            </div>
            <div className="card-footer">
              <div className="row g-2">
                <div className="col-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <div className="col-6">
                  <Link
                    href="/admin/products"
                    className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right forms */}
        <div className="col-xl-9 col-lg-8">
          {/* Upload / Image URL */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:camera-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
                Product Imagery
              </h5>
            </div>
            <div className="card-body">
              <label className="form-label fw-medium">Product Image URL</label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <iconify-icon icon="solar:link-bold-duotone" style={{ color: '#ff6c2f' }}></iconify-icon>
                </span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              {imageUrl && (
                <div className="d-flex gap-3 flex-wrap mb-2">
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imageUrl}
                      alt="Product"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:box-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
                Product Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label className="form-label fw-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label fw-medium">Category</label>
                  <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-medium">SKU</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-3">
                <label className="form-label fw-medium">Available Sizes</label>
                <div className="d-flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`btn btn-sm ${selectedSizes.includes(s) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      style={{ minWidth: '42px' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-3">
                <label className="form-label fw-medium">Available Colors</label>
                <div className="d-flex flex-wrap gap-2">
                  {COLORS.map((c) => {
                    const active = selectedColors.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleColor(c.id)}
                        title={c.label}
                        className="btn btn-light btn-sm d-flex align-items-center justify-content-center p-0"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: active ? '2px solid #ff6c2f' : '1px solid #cbd5e1',
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: c.hex,
                            border: `1px solid ${c.border || '#ddd'}`,
                            display: 'inline-block',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-medium">Full Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed editorial product descriptions..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Short Highlights</label>
                <input
                  type="text"
                  className="form-control"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Handcrafted 18k solid gold with recycled ethical materials."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:tag-price-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
                Pricing Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label className="form-label fw-medium">Sale Price ($) *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <iconify-icon icon="solar:dollar-bold-duotone" style={{ fontSize: '18px', color: '#64748b' }}></iconify-icon>
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <label className="form-label fw-medium">Compare At Price ($)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <iconify-icon icon="solar:sale-bold-duotone" style={{ fontSize: '18px', color: '#64748b' }}></iconify-icon>
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="d-flex justify-content-end gap-2 mb-4">
            <Link href="/admin/products" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

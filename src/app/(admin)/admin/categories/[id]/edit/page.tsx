'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/types/category';

export default function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function loadCategory() {
      try {
        setLoading(true);
        const data = await apiClient.categories.get(categoryId);
        if (data) {
          setName(data.name || '');
          setSlug(data.slug || '');
          setDescription(data.description || '');
          setImageUrl(data.image || '');
          setProductCount(data.product_count ?? 0);
        }
      } catch (err: any) {
        toast.error('Failed to load category: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      await apiClient.categories.update(categoryId, {
        name: name.trim(),
        description: description.trim(),
        image: imageUrl.trim() || undefined,
      });
      toast.success('Category updated successfully!');
      router.push('/admin/categories');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading category...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <div className="row">
        {/* Left Column Preview */}
        <div className="col-lg-4 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div
                className="bg-light rounded text-center p-4 d-flex align-items-center justify-content-center overflow-hidden border"
                style={{ minHeight: '160px' }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="img-fluid"
                    style={{ maxHeight: '140px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://techzaa.in/larkon/admin/assets/images/product/p-1.png';
                    }}
                  />
                ) : (
                  <iconify-icon icon="solar:folder-with-files-bold-duotone" className="text-primary fs-48"></iconify-icon>
                )}
              </div>

              <div className="mt-3">
                <h5 className="mb-1 fw-semibold d-flex align-items-center gap-2">
                  <iconify-icon icon="solar:info-circle-bold-duotone" className="text-primary fs-18"></iconify-icon>
                  {name || 'Category'}
                </h5>

                <div className="row mt-3">
                  <div className="col-12 mb-2">
                    <p className="text-muted mb-0 fs-13">Created By :</p>
                    <h6 className="mb-0 fw-semibold">Admin</h6>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-0 fs-13">Stock / Items :</p>
                    <h6 className="mb-0 fw-semibold">{productCount}</h6>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-0 fs-13">Slug :</p>
                    <h6 className="mb-0 fw-semibold text-truncate">{slug}</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-light-subtle d-flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-fill btn-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/admin/categories" className="btn btn-outline-secondary flex-fill btn-sm">
                Cancel
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-8 col-xl-9">
          {/* Thumbnail / Image URL */}
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title mb-0">Category Image</h4>
            </div>
            <div className="card-body">
              <label className="form-label">Image URL</label>
              <div className="input-group">
                <span className="input-group-text">
                  <iconify-icon icon="solar:link-bold-duotone" className="text-primary"></iconify-icon>
                </span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <p className="text-muted mb-0 fs-13 mt-2">
                Provide a hosted direct image link for this category banner/thumbnail.
              </p>
            </div>
          </div>

          {/* General Info */}
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title mb-0">General Information</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label htmlFor="category-title" className="form-label">Category Title *</label>
                  <input
                    type="text"
                    id="category-title"
                    required
                    className="form-control"
                    placeholder="Enter Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-lg-6">
                  <label htmlFor="category-slug" className="form-label">Category Slug (Read Only)</label>
                  <input
                    type="text"
                    id="category-slug"
                    disabled
                    className="form-control bg-light"
                    value={slug}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="category-desc" className="form-label">Description</label>
                  <textarea
                    id="category-desc"
                    className="form-control"
                    rows={4}
                    placeholder="Enter category description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mb-4">
            <Link href="/admin/categories" className="btn btn-outline-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Update Category'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

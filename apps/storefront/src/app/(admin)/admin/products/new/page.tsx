'use client';

import { useState } from 'react';
import Link from 'next/link';

const COLORS = [
  { id: 'c-dark',   hex: '#1e293b', label: 'Dark' },
  { id: 'c-yellow', hex: '#f59e0b', label: 'Yellow' },
  { id: 'c-white',  hex: '#f8fafc', label: 'White', border: '#e2e8f0' },
  { id: 'c-red',    hex: '#ef4444', label: 'Red' },
];

const SIZES = ['S', 'M', 'L'];

export default function ProductAdd() {
  const [productType, setProductType] = useState('simple');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['c-dark']);

  // Toggle helpers for variant matrix
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <div className="row g-3">
      {/* ── Left Sidebar (Preview & Publishing) ── */}
      <div className="col-xl-3 col-lg-4">
        {/* Preview Card */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
              <img src="https://techzaa.in/larkon/admin/assets/images/product/p-1.png" alt="Preview" style={{ maxHeight: '160px', objectFit: 'contain' }} />
            </div>
            <h5 className="fw-bold mb-1">New Product <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>(Preview)</span></h5>
            <div className="d-flex align-items-center gap-2 mt-2">
              <span className="fw-bold fs-18 text-dark">$0.00</span>
            </div>
          </div>
        </div>

        {/* Publishing & Status Card */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:calendar-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Publishing
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Status</label>
              <select className="form-select">
                <option value="draft">Draft</option>
                <option value="active">Active (Published)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label fw-medium">Publish Date</label>
              <input type="datetime-local" className="form-control" />
              <div className="form-text">Leave empty to publish immediately upon saving.</div>
            </div>
          </div>
          <div className="card-footer">
            <div className="row g-2">
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <iconify-icon icon="solar:diskette-bold"></iconify-icon> Save
                </button>
              </div>
              <div className="col-6">
                <Link href="/admin/products" className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Organization */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:folder-with-files-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Organization
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Category</label>
              <select className="form-select">
                <option value="">Choose a category</option>
                {['Fashion', 'Electronics', 'Footwear', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Brand / Vendor</label>
              <input type="text" className="form-control" placeholder="e.g. Nike" />
            </div>
            <div className="mb-0">
              <label className="form-label fw-medium">Tags</label>
              <input type="text" className="form-control mb-2" placeholder="Add tags (comma separated)" />
              <div className="d-flex flex-wrap gap-1">
                <span className="badge bg-light text-dark border">Summer</span>
                <span className="badge bg-light text-dark border">New Arrival</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Forms ── */}
      <div className="col-xl-9 col-lg-8">
        
        {/* Core Product Info */}
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:box-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Basic Information
            </h5>
            <div style={{ width: '200px' }}>
              <select className="form-select border-primary text-primary fw-medium" value={productType} onChange={e => setProductType(e.target.value)}>
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
                <option value="digital">Digital Product</option>
                <option value="bundle">Product Bundle</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Product Name</label>
              <input type="text" className="form-control form-control-lg" placeholder="Short sleeve t-shirt" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Description</label>
              <textarea className="form-control" rows={5} placeholder="Full product description with HTML support..."></textarea>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:camera-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Product Media
            </h5>
          </div>
          <div className="card-body">
            <label style={{ display: 'block', border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '36px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#ff6c2f')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}>
              <input type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} />
              <div className="d-flex justify-content-center gap-3 mb-3">
                <iconify-icon icon="solar:gallery-add-bold-duotone" style={{ fontSize: '48px', color: '#ff6c2f' }}></iconify-icon>
                <iconify-icon icon="solar:video-frame-bold-duotone" style={{ fontSize: '48px', color: '#ff6c2f' }}></iconify-icon>
                <iconify-icon icon="solar:panorama-bold-duotone" style={{ fontSize: '48px', color: '#ff6c2f' }}></iconify-icon>
              </div>
              <p className="fw-bold mb-1">Drop your media here, or <span style={{ color: '#ff6c2f' }}>click to browse</span></p>
              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Supports Images (PNG/JPG), Video (MP4), and 360° views.</p>
            </label>
          </div>
        </div>

        {/* Pricing & Inventory (Simple Product) */}
        {productType === 'simple' && (
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:tag-price-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
                Pricing & Inventory
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Regular Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control" placeholder="0.00" />
                  </div>
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Sale Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control" placeholder="0.00" />
                  </div>
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Tax Status</label>
                  <select className="form-select">
                    <option>Taxable</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="col-lg-6 mt-4">
                  <label className="form-label fw-medium">SKU (Stock Keeping Unit)</label>
                  <input type="text" className="form-control" placeholder="e.g. TSHIRT-BLK-M" />
                </div>
                <div className="col-lg-6 mt-4">
                  <label className="form-label fw-medium">Stock Quantity</label>
                  <input type="number" className="form-control" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variants Matrix (Variable Product) */}
        {productType === 'variable' && (
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:layers-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
                Variant Matrix
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark">1. Select Sizes</label>
                  <div className="d-flex flex-wrap gap-2">
                    {SIZES.map(s => (
                      <div key={s}>
                        <input type="checkbox" className="btn-check" id={`sz-${s}`} checked={selectedSizes.includes(s)} onChange={() => toggleSize(s)} />
                        <label className="btn btn-outline-secondary btn-sm" htmlFor={`sz-${s}`} style={{ minWidth: '42px' }}>{s}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark">2. Select Colors</label>
                  <div className="d-flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <div key={c.id} title={c.label}>
                        <input type="checkbox" className="btn-check" id={`col-${c.id}`} checked={selectedColors.includes(c.id)} onChange={() => toggleColor(c.id)} />
                        <label htmlFor={`col-${c.id}`} className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', border: selectedColors.includes(c.id) ? '2px solid #ff6c2f' : '1px solid #ddd' }}>
                          <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.hex, border: `1px solid ${c.border || 'transparent'}`, display: 'inline-block' }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSizes.length > 0 && selectedColors.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0 text-center">
                    <thead className="bg-light">
                      <tr>
                        <th>Variant</th>
                        <th>SKU</th>
                        <th>Price ($)</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSizes.flatMap(s => selectedColors.map(c => {
                        const colorLabel = COLORS.find(col => col.id === c)?.label;
                        return (
                          <tr key={`${s}-${c}`}>
                            <td className="fw-medium text-start ps-3">
                              <span className="badge bg-secondary-subtle text-secondary me-2">{s}</span>
                              <span className="badge bg-secondary-subtle text-secondary">{colorLabel}</span>
                            </td>
                            <td><input type="text" className="form-control form-control-sm mx-auto" placeholder={`SKU-${s}-${colorLabel?.toUpperCase()}`} style={{ maxWidth: '150px' }} /></td>
                            <td><input type="number" className="form-control form-control-sm mx-auto" placeholder="0.00" style={{ maxWidth: '100px' }} /></td>
                            <td><input type="number" className="form-control form-control-sm mx-auto" placeholder="0" style={{ maxWidth: '100px' }} /></td>
                            <td><button className="btn btn-soft-danger btn-sm"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></button></td>
                          </tr>
                        );
                      }))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Digital Product Details */}
        {productType === 'digital' && (
          <div className="card mb-3 border-info">
            <div className="card-header bg-info-subtle border-info">
              <h5 className="card-title text-info mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:cloud-download-bold-duotone" style={{ fontSize: '20px' }}></iconify-icon>
                Digital Assets & Licensing
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label fw-medium">Upload File</label>
                <input className="form-control" type="file" />
                <div className="form-text">Upload the software, PDF, or zip file the customer will receive.</div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="licenseGen" defaultChecked />
                  <label className="form-check-label fw-bold text-dark" htmlFor="licenseGen">Enable License Key Generation</label>
                </div>
                <p className="text-muted fs-13 mb-0">Automatically generate and assign a unique license key to the customer upon purchase.</p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Attributes */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:checklist-minimalistic-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Custom Attributes
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-2 align-items-center mb-2">
              <div className="col-4 fw-medium text-muted">Attribute Name</div>
              <div className="col-7 fw-medium text-muted">Value(s)</div>
              <div className="col-1"></div>
            </div>
            <div className="row g-2 align-items-center mb-2">
              <div className="col-4"><input type="text" className="form-control" defaultValue="Material" /></div>
              <div className="col-7"><input type="text" className="form-control" defaultValue="100% Cotton" /></div>
              <div className="col-1"><button className="btn btn-soft-danger w-100"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></button></div>
            </div>
            <div className="row g-2 align-items-center mb-3">
              <div className="col-4"><input type="text" className="form-control" defaultValue="Care Instructions" /></div>
              <div className="col-7"><input type="text" className="form-control" defaultValue="Machine wash cold" /></div>
              <div className="col-1"><button className="btn btn-soft-danger w-100"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></button></div>
            </div>
            <button className="btn btn-soft-primary btn-sm"><iconify-icon icon="solar:add-circle-line-duotone" className="me-1"></iconify-icon> Add Attribute</button>
          </div>
        </div>

        {/* Linked Products */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:link-circle-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Linked Products
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark">Upsells</label>
                <input type="text" className="form-control mb-2" placeholder="Search products to upsell..." />
                <div className="form-text mt-0">Products shown instead of the current one to encourage a more profitable upgrade.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark">Cross-sells</label>
                <input type="text" className="form-control mb-2" placeholder="Search products to cross-sell..." />
                <div className="form-text mt-0">Products shown in the cart based on the current product.</div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:global-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Search Engine Optimization (SEO)
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Page Title</label>
              <input type="text" className="form-control" placeholder="SEO Title (defaults to product name)" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Meta Description</label>
              <textarea className="form-control" rows={3} placeholder="Brief description for search engine results..."></textarea>
            </div>
            <div className="mb-0">
              <label className="form-label fw-medium">URL Slug</label>
              <div className="input-group">
                <span className="input-group-text">https://yoursite.com/products/</span>
                <input type="text" className="form-control" placeholder="product-name" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

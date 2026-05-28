'use client';

import Link from 'next/link';

const COLORS = [
  { id: 'e-dark',   hex: '#1e293b', label: 'Dark' },
  { id: 'e-yellow', hex: '#f59e0b', label: 'Yellow' },
  { id: 'e-white',  hex: '#f8fafc', label: 'White', border: '#e2e8f0' },
  { id: 'e-red',    hex: '#ef4444', label: 'Red' },
  { id: 'e-green',  hex: '#22c55e', label: 'Green' },
  { id: 'e-blue',   hex: '#3b82f6', label: 'Blue' },
  { id: 'e-sky',    hex: '#06b6d4', label: 'Sky' },
  { id: 'e-gray',   hex: '#94a3b8', label: 'Gray' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductEdit() {
  return (
    <div className="row g-3">
      {/* ── Left sidebar preview ── */}
      <div className="col-xl-3 col-lg-4">
        <div className="card">
          <div className="card-body">
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
              <img src="https://techzaa.in/larkon/admin/assets/images/product/p-1.png" alt="Preview" style={{ maxHeight: '160px', objectFit: 'contain' }} />
            </div>
            <h5 className="fw-bold mb-1">Men Black Slim Fit T-shirt <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>(Fashion)</span></h5>
            <div className="d-flex align-items-center gap-2 mt-2 mb-3">
              <span className="text-muted text-decoration-line-through">$100</span>
              <span className="fw-bold fs-18 text-dark">$80</span>
              <span className="badge bg-danger-subtle text-danger">30% Off</span>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold mb-2">Sizes:</h6>
              <div className="d-flex flex-wrap gap-1">
                {['S', 'M', 'XL', 'XXL'].map(s => (
                  <span key={s} className="badge bg-light text-dark border" style={{ padding: '6px 10px' }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h6 className="fw-bold mb-2">Colors:</h6>
              <div className="d-flex gap-1">
                {COLORS.slice(0, 4).map(c => (
                  <span key={c.id} title={c.label} style={{ width: '22px', height: '22px', borderRadius: '50%', background: c.hex, border: `1.5px solid ${c.border || c.hex}`, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="row g-2">
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon> Save
                </button>
              </div>
              <div className="col-6">
                <Link href="/admin/products" className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2">
                  <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right forms ── */}
      <div className="col-xl-9 col-lg-8">
        {/* Upload */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:camera-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Product Photos
            </h5>
          </div>
          <div className="card-body">
            {/* Existing images */}
            <div className="d-flex gap-3 flex-wrap mb-3">
              {['p-1.png', 'p-10.png', 'p-13.png'].map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={`https://techzaa.in/larkon/admin/assets/images/product/${img}`} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <button style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>×</button>
                </div>
              ))}
              <label style={{ width: '80px', height: '80px', border: '2px dashed #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', color: '#94a3b8', flexDirection: 'column', gap: '4px', fontSize: '12px' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#ff6c2f')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
                <iconify-icon icon="solar:add-circle-bold" style={{ fontSize: '24px', color: '#ff6c2f' }}></iconify-icon>
                Add
              </label>
            </div>
            <label style={{ display: 'block', border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#ff6c2f')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}>
              <input type="file" multiple accept="image/*" style={{ display: 'none' }} />
              <iconify-icon icon="solar:cloud-upload-bold-duotone" style={{ fontSize: '40px', color: '#ff6c2f', display: 'block', marginBottom: '8px' }}></iconify-icon>
              <p className="fw-medium mb-0">Drop new images here, or <span style={{ color: '#ff6c2f' }}>click to browse</span></p>
            </label>
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
                <label className="form-label fw-medium">Product Name</label>
                <input type="text" className="form-control" defaultValue="Men Black Slim Fit T-shirt" />
              </div>
              <div className="col-lg-6">
                <label className="form-label fw-medium">Category</label>
                <select className="form-select" defaultValue="Fashion">
                  <option value="">Choose a category</option>
                  {['Fashion', 'Electronics', 'Footwear', 'Sportswear', 'Watches', 'Furniture', 'Appliances', 'Headphones'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Brand</label>
                <input type="text" className="form-control" defaultValue="Larkon Fashion" />
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Weight</label>
                <input type="text" className="form-control" defaultValue="300g" />
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Gender</label>
                <select className="form-select" defaultValue="Men">
                  <option value="">Select gender</option>
                  <option>Men</option><option>Women</option><option>Unisex</option>
                </select>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-3">
              <label className="form-label fw-medium">Available Sizes</label>
              <div className="d-flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <div key={s}>
                    <input type="checkbox" className="btn-check" id={`e-sz-${i}`} defaultChecked={['S','M','XL','XXL'].includes(s)} />
                    <label className="btn btn-outline-secondary btn-sm" htmlFor={`e-sz-${i}`} style={{ minWidth: '42px' }}>{s}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-3">
              <label className="form-label fw-medium">Available Colors</label>
              <div className="d-flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <div key={c.id} title={c.label}>
                    <input type="checkbox" className="btn-check" id={c.id} defaultChecked={['e-dark','e-yellow','e-white','e-red'].includes(c.id)} />
                    <label htmlFor={c.id} className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.hex, border: `1px solid ${c.border || '#ddd'}`, display: 'inline-block' }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-medium">Description</label>
              <textarea className="form-control" rows={5} defaultValue="Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders, long sleeves and ribbing around the neckline, cuffs and hem."></textarea>
            </div>

            <div className="row g-3">
              <div className="col-lg-4">
                <label className="form-label fw-medium">Tag Number</label>
                <input type="number" className="form-control" defaultValue="36294007" />
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Stock</label>
                <input type="number" className="form-control" defaultValue="465" />
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Tags</label>
                <select className="form-select" multiple defaultValue={['Fashion']}>
                  {['Fashion', 'Electronics', 'Watches', 'Headphones'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
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
              <div className="col-lg-4">
                <label className="form-label fw-medium">Price</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <iconify-icon icon="solar:dollar-bold-duotone" style={{ fontSize: '18px', color: '#64748b' }}></iconify-icon>
                  </span>
                  <input type="number" className="form-control" defaultValue="80" />
                </div>
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Discount (%)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <iconify-icon icon="solar:sale-bold-duotone" style={{ fontSize: '18px', color: '#64748b' }}></iconify-icon>
                  </span>
                  <input type="number" className="form-control" defaultValue="30" />
                </div>
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-medium">Tax (%)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <iconify-icon icon="solar:bill-list-bold-duotone" style={{ fontSize: '18px', color: '#64748b' }}></iconify-icon>
                  </span>
                  <input type="number" className="form-control" defaultValue="3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light d-flex align-items-center gap-2">
            <iconify-icon icon="solar:restart-bold"></iconify-icon> Reset
          </button>
          <Link href="/admin/products" className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Back
          </Link>
          <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
            <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

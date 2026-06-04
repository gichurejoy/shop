'use client';

import { useState } from 'react';
import Link from 'next/link';

const IMAGES = [
  'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-10.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-13.png',
  'https://techzaa.in/larkon/admin/assets/images/product/p-14.png',
];

const COLORS = [
  { id: 'dark',   label: 'Dark',   hex: '#1e293b' },
  { id: 'yellow', label: 'Yellow', hex: '#f59e0b' },
  { id: 'white',  label: 'White',  hex: '#f8fafc', border: '#e2e8f0' },
  { id: 'green',  label: 'Green',  hex: '#22c55e' },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const REVIEWS = [
  { name: 'Josephine Thompson', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg', rating: 5, date: '10 Jan, 2024', text: 'Excellent quality! The fabric is super soft and the fit is perfect. Will definitely buy again.' },
  { name: 'Anna M. Hines', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-3.jpg', rating: 4, date: '05 Jan, 2024', text: 'Great product overall. The color is exactly as shown in the pictures. Fast delivery too!' },
  { name: 'Peter Smith', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg', rating: 4, date: '28 Dec, 2023', text: 'Good value for money. Fits true to size. The material is comfortable for all-day wear.' },
];

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b', fontSize: '16px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <iconify-icon key={i} icon={i < Math.floor(count) ? 'solar:star-bold' : i < count ? 'solar:star-half-bold' : 'solar:star-linear'} />
      ))}
    </span>
  );
}

export default function ProductDetails() {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('dark');
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div>
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-3 text-muted" style={{ fontSize: '13px' }}>
        <Link href="/admin" className="text-muted text-decoration-none">Dashboard</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <Link href="/admin/products" className="text-muted text-decoration-none">Products</Link>
        <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
        <span className="text-dark fw-medium">Men Black Slim Fit T-shirt</span>
      </div>

      <div className="row g-3">
        {/* ── Left: Image gallery ── */}
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              {/* Main image */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', overflow: 'hidden' }}>
                <img src={IMAGES[activeImg]} alt="product" style={{ maxHeight: '300px', maxWidth: '90%', objectFit: 'contain', transition: 'opacity 0.2s' }} />
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {IMAGES.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ padding: '4px', borderRadius: '8px', border: `2px solid ${activeImg === i ? '#ff6c2f' : '#e2e8f0'}`, background: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="card-footer border-top">
              <div className="row g-2">
                <div className="col-5">
                  <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                    <iconify-icon icon="solar:cart-large-4-bold-duotone" style={{ fontSize: '18px' }}></iconify-icon> Add To Cart
                  </button>
                </div>
                <div className="col-5">
                  <button className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2">
                    <iconify-icon icon="solar:bag-smile-bold-duotone" style={{ fontSize: '18px' }}></iconify-icon> Buy Now
                  </button>
                </div>
                <div className="col-2">
                  <button onClick={() => setWishlisted(!wishlisted)} className={`btn w-100 d-flex align-items-center justify-content-center fs-20 ${wishlisted ? 'btn-danger' : 'btn-soft-danger'}`}>
                    <iconify-icon icon={wishlisted ? 'solar:heart-bold' : 'solar:heart-broken'}></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Product info ── */}
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-body">
              {/* Badge + title */}
              <span className="badge bg-success text-white fs-12 mb-2">New Arrival</span>
              <h4 className="fw-bold mb-1">Men Black Slim Fit T-shirt</h4>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <Stars count={4.5} />
                <span className="fw-medium text-dark">4.5</span>
                <span className="text-muted">(55 Reviews)</span>
              </div>

              {/* Price */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <h2 className="fw-bold mb-0" style={{ color: '#ff6c2f' }}>$80.00</h2>
                <span className="text-muted text-decoration-line-through fs-16">$100.00</span>
                <span className="badge bg-danger-subtle text-danger">30% Off</span>
              </div>

              <hr />

              {/* Color selector */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">
                  Color: <span className="text-muted fw-normal">{COLORS.find(c => c.id === selectedColor)?.label}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c.id} onClick={() => setSelectedColor(c.id)} title={c.label} style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.hex, border: selectedColor === c.id ? '3px solid #ff6c2f' : `2px solid ${c.border || c.hex}`, cursor: 'pointer', outline: selectedColor === c.id ? '2px solid #ff6c2f' : 'none', outlineOffset: '2px', transition: 'all 0.15s' }} />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">
                  Size: <span className="text-muted fw-normal">{selectedSize}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{ width: '42px', height: '42px', borderRadius: '8px', border: selectedSize === s ? '2px solid #ff6c2f' : '1px solid #e2e8f0', background: selectedSize === s ? '#ff6c2f' : '#fff', color: selectedSize === s ? '#fff' : '#334155', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Quantity:</h6>
                <div className="d-flex align-items-center gap-0" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', width: 'fit-content', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '40px', border: 'none', background: '#f8fafc', fontSize: '20px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ width: '48px', textAlign: 'center', fontWeight: 700, fontSize: '15px' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: '40px', height: '40px', border: 'none', background: '#f8fafc', fontSize: '20px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              {/* Product info list */}
              <ul className="list-unstyled mb-3" style={{ fontSize: '14px' }}>
                <li className="d-flex align-items-center gap-2 mb-1">
                  <iconify-icon icon="solar:check-circle-bold-duotone" style={{ color: '#22c55e', fontSize: '18px' }}></iconify-icon>
                  <span>In Stock — Ready to ship</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-1">
                  <iconify-icon icon="solar:check-circle-bold-duotone" style={{ color: '#22c55e', fontSize: '18px' }}></iconify-icon>
                  <span>Free delivery available</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-1">
                  <iconify-icon icon="solar:tag-price-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
                  <span>Sales 10% Off — Use Code: <strong>CODE123</strong></span>
                </li>
              </ul>

              {/* Available offers */}
              <h6 className="fw-bold mb-2">Available Offers:</h6>
              <div className="d-flex align-items-start gap-3 mb-2 p-3 rounded" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <iconify-icon icon="solar:bookmark-bold-duotone" style={{ color: '#22c55e', fontSize: '22px', flexShrink: 0, marginTop: '2px' }}></iconify-icon>
                <p className="mb-0" style={{ fontSize: '13px' }}><strong>Bank Offer</strong> — 10% instant discount on Bank Debit Cards, up to $30 on orders of $50 and above</p>
              </div>
              <div className="d-flex align-items-start gap-3 p-3 rounded" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <iconify-icon icon="solar:bookmark-bold-duotone" style={{ color: '#f59e0b', fontSize: '22px', flexShrink: 0, marginTop: '2px' }}></iconify-icon>
                <p className="mb-0" style={{ fontSize: '13px' }}><strong>Exclusive Offer</strong> — Grab our exclusive offer now and save 20% on your next purchase!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shipping info banner ── */}
      <div className="card mt-3">
        <div className="card-body">
          <div className="row g-3">
            {[
              { icon: 'solar:kick-scooter-bold-duotone', color: '#3b82f6', title: 'Free shipping for all orders over $200', sub: 'Only in this week' },
              { icon: 'solar:ticket-bold-duotone', color: '#22c55e', title: 'Special discounts for customers', sub: 'Coupons up to $100' },
              { icon: 'solar:gift-bold-duotone', color: '#f59e0b', title: 'Get a gift voucher for every order', sub: 'With products over $500' },
              { icon: 'solar:headphones-round-sound-bold-duotone', color: '#ef4444', title: '24/7 support center', sub: 'Live chat & phone support' },
            ].map((item, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: item.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon={item.icon} style={{ fontSize: '26px', color: item.color }}></iconify-icon>
                  </div>
                  <div>
                    <p className="fw-medium mb-0" style={{ fontSize: '13px', color: '#1e293b' }}>{item.title}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specs / Reviews ── */}
      <div className="card mt-3">
        <div className="card-header p-0">
          <div className="d-flex border-bottom">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specifications', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${REVIEWS.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: '14px 24px', border: 'none', background: 'transparent', fontWeight: activeTab === tab.key ? 700 : 500, color: activeTab === tab.key ? '#ff6c2f' : '#64748b', borderBottom: activeTab === tab.key ? '3px solid #ff6c2f' : '3px solid transparent', cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s' }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {/* Description */}
          {activeTab === 'description' && (
            <div>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders, long sleeves and ribbing around the neckline, cuffs and hem. Small metal text applique.</p>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>The versatile black slim-fit T-shirt is a wardrobe essential. Crafted from premium 100% organic cotton, it offers unparalleled comfort and style. The slim-fit design flatters all body types while the classic crew neck adds a timeless touch.</p>
              <div className="row g-3 mt-2">
                {[
                  { icon: 'solar:leaf-bold-duotone', color: '#22c55e', title: '100% Organic Cotton', sub: 'Eco-friendly materials' },
                  { icon: 'solar:washing-machine-bold-duotone', color: '#3b82f6', title: 'Machine Washable', sub: 'Easy care instructions' },
                  { icon: 'solar:medal-ribbons-star-bold-duotone', color: '#f59e0b', title: 'Premium Quality', sub: 'Durable and long-lasting' },
                  { icon: 'solar:delivery-bold-duotone', color: '#8b5cf6', title: 'Fast Delivery', sub: '2-3 business days' },
                ].map((f, i) => (
                  <div key={i} className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#f8fafc' }}>
                      <iconify-icon icon={f.icon} style={{ fontSize: '28px', color: f.color, flexShrink: 0 }}></iconify-icon>
                      <div>
                        <p className="fw-bold mb-0" style={{ fontSize: '14px' }}>{f.title}</p>
                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{f.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'specifications' && (
            <div className="table-responsive">
              <table className="table table-bordered mb-0" style={{ fontSize: '14px' }}>
                <tbody>
                  {[
                    ['Brand', 'Waveron Apparel'], ['Material', '100% Organic Cotton'], ['Weight', '180 GSM'],
                    ['Fit', 'Slim Fit'], ['Neck Style', 'Crew Neck'], ['Sleeve', 'Short Sleeve'],
                    ['Available Colors', 'Dark, Yellow, White, Green'], ['Available Sizes', 'XS, S, M, L, XL, XXL'],
                    ['Country of Origin', 'Bangladesh'], ['SKU', 'MBT-001-BLK'],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="fw-medium bg-light-subtle" style={{ width: '200px' }}>{k}</td>
                      <td className="text-muted">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div>
              {/* Rating summary */}
              <div className="row g-3 mb-4">
                <div className="col-md-3 text-center">
                  <div style={{ fontSize: '56px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>4.5</div>
                  <Stars count={4.5} />
                  <p className="text-muted mt-1 mb-0" style={{ fontSize: '13px' }}>Based on 55 reviews</p>
                </div>
                <div className="col-md-9">
                  {[['5', 72], ['4', 18], ['3', 6], ['2', 2], ['1', 2]].map(([star, pct]) => (
                    <div key={star} className="d-flex align-items-center gap-2 mb-2">
                      <span style={{ width: '20px', fontSize: '13px', color: '#64748b' }}>{star}</span>
                      <iconify-icon icon="solar:star-bold" style={{ color: '#f59e0b', fontSize: '14px' }}></iconify-icon>
                      <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#94a3b8', width: '30px' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              {REVIEWS.map((r, i) => (
                <div key={i} className={i < REVIEWS.length - 1 ? 'border-bottom pb-3 mb-3' : ''}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <img src={r.avatar} alt={r.name} className="rounded-circle" style={{ width: '44px', height: '44px' }} />
                    <div>
                      <p className="fw-bold mb-0" style={{ fontSize: '14px' }}>{r.name}</p>
                      <div className="d-flex align-items-center gap-2">
                        <Stars count={r.rating} />
                        <span className="text-muted" style={{ fontSize: '12px' }}>{r.date}</span>
                      </div>
                    </div>
                    <span className="ms-auto badge bg-success-subtle text-success">Verified Purchase</span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.7' }}>{r.text}</p>
                </div>
              ))}

              <button className="btn btn-outline-primary mt-3">Write a Review</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Related products ── */}
      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title mb-0">Related Products</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {[
              { id: 2, name: 'Olive Green Leather Bag', price: 136, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png', rating: 4.1 },
              { id: 3, name: 'Women Golden Dress', price: 219, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-3.png', rating: 4.4 },
              { id: 5, name: 'Cargo Pants', price: 98, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-5.png', rating: 4.3 },
              { id: 8, name: 'Brown Leather Wallet', price: 72, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-8.png', rating: 4.0 },
            ].map(p => (
              <div key={p.id} className="col-6 col-md-3">
                <Link href={`/admin/products/${p.id}`} className="text-decoration-none">
                  <div className="card h-100" style={{ cursor: 'pointer' }}>
                    <div style={{ background: '#f8fafc', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
                      <img src={p.img} alt={p.name} style={{ maxHeight: '110px', objectFit: 'contain' }} />
                    </div>
                    <div className="card-body p-2">
                      <p className="fw-medium mb-1 text-dark" style={{ fontSize: '13px' }}>{p.name}</p>
                      <Stars count={p.rating} />
                      <p className="fw-bold text-primary mb-0">${p.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

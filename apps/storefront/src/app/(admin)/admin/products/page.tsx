'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  { id: 1, name: 'Men Black Slim Fit T-shirt', sizes: 'S, M, L, XL', price: 80, stock: 142, category: 'Fashion', rating: 4.5, status: 'Published', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png' },
  { id: 2, name: 'Olive Green Leather Bag', sizes: 'Standard', price: 136, stock: 58, category: 'Fashion', rating: 4.1, status: 'Published', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png' },
  { id: 3, name: 'Women Golden Dress', sizes: 'XS, S, M', price: 219, stock: 0, category: 'Fashion', rating: 4.4, status: 'Draft', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-3.png' },
  { id: 4, name: 'Gray Cap For Men', sizes: 'One Size', price: 76, stock: 321, category: 'Accessories', rating: 4.2, status: 'Published', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png' },
  { id: 5, name: 'Cargo Pants', sizes: 'S, M, L, XL, XXL', price: 98, stock: 74, category: 'Fashion', rating: 4.3, status: 'Published', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-5.png' },
  { id: 6, name: 'Wireless Headphones', sizes: 'Standard', price: 159, stock: 33, category: 'Electronics', rating: 4.6, status: 'Archived', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-6.png' },
  { id: 7, name: 'Running Sneakers', sizes: '7, 8, 9, 10, 11', price: 144, stock: 0, category: 'Footwear', rating: 4.5, status: 'Draft', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-7.png' },
  { id: 8, name: 'Brown Leather Wallet', sizes: 'Standard', price: 72, stock: 207, category: 'Accessories', rating: 4.0, status: 'Published', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-8.png' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '1px', color: '#f59e0b', fontSize: '12px' }}>
      {[1,2,3,4,5].map(i => (
        <iconify-icon key={i} icon={i <= Math.floor(rating) ? 'solar:star-bold' : 'solar:star-linear'} />
      ))}
      <span style={{ marginLeft: '4px', color: '#64748b', fontSize: '12px' }}>{rating}</span>
    </span>
  );
}

function RowActions({ productId }: { productId: number }) {
  return (
    <div className="d-flex gap-2">
      <Link href={`/admin/products/${productId}`} className="btn btn-light btn-sm" title="View"><iconify-icon className="align-middle fs-18" icon="solar:eye-broken" /></Link>
      <Link href={`/admin/products/${productId}/edit`} className="btn btn-soft-primary btn-sm" title="Edit"><iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken" /></Link>
      <button className="btn btn-soft-secondary btn-sm" title="Duplicate" onClick={() => alert(`Clone product #${productId}?`)}><iconify-icon className="align-middle fs-18" icon="solar:copy-broken" /></button>
      <button className="btn btn-soft-danger btn-sm" title="Delete" onClick={() => alert(`Delete product #${productId}? (demo)`)}><iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken" /></button>
    </div>
  );
}



export default function ProductsListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  const toggleOne = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>All Products</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {selected.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginRight: '8px' }}>{selected.length} selected</span>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: '12px', padding: '4px 8px' }}>
                <iconify-icon icon="solar:tag-price-bold" /> Edit Price
              </button>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: '12px', padding: '4px 8px' }}>
                <iconify-icon icon="solar:box-bold" /> Edit Stock
              </button>
              <select className="form-select form-select-sm" style={{ width: '130px', fontSize: '12px', padding: '4px 8px', borderColor: '#cbd5e1' }}>
                <option value="">Change Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <button className="btn btn-sm btn-soft-danger d-flex align-items-center gap-1" style={{ fontSize: '12px', padding: '4px 8px' }}>
                <iconify-icon icon="solar:trash-bin-minimalistic-bold" /> Delete
              </button>
            </div>
          ) : (
            <>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="search" placeholder="Search products..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '8px 14px 8px 34px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', fontSize: '13px', width: '220px', outline: 'none',
                  }}
                />
                <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px', display: 'flex' }}>
                  <iconify-icon icon="solar:magnifer-linear" />
                </span>
              </div>
              <button className="btn btn-light" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <iconify-icon icon="solar:import-bold-duotone" /> Import CSV
              </button>
              <Link
                href="/admin/products/grid"
                style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#334155', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <iconify-icon icon="solar:widget-5-bold-duotone" /> Grid View
              </Link>
              <Link
                href="/admin/products/new"
                style={{ padding: '8px 14px', borderRadius: '8px', background: '#ff6c2f', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <iconify-icon icon="solar:add-circle-bold" /> Add Product
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', width: '40px' }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ accentColor: '#ff6c2f', cursor: 'pointer' }} />
              </th>
              {['Product', 'Price', 'Stock', 'Category', 'Rating', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderTop: '1px solid #f1f5f9',
                  background: selected.includes(p.id) ? '#fff7ed' : i % 2 === 0 ? '#fff' : '#fafafa',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!selected.includes(p.id)) (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!selected.includes(p.id)) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#fff' : '#fafafa'; }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} style={{ accentColor: '#ff6c2f', cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={p.img} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/44?text=P'; }} />
                    </div>
                    <div>
                      <Link href={`/admin/products/${p.id}`} style={{ fontWeight: 600, color: '#1e40af', textDecoration: 'none', display: 'block' }}>{p.name}</Link>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sizes: {p.sizes}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>${p.price}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ color: p.stock === 0 ? '#ef4444' : p.stock < 50 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{p.category}</td>
                <td style={{ padding: '14px 16px' }}><StarRating rating={p.rating} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: p.status === 'Published' ? '#dcfce7' : p.status === 'Archived' ? '#f1f5f9' : '#fef3c7',
                    color: p.status === 'Published' ? '#16a34a' : p.status === 'Archived' ? '#64748b' : '#d97706',
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}><RowActions productId={p.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
        <span>Showing {filtered.length} of {PRODUCTS.length} products</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,'...', 10].map((p, i) => (
            <button key={i} style={{
              padding: '5px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
              background: p === 1 ? '#ff6c2f' : '#fff', color: p === 1 ? '#fff' : '#64748b',
              cursor: 'pointer', fontSize: '13px', fontWeight: p === 1 ? 600 : 400,
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

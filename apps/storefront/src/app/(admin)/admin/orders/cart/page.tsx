'use client';

import { useState } from 'react';
import Link from 'next/link';

const CART_ITEMS = [
  { id: 1, name: 'Men Black Slim Fit T-shirt', size: 'M', color: 'Black', price: 80, qty: 2, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png' },
  { id: 2, name: 'Olive Green Leather Bag', size: 'Standard', color: 'Olive', price: 136, qty: 1, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png' },
  { id: 3, name: 'Gray Cap For Men', size: 'One Size', color: 'Gray', price: 76, qty: 1, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png' },
];

export default function OrderCartPage() {
  const [items, setItems] = useState(CART_ITEMS.map(i => ({ ...i })));
  const [coupon, setCoupon] = useState('');

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 15;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          <Link href="/admin/orders" style={{ color: '#64748b', textDecoration: 'none' }}>Orders</Link> › <span style={{ color: '#ff6c2f' }}>Cart</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Shopping Cart</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Cart table */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
            Cart Items ({items.length})
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['Product', 'Size / Color', 'Unit Price', 'Quantity', 'Total', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.img} style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 16px', color: '#64748b' }}>
                    <div style={{ fontSize: '12px' }}>{item.size}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.color}</div>
                  </td>
                  <td style={{ padding: '16px 16px', color: '#64748b' }}>${item.price}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: '30px', height: '30px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>−</button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: '30px', height: '30px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: '16px 16px', fontWeight: 700, color: '#0f172a' }}>${item.price * item.qty}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <button onClick={() => removeItem(item.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#dc2626', fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
            <Link href="/admin/products" style={{ padding: '9px 18px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#334155', textDecoration: 'none', fontSize: '13px' }}>
              ← Continue Shopping
            </Link>
            <Link href="/admin/orders/checkout" style={{ padding: '9px 18px', borderRadius: '8px', background: '#ff6c2f', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Proceed to Checkout →
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Order Summary</div>
          <div style={{ padding: '20px' }}>
            {[['Subtotal', `$${subtotal}`], ['Shipping', `$${shipping}`], ['Tax (10%)', `$${tax}`]].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#0f172a', padding: '12px 0', borderTop: '1px solid #e2e8f0', marginTop: '4px' }}>
              <span>Total</span><span style={{ color: '#ff6c2f' }}>${total}</span>
            </div>
            {/* Coupon */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Coupon Code</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter code..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
                <button style={{ padding: '8px 14px', borderRadius: '8px', background: '#0f172a', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Apply</button>
              </div>
            </div>
            <Link href="/admin/orders/checkout" style={{ display: 'block', marginTop: '16px', padding: '11px', borderRadius: '8px', background: '#ff6c2f', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

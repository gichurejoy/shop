'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types/product';

interface ICartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  img: string;
}

export default function OrderCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<IProduct[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');

  useEffect(() => {
    // Load from sessionStorage if available, else load initial from MySQL
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('admin_pos_cart') : null;
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    } else {
      apiClient.products.list({ limit: 4 }).then((res) => {
        const prods = res.products || [];
        setCatalogProducts(prods);
        if (prods.length > 0) {
          const initialItems: ICartItem[] = prods.slice(0, 2).map((p) => ({
            id: `ci-${p.id}`,
            productId: p.id,
            name: p.title,
            size: 'Standard',
            color: 'Default',
            price: p.price,
            qty: 1,
            img: p.images?.[0] || 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
          }));
          setItems(initialItems);
          sessionStorage.setItem('admin_pos_cart', JSON.stringify(initialItems));
        }
      });
    }

    // Load full catalog for item picker
    apiClient.products.list({ limit: 50 }).then((res) => {
      const prods = res.products || [];
      setCatalogProducts(prods);
      if (prods.length > 0) {
        setSelectedProductToAdd(prods[0].id);
      }
    });
  }, []);

  const saveCart = (newItems: ICartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_pos_cart', JSON.stringify(newItems));
    }
  };

  const updateQty = (id: string, delta: number) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveCart(updated);
  };

  const handleAddProduct = () => {
    const prod = catalogProducts.find((p) => p.id === selectedProductToAdd);
    if (!prod) return;

    const existing = items.find((i) => i.productId === prod.id);
    if (existing) {
      updateQty(existing.id, 1);
    } else {
      const newItem: ICartItem = {
        id: `ci-${prod.id}-${Date.now()}`,
        productId: prod.id,
        name: prod.title,
        size: 'Standard',
        color: 'Default',
        price: prod.price,
        qty: 1,
        img: prod.images?.[0] || 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',
      };
      saveCart([...items, newItem]);
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = items.length > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleProceed = () => {
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before proceeding.');
      return;
    }
    router.push('/admin/orders/checkout');
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <div className="text-muted fs-13 mb-1">
            <Link href="/admin/orders" className="text-muted text-decoration-none">Orders</Link> › <span className="text-primary">Admin POS Cart</span>
          </div>
          <h3 className="fw-bold text-dark mb-0">Admin Terminal Order Placement</h3>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <select
            className="form-select form-select-sm"
            style={{ minWidth: '240px' }}
            value={selectedProductToAdd}
            onChange={(e) => setSelectedProductToAdd(e.target.value)}
          >
            {catalogProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — ${Number(p.price).toFixed(2)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
            onClick={handleAddProduct}
          >
            <iconify-icon icon="solar:add-circle-bold" className="fs-16"></iconify-icon> Add to Cart
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Cart table */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Cart Items ({items.length})</h5>
              <span className="text-muted fs-13">Ready for order creation</span>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Product</th>
                    <th>Attributes</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No items in cart. Select a product above and click "Add to Cart".
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.img}
                              alt={item.name}
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <span className="fw-semibold text-dark">{item.name}</span>
                          </div>
                        </td>
                        <td className="text-muted fs-13">
                          <div>Size: <span className="text-dark">{item.size}</span></div>
                          <div>Color: <span className="text-dark">{item.color}</span></div>
                        </td>
                        <td className="fw-medium text-dark">${item.price.toFixed(2)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-0 px-2"
                              onClick={() => updateQty(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="fw-semibold text-dark px-1">{item.qty}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-0 px-2"
                              onClick={() => updateQty(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold text-dark">${(item.price * item.qty).toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-soft-danger"
                            onClick={() => removeItem(item.id)}
                            title="Remove"
                          >
                            <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary side */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header border-bottom">
              <h5 className="card-title mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal</span>
                <span className="fw-medium text-dark">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Shipping Fee</span>
                <span className="fw-medium text-dark">${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Estimated Tax (8%)</span>
                <span className="fw-medium text-dark">${tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between pt-3 border-top fs-16 fw-bold text-dark">
                <span>Total Amount</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 mt-4 py-2 fw-semibold"
                onClick={handleProceed}
                disabled={items.length === 0}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

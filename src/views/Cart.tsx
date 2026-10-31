"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingCart, Tag, Check } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, total } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await apiClient.coupons.apply(promoCode.trim(), subtotal);
      if (res.valid) {
        setDiscount(res.discountAmount);
        setAppliedCode(promoCode.trim().toUpperCase());
        setPromoMessage({ text: res.message, isError: false });
        toast.success(res.message);
      } else {
        setDiscount(0);
        setAppliedCode('');
        setPromoMessage({ text: res.message, isError: true });
        toast.error(res.message);
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to apply promo code';
      setPromoMessage({ text: msg, isError: true });
      toast.error(msg);
    }
  };

  const finalTotal = Math.max(0, total - discount);
  if (cartItems.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
              <ShoppingCart className="w-12 h-12 text-[#8B5A3C]" />
            </div>
            <h2
              className="text-2xl font-bold text-[#3D2817] mb-6"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              YOUR CART IS EMPTY
            </h2>
            <Link href="/">
              <button className="bg-[#8B5A3C] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6F4630] transition-colors shadow-md shadow-[#8B5A3C]/20">
                GO TO SHOP
              </button>
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-12">
            <h3
              className="text-xl font-bold text-[#3D2817] mb-6"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              Before You Leave
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p) =>
                <ProductCard key={p.id} product={p} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h1
            className="text-3xl font-bold text-[#3D2817]"
            style={{
              fontFamily: 'Playfair Display, serif'
            }}>
            Shopping Cart
          </h1>
          <span className="text-sm text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemKey = `${item.id}-${item.selectedSize || 'default'}`;
              return (
                <div
                  key={itemKey}
                  className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 relative">
                  <Link
                    href={`/product/${item.id}`}
                    className="w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between pr-8">
                        <Link href={`/product/${item.id}`}>
                          <h3 className="font-semibold text-[#3D2817] hover:text-[#8B5A3C] transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                      </div>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500 mt-1">
                          Size:{' '}
                          <span className="font-medium text-gray-900">
                            {item.selectedSize}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#3D2817]">
                          ${item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ${item.mrp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center bg-white border border-gray-200 rounded-lg h-9">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.selectedSize)
                          }
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C] transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-[#3D2817] text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.selectedSize)
                          }
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C] transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove item">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-4">
              <h2 className="text-lg font-bold text-[#3D2817] mb-4 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-[#3D2817]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-[#7A8B68]">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-[#3D2817]">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#7A8B68]">
                    <span>Discount ({appliedCode})</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#3D2817]">Total</span>
                  <span className="text-2xl font-bold text-[#3D2817]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <button className="w-full bg-[#8B5A3C] text-white py-3.5 rounded-xl font-bold hover:bg-[#6F4630] transition-colors shadow-md shadow-[#8B5A3C]/20 mb-4">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-[#8B5A3C] hover:underline">
                  
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  PROMO CODE (Try: WELCOME10, SAVE20, GOLD25)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5A3C]" />
                  
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-2 ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600 font-semibold'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export default Cart;

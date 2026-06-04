"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
export function Cart() {
  // Toggle for demo purposes
  const [isEmpty, setIsEmpty] = useState(false);
  // Mock cart data
  const [cartItems, setCartItems] = useState([
  {
    ...products[0],
    cartId: 'c1',
    quantity: 1,
    selectedSize: 'M'
  },
  {
    ...products[2],
    cartId: 'c2',
    quantity: 2,
    selectedSize: 'L'
  }]
  );
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
    items.map((item) =>
    item.cartId === cartId ?
    {
      ...item,
      quantity: newQuantity
    } :
    item
    )
    );
  };
  const removeItem = (cartId: string) => {
    setCartItems((items) => items.filter((item) => item.cartId !== cartId));
    if (cartItems.length === 1) setIsEmpty(true);
  };
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% mock tax
  const total = subtotal + tax;
  if (isEmpty || cartItems.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsEmpty(false)}
              className="text-xs text-gray-400 hover:text-[#8B5A3C] underline">
              
              Toggle Filled State (Demo)
            </button>
          </div>

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
      </div>);

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
          <button
            onClick={() => setIsEmpty(true)}
            className="text-xs text-gray-400 hover:text-[#8B5A3C] underline">
            
            Toggle Empty State (Demo)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) =>
            <div
              key={item.cartId}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Size:{' '}
                      <span className="font-medium text-gray-900">
                        {item.selectedSize}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#3D2817]">
                        ${item.price}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ${item.mrp}
                      </span>
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg h-9">
                      <button
                      onClick={() =>
                      updateQuantity(item.cartId, item.quantity - 1)
                      }
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C] transition-colors">
                      
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold text-[#3D2817] text-sm">
                        {item.quantity}
                      </span>
                      <button
                      onClick={() =>
                      updateQuantity(item.cartId, item.quantity + 1)
                      }
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C] transition-colors">
                      
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                onClick={() => removeItem(item.cartId)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Remove item">
                
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
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
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#3D2817]">Total</span>
                  <span className="text-2xl font-bold text-[#3D2817]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-[#8B5A3C] text-white py-3.5 rounded-xl font-bold hover:bg-[#6F4630] transition-colors shadow-md shadow-[#8B5A3C]/20 mb-4">
                Proceed to Checkout
              </button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-[#8B5A3C] hover:underline">
                  
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  PROMO CODE
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5A3C]" />
                  
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export default Cart;

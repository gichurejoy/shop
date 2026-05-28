import React from 'react';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { products } from '../data/products';
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cartItems = [
  {
    ...products[0],
    quantity: 1,
    size: 'M'
  },
  {
    ...products[2],
    quantity: 2,
    size: 'L'
  }];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <>
      {/* Backdrop */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose} />

      }

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#8B5A3C]" />
              <h2 className="text-lg font-bold text-[#3D2817]">
                Shopping Cart
              </h2>
              <span className="text-sm text-gray-500">
                ({cartItems.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.map((item, idx) =>
            <div
              key={idx}
              className="flex gap-3 pb-4 border-b border-gray-100">
              
                <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
              
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#3D2817] line-clamp-2 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Size: {item.size}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3D2817]">
                      ${item.price}
                    </span>
                    <div className="flex items-center border border-gray-200 rounded h-7">
                      <button className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C]">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C]">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-[#3D2817]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Link href="/cart" onClick={onClose}>
              <button className="w-full bg-white border border-[#8B5A3C] text-[#8B5A3C] py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors mb-2">
                View Cart
              </button>
            </Link>
            <Link href="/checkout" onClick={onClose}>
              <button className="w-full bg-[#8B5A3C] text-white py-3 rounded-lg font-bold hover:bg-[#6F4630] transition-colors">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>);

}
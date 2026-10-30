"use client";

import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  showDiscountBadge?: boolean;
}

export function ProductCard({
  product,
  showPrice = true,
  showRating = true,
  showAddToCart = true,
  showDiscountBadge = true
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      image: product.image,
      selectedSize: 'M',
    }, 1);
    toast.success(`Added ${product.name} to your cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#8B5A3C] transition-all group flex flex-col h-full">
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gray-50 block">
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        
        {showDiscountBadge && (
          <div className="absolute top-3 left-3 bg-[#D4A574] text-[#3D2817] px-2 py-0.5 rounded text-xs font-bold shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </Link>

      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10">
        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
      </button>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-semibold text-[#3D2817] mb-1 line-clamp-2 text-sm group-hover:text-[#8B5A3C] transition-colors">
            {product.name}
          </h3>

          {showRating && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5 bg-[#FAF6F0] px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-[#D4A574] text-[#D4A574]" />
                <span className="text-xs font-bold text-[#3D2817]">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          )}

          {showPrice && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-[#3D2817]">
                ${product.price}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ${product.mrp}
              </span>
            </div>
          )}
        </Link>

        {showAddToCart && (
          <button 
            onClick={handleAdd}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-auto border ${
              added 
                ? 'bg-[#8B5A3C] text-white border-[#8B5A3C]' 
                : 'bg-white border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white'
            }`}>
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        )}
      </div>
    </div>);

}
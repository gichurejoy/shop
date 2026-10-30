import React from 'react';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';
interface ProductGridProps {
  title: string;
  limit?: number;
  columns?: number;
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  showDiscountBadge?: boolean;
  backgroundColor?: string;
}

export function ProductGrid({
  title,
  limit,
  columns = 4,
  showPrice = true,
  showRating = true,
  showAddToCart = true,
  showDiscountBadge = true,
  backgroundColor
}: ProductGridProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;

  let gridColsClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  if (columns === 2) {
    gridColsClass = 'grid-cols-1 sm:grid-cols-2';
  } else if (columns === 3) {
    gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  } else if (columns === 5) {
    gridColsClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  }

  const customStyle: React.CSSProperties = {};
  if (backgroundColor) {
    customStyle.backgroundColor = backgroundColor;
  }

  return (
    <div className="w-full py-8" style={customStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold mb-6 text-[#3D2817]"
          style={{
            fontFamily: 'Playfair Display, serif'
          }}>
          
          {title}
        </h2>

        <div className={`grid ${gridColsClass} gap-4`}>
          {displayProducts.map((product) =>
          <ProductCard 
            key={product.id} 
            product={product} 
            showPrice={showPrice}
            showRating={showRating}
            showAddToCart={showAddToCart}
            showDiscountBadge={showDiscountBadge}
          />
          )}
        </div>
      </div>
    </div>);

}
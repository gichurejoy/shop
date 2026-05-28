import React from 'react';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';
interface ProductGridProps {
  title: string;
  limit?: number;
}
export function ProductGrid({ title, limit }: ProductGridProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold mb-6 text-[#3D2817]"
          style={{
            fontFamily: 'Playfair Display, serif'
          }}>
          
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
      </div>
    </div>);

}
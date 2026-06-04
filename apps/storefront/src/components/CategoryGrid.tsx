import React from 'react';
import Link from 'next/link';
import {
  Gem,
  Sparkles,
  Circle,
  Watch,
  Shirt,
  Wind,
  Snowflake,
  Layers,
  Square } from
  'lucide-react';

interface CategoryGridProps {
  title?: string;
  cat1Label?: string;
  cat2Label?: string;
  cat3Label?: string;
  cat4Label?: string;
  cat5Label?: string;
  cat6Label?: string;
  cat7Label?: string;
  cat8Label?: string;
  cat9Label?: string;
  cat10Label?: string;
}

export function CategoryGrid({
  title,
  cat1Label,
  cat2Label,
  cat3Label,
  cat4Label,
  cat5Label,
  cat6Label,
  cat7Label,
  cat8Label,
  cat9Label,
  cat10Label
}: CategoryGridProps) {
  const categories = [
  {
    icon: Circle,
    label: cat1Label || 'Rings',
    value: 'jewelry'
  },
  {
    icon: Sparkles,
    label: cat2Label || 'Necklaces',
    value: 'jewelry'
  },
  {
    icon: Gem,
    label: cat3Label || 'Earrings',
    value: 'jewelry'
  },
  {
    icon: Circle,
    label: cat4Label || 'Bracelets',
    value: 'jewelry'
  },
  {
    icon: Watch,
    label: cat5Label || 'Watches',
    value: 'jewelry'
  },
  {
    icon: Shirt,
    label: cat6Label || 'Cardigans',
    value: 'sweater'
  },
  {
    icon: Wind,
    label: cat7Label || 'Pullovers',
    value: 'sweater'
  },
  {
    icon: Snowflake,
    label: cat8Label || 'Cashmere',
    value: 'sweater'
  },
  {
    icon: Layers,
    label: cat9Label || 'Turtlenecks',
    value: 'sweater'
  },
  {
    icon: Square,
    label: cat10Label || 'Vests',
    value: 'sweater'
  }];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold mb-6 text-[#3D2817]"
          style={{
            fontFamily: 'Playfair Display, serif'
          }}>
          
          {title || "Browse by Category"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((category) =>
          <Link
            href={`/products?category=${category.value}`}
            key={category.label}
            className="bg-white border border-gray-200 rounded-xl p-2 pr-4 flex items-center gap-3 hover:shadow-md hover:border-[#8B5A3C] transition-all group">
            
              <div className="w-12 h-12 bg-[#FAF6F0] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#8B5A3C]/10 transition-colors">
                <category.icon className="w-6 h-6 text-[#8B5A3C]" />
              </div>
              <span className="font-medium text-sm text-[#3D2817] text-left leading-tight">
                {category.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>);

}
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
    { icon: Sparkles, label: cat1Label || 'Best Sellers', value: 'all' },
    { icon: Gem, label: cat2Label || 'New Arrivals', value: 'all' },
    { icon: Circle, label: cat3Label || 'Top Rated', value: 'all' },
    { icon: Watch, label: cat4Label || 'Deals & Offers', value: 'all' },
    { icon: Shirt, label: cat5Label || 'Popular Picks', value: 'all' },
    { icon: Wind, label: cat6Label || 'Seasonal Lines', value: 'all' },
    { icon: Snowflake, label: cat7Label || 'Premium Grade', value: 'all' },
    { icon: Layers, label: cat8Label || 'Essentials', value: 'all' },
    { icon: Square, label: cat9Label || 'Clearance', value: 'all' },
    { icon: Circle, label: cat10Label || 'Accessories', value: 'all' },
  ];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {title || "Browse by Category"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((category) => (
            <Link
              href={`/products?q=${encodeURIComponent(category.label)}`}
              key={category.label}
              className="bg-white border border-gray-200 rounded-xl p-2 pr-4 flex items-center gap-3 hover:shadow-md hover:border-orange-500 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
                <category.icon className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
              </div>
              <span className="font-medium text-sm text-slate-800 text-left leading-tight group-hover:text-orange-600 transition-colors">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
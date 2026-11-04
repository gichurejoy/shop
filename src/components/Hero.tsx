"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  heading?: string;
  searchPlaceholder?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}

export function Hero({ heading, searchPlaceholder, backgroundColor, backgroundImage }: HeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const customStyle: React.CSSProperties = {};
  if (backgroundImage) {
    customStyle.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.60), rgba(15, 23, 42, 0.70)), url("${backgroundImage}")`;
    customStyle.backgroundSize = 'cover';
    customStyle.backgroundPosition = 'center';
  } else if (backgroundColor) {
    customStyle.backgroundColor = backgroundColor;
  }

  return (
    <div 
      className="w-full bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white py-12 relative overflow-hidden"
      style={customStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            {heading || "Welcome to Our Store"}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder || "Search products, collections, and brands..."}
              className="w-full pl-12 pr-28 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Decorative ambient lighting */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );

}
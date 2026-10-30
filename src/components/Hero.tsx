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
    customStyle.backgroundImage = `url(${backgroundImage})`;
    customStyle.backgroundSize = 'cover';
    customStyle.backgroundPosition = 'center';
  } else if (backgroundColor) {
    customStyle.backgroundColor = backgroundColor;
  }

  return (
    <div 
      className="w-full bg-[#5C3A24] text-white py-12 relative overflow-hidden"
      style={customStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <h2
            className="text-3xl md:text-4xl font-bold mb-2 text-white"
            style={{
              fontFamily: 'Playfair Display, serif'
            }}>
            
            {heading || "Shop Jewelry & Knitwear"}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5A3C] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder || "Search rings, necklaces, sweaters..."}
              className="w-full pl-12 pr-28 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8B5A3C] hover:bg-[#6F4630] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Decorative illustrations */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-30 text-[#D4A574]">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <circle
            cx="60"
            cy="30"
            r="20"
            stroke="currentColor"
            strokeWidth="3" />
          
          <path
            d="M60 50 L60 100 M30 70 L60 70 L90 70 M30 120 L60 160 M90 120 L60 160"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round" />
          
          <circle cx="60" cy="65" r="6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-30 text-[#D4A574]">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <circle
            cx="60"
            cy="30"
            r="20"
            stroke="currentColor"
            strokeWidth="3" />
          
          <path
            d="M60 50 L60 100 M30 70 L60 70 L90 70 M30 120 L60 160 M90 120 L60 160"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round" />
          
          <path
            d="M45 55 L75 55 L80 90 L40 90 Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round" />
          
        </svg>
      </div>
    </div>);

}
import React from 'react';
import Link from 'next/link';

interface PromoBannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export function PromoBanner({ title, description, ctaLabel, ctaLink }: PromoBannerProps) {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-8 text-white text-center relative overflow-hidden border border-slate-700/50 shadow-xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {title || "Special Seasonal Offers & Discounts"}
            </h2>
            <p className="text-sm md:text-base mb-5 opacity-90 max-w-2xl mx-auto text-slate-300">
              {description || "Save up to 30% on top-rated products and high-demand collections across the entire catalog."}
            </p>
            <Link href={ctaLink || "/products"} className="inline-block">
              <button className="bg-orange-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-md">
                {ctaLabel || "Shop All Deals"}
              </button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
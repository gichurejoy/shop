import React from 'react';
import Link from 'next/link';
import { MessageCircle, Headphones } from 'lucide-react';

interface StylistBannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
}

export function StylistBanner({ title, description, ctaLabel }: StylistBannerProps) {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3 text-slate-900">
              {title || "Expert Advice & Bulk Inquiries"}
            </h2>
            <p className="text-slate-600 text-sm mb-5 max-w-xl">
              {description || "Need guidance on product specifications, commercial orders, or tailored recommendations? Our product specialists are ready to assist you."}
            </p>
            <Link href="/about" className="inline-block">
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 w-fit shadow-sm">
                <MessageCircle className="w-4 h-4 text-orange-400" />
                {ctaLabel || "Contact Specialist"}
              </button>
            </Link>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-200/60 shrink-0 text-orange-600">
            <Headphones className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
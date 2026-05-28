import React from 'react';
import { MessageCircle } from 'lucide-react';
export function StylistBanner() {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6F0] border border-[#8B5A3C]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2
              className="text-2xl font-bold mb-3 text-[#3D2817]"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Ask Anything About Your Style
            </h2>
            <p className="text-gray-700 text-sm mb-5 max-w-xl">
              Our expert stylists are here to help you find the perfect piece
              for any occasion. Get personalized recommendations for jewelry and
              knitwear that match your unique style.
            </p>
            <button className="bg-[#8B5A3C] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#6F4630] transition-colors flex items-center gap-2 w-fit">
              <MessageCircle className="w-4 h-4" />
              Chat with a Stylist
            </button>
          </div>

          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="35" r="20" stroke="#3D2817" strokeWidth="3" />
              <path
                d="M60 55 L60 85 M40 65 L60 65 L80 65"
                stroke="#3D2817"
                strokeWidth="3"
                strokeLinecap="round" />
              
              <circle cx="50" cy="75" r="5" fill="#8B5A3C" />
              <circle cx="70" cy="75" r="5" fill="#8B5A3C" />
            </svg>
          </div>
        </div>
      </div>
    </div>);

}
import React from 'react';
export function PromoBanner() {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3D2817] rounded-2xl p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2
              className="text-2xl md:text-3xl font-bold mb-3 text-[#D4A574]"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Save Up to 25% on Premium Collections
            </h2>
            <p className="text-sm md:text-base mb-5 opacity-90 max-w-2xl mx-auto">
              Exclusive offers on handcrafted jewelry and luxury knitwear
            </p>
            <button className="bg-[#8B5A3C] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#6F4630] transition-colors">
              Shop Now
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#8B5A3C] rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4A574] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </div>);

}
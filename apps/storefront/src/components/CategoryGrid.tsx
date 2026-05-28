import React from 'react';
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
export function CategoryGrid() {
  const categories = [
  {
    icon: Circle,
    label: 'Rings'
  },
  {
    icon: Sparkles,
    label: 'Necklaces'
  },
  {
    icon: Gem,
    label: 'Earrings'
  },
  {
    icon: Circle,
    label: 'Bracelets'
  },
  {
    icon: Watch,
    label: 'Watches'
  },
  {
    icon: Shirt,
    label: 'Cardigans'
  },
  {
    icon: Wind,
    label: 'Pullovers'
  },
  {
    icon: Snowflake,
    label: 'Cashmere'
  },
  {
    icon: Layers,
    label: 'Turtlenecks'
  },
  {
    icon: Square,
    label: 'Vests'
  }];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold mb-6 text-[#3D2817]"
          style={{
            fontFamily: 'Playfair Display, serif'
          }}>
          
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((category) =>
          <button
            key={category.label}
            className="bg-white border border-gray-200 rounded-xl p-2 pr-4 flex items-center gap-3 hover:shadow-md hover:border-[#8B5A3C] transition-all group">
            
              <div className="w-12 h-12 bg-[#FAF6F0] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#8B5A3C]/10 transition-colors">
                <category.icon className="w-6 h-6 text-[#8B5A3C]" />
              </div>
              <span className="font-medium text-sm text-[#3D2817] text-left leading-tight">
                {category.label}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>);

}
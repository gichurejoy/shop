import React from 'react';
import { ArrowRight } from 'lucide-react';
export function Lookbook() {
  const looks = [
  {
    id: 1,
    name: 'The Golden Hour',
    description:
    'Embrace the warmth of autumn with rich, earthy tones. A chunky cable-knit cardigan in burnt sienna pairs perfectly with delicate, layered gold chains that catch the fading light. The contrast between the heavy texture of the wool and the fine, gleaming metal creates a look of effortless sophistication.',
    products: [
    'Oversized Cable Knit Cardigan',
    'Layered Gold Chain Necklace',
    'Simple Gold Huggies'],

    image:
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
  },
  {
    id: 2,
    name: 'Midnight Elegance',
    description:
    'For evenings that demand a touch of drama. A sleek, form-fitting black cashmere turtleneck serves as the perfect canvas for a statement diamond pendant. The simplicity of the knitwear allows the jewelry to take center stage, offering a masterclass in understated luxury.',
    products: [
    'Ribbed Cashmere Turtleneck',
    'Diamond Teardrop Pendant',
    'Classic Diamond Studs'],

    image:
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800'
  },
  {
    id: 3,
    name: 'Weekend Wanderer',
    description:
    "Comfort meets style for leisurely weekend strolls. A slouchy, oatmeal-colored merino wool sweater is elevated by a stack of textured silver bracelets and a bold, architectural ring. It's a look that says you care about details, even on your days off.",
    products: [
    'Slouchy Merino Pullover',
    'Hammered Silver Cuff',
    'Architectural Dome Ring'],

    image:
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'
  },
  {
    id: 4,
    name: 'The Modern Classic',
    description:
    'Reinventing timeless staples. A crisp white v-neck sweater in a fine silk-blend knit is paired with a modern pearl choker. This look bridges the gap between traditional elegance and contemporary edge, perfect for the modern professional.',
    products: [
    'Silk-Blend V-Neck',
    'Modern Pearl Choker',
    'Pearl Drop Earrings'],

    image:
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
  },
  {
    id: 5,
    name: 'The Power Knit',
    description:
    "Command attention without sacrificing comfort. A structured, deep emerald green knit blazer over a simple camisole, accessorized with a bold, vintage-inspired gold collar necklace. It's powerful, feminine, and unmistakably chic.",
    products: [
    'Structured Knit Blazer',
    'Vintage-Inspired Gold Collar',
    'Gold Dome Ring'],

    image:
    'https://images.unsplash.com/photo-1583846400216-df856648cb82?w=800'
  }];

  const pastEditions = [
  {
    title: 'Spring/Summer 2024',
    subtitle: 'Light & Luminous',
    image:
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400'
  },
  {
    title: 'Autumn/Winter 2023',
    subtitle: 'Cozy Opulence',
    image:
    'https://images.unsplash.com/photo-1515347619152-141a4611413a?w=400'
  },
  {
    title: 'Spring/Summer 2023',
    subtitle: 'Breeze & Brilliance',
    image:
    'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=400'
  }];

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <div className="bg-[#5C3A24] text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
            alt="Background"
            className="w-full h-full object-cover" />
          
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-['Playfair_Display']">
            The Lumière & Knit Lookbook
          </h1>
          <p className="text-xl text-[#D4A574] max-w-2xl mx-auto font-light tracking-wide uppercase">
            Curated styles for the modern romantic
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Current Edition Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-[#8B5A3C] tracking-widest uppercase mb-4">
            Current Edition
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
            Autumn/Winter 2024 — Warm & Woven
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            This season, we explore the beautiful tension between the soft,
            yielding nature of premium knitwear and the structured, enduring
            brilliance of fine jewelry. Discover five curated looks that define
            the Lumière & Knit aesthetic for the colder months.
          </p>
        </div>

        {/* Looks */}
        <div className="space-y-32 mb-32">
          {looks.map((look, index) =>
          <div
            key={look.id}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
            
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover" />
                
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-block px-3 py-1 bg-[#FAF6F0] border border-[#D4A574] text-[#8B5A3C] text-sm font-bold tracking-widest uppercase rounded-full">
                  Look {look.id}
                </div>
                <h3 className="text-4xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  {look.name}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {look.description}
                </p>
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-[#3D2817] uppercase tracking-wider mb-3">
                    Wearing:
                  </h4>
                  <ul className="space-y-2 mb-8">
                    {look.products.map((product, i) =>
                  <li
                    key={i}
                    className="text-gray-600 flex items-center gap-2">
                    
                        <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full"></span>
                        {product}
                      </li>
                  )}
                  </ul>
                  <button className="px-8 py-4 bg-[#8B5A3C] text-white font-bold rounded-full hover:bg-[#6F4630] transition-colors inline-flex items-center gap-2">
                    Shop This Look
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Past Editions */}
        <div className="pt-20 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-[#3D2817] mb-12 text-center font-['Playfair_Display']">
            Explore Past Editions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEditions.map((edition, index) =>
            <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                  <img
                  src={edition.image}
                  alt={edition.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-6 py-2 bg-white text-[#3D2817] font-bold rounded-full">
                      View Lookbook
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display'] text-center">
                  {edition.title}
                </h3>
                <p className="text-gray-500 text-center">{edition.subtitle}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}
export default Lookbook;

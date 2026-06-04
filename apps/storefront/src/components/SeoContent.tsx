import React from 'react';

interface SeoContentProps {
  title1?: string;
  body1?: string;
  title2?: string;
  body2?: string;
  title3?: string;
  body3?: string;
}

export function SeoContent({
  title1,
  body1,
  title2,
  body2,
  title3,
  body3
}: SeoContentProps) {
  return (
    <div className="w-full py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-sm max-w-none text-gray-600">
          <h2
            className="text-xl font-bold mb-3 text-[#3D2817]"
            style={{
              fontFamily: 'Playfair Display, serif'
            }}>
            
            {title1 || "Premium Jewelry & Luxury Knitwear"}
          </h2>
          <p className="mb-5">
            {body1 || "Discover our curated collection of handcrafted jewelry and premium knitwear. From timeless gold pieces to cozy cashmere sweaters, each item is selected for quality, craftsmanship, and enduring style."}
          </p>

          <h2
            className="text-xl font-bold mb-3 mt-6 text-[#3D2817]"
            style={{
              fontFamily: 'Playfair Display, serif'
            }}>
            
            {title2 || "Jewelry Care Guide"}
          </h2>
          <div className="mb-5 text-sm">
            {body2 ? (
              <p>{body2}</p>
            ) : (
              <>
                <p className="mb-3">
                  Proper care ensures your jewelry maintains its brilliance for years.
                  Store pieces separately in soft pouches to prevent scratching. Clean
                  gold and diamond jewelry with warm water and mild soap, using a soft
                  brush for intricate details. Remove jewelry before swimming,
                  exercising, or applying cosmetics.
                </p>
                <p>
                  For pearls and delicate gemstones, use only a damp cloth and avoid
                  harsh chemicals. Professional cleaning once a year helps maintain
                  the integrity of settings and ensures stones remain secure.
                </p>
              </>
            )}
          </div>

          <h2
            className="text-xl font-bold mb-3 mt-6 text-[#3D2817]"
            style={{
              fontFamily: 'Playfair Display, serif'
            }}>
            
            {title3 || "Sweater Care & Maintenance"}
          </h2>
          <div className="mb-5 text-sm">
            {body3 ? (
              <p>{body3}</p>
            ) : (
              <>
                <p className="mb-3">
                  Quality knitwear deserves gentle care. Hand wash cashmere and merino
                  wool in cool water with specialized detergent. Gently press out
                  excess water without wringing, then lay flat to dry on a clean
                  towel. Never hang wet sweaters as this can distort the shape.
                </p>
                <p>
                  Store folded sweaters in breathable cotton bags during warmer
                  months. Use cedar blocks or lavender sachets to naturally deter
                  moths. For minor pilling, use a sweater comb or fabric shaver to
                  restore a smooth finish.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
interface BrandStripProps {
  title?: string;
  brands?: string | string[];
}

export function BrandStrip({ title, brands }: BrandStripProps) {
  const displayBrands = Array.isArray(brands)
    ? brands
    : typeof brands === 'string' && brands.trim()
    ? brands.split(',').map(b => b.trim())
    : [
      'Aurelia',
      'Wovenly',
      'Maison Lin',
      'Nordkraft',
      'Soleil',
      'Cashmere Co',
      'Lumière',
      'Knit House'
    ];

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-xl font-bold mb-6 text-center text-[#3D2817]"
          style={{
            fontFamily: 'Playfair Display, serif'
          }}>
          
          {title || "Featured Brands"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {displayBrands.map((brand) =>
          <div
            key={brand}
            className="aspect-[3/2] bg-white rounded-xl flex items-center justify-center border border-gray-100 hover:border-[#8B5A3C] hover:shadow-sm transition-all cursor-pointer">
            
              <span
              className="font-semibold text-[#3D2817] text-center px-2 text-sm"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
                {brand}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>);

}
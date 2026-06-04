import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Grid, List, Check } from 'lucide-react';

export function Catalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get('category') : null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'jewelry' | 'sweater' | 'digital'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'physical' | 'digital'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [sortBy, setSortBy] = useState<'bestselling' | 'low-high' | 'high-low' | 'rating'>('bestselling');

  useEffect(() => {
    if (categoryParam === 'jewelry' || categoryParam === 'sweater' || categoryParam === 'digital') {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        let matchesCategory = true;
        if (selectedCategory === 'jewelry') {
          matchesCategory = p.category === 'jewelry' && p.type === 'physical';
        } else if (selectedCategory === 'sweater') {
          matchesCategory = p.category === 'sweater';
        } else if (selectedCategory === 'digital') {
          matchesCategory = p.type === 'digital';
        }

        // Product type filter
        let matchesType = true;
        if (selectedType !== 'all') {
          matchesType = p.type === selectedType;
        }

        // Price filter
        const matchesPrice = p.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesType && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default bestselling (e.g. sorted by reviews)
        return b.reviews - a.reviews;
      });
  }, [searchTerm, selectedCategory, selectedType, maxPrice, sortBy]);

  return (
    <div className="w-full min-h-screen bg-[#FAF6F0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#8B5A3C] uppercase tracking-wider">Collections</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3D2817] mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Browse All Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">Discover handcrafted jewelry and premium cashmere sweaters.</p>
        </div>

        {/* Toolbar controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jewelry, pullovers, cardigans..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:border-[#8B5A3C] transition-all bg-gray-50/50"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" /> SORT BY
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
            >
              <option value="bestselling">Bestselling</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Workspace layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-sm text-[#3D2817] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8B5A3C]" /> Filters
                </h3>
                {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || maxPrice !== 600) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedType('all');
                      setMaxPrice(600);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Category</h4>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'All Items', value: 'all' },
                    { label: 'Jewelry', value: 'jewelry' },
                    { label: 'Knitwear', value: 'sweater' },
                    { label: 'Digital Vouchers', value: 'digital' }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value as any)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                        selectedCategory === cat.value
                          ? 'bg-[#FAF6F0] text-[#8B5A3C]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.label}
                      {selectedCategory === cat.value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product type section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Product Type</h4>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'All Types', value: 'all' },
                    { label: 'Physical Products', value: 'physical' },
                    { label: 'Digital Vouchers', value: 'digital' }
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(t.value as any)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                        selectedType === t.value
                          ? 'bg-[#FAF6F0] text-[#8B5A3C]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                      {selectedType === t.value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range section */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-400 tracking-wider uppercase">
                  <span>Max Price</span>
                  <span className="text-[#8B5A3C] font-extrabold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="600"
                  step="10"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8B5A3C] cursor-pointer"
                />
                <div className="flex justify-between text-xxs text-gray-400 font-bold">
                  <span>$40</span>
                  <span>$600</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[350px]">
                <SlidersHorizontal className="w-12 h-12 text-gray-300 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-[#3D2817]">No products matched your criteria</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">Try relaxing your search terms or adjustments in the filter sidebar panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Catalog;

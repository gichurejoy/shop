import React, { useState } from 'react';
import { MapPin, ShoppingCart, User, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStorefront } from '../context/StorefrontContext';
import { useCart } from '../context/CartContext';

interface TopBarProps {
  onCartClick?: () => void;
}

export function TopBar({ onCartClick }: TopBarProps) {
  const router = useRouter();
  const { activeAddress, setIsAddressDrawerOpen, isLoggedIn, user } = useStorefront();
  const { cartCount } = useCart();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-2xl font-bold text-[#3D2817]"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Lumière & Knit
            </Link>

            <button 
              onClick={() => setIsAddressDrawerOpen(true)}
              className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-[#8B5A3C] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#8B5A3C]" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Delivery Address</div>
                <div className="flex items-center gap-1 font-medium text-[#3D2817] line-clamp-1 max-w-[200px]">
                  {activeAddress}
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                </div>
              </div>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search collection..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#8B5A3C] transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              
              <ShoppingCart className="w-5 h-5 text-[#3D2817] group-hover:text-[#8B5A3C]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A574] text-[#3D2817] font-bold text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 border border-[#8B5A3C] bg-[#8B5A3C] text-white rounded-lg hover:bg-[#6F4630] transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Dashboard ({user?.name.split(' ')[0]})</span>
              </Link>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 px-4 py-2 border border-[#8B5A3C] text-[#8B5A3C] rounded-lg hover:bg-[#8B5A3C] hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>);

}
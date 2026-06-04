import React from 'react';
import { MapPin, ShoppingCart, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useStorefront } from '../context/StorefrontContext';

interface TopBarProps {
  onCartClick?: () => void;
}

export function TopBar({ onCartClick }: TopBarProps) {
  const { activeAddress, setIsAddressDrawerOpen, isLoggedIn, user } = useStorefront();

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
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

          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              
              <ShoppingCart className="w-5 h-5 text-[#3D2817] group-hover:text-[#8B5A3C]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A574] text-[#3D2817] font-bold text-xs rounded-full flex items-center justify-center">
                2
              </span>
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
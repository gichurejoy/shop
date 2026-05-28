import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
export function Footer() {
  const categories = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Watches',
  'Cardigans',
  'Pullovers',
  'Turtlenecks',
  'Cashmere',
  'Sale'];

  const help = [
  'Contact Us',
  'Track Order',
  'Returns & Exchanges',
  'Shipping Info',
  'Size Guide',
  'Care Instructions',
  'Gift Cards',
  'FAQs'];

  const company = [
  'About Us',
  'Careers',
  'Press',
  'Sustainability',
  'Store Locator',
  'Privacy Policy',
  'Terms of Service'];

  return (
    <footer className="w-full bg-[#3D2817] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3
              className="text-white font-bold text-xl mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Lumière & Knit
            </h3>
            <p className="text-sm mb-4 text-gray-400">
              Premium jewelry and luxury knitwear for the discerning customer.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8B5A3C] hover:text-white transition-colors">
                
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8B5A3C] hover:text-white transition-colors">
                
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8B5A3C] hover:text-white transition-colors">
                
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8B5A3C] hover:text-white transition-colors">
                
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((item) =>
              <li key={item}>
                  <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  
                    {item}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Help</h4>
            <ul className="space-y-2">
              {help.slice(0, 6).map((item) =>
              <li key={item}>
                  <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  
                    {item}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {company.map((item) =>
              <li key={item}>
                  <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  
                    {item}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2024 Lumière & Knit. All rights reserved.
            </p>
            <div className="flex gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-8" />
              
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-8" />
              
            </div>
          </div>
        </div>
      </div>
    </footer>);

}
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CmsMenuNode } from '../lib/cms';

export function MainNav({ navigation = [] }: { navigation?: CmsMenuNode[] }) {
  const pathname = usePathname();
  
  // Use default fallback if CMS is empty
  const navItems = navigation.length > 0 ? navigation : [
    {
      id: 'default',
      label: 'Shop',
      link: '/',
      isMega: true,
      children: []
    }
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto md:justify-center md:gap-10 md:overflow-visible scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.link || (item.link === '/' && pathname.startsWith('/product'));
            return (
              <div key={item.id} className="group relative">
                <Link
                  href={item.link}
                  className={`relative py-3 px-2 whitespace-nowrap text-sm font-medium transition-colors block ${isActive ? 'text-[#8B5A3C]' : 'text-[#3D2817] hover:text-[#8B5A3C]'}`}>
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge &&
                      <span className="px-2 py-0.5 bg-[#D4A574] text-[#3D2817] font-bold text-xs rounded">
                        {item.badge}
                      </span>
                    }
                  </span>
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5A3C]" />}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.isMega && item.children && item.children.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex">
                    {item.children.map((column, idx) => (
                      <div key={column.id} className={`flex-1 p-6 ${idx < item.children.length - 1 ? 'border-r border-gray-100' : ''} ${idx % 2 === 0 ? 'bg-[#FAF6F0]/50' : ''}`}>
                        <h3 className="font-bold text-[#3D2817] mb-4">{column.label}</h3>
                        {column.children && column.children.length > 0 && (
                          <ul className="space-y-2">
                            {column.children.map(subLink => (
                              <li key={subLink.id}>
                                <Link href={subLink.link} className="text-sm text-gray-600 hover:text-[#8B5A3C]">
                                  {subLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Standard Dropdown */}
                {!item.isMega && item.children && item.children.length > 0 && (
                  <div className="absolute top-full left-0 w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {item.children.map(subLink => (
                      <Link key={subLink.id} href={subLink.link} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#8B5A3C] hover:bg-gray-50">
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>);

}
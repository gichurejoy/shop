"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { MainNav } from './MainNav';
import { CategoryStrip } from './CategoryStrip';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import type { CmsMenuNode } from '@/lib/cms';
import { StorefrontProvider } from '../context/StorefrontContext';
import { CartProvider, useCart } from '../context/CartContext';
import { AddressDrawer } from './AddressDrawer';
import { Toaster } from 'sonner';

function ClientLayoutInner({ children, navigation = [] }: { children: React.ReactNode, navigation?: CmsMenuNode[] }) {
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCart();
  const pathname = usePathname();

  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/cms-preview');
  let currentSlug = 'home';
  if (pathname && pathname !== '/') {
    currentSlug = pathname.replace(/^\//, '').split('/')[0];
  }

  const isEditableCmsPage = !isExcluded && !['cart', 'checkout', 'login', 'account', 'dashboard', 'tracking', 'order-tracking', 'order-confirmation'].includes(currentSlug);

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <Toaster position="top-right" richColors />
      <TopBar onCartClick={() => setIsCartDrawerOpen(true)} />
      <MainNav navigation={navigation} />
      <CategoryStrip />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
      <AddressDrawer />

      {/* Floating Admin Quick-Edit Pill */}
      {isEditableCmsPage && (
        <a
          href={`/admin/cms/builder?page=${currentSlug}`}
          className="fixed bottom-6 right-6 z-50 bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 no-underline group"
          title={`Edit ${currentSlug} visually in the CMS Website Builder`}
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6c2f] group-hover:scale-125 transition-transform" />
          <span className="tracking-wide">Visual Editor ({currentSlug})</span>
        </a>
      )}
    </div>
  );
}

export function ClientLayout({ children, navigation = [] }: { children: React.ReactNode, navigation?: CmsMenuNode[] }) {
  return (
    <StorefrontProvider>
      <CartProvider>
        <ClientLayoutInner navigation={navigation}>{children}</ClientLayoutInner>
      </CartProvider>
    </StorefrontProvider>
  );
}

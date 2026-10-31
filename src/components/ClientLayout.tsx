"use client";

import React from 'react';
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

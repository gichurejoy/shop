"use client";

import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { MainNav } from './MainNav';
import { CategoryStrip } from './CategoryStrip';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

import { CmsMenuNode } from '../lib/cms';

export function ClientLayout({ children, navigation = [] }: { children: React.ReactNode, navigation?: CmsMenuNode[] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <TopBar onCartClick={() => setIsCartOpen(true)} />
      <MainNav navigation={navigation} />
      <CategoryStrip />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

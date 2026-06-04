"use client";

import { Suspense } from 'react';
import { Catalog } from '../../../pages/Catalog';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5A3C]"></div>
      </div>
    }>
      <Catalog />
    </Suspense>
  );
}

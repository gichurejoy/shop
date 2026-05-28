const fs = require('fs');
const path = require('path');

const layoutPath = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin/layout.tsx';
const sidebarPath = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/components/AdminSidebar.tsx';

let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Find the start and end of the App Menu (Sidebar)
const startMarker = '{/* ========== App Menu Start ========== */}';
const endMarker = '{/* ========== App Menu End ========== */}';

const startIndex = layoutContent.indexOf(startMarker);
const endIndex = layoutContent.indexOf(endMarker) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find sidebar markers!");
    process.exit(1);
}

const sidebarContentRaw = layoutContent.substring(startIndex, endIndex);

// Remove the expandedMenu state from layout.tsx
layoutContent = layoutContent.replace(/const \[expandedMenu, setExpandedMenu\] = useState<string \| null>\('.*?'\);\s*\n/, '');

// Replace the sidebar with the component
const layoutWithComponent = layoutContent.substring(0, startIndex) + 
    '<AdminSidebar isMenuOpen={isMenuOpen} />' + 
    layoutContent.substring(endIndex);

// Add import to layout.tsx
let layoutFinal = layoutWithComponent.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect } from 'react';\nimport AdminSidebar from '@/components/AdminSidebar';"
);

// Create AdminSidebar.tsx
const sidebarComponentContent = `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar({ isMenuOpen }: { isMenuOpen: boolean }) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Products');

  return (
    <>
      ${sidebarContentRaw}
    </>
  );
}
`;

fs.writeFileSync(sidebarPath, sidebarComponentContent, 'utf8');
fs.writeFileSync(layoutPath, layoutFinal, 'utf8');

console.log('Sidebar extracted to components/AdminSidebar.tsx successfully!');

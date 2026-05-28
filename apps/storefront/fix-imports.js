const fs = require('fs');
const path = require('path');
const dirs = ['care-guide', 'cart', 'checkout', 'gift-cards', 'lookbook', 'membership', 'style-guide', 'order-confirmation', 'order-tracking'];

dirs.forEach(dir => {
  const filePath = path.join('src/app/(storefront)', dir, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let componentName = dir.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    let content = `"use client";\nimport { ${componentName} } from '../../../pages/${componentName}';\n\nexport default function Page() {\n  return <${componentName} />;\n}\n`;
    fs.writeFileSync(filePath, content);
  }
});

const productPath = 'src/app/(storefront)/product/[id]/page.tsx';
if (fs.existsSync(productPath)) {
  let content = `"use client";\nimport { ProductDetail } from '../../../../pages/ProductDetail';\n\nexport default function Page() {\n  return <ProductDetail />;\n}\n`;
  fs.writeFileSync(productPath, content);
}
console.log('Fixed imports for real');

const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'product/[id]', component: 'ProductDetail', importPath: '../../../../pages/ProductDetail' },
  { path: 'cart', component: 'Cart', importPath: '../../../pages/Cart' },
  { path: 'style-guide', component: 'StyleGuide', importPath: '../../../pages/StyleGuide' },
  { path: 'gift-cards', component: 'GiftCards', importPath: '../../../pages/GiftCards' },
  { path: 'lookbook', component: 'Lookbook', importPath: '../../../pages/Lookbook' },
  { path: 'membership', component: 'Membership', importPath: '../../../pages/Membership' },
  { path: 'care-guide', component: 'CareGuide', importPath: '../../../pages/CareGuide' },
  { path: 'checkout', component: 'Checkout', importPath: '../../../pages/Checkout' },
  { path: 'order-confirmation/[orderId]', component: 'OrderConfirmation', importPath: '../../../../pages/OrderConfirmation' },
  { path: 'tracking', component: 'OrderTracking', importPath: '../../../pages/OrderTracking' },
  { path: 'tracking/[orderId]', component: 'OrderTracking', importPath: '../../../../pages/OrderTracking' }
];

const baseDir = path.join(__dirname, 'apps', 'storefront', 'src', 'app');

routes.forEach(route => {
  const dirPath = path.join(baseDir, route.path);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const content = `"use client";\nimport { ${route.component} } from '${route.importPath}';\n\nexport default function Page() {\n  return <${route.component} />;\n}\n`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log('Created', dirPath);
});

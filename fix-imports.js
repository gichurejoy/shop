const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'product/[id]', importPath: '../../../pages/ProductDetail' },
  { path: 'cart', importPath: '../../pages/Cart' },
  { path: 'style-guide', importPath: '../../pages/StyleGuide' },
  { path: 'gift-cards', importPath: '../../pages/GiftCards' },
  { path: 'lookbook', importPath: '../../pages/Lookbook' },
  { path: 'membership', importPath: '../../pages/Membership' },
  { path: 'care-guide', importPath: '../../pages/CareGuide' },
  { path: 'checkout', importPath: '../../pages/Checkout' },
  { path: 'order-confirmation/[orderId]', importPath: '../../../pages/OrderConfirmation' },
  { path: 'tracking', importPath: '../../pages/OrderTracking' },
  { path: 'tracking/[orderId]', importPath: '../../../pages/OrderTracking' }
];

const baseDir = path.join(__dirname, 'apps', 'storefront', 'src', 'app');

routes.forEach(route => {
  const filePath = path.join(baseDir, route.path, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace any import path with the correct one
    content = content.replace(/from '.*pages\//, `from '${route.importPath.split('pages/')[0]}pages/`);
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
});

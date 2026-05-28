const fs = require('fs');
const sidebarPath = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/components/AdminSidebar.tsx';
let content = fs.readFileSync(sidebarPath, 'utf8');

// Replace \${pathname.startsWith with ${pathname.startsWith
content = content.replace(/\\\$\{pathname\.startsWith/g, '${pathname.startsWith');

fs.writeFileSync(sidebarPath, content, 'utf8');
console.log('Fixed syntax in AdminSidebar.tsx');

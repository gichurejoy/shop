const fs = require('fs');
const path = require('path');

const layoutFile = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin/layout.tsx';
let content = fs.readFileSync(layoutFile, 'utf8');

// Function to add active class to parent nav-link
const fixActive = (menuName, routePath) => {
    const regex = new RegExp(`(<a\\s*\\n\\s*className={\`nav-link menu-arrow )(\\\${expandedMenu === '${menuName}' \\? '' : 'collapsed'}\`})`, 'g');
    content = content.replace(regex, `$1\\\${pathname.startsWith('${routePath}') ? 'active' : ''} $2`);
};

fixActive('Products', '/admin/products');
fixActive('Category', '/admin/categories');
fixActive('Inventory', '/admin/inventory');
fixActive('Orders', '/admin/orders');
fixActive('Purchases', '/admin/purchases');
fixActive('Attributes', '/admin/attributes');
fixActive('Invoices', '/admin/invoices');
fixActive('Roles', '/admin/roles');
fixActive('Customers', '/admin/customers');
fixActive('Sellers', '/admin/sellers');
fixActive('Coupons', '/admin/coupons');

fs.writeFileSync(layoutFile, content, 'utf8');
console.log('Sidebar active states added!');

const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)';

const replacements = [
    { regex: /product-grid\.html/g, replacement: '/admin/products' },
    { regex: /product-list\.html/g, replacement: '/admin/products' },
    { regex: /product-details\.html/g, replacement: '/admin/products/1' },
    { regex: /product-add\.html/g, replacement: '/admin/products/new' },
    { regex: /product-edit\.html/g, replacement: '/admin/products/1/edit' },
    { regex: /category-list\.html/g, replacement: '/admin/categories' },
    { regex: /category-add\.html/g, replacement: '/admin/categories/new' },
    { regex: /category-edit\.html/g, replacement: '/admin/categories/1/edit' },
    { regex: /inventory-warehouse\.html/g, replacement: '/admin/inventory/warehouse' },
    { regex: /inventory-received-orders\.html/g, replacement: '/admin/inventory/received-orders' },
    { regex: /index\.html/g, replacement: '/admin' }
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            for (const r of replacements) {
                updated = updated.replace(r.regex, r.replacement);
            }
            // Also let's replace relative images in newly created category files!
            // We want all src="assets/images/" to become src="https://techzaa.in/larkon/admin/assets/images/"
            updated = updated.replace(/src="assets\/images\//g, 'src="https://techzaa.in/larkon/admin/assets/images/');
            updated = updated.replace(/src='assets\/images\//g, "src='https://techzaa.in/larkon/admin/assets/images/");
            
            if (updated !== content) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Replaced links in: ${fullPath}`);
            }
        }
    }
}

processDir(targetDir);
console.log("HTML links replacement completed!");

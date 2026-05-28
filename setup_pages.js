const fs = require('fs');
const path = require('path');

const scratchDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/6bd2ddf4-b3a2-42fe-baa7-72b50286bf43/scratch';
const outDir = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin';

const mappings = [
    { src: 'product-grid', dest: 'products/page.tsx', name: 'ProductsGrid' },
    { src: 'product-details', dest: 'products/[id]/page.tsx', name: 'ProductDetails' },
    { src: 'product-edit', dest: 'products/[id]/edit/page.tsx', name: 'ProductEdit' },
    { src: 'product-add', dest: 'products/new/page.tsx', name: 'ProductAdd' },
    { src: 'category-list', dest: 'categories/page.tsx', name: 'CategoryList' },
    { src: 'category-edit', dest: 'categories/[id]/edit/page.tsx', name: 'CategoryEdit' },
    { src: 'category-add', dest: 'categories/new/page.tsx', name: 'CategoryAdd' },
    { src: 'inventory-warehouse', dest: 'inventory/warehouse/page.tsx', name: 'InventoryWarehouse' },
    { src: 'inventory-received-orders', dest: 'inventory/received-orders/page.tsx', name: 'InventoryReceivedOrders' }
];

for (const m of mappings) {
    const srcPath = path.join(scratchDir, `${m.src}-jsx.txt`);
    const destPath = path.join(outDir, m.dest);
    
    if (fs.existsSync(srcPath)) {
        const jsx = fs.readFileSync(srcPath, 'utf8');
        const content = `import Link from "next/link";\n\nexport default function ${m.name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
        
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, content, 'utf8');
        console.log(`Created ${destPath}`);
    } else {
        console.error(`Missing ${srcPath}`);
    }
}

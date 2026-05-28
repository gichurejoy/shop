const fs = require('fs');
const path = require('path');

const adminDir = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin';
const productsDir = path.join(adminDir, 'products');
const gridDir = path.join(productsDir, 'grid');
const gridPage = path.join(gridDir, 'page.tsx');
const listPage = path.join(productsDir, 'page.tsx');
const scratchDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/6bd2ddf4-b3a2-42fe-baa7-72b50286bf43/scratch';
const listJsxPath = path.join(scratchDir, 'product-list-jsx.txt');

// 1. Create grid dir and move current page.tsx to grid/page.tsx
if (!fs.existsSync(gridDir)) {
    fs.mkdirSync(gridDir, { recursive: true });
}
if (fs.existsSync(listPage)) {
    fs.renameSync(listPage, gridPage);
    console.log("Moved products/page.tsx to products/grid/page.tsx");
}

// 2. Generate products/page.tsx from product-list-jsx.txt
if (fs.existsSync(listJsxPath)) {
    const jsx = fs.readFileSync(listJsxPath, 'utf8');
    const content = `import Link from "next/link";\n\nexport default function ProductsList() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
    fs.writeFileSync(listPage, content, 'utf8');
    console.log("Created products/page.tsx (List view)");
} else {
    console.log("product-list-jsx.txt not found");
}

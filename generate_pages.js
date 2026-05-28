const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\6bd2ddf4-b3a2-42fe-baa7-72b50286bf43\\scratch\\';
const appPath = 'c:\\Users\\ADMIN\\Desktop\\Project\\shop\\apps\\storefront\\src\\app\\(admin)\\admin\\products\\';

const mappings = [
    { name: 'product-list', path: 'page.tsx', componentName: 'ProductList' },
    { name: 'product-grid', path: 'grid\\page.tsx', componentName: 'ProductGrid' },
    { name: 'product-details', path: '[id]\\page.tsx', componentName: 'ProductDetails' },
    { name: 'product-add', path: 'new\\page.tsx', componentName: 'ProductAdd' },
    { name: 'product-edit', path: '[id]\\edit\\page.tsx', componentName: 'ProductEdit' }
];

for (const m of mappings) {
    try {
        let jsx = fs.readFileSync(basePath + m.name + '-jsx.txt', 'utf-8');
        
        // Since Link is imported, optionally replace <a href="..."> with <Link href="..."> 
        // This is complex with regex, we can just let it use <a> for now.
        // Wait, JSX requires <label for="..."> to be htmlFor, we already did that.
        // JSX requires checked instead of checked="", etc.
        jsx = jsx.replace(/checked=""/g, 'defaultChecked');
        jsx = jsx.replace(/selected=""/g, 'defaultValue');
        
        // Also some attributes like "readonly" -> "readOnly"
        jsx = jsx.replace(/readonly/g, 'readOnly');
        jsx = jsx.replace(/tabindex/g, 'tabIndex');

        const fullPath = path.join(appPath, m.path);
        
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });

        const content = `import Link from 'next/link';\n\nexport default function ${m.componentName}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
        fs.writeFileSync(fullPath, content);
        console.log(`Generated ${fullPath}`);
    } catch (err) {
        console.error(`Error generating ${m.name}: ${err.message}`);
    }
}

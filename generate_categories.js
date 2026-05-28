const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/ADMIN/.gemini/antigravity/brain/6bd2ddf4-b3a2-42fe-baa7-72b50286bf43/scratch/';
const appPath = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin/categories/';

const mappings = [
    { name: 'category-list', path: 'page.tsx', componentName: 'CategoryList' },
    { name: 'category-add', path: 'new\\page.tsx', componentName: 'CategoryAdd' },
    { name: 'category-edit', path: '[id]\\edit\\page.tsx', componentName: 'CategoryEdit' }
];

for (const m of mappings) {
    try {
        let jsx = fs.readFileSync(basePath + m.name + '-jsx.txt', 'utf-8');
        
        jsx = jsx.replace(/checked=""/g, 'defaultChecked');
        jsx = jsx.replace(/selected=""/g, 'defaultValue');
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

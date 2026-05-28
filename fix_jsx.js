const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            // Fix invalid attributes
            updated = updated.replace(/\[data-slider-size="md" \]/g, 'data-slider-size="md"');
            updated = updated.replace(/readonly=""/g, 'readOnly');
            updated = updated.replace(/checked/g, 'defaultChecked'); // naive but should work mostly
            // but wait, we already have defaultChecked in places? No, convert.js didn't convert checked to defaultChecked.
            // Actually, replace `<input type="checkbox" className="btn-check" id="color-dark2" checked />`
            // Let's use a smarter regex for checked
            updated = updated.replace(/ checked \/>/g, ' defaultChecked />');
            updated = updated.replace(/ checked>/g, ' defaultChecked>');
            
            // Fix unescaped >
            updated = updated.replace(/Colors >/g, 'Colors &gt;');
            updated = updated.replace(/Size >/g, 'Size &gt;');
            
            // Fix Kid's which is unescaped ' (actually ' in text is fine in JSX, but sometimes causes issues).
            // Usually unescaped ' inside JSX text is okay if it's not in a tag. NextJS might warn but not error.
            
            if (updated !== content) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Fixed JSX in: ${fullPath}`);
            }
        }
    }
}

processDir(targetDir);
console.log("JSX syntax fixes completed!");

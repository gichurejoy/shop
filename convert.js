const fs = require('fs');

function htmlToJsx(html) {
    let jsx = html;
    
    // Replace class= with className=
    jsx = jsx.replace(/class=/g, 'className=');
    
    // Replace for= with htmlFor=
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    
    // Close self-closing tags
    jsx = jsx.replace(/<img(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<img${p1} />`;
    });
    jsx = jsx.replace(/<input(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<input${p1} />`;
    });
    jsx = jsx.replace(/<br(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<br${p1} />`;
    });
    jsx = jsx.replace(/<hr(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<hr${p1} />`;
    });

    // Replace inline styles (basic parsing, very naive but good enough for common template styles)
    jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
        const rules = p1.split(';').filter(r => r.trim().length > 0);
        const styleObj = {};
        for (const rule of rules) {
            const parts = rule.split(':');
            if (parts.length >= 2) {
                let key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                // camelCase the key
                key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                styleObj[key] = value;
            }
        }
        return `style={${JSON.stringify(styleObj)}}`;
    });

    // Convert <!-- --> to {/* */}
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Replace javascript:void(0); with #!
    jsx = jsx.replace(/href="javascript:void\(0\);?"/g, 'href="#!"');
    jsx = jsx.replace(/href="javascript: void\(0\);?"/g, 'href="#!"');

    return jsx;
}

const basePath = 'C:/Users/ADMIN/.gemini/antigravity/brain/6bd2ddf4-b3a2-42fe-baa7-72b50286bf43/scratch/';
const targets = ['product-list', 'product-grid', 'product-details', 'product-add', 'product-edit', 'category-list', 'category-add', 'category-edit', 'inventory-warehouse', 'inventory-received-orders'];

for (const target of targets) {
    try {
        const html = fs.readFileSync(basePath + target + '-content.html', 'utf-8');
        const jsx = htmlToJsx(html);
        fs.writeFileSync(basePath + target + '-jsx.txt', jsx);
        console.log(`Converted ${target}`);
    } catch (err) {
        console.error(`Error with ${target}: ${err.message}`);
    }
}

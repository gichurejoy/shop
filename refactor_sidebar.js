const fs = require('fs');
const path = require('path');

const layoutFile = 'c:/Users/ADMIN/Desktop/Project/shop/apps/storefront/src/app/(admin)/admin/layout.tsx';
let content = fs.readFileSync(layoutFile, 'utf8');

// Add expandedMenu state
if (!content.includes('expandedMenu')) {
    content = content.replace(
        'const [isMenuOpen, setIsMenuOpen] = useState(true);',
        'const [isMenuOpen, setIsMenuOpen] = useState(true);\n  const [expandedMenu, setExpandedMenu] = useState<string | null>(\'Products\');'
    );
}

// Regex to find sidebar sections
// Pattern:
// <a className="nav-link menu-arrow" data-bs-toggle="collapse" href="#sidebarProducts">
//   ...
// </a>
// <div className="collapse show" id="sidebarProducts"> or <div className="collapse" id="sidebarProducts">

const sectionRegex = /<a className="nav-link menu-arrow" data-bs-toggle="collapse" href="#sidebar([a-zA-Z0-9_]+)">([\s\S]*?)<\/a>\s*<div className="collapse( show)?" id="sidebar\1">/g;

content = content.replace(sectionRegex, (match, menuName, innerContent) => {
    const isShow = match.includes('collapse show');
    
    return `<a 
                className={\`nav-link menu-arrow \${expandedMenu === '${menuName}' ? '' : 'collapsed'}\`} 
                onClick={(e) => { e.preventDefault(); setExpandedMenu(expandedMenu === '${menuName}' ? null : '${menuName}'); }} 
                href="#!"
                aria-expanded={expandedMenu === '${menuName}'}
              >${innerContent}</a>
              <div className={\`collapse \${expandedMenu === '${menuName}' ? 'show' : ''}\`} id="sidebar${menuName}">`;
});

fs.writeFileSync(layoutFile, content, 'utf8');
console.log('Sidebar refactored to native React state!');

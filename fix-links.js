const fs = require('fs');
const path = require('path');

function fixLinks(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixLinks(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Replace to= with href= inside JSX
      content = content.replace(/\bto={/g, 'href={');
      content = content.replace(/\bto="/g, 'href="');
      content = content.replace(/\bto='/g, "href='");

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed links in', fullPath);
      }
    }
  }
}

fixLinks(path.join(__dirname, 'apps', 'storefront', 'src'));

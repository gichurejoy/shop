const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add "use client" if it has hooks
  if (content.includes('useState') || content.includes('useEffect') || content.includes('useParams') || content.includes('useNavigate') || content.includes('useLocation') || content.includes('useRouter') || content.includes('usePathname')) {
    if (!content.includes('"use client"')) {
      content = '"use client";\n\n' + content;
      changed = true;
    }
  }

  // Replace Link
  if (content.includes('import { Link } from \'react-router-dom\'')) {
    content = content.replace(/import \{ Link \} from 'react-router-dom';?/g, "import Link from 'next/link';");
    changed = true;
  }
  
  if (content.includes('import { useParams, Link } from \'react-router-dom\'')) {
    content = content.replace(/import \{ useParams, Link \} from 'react-router-dom';?/g, "import Link from 'next/link';\nimport { useParams } from 'next/navigation';");
    changed = true;
  }

  if (content.includes('import { Link, useParams } from \'react-router-dom\'')) {
    content = content.replace(/import \{ Link, useParams \} from 'react-router-dom';?/g, "import Link from 'next/link';\nimport { useParams } from 'next/navigation';");
    changed = true;
  }
  
  if (content.includes('import { Link, useNavigate } from \'react-router-dom\'')) {
    content = content.replace(/import \{ Link, useNavigate \} from 'react-router-dom';?/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';");
    // Replace useNavigate() with useRouter()
    content = content.replace(/useNavigate\(\)/g, "useRouter()");
    changed = true;
  }

  if (content.includes('import { useParams, useNavigate } from \'react-router-dom\'')) {
    content = content.replace(/import \{ useParams, useNavigate \} from 'react-router-dom';?/g, "import { useParams, useRouter } from 'next/navigation';");
    content = content.replace(/useNavigate\(\)/g, "useRouter()");
    changed = true;
  }

  if (content.includes('import { Link, useLocation } from \'react-router-dom\'')) {
    content = content.replace(/import \{ Link, useLocation \} from 'react-router-dom';?/g, "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';");
    content = content.replace(/const location = useLocation\(\)/g, "const pathname = usePathname()");
    content = content.replace(/location\.pathname/g, "pathname"); 
    changed = true;
  }

  // Also replace `to=` with `href=` in `<Link>` tags
  if (content.includes('<Link ')) {
    content = content.replace(/<Link ([^>]*)to=/g, "<Link $1href=");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'apps', 'storefront', 'src'));

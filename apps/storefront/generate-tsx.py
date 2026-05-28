import os
import re

pages = {
    'customer-list': 'customers/page.tsx',
    'customer-detail': 'customers/details/page.tsx',
    'settings': 'settings/page.tsx',
    'calendar': 'apps/calendar/page.tsx'
}

for page, target_path in pages.items():
    with open(f'{page}-jsx.txt', 'r', encoding='utf-8') as f:
        jsx_content = f.read()
    
    # Remove script tags that cause issues in React
    jsx_content = re.sub(r'<script.*?</script>', '', jsx_content, flags=re.DOTALL)
    
    # Fix the unescaped characters in JSX
    jsx_content = jsx_content.replace('<!--', '{/*').replace('-->', '*/}')
    jsx_content = jsx_content.replace('href="javascript: void(0);"', 'href="#!"')
    jsx_content = jsx_content.replace('href="javascript:void(0);"', 'href="#!"')
    
    # Remove novalidate="" attribute which causes issues
    jsx_content = jsx_content.replace('novalidate=""', 'noValidate')
    # replace class= with className= (already done but just in case)
    # Fix self closing input
    
    component_name = ''.join(word.title() for word in page.split('-')) + 'Page'
    
    react_code = f"""'use client';

import Link from 'next/link';

export default function {component_name}() {{
  return (
    <>
      {jsx_content}
    </>
  );
}}
"""
    
    full_path = os.path.join('src', 'app', '(admin)', 'admin', target_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(react_code)

import re

def ext(f):
    try:
        h = open(f, 'r', encoding='utf-8').read()
        
        # Find page content start
        idx = h.find('<div class="page-content">')
        if idx == -1:
            print('No page-content found in ' + f)
            return
            
        sub_h = h[idx:]
        # Find container and extract exactly up to End Container Fluid
        # Notice we don't capture the <div class="container...">, we start AFTER it.
        # Wait, using regex to extract inside is easier:
        match = re.search(r'<div class="container-(?:fluid|xxl)">([\s\S]*?)</div>\s*<!-- End Container Fluid -->', sub_h)
        if match:
            content = match.group(1).strip()
            with open(f.replace('.html', '-content.html'), 'w', encoding='utf-8') as out:
                out.write(content)
            print('Extracted ' + f)
        else: 
            print('Failed ' + f)
    except Exception as e: print(e)

for name in ['product-list', 'product-grid', 'product-details', 'product-add', 'product-edit', 'category-list', 'category-add', 'category-edit', 'inventory-warehouse', 'inventory-received-orders']:
    ext('C:/Users/ADMIN/.gemini/antigravity/brain/6bd2ddf4-b3a2-42fe-baa7-72b50286bf43/scratch/' + name + '.html')

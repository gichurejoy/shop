import re

def html_to_jsx(html):
    html = html.replace('class=', 'className=')
    html = re.sub(r'<(img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2 />', html)
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('selected', 'defaultValue')
    html = html.replace('checked', 'defaultChecked')
    html = html.replace('tabindex', 'tabIndex')
    html = re.sub(r'style=\'(.*?)\'', r'', html)
    html = re.sub(r'style=\"(.*?)\"', r'', html)
    return html

for page in ['customer-list', 'customer-detail', 'settings', 'calendar']:
    with open(f'{page}-extracted.html', encoding='utf-16') as f:
        html = f.read()
    jsx = html_to_jsx(html)
    with open(f'{page}-jsx.txt', 'w', encoding='utf-8') as f:
        f.write(jsx)

import urllib.request
import os

base_url = "https://techzaa.in/larkon/admin/"
dest_dir = "C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\6bd2ddf4-b3a2-42fe-baa7-72b50286bf43\\scratch\\"

os.makedirs(dest_dir, exist_ok=True)

files = ["category-list.html", "category-add.html", "category-edit.html"]

for f in files:
    url = base_url + f
    dest = os.path.join(dest_dir, f)
    print(f"Downloading {url} to {dest}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print("Success")
    except Exception as e:
        print(f"Failed: {e}")

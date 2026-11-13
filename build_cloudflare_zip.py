import os
import re
import shutil
import tempfile
import zipfile

dist_dir = 'dist'
output_zips = [
    'public/cloudflare-pages-dist.zip',
    'public/quiet-sales-engine-built.zip',
]

forbidden_substrings = [
    'bareglow',
    'poultry',
    'chicken',
    'oshaprapra',
    'extracted_logo',
    'cloudflare-pages-dist.zip',
    'quiet-sales-engine-built.zip',
    'the-quiet-sales-engine.zip',
    'the-no-reels-system.zip',
    'biasharabase-digital-guide.zip',
    'the-quiet-sales-engine.pdf',
    'assets/aistudio',
]

if not os.path.exists(dist_dir):
    raise SystemExit('dist/ directory not found. Run npm run build first.')

with tempfile.TemporaryDirectory() as tmp_dir:
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
            lower_rel = rel_path.lower()
            if any(bad in lower_rel for bad in forbidden_substrings):
                continue

            # Flatten dist/assets/* directly to root so GitHub web "choose your files" keeps everything working
            target_name = os.path.basename(rel_path) if rel_path.startswith('assets/') else rel_path
            dest_path = os.path.join(tmp_dir, target_name)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(full_path, dest_path)

    # Rewrite asset paths in index.html and sw.js to root
    index_path = os.path.join(tmp_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            html = f.read()
        html = html.replace('"/assets/', '"/').replace("'/assets/", "'/")
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(html)

        # Verify flattened JS and CSS exist at root
        for match in re.findall(r'(?:src|href)=["\']/([^"\']+\.(?:js|css))["\']', html):
            assert os.path.exists(os.path.join(tmp_dir, match)), f'Missing root asset referenced in index.html: {match}'

    sw_path = os.path.join(tmp_dir, 'sw.js')
    if os.path.exists(sw_path):
        with open(sw_path, 'r', encoding='utf-8') as f:
            sw_code = f.read()
        sw_code = sw_code.replace('"assets/', '"').replace("'assets/", "'")
        with open(sw_path, 'w', encoding='utf-8') as f:
            f.write(sw_code)

    for output_zip in output_zips:
        included_files = []
        with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(tmp_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, tmp_dir).replace('\\', '/')
                    zf.write(full_path, rel_path)
                    included_files.append(rel_path)
            wrangler_jsonc = '''{
  "name": "engin",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./",
    "not_found_handling": "single-page-application"
  }
}
'''
            zf.writestr('wrangler.jsonc', wrangler_jsonc)
            included_files.append('wrangler.jsonc')
        size_kb = os.path.getsize(output_zip) / 1024
        print(f'Built {output_zip}: {size_kb:.2f} KB ({len(included_files)} flat files)')
        print('Files:', sorted(included_files))

import os
import zipfile
import shutil
import subprocess

staging_dir = '/tmp/the-quiet-sales-engine'
if os.path.exists(staging_dir):
    shutil.rmtree(staging_dir)
os.makedirs(staging_dir, exist_ok=True)

# 1. Exact list of clean source & asset files for THE QUIET SALES ENGINE (GitHub + Cloudflare Pages ready)
files_to_copy = [
    'index.html',
    'vite.config.ts',
    'tsconfig.json',
    'metadata.json',
    'firebase-applet-config.json',
    'firebase-blueprint.json',
    'firestore.rules',
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/firebase.ts',
    'src/services/engineFirestoreService.ts',
    'src/components/BiasharaBaseApp.tsx',
    'src/components/BiasharaSalesLanding.tsx',
    'src/components/SellerAdminDashboard.tsx',
    'src/data/biasharaGuideData.ts',
    'src/types/biashara.ts',
    'src/utils/security.ts',
    'public/_redirects',
    'public/manifest.json',
    'public/apple-touch-icon.png',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/The-Quiet-Sales-Engine-8-Chapters.pdf'
]

for rel_path in files_to_copy:
    src_file = os.path.join('.', rel_path)
    if os.path.exists(src_file):
        dest_file = os.path.join(staging_dir, rel_path)
        os.makedirs(os.path.dirname(dest_file), exist_ok=True)
        shutil.copy2(src_file, dest_file)
        print('Included:', rel_path)
    else:
        print('Warning missing file:', rel_path)

# 2. Standalone clean package.json for GitHub -> Cloudflare Pages (includes vite-plugin-pwa)
clean_package_json = '''{
  "name": "the-quiet-sales-engine",
  "private": true,
  "version": "2.0.0",
  "description": "THE QUIET SALES ENGINE · BiasharaBase.com 5-Part Digital Product & Social Selling Engine",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "firebase": "^13.2.0",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2",
    "vite-plugin-pwa": "^2.0.0"
  }
}
'''
with open(os.path.join(staging_dir, 'package.json'), 'w') as f:
    f.write(clean_package_json.strip() + '\n')

# 3. Clean .gitignore & .nvmrc (ensures Cloudflare Pages uses Node 20 automatically)
gitignore_content = '''node_modules/
build/
dist/
dev-dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
'''
with open(os.path.join(staging_dir, '.gitignore'), 'w') as f:
    f.write(gitignore_content)

with open(os.path.join(staging_dir, '.nvmrc'), 'w') as f:
    f.write('24\n')

with open(os.path.join(staging_dir, '.npmrc'), 'w') as f:
    f.write('legacy-peer-deps=true\n')

wrangler_config = '''{
  "name": "engin",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
'''
with open(os.path.join(staging_dir, 'wrangler.jsonc'), 'w') as f:
    f.write(wrangler_config.strip() + '\n')

# Generate clean package-lock.json so Cloudflare auto-detects npm (and never bun)
subprocess.run(
    ['npm', 'install', '--package-lock-only', '--no-audit', '--no-fund'],
    cwd=staging_dir,
    check=True
)

# 4. Comprehensive README.md with GitHub + Cloudflare Pages deployment instructions
readme_content = '''# THE QUIET SALES ENGINE · BiasharaBase.com

The official **Quiet Sales Engine** (No-Reels Text & DM System) for selling digital products, templates, and freelance services on **biasharabase.com**.

## What is Included
1. **Public Sales Page:** 5-question clarity overview, Who This Helps vs Who Should Not Buy, 7-Day Preview, Template Vault preview, Tanzanian TSh examples, Case Studies, Conversation Map, and Dual Payment Paths.
2. **Buyer Onboarding & 9-Tab Interactive Workspace:** Start Here (7-Day Plan), Build My Offer, What Should I Post?, 20-Template Vault, DM Scripts, Tanzanian Examples, Conversation Map, Case Studies, and Weekly Scorecard.
3. **Private Seller Admin Dashboard (`BB-ADMIN-2025`):** Manage customer access codes, search by email/order ID, revoke/restore codes, resend access emails, update pricing/mobile number (`0757 895 896` · `SARAH KAPUYA`), and connect Selar + Make.com + Supabase.
4. **Cloud Sync & Offline PWA Support:** Real-time Firestore database sync, Supabase verification mirror support, and printable PDF manual (`public/The-Quiet-Sales-Engine-8-Chapters.pdf`).

## Run Locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Cloudflare Workers or Pages via GitHub
1. Unzip this folder and upload the **contents inside** directly to the root `/` of your GitHub repository (so `package.json`, `package-lock.json`, and `wrangler.jsonc` are at the top level).
2. **Recommended (Cloudflare Pages):** In Cloudflare Dashboard, go to **Workers & Pages → Create → Pages tab → Import an existing Git repository** with:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **If using Cloudflare Workers Builds (`npx wrangler deploy`):** Set:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy --assets ./dist`
   - **Root directory:** `/`
4. Click **Save and Deploy**.
5. Once live, open **Custom domains → Set up a custom domain** and enter `engine.biasharabase.com`.

---
© BiasharaBase (biasharabase.com). All rights reserved.
'''
with open(os.path.join(staging_dir, 'README.md'), 'w') as f:
    f.write(readme_content.strip() + '\n')

# 5. Generate clean ZIP archives
zip_destinations = [
    'public/the-quiet-sales-engine.zip',
    'public/the-no-reels-system.zip',
    'public/biasharabase-digital-guide.zip'
]

for zip_path in zip_destinations:
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(staging_dir):
            for file in files:
                filepath = os.path.join(root, file)
                arcname = os.path.relpath(filepath, staging_dir)
                zipf.write(filepath, arcname)
    size_kb = os.path.getsize(zip_path) / 1024
    print(f'Successfully built {zip_path}: {size_kb:.2f} KB')

# 6. Verify contents
with zipfile.ZipFile('public/the-quiet-sales-engine.zip', 'r') as z:
    file_list = z.namelist()
    print('Total files in clean engine zip:', len(file_list))
    print('All files in zip:', file_list)
    forbidden = [f for f in file_list if any(w in f.lower() for w in ['bareglow', 'poultry', 'salon', 'chicken', 'vincent', 'vince', 'kats'])]
    print('Forbidden files found:', forbidden)
    assert len(forbidden) == 0, f'Found forbidden files: {forbidden}'

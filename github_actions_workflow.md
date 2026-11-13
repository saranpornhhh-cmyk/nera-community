name: Deploy NERA to GitHub Pages

on:
  # ทำงานอัตโนมัติเมื่อมีการ Push โค้ดขึ้นกิ่ง main
  push:
    branches: ["main"]
  # อนุญาตให้กดสั่งรัน Workflow นี้ด้วยตัวเองจากหน้าเว็บ GitHub
  workflow_dispatch:

# ตั้งค่าสิทธิ์การเข้าถึงสำหรับ GITHUB_TOKEN เพื่อให้สามารถเผยแพร่ลง GitHub Pages ได้
permissions:
  contents: read
  pages: write
  id-token: write

# ป้องกันไม่ให้การ Deploy ทำงานซ้อนทับกัน
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm install

      - name: Build Project for Production
        run: npm run build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4

      - name: Upload Build Artifact (dist folder)
        uses: actions/upload-pages-artifact@v3
        with:
          # ระบุโฟลเดอร์ที่ได้จากการ Build (Vite ใช้โฟลเดอร์ dist)
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
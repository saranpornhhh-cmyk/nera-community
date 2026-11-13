import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // การตั้งค่า base path ให้ตรงกับชื่อ Repository ของ GitHub
  // เพื่อป้องกันปัญหาหาไฟล์ JavaScript, CSS หรือ Assets ไม่พบเมื่อ Deploy
  base: '/nera-community/',
})
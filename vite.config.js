import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/qr-tools-hub/', // 👈 repo name for GitHub Pages
})

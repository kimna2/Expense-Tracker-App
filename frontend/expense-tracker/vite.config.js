import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,

    proxy: {
      '/api': {
        target: 'https://killingly-unstained-trang.ngrok-free.dev', // 🔴 LINK NGROK BACKEND
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

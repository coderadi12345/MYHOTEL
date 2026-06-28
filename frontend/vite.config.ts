import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/hotel-api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hotel-api/, '/api/v1'),
      },
      '/booking-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/booking-api/, '/api/v1'),
      },
      '/notification-api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notification-api/, '/api/v1'),
      },
    },
  },
})

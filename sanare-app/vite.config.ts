import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173, // Use 5173 for Vite frontend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend runs on 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this server proxy configuration
  server: {
    proxy: {
      '/api': {
        target: 'https://eduspark-vdqw.vercel.app', // Your local backend URL
        changeOrigin: true,
      }
    }
  }
})
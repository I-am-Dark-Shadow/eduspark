import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this server proxy configuration for local development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your local backend URL
        changeOrigin: true,
      }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5000', // Replace with your API's base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Removes '/api' prefix
      },
    },
  },
})

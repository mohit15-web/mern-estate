import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // target: 'https://mern-estate-li4s.onrender.com',
        target: 'http://localhost:1234',
        secure: false
      }
    }
  },
  plugins: [react()],
})

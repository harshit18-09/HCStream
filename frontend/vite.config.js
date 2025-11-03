import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests during dev to avoid CORS and make cookies work
    proxy: {
      // forward any /api/* request to backend running on port 8000
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        // keep path as-is: /api/v1/... -> http://localhost:8000/api/v1/...
      },
    },
  },
})

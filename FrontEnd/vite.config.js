import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Generate source maps for better debugging in production
    sourcemap: true,
    // Optimize build output
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['d3']
        }
      }
    }
  },
  // Handle SPA routing for Vercel
  // This ensures that routes like /saved-builds work even on page refresh
  preview: {
    port: 5173,
    strictPort: true,
  }
})

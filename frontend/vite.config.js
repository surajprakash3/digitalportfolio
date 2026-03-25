import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
})

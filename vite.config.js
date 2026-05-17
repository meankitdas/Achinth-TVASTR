import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting — keeps main bundle lean.
         * Three.js is split into its own chunk so the main app
         * code loads faster and is cached separately.
         */
        manualChunks: {
          // Obfuscated chunk names to reduce technology fingerprinting
          'v-r': ['react', 'react-dom', 'react-router-dom'],
          'v-t': ['three'],
          'v-s': ['@supabase/supabase-js'],
          'v-p': ['html2canvas', 'jspdf'],
        },
      },
    },
    // Raise warning threshold — Three.js vendor chunk is intentionally large
    chunkSizeWarningLimit: 700,
  },
})

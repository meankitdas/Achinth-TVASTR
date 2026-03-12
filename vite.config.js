import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting — keeps main bundle lean.
         * Three.js + R3F are split into their own chunk so the
         * main app code loads faster and is cached separately.
         */
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Three.js rendering stack (large but cacheable)
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Supabase auth client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Raise warning threshold — Three.js vendor chunk is intentionally large
    chunkSizeWarningLimit: 700,
  },
})

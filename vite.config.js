import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    // Optimisation du bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'utils': ['axios', 'dayjs']
        }
      }
    },
    // Taille limite avant warning
    chunkSizeWarningLimit: 500,
    // Minification avec esbuild (inclus par défaut)
    minify: 'esbuild'
  },

  // Optimisation du dev server
  server: {
    port: 3000,
    open: true
  },

  // Preview server
  preview: {
    port: 4173
  }
})

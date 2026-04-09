import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap':  ['gsap', '@gsap/react'],
          'vendor-lenis': ['lenis'],
        },
      },
    },
    assetsInlineLimit: 4096,
    target: 'es2020',
  },
})

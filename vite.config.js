import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          animacao: ['gsap', 'lenis']
        }
      }
    }
  }
})

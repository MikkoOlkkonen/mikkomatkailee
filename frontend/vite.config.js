import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MikkoMatkailee',
        short_name: 'MM',
        description: 'Vapaan sanan alusta. Postaile vapaasti, ilmaise vapaasti',
        theme_color: '#ffffff',
      },
    })
  ],
  server: { proxy: {
    '/api': {
      target: 'http://localhost:3003',
      changeOrigin: true,
    },
  },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js' }
})

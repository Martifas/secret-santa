import { fileURLToPath, URL } from 'node:url'
import svgr from 'vite-svg-loader'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    allowedHosts: [
      'giftmeister.eu',
      'secret-santa.y3peb2c7ghy0t.eu-central-1.cs.amazonlightsail.com',
    ],
  },
})

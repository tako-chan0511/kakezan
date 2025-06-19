import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  

// https://vite.dev/config/
export default defineConfig({
  base: '/kakezan/',
  plugins: [vue()],
   resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

})

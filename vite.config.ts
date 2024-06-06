import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components'),
      '@layout': resolve('src/layout'),
      '@router': resolve('src/router'),
      '@services': resolve('src/services'),
      '@store': resolve('src/store'),
      '@utils': resolve('src/utils'),
      '@views': resolve('src/views'),
      '@hooks': resolve('src/hooks'),
      '@directives': resolve('src/directives')
    }
  }
})

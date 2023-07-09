import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  base: './',

  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:10061',
        changeOrigin: true,
        rewrite: path => path.replace('/^\/api/', '/api')
      },
      '/api/v1/repo/ws': {
        target: 'ws://127.0.0.1:10061',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace('/^\/api/v1/repo/ws/', '/api/v1/repo/ws')
      },
      '/api/v1/repo/version/ws': {
        target: 'ws://127.0.0.1:10061',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace('/^\/api/v1/repo/version/ws/', '/api/v1/repo/version/ws')
      }
    }
  }
})

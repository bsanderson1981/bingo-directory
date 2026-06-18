import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ftc-rss': {
        target: 'https://consumer.ftc.gov/blog/gd-rss.xml',
        changeOrigin: true,
        rewrite: (path) => '',
      },
      '/api/substack-rss': {
        target: 'https://olderfriends.substack.com/feed',
        changeOrigin: true,
        rewrite: (path) => '',
      },
    },
  },
})

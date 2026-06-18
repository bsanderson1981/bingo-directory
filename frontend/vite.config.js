import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-hide-event',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/hide-event') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { name, city } = JSON.parse(body);
                const filePath = path.join(__dirname, 'public/data/manual_review.json');
                if (fs.existsSync(filePath)) {
                  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                  const updated = data.map(item => {
                    if (item.name === name && item.city === city) {
                      return { ...item, hidden: true };
                    }
                    return item;
                  });
                  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
                  
                  // Also write to dist/data/manual_review.json if it exists
                  const distPath = path.join(__dirname, 'dist/data/manual_review.json');
                  if (fs.existsSync(distPath)) {
                    fs.writeFileSync(distPath, JSON.stringify(updated, null, 2), 'utf-8');
                  }
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'manual_review.json not found' }));
                }
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
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


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
          if (req.method === 'POST' && req.url === '/api/hide-events') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { events } = JSON.parse(body);
                const filePath = path.join(__dirname, 'public/data/manual_review.json');
                if (fs.existsSync(filePath)) {
                  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                  const updated = data.map(item => {
                    const shouldHide = events.some(e => e.name === item.name && e.city === item.city);
                    if (shouldHide) {
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
          } else if (req.method === 'POST' && req.url === '/api/approve-events') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { events } = JSON.parse(body);
                const manualFilePath = path.join(__dirname, 'public/data/manual_review.json');
                const directoryFilePath = path.join(__dirname, 'public/data/bingo_directory.json');
                
                if (fs.existsSync(manualFilePath) && fs.existsSync(directoryFilePath)) {
                  let manualData = JSON.parse(fs.readFileSync(manualFilePath, 'utf-8'));
                  let directoryData = JSON.parse(fs.readFileSync(directoryFilePath, 'utf-8'));
                  
                  const approvedItems = [];
                  const remainingManualItems = [];
                  
                  manualData.forEach(item => {
                    const isApproved = events.some(e => e.name === item.name && e.city === item.city);
                    if (isApproved) {
                      approvedItems.push(item);
                    } else {
                      remainingManualItems.push(item);
                    }
                  });
                  
                  approvedItems.forEach(item => {
                    const isDuplicate = directoryData.some(d => 
                      d.name.toLowerCase() === item.name.toLowerCase() &&
                      d.city.toLowerCase() === item.city.toLowerCase()
                    );
                    
                    if (!isDuplicate) {
                      const newItem = { ...item };
                      delete newItem.reason;
                      delete newItem.scraped_at;
                      delete newItem.hidden;
                      
                      newItem.id = `bingo-${(newItem.state || 'us').toLowerCase()}-${String(directoryData.length + 1).padStart(3, '0')}`;
                      newItem.verified_at = new Date().toISOString().split('T')[0];
                      
                      directoryData.push(newItem);
                    }
                  });
                  
                  fs.writeFileSync(manualFilePath, JSON.stringify(remainingManualItems, null, 2), 'utf-8');
                  fs.writeFileSync(directoryFilePath, JSON.stringify(directoryData, null, 2), 'utf-8');
                  
                  const distManualPath = path.join(__dirname, 'dist/data/manual_review.json');
                  const distDirectoryPath = path.join(__dirname, 'dist/data/bingo_directory.json');
                  if (fs.existsSync(distManualPath)) {
                    fs.writeFileSync(distManualPath, JSON.stringify(remainingManualItems, null, 2), 'utf-8');
                  }
                  if (fs.existsSync(distDirectoryPath)) {
                    fs.writeFileSync(distDirectoryPath, JSON.stringify(directoryData, null, 2), 'utf-8');
                  }
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Data files not found' }));
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


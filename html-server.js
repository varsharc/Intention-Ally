const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a server that serves a static HTML file with our UI components
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle different routes
  if (req.url === '/' || req.url === '/index.html') {
    // Serve the main HTML with UI components
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading index.html: ${err.message}`);
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else if (req.url === '/api/health') {
    // API health check
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'HTML server is healthy' }));
  } else {
    // Not found
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTML server running at http://0.0.0.0:${PORT}`);
});
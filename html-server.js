const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
    console.log('Served index.html');
  } else if (req.url === '/test') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('test-accessibility.html').pipe(res);
    console.log('Served test-accessibility.html');
  } else if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ status: 'ok' }));
    console.log('Health check');
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
    console.log(`404 for ${req.url}`);
  }
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
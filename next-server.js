// Enhanced Next.js server that runs on port 5000 using Express
// This is a custom server for Next.js with comprehensive CORS and headers for Replit

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Adding console.time to track server performance
console.time('Server Ready');

app.prepare().then(() => {
  const server = express();
  
  // Enable CORS with comprehensive headers
  server.use((req, res, next) => {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Accept-Version, X-Api-Version');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Replit-specific headers
    res.header('X-Frame-Options', 'ALLOWALL');
    res.header('Cache-Control', 'no-store, must-revalidate');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    next();
  });
  
  // Record server start time for performance tracking
  const serverStartTime = Date.now();
  
  // Debug logging for all requests
  server.use((req, res, next) => {
    console.log(`Time ${Date.now() - serverStartTime}ms: ${req.method} ${req.url}`);
    next();
  });
  
  // Let Next.js handle all routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Listen on all interfaces
  server.listen(5000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.timeEnd('Server Ready');
    console.log('> Ready on http://0.0.0.0:5000');
  });
});
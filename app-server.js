const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'ALLOWALL');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Application is running' });
});

// Handle all backend API calls
app.use('/api', (req, res, next) => {
  const apiUrl = `http://0.0.0.0:8002${req.url}`;
  console.log(`Proxying API request to: ${apiUrl}`);
  
  // Simple proxying for GET requests
  if (req.method === 'GET') {
    fetch(apiUrl)
      .then(apiRes => apiRes.json())
      .then(data => res.json(data))
      .catch(err => {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Failed to fetch from API' });
      });
  } else {
    // Other method types would need more complex handling
    res.status(405).json({ error: 'Method not supported' });
  }
});

// Load Next.js app and use it for all other routes
nextApp.prepare().then(() => {
  // Let Next.js handle all other routes
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  const PORT = 5000;
  createServer(app).listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${PORT}`);
  });
});
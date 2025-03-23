const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express application
const app = express();
const PORT = 5000; // Must use port 5000 for Replit

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
  credentials: true
}));

// Set Replit-specific headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Simple request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static test HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// API route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server is healthy' });
});

// API route for request headers - useful for debugging
app.get('/api/headers', (req, res) => {
  res.json({
    headers: req.headers,
    ip: req.ip || req.connection.remoteAddress,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query
  });
});

// Proxy API requests to the FastAPI backend
app.use('/api/backend', createProxyMiddleware({
  target: 'http://localhost:8002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/backend': '', // remove the /api/backend path
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Unable to reach the backend server',
      error: err.message
    });
  }
}));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${PORT}`);
  console.log(`API health check available at http://0.0.0.0:${PORT}/api/health`);
  console.log(`Access test page at http://0.0.0.0:${PORT}/`);
});
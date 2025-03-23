const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// For health checks and status
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Proxy all other requests to Next.js app
app.use('/', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}));

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
});
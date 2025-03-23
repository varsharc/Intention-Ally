const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// Ensure we're using port 5000 for Replit compatibility
const PORT = process.env.PORT || 5000;

// Prepare the Next.js app
app.prepare().then(() => {
  const server = express();
  
  // Logging middleware
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
  
  // Enable CORS
  server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
    credentials: true
  }));
  
  // Set Replit-specific headers
  server.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
  // API route for health check
  server.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Next.js server is healthy' });
  });
  
  // API route for request headers - useful for debugging
  server.get('/api/headers', (req, res) => {
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
  server.use('/api/backend', createProxyMiddleware({
    target: 'http://0.0.0.0:8002',
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
    },
    logLevel: 'debug'
  }));
  
  // Let Next.js handle everything else
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Start the server
  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${PORT}`);
    console.log(`> API health check available at http://0.0.0.0:${PORT}/api/health`);
    console.log(`> FastAPI backend proxy at http://0.0.0.0:${PORT}/api/backend`);
  });
});
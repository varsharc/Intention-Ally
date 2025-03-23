const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// Ensure we're using port 5000 for Replit compatibility
const PORT = process.env.PORT || 3000;

// Prepare the Next.js app
app.prepare().then(() => {
  const server = express();
  
  // Serve static files
  server.use(express.static(path.join(__dirname, 'public')));
  
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
    res.json({ 
      status: 'ok', 
      message: 'Next.js server is healthy',
      timestamp: new Date().toISOString(),
      env: {
        node_env: process.env.NODE_ENV,
        port: PORT
      }
    });
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
  
  // Deployment page route
  server.get('/deploy', (req, res) => {
    try {
      const deployHtml = fs.readFileSync(path.join(__dirname, 'deploy.html'), 'utf8');
      res.send(deployHtml);
    } catch (err) {
      console.error('Error serving deployment page:', err);
      res.status(500).send('Error loading deployment page');
    }
  });
  
  // API route for deployment status
  server.get('/api/deploy-status', (req, res) => {
    res.json({
      status: 'ready',
      message: 'Intention-Ally application is ready for deployment',
      features: [
        'Interactive Knowledge Graph',
        'Enhanced Trend Visualization',
        'Firebase Storage Optimization',
        'Keyword Analysis',
        'Cross-browser Compatibility'
      ],
      timestamp: new Date().toISOString()
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
    console.log(`> Deployment page available at http://0.0.0.0:${PORT}/deploy`);
  });
});
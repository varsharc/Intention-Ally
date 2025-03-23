/**
 * Simple production server for Intention-Ally
 * Combines both Express and Next.js functionality
 */

const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

// Production configuration
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 5000;

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
  
  // Set security headers
  server.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });
  
  // API route for health check
  server.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Intention-Ally server is healthy',
      env: {
        node_env: process.env.NODE_ENV,
        port: PORT
      }
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
      status: 'production',
      message: 'Intention-Ally application is running in production mode',
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
  
  // Proxy API requests to the FastAPI backend (when available)
  server.use('/api/backend', createProxyMiddleware({
    target: process.env.BACKEND_URL || 'http://localhost:8002',
    changeOrigin: true,
    pathRewrite: {
      '^/api/backend': '',
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.status(503).json({
        status: 'error',
        message: 'Backend service unavailable',
        error: err.message
      });
    },
    logLevel: 'warn'
  }));
  
  // Let Next.js handle everything else
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Start the server
  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Production server ready on http://0.0.0.0:${PORT}`);
    console.log(`> Deployment page available at http://0.0.0.0:${PORT}/deploy`);
  });
}).catch(err => {
  console.error('Error starting production server:', err);
  process.exit(1);
});
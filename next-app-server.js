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
const PORT = process.env.PORT || 5000;

// Prepare the Next.js app
app.prepare().then(() => {
  const server = express();
  
  // Basic middleware for parsing request bodies
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  
  // Serve static files with long cache times for better performance
  server.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: true
  }));
  
  // Comprehensive logging middleware for debugging
  server.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Started`);
    
    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
  });
  
  // Enhanced CORS specifically configured for Replit environment
  server.use(cors({
    origin: ['*', 'https://*.replit.dev', 'https://*.replit.com'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'X-CSRF-Token', 
      'X-Requested-With', 
      'Accept', 
      'Accept-Version', 
      'Content-Length', 
      'Content-MD5', 
      'Content-Type', 
      'Date', 
      'X-Api-Version', 
      'Authorization'
    ],
    credentials: true,
    maxAge: 86400 // Cache preflight requests for 24 hours
  }));
  
  // Set Replit-specific headers for webview compatibility and security
  server.use((req, res, next) => {
    // Allow Replit webview iframe embedding
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    
    // Prevent caching to ensure fresh content
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // CORS headers duplicated to ensure they're set
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
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
  
  // Proxy API requests to the FastAPI backend with enhanced error handling for Replit
  server.use('/api/backend', createProxyMiddleware({
    target: 'http://0.0.0.0:8002',
    changeOrigin: true,
    pathRewrite: {
      '^/api/backend': '', // remove the /api/backend path
    },
    // Enhanced options for Replit environment
    ws: false, // Disable WebSockets to avoid Replit connection issues
    secure: false, // Don't verify SSL certificates
    autoRewrite: true, // Rewrite headers to match the target URL
    followRedirects: true, // Follow HTTP redirects
    cookieDomainRewrite: { '*': '' }, // Rewrite cookies to make them work with proxies
    onProxyRes: (proxyRes, req, res) => {
      // Log the proxy response for debugging
      console.log(`[Proxy Response] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
      // Add headers to prevent caching
      proxyRes.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
      proxyRes.headers['pragma'] = 'no-cache';
      proxyRes.headers['expires'] = '0';
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Unable to reach the backend server',
        error: err.message,
        time: new Date().toISOString()
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
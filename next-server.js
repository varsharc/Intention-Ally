const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable CORS with comprehensive headers
  server.use((req, res, next) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Set Replit-specific headers
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    
    next();
  });

  // Simple request logging for debugging
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // API route for health check
  server.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Next.js server is healthy' });
  });

  // Proxy API requests to the FastAPI backend
  server.use('/api/backend', createProxyMiddleware({
    target: 'http://localhost:8002',
    changeOrigin: true,
    pathRewrite: {
      '^/api/backend': '', // remove the /api/backend path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log the original request going to the backend
      console.log(`Proxying to backend: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response from backend
      console.log(`Backend responded: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
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

  // Handle all other routes with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Next.js ready on http://0.0.0.0:${port}`);
    console.log(`> API health check available at http://0.0.0.0:${port}/api/health`);
    console.log(`> Backend proxy available at http://0.0.0.0:${port}/api/backend`);
    
    // Output a message specifically for the Replit environment
    if (process.env.REPL_SLUG || process.env.REPL_OWNER) {
      console.log(`Running in Replit environment - accessible at port ${port}`);
    }
  });
});
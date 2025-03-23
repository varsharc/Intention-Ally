const express = require('express');
const next = require('next');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Detailed logging function
const logWithDetails = (message, details = {}) => {
  console.log(`[${new Date().toISOString()}] ${message}`, 
    Object.keys(details).length ? details : '');
};

app.prepare().then(() => {
  const server = express();

  // Enable CORS with the cors package as recommended
  server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

  // Enhanced request logging for detailed debugging
  server.use((req, res, next) => {
    const requestStart = Date.now();
    const requestId = Math.random().toString(36).substring(2, 15);
    
    // Log request details
    logWithDetails(`REQUEST ${requestId}`, {
      method: req.method,
      url: req.url,
      headers: req.headers,
      ip: req.ip || req.connection.remoteAddress,
      params: req.params,
      query: req.query
    });
    
    // Capture and log response details
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
      const responseTime = Date.now() - requestStart;
      logWithDetails(`RESPONSE ${requestId}`, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        responseTime: `${responseTime}ms`,
        headers: res.getHeaders()
      });
      return originalEnd.call(this, chunk, encoding);
    };
    
    next();
  });

  // Serve static files from the public directory
  server.use(express.static(path.join(__dirname, 'public')));

  // Specific route for test.html
  server.get('/test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
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
      query: req.query,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        REPL_SLUG: process.env.REPL_SLUG,
        REPL_OWNER: process.env.REPL_OWNER,
      }
    });
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
      logWithDetails(`PROXY REQUEST`, {
        originalUrl: req.url,
        method: req.method,
        target: 'http://localhost:8002',
        path: req.url.replace('/api/backend', '')
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response from backend
      logWithDetails(`PROXY RESPONSE`, {
        originalUrl: req.url,
        statusCode: proxyRes.statusCode,
        statusMessage: proxyRes.statusMessage,
        headers: proxyRes.headers
      });
    },
    onError: (err, req, res) => {
      logWithDetails(`PROXY ERROR`, {
        originalUrl: req.url,
        error: err.message,
        stack: err.stack
      });
      
      res.status(500).json({ 
        status: 'error', 
        message: 'Unable to reach the backend server',
        error: err.message,
        details: 'The API backend seems to be unavailable. Please check if the FastAPI server is running on port 8002.'
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
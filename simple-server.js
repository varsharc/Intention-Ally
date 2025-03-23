const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors({ origin: '*' }));

// Add basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve the simple test HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-test.html'));
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple Express server is healthy' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple Express server listening at http://0.0.0.0:${PORT}`);
});
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create express server
const app = express();
const PORT = process.env.PORT || 5001;

// Serve static HTML files
app.use(express.static(path.join(__dirname)));

// Set server headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Main route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Deployment page
app.get('/deploy', (req, res) => {
  res.sendFile(path.join(__dirname, 'deploy.html'));
});

// Simple API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HTML server is running',
    timestamp: new Date().toISOString()
  });
});

// Proxy endpoint to check FastAPI backend
app.get('/api/backend-status', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8002');
    const data = await response.json();
    res.json({
      status: 'ok',
      backend: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to connect to backend',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTML server running at http://0.0.0.0:${PORT}`);
  console.log(`Deployment page available at http://0.0.0.0:${PORT}/deploy`);
});
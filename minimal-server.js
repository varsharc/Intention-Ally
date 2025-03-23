// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware for handling CORS and iframe embedding
app.use((req, res, next) => {
  // Specific headers for Replit compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint that Replit uses
app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.json({ status: 'ok', message: 'Intention-Ally server is running' });
});

// Root endpoint to serve our main HTML interface
app.get('/', (req, res) => {
  console.log('Root request received');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Also serve the HTML file on /search route
app.get('/search', (req, res) => {
  console.log('Search request received');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// FastAPI backend proxy endpoint
app.get('/api/backend/*', async (req, res) => {
  const backendPath = req.path.replace('/api/backend', '');
  const backendUrl = `http://localhost:8002${backendPath || '/'}`;
  
  try {
    console.log(`Proxying request to: ${backendUrl}`);
    const response = await fetch(backendUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Backend proxy error: ${error.message}`);
    res.status(502).json({ error: 'Backend service unavailable' });
  }
});

// Fallback route handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Intention-Ally server running at http://0.0.0.0:${PORT}`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
  console.log(`Backend API proxy available at http://0.0.0.0:${PORT}/api/backend`);
});
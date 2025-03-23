const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express application
const app = express();
const PORT = 5000;

// Enable CORS with comprehensive headers
app.use((req, res, next) => {
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
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a basic test HTML page if none exists
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(indexPath)) {
  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intention-Ally - Semantic Search Tool</title>
  <style>
    body {
      background-color: #111111;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      background-color: #000000;
      padding: 1rem 0;
      border-bottom: 2px solid #EAB308;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: 1.5rem;
      color: #EAB308;
    }
    main {
      min-height: calc(100vh - 200px);
      padding: 2rem 0;
    }
    .search-container {
      margin-bottom: 2rem;
    }
    .search-box {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input[type="text"] {
      flex: 1;
      padding: 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid #333;
      background-color: #1F2937;
      color: white;
    }
    .btn-primary {
      background-color: #EAB308;
      color: #000000;
      font-weight: 600;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
    }
    .btn-primary:hover {
      background-color: #CA8A04;
    }
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .tag {
      background-color: rgba(234, 179, 8, 0.2);
      color: #EAB308;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .tag span {
      cursor: pointer;
    }
    .viz-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .viz-card {
      background-color: #1F2937;
      border-radius: 0.5rem;
      padding: 1rem;
      height: 300px;
    }
    .viz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .results-container {
      background-color: #1F2937;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 2rem;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .result-card {
      background-color: #111827;
      border-radius: 0.375rem;
      padding: 1rem;
      margin-bottom: 1rem;
      border-left: 3px solid #EAB308;
    }
    .result-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #EAB308;
    }
    .result-url {
      color: #9CA3AF;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .result-description {
      font-size: 0.9375rem;
      color: #D1D5DB;
    }
    .sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      height: 100vh;
      background-color: #000000;
      border-left: 1px solid #333;
      padding: 1rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    .sidebar.active {
      transform: translateX(0);
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #333;
    }
    .filter-section {
      margin-bottom: 1.5rem;
    }
    .filter-title {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #EAB308;
    }
    footer {
      background-color: #000000;
      padding: 1rem 0;
      text-align: center;
      color: #9CA3AF;
      border-top: 1px solid #333;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Intention-Ally
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <div class="search-container">
        <h1>Semantic Search & Clustering</h1>
        <div class="search-box">
          <input type="text" placeholder="Enter keyword to track...">
          <button class="btn-primary">Search</button>
        </div>
        <div class="tags-container">
          <div class="tag">carbon insetting <span>×</span></div>
          <div class="tag">sustainable logistics <span>×</span></div>
          <div class="tag">scope 3 emissions <span>×</span></div>
        </div>
      </div>

      <div class="viz-container">
        <div class="viz-card">
          <div class="viz-header">
            <h3>Knowledge Graph</h3>
            <div class="controls">
              <button>Zoom</button>
            </div>
          </div>
          <div class="knowledge-graph-placeholder" style="height: 250px; display: flex; justify-content: center; align-items: center; color: #9CA3AF;">
            Knowledge Graph Visualization
          </div>
        </div>
        <div class="viz-card">
          <div class="viz-header">
            <h3>Trend Analysis</h3>
            <div class="controls">
              <select>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div class="trend-viz-placeholder" style="height: 250px; display: flex; justify-content: center; align-items: center; color: #9CA3AF;">
            Trend Line Visualization
          </div>
        </div>
      </div>

      <div class="results-container">
        <div class="results-header">
          <h3>Search Results</h3>
          <div class="controls">
            <button>Sort</button>
            <button>Filter</button>
          </div>
        </div>
        <div class="results-list">
          <div class="result-card">
            <div class="result-title">What is Carbon Insetting? Greener Logistics Starts Here</div>
            <div class="result-url">sustainablelogistics.com/carbon-insetting</div>
            <div class="result-description">Carbon insetting is the practice of making investments in sustainable practices directly within a company's own supply chain...</div>
          </div>
          <div class="result-card">
            <div class="result-title">Carbon Insetting vs Offsetting: The Key Differences Explained</div>
            <div class="result-url">climateaction.org/insights/insetting-vs-offsetting</div>
            <div class="result-description">While carbon offsetting focuses on compensating for emissions by funding external projects, carbon insetting aims to reduce emissions directly within your value chain...</div>
          </div>
          <div class="result-card">
            <div class="result-title">Implementing Carbon Insetting in Logistics Networks</div>
            <div class="result-url">logisticsweekly.com/carbon-strategies</div>
            <div class="result-description">Organizations are increasingly turning to carbon insetting as a strategy to reduce emissions throughout their logistics and supply chain operations...</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>Intention-Ally © 2025 | Semantic Search & Clustering Tool</p>
    </div>
  </footer>

  <script>
    // Simple placeholder JavaScript
    console.log('Intention-Ally application loaded');
  </script>
</body>
</html>
  `;
  fs.writeFileSync(indexPath, defaultHtml);
  console.log('Created default index.html');
}

// API route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

// Route for testing
app.get('/test', (req, res) => {
  res.send('Server is working properly! The test endpoint is accessible.');
});

// Optional: Proxy requests to FastAPI backend
app.use('/api/backend', createProxyMiddleware({
  target: 'http://localhost:8002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/backend': '', // remove the /api/backend path
  },
}));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`API health check available at http://0.0.0.0:${PORT}/api/health`);
  console.log(`Test endpoint available at http://0.0.0.0:${PORT}/test`);
});
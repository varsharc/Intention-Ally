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
  
  // Enhanced CORS configuration for Replit
  server.use(cors({
    origin: ['*', 'https://*.replit.dev', 'https://*.repl.co', 'https://*.replit.app', 'https://*.picard.replit.dev', 'https://replit.com', 'https://ce132cda-9e2d-417d-8fed-b0ec64c27ca5-00-2tx172xuax2xs.picard.replit.dev'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: true,
    maxAge: 86400
  }));
  
  // Set Replit-specific headers for all responses
  server.use((req, res, next) => {
    // Handle OPTIONS requests for preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Origin,Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    next();
  });
  
  // API route for health check
  server.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Next.js server is healthy' });
  });
  
  // Direct route for test page that bypasses Next.js routing
  server.get('/test-page', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Intention-Ally - Test Page</title>
        <style>
          :root {
            --color-background: #121212;
            --color-text: #F9FAFB;
            --color-primary: #EAB308;
            --color-secondary: #4B5563;
            --color-card: #1F2937;
            --color-border: #374151;
          }
          
          body {
            background-color: var(--color-background);
            color: var(--color-text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          h1 {
            color: var(--color-primary);
            margin-bottom: 10px;
          }
          
          p {
            margin-bottom: 20px;
          }
          
          .card {
            background-color: var(--color-card);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .button {
            background-color: var(--color-primary);
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
          }
          
          .search-box {
            display: flex;
            margin-bottom: 20px;
          }
          
          .search-box input {
            flex: 1;
            padding: 10px;
            border: 1px solid var(--color-border);
            background-color: var(--color-background);
            color: var(--color-text);
            border-radius: 4px 0 0 4px;
          }
          
          .search-box button {
            background-color: var(--color-primary);
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 0 4px 4px 0;
            font-weight: 600;
            cursor: pointer;
          }

          #results {
            margin-top: 20px;
          }

          .result-item {
            background-color: #2D3748;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 4px;
          }

          .result-item h3 {
            color: var(--color-primary);
            margin-top: 0;
            margin-bottom: 5px;
          }

          .result-item a {
            color: #A3BFFA;
            text-decoration: none;
          }

          .result-item p {
            margin-top: 5px;
            margin-bottom: 0;
          }

          .api-status {
            font-size: 0.85rem;
            margin-top: 5px;
            color: #A0AEC0;
          }

          .success {
            color: #68D391;
          }

          .error {
            color: #F56565;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Intention-Ally Test Page</h1>
          <p>This is a direct test page to verify API and interface functionality</p>
          
          <div class="card">
            <h2>API Status</h2>
            <div id="api-status">Checking connection...</div>
            <button id="check-api" class="button">Check API Connection</button>
          </div>
          
          <div class="card">
            <h2>Search Test</h2>
            <div class="search-box">
              <input id="search-input" type="text" placeholder="Enter keyword to search" value="carbon insetting">
              <button id="search-button" class="button">Search</button>
            </div>
            <div id="search-status"></div>
            <div id="results"></div>
          </div>
        </div>
        
        <script>
          // Check API connection
          document.getElementById('check-api').addEventListener('click', async () => {
            const statusDiv = document.getElementById('api-status');
            statusDiv.textContent = 'Checking...';
            
            try {
              const response = await fetch('/api/health');
              const data = await response.json();
              
              if (data.status === 'ok') {
                statusDiv.textContent = '✓ API Connected: ' + data.message;
                statusDiv.className = 'api-status success';
              } else {
                statusDiv.textContent = '✗ API Error: ' + (data.message || 'Unknown error');
                statusDiv.className = 'api-status error';
              }
            } catch (error) {
              statusDiv.textContent = '✗ Connection Failed: ' + error.message;
              statusDiv.className = 'api-status error';
            }
          });
          
          // Perform search
          document.getElementById('search-button').addEventListener('click', async () => {
            const keyword = document.getElementById('search-input').value.trim();
            const resultsDiv = document.getElementById('results');
            const statusDiv = document.getElementById('search-status');
            
            if (!keyword) {
              statusDiv.textContent = 'Please enter a keyword to search';
              statusDiv.className = 'api-status error';
              return;
            }
            
            statusDiv.textContent = 'Searching...';
            statusDiv.className = 'api-status';
            resultsDiv.innerHTML = '';
            
            try {
              const response = await fetch(\`/api/backend/search/\${encodeURIComponent(keyword)}\`);
              const data = await response.json();
              
              if (data.success && data.results && data.results.length > 0) {
                statusDiv.textContent = \`✓ Found \${data.results.length} results for "\${keyword}"\`;
                statusDiv.className = 'api-status success';
                
                data.results.forEach(result => {
                  const resultItem = document.createElement('div');
                  resultItem.className = 'result-item';
                  resultItem.innerHTML = \`
                    <h3><a href="\${result.url}" target="_blank">\${result.title}</a></h3>
                    <p>\${result.description}</p>
                  \`;
                  resultsDiv.appendChild(resultItem);
                });
              } else {
                statusDiv.textContent = \`✗ No results found for "\${keyword}": \${data.message || 'No data available'}\`;
                statusDiv.className = 'api-status error';
              }
            } catch (error) {
              statusDiv.textContent = '✗ Search Failed: ' + error.message;
              statusDiv.className = 'api-status error';
            }
          });
          
          // Trigger API check on load
          document.getElementById('check-api').click();
        </script>
      </body>
      </html>
    `);
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
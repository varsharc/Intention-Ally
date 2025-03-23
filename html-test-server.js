/**
 * Simple HTML test server for Intention-Ally application
 * This standalone server bypasses Next.js to serve a direct HTML interface
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 5001;

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true
}));

// Set headers for all responses
app.use((req, res, next) => {
  // Handle preflight OPTIONS requests
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
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server is running' });
});

// Proxy API requests to the FastAPI backend
app.use('/api/backend', createProxyMiddleware({
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

// Serve the main test page
app.get('/', (req, res) => {
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
        
        .keyword-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .keyword-tag {
          background-color: #2D3748;
          color: var(--color-primary);
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .keyword-tag:hover {
          background-color: #374151;
        }
        
        .keyword-tag .icon {
          margin-left: 6px;
          font-size: 12px;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 20px;
        }
        
        .tab {
          padding: 10px 20px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        
        .tab.active {
          border-bottom: 2px solid var(--color-primary);
          color: var(--color-primary);
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Intention-Ally</h1>
        <p>Semantic search and clustering for focused research</p>
        
        <div class="tabs">
          <div class="tab active" onclick="switchTab('search')">Search</div>
          <div class="tab" onclick="switchTab('trends')">Trends</div>
          <div class="tab" onclick="switchTab('api')">API Status</div>
        </div>
        
        <div id="search-tab" class="tab-content active">
          <div class="card">
            <h2>Search</h2>
            <div class="search-box">
              <input id="search-input" type="text" placeholder="Enter keyword to search" value="carbon insetting">
              <button id="search-button" class="button">Search</button>
            </div>
            
            <h3>Active Keywords</h3>
            <div id="keyword-tags" class="keyword-tags">
              <!-- Keywords will be loaded here -->
            </div>
            
            <div id="search-status"></div>
            <div id="results"></div>
          </div>
        </div>
        
        <div id="trends-tab" class="tab-content">
          <div class="card">
            <h2>Trend Visualization</h2>
            <p>Trend visualization will be implemented here</p>
          </div>
        </div>
        
        <div id="api-tab" class="tab-content">
          <div class="card">
            <h2>API Status</h2>
            <div id="api-status">Checking connection...</div>
            <button id="check-api" class="button">Check API Connection</button>
            
            <h3>Endpoints</h3>
            <ul>
              <li><code>/api/health</code> - Server health</li>
              <li><code>/api/backend</code> - FastAPI backend proxy</li>
            </ul>
          </div>
        </div>
      </div>
      
      <script>
        // Tabs functionality
        function switchTab(tabName) {
          document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
          
          document.querySelector(\`.tab[onclick="switchTab('\${tabName}')"]\`).classList.add('active');
          document.getElementById(\`\${tabName}-tab\`).classList.add('active');
        }
        
        // Check API connection
        document.getElementById('check-api').addEventListener('click', async () => {
          const statusDiv = document.getElementById('api-status');
          statusDiv.textContent = 'Checking...';
          
          try {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            statusDiv.textContent = \`✓ API Connected: \${data.message}\`;
            statusDiv.className = 'api-status success';
            
            // Also check backend connection
            try {
              const backendResponse = await fetch('/api/backend');
              const backendData = await backendResponse.json();
              
              statusDiv.textContent += \`\\n✓ Backend API: \${backendData.message || 'Connected'}\`;
            } catch (backendError) {
              statusDiv.textContent += \`\\n✗ Backend API Error: \${backendError.message}\`;
            }
          } catch (error) {
            statusDiv.textContent = \`✗ Connection Failed: \${error.message}\`;
            statusDiv.className = 'api-status error';
          }
        });
        
        // Load keywords
        async function loadKeywords() {
          try {
            const response = await fetch('/api/backend/keywords');
            const keywords = await response.json();
            
            const keywordTagsContainer = document.getElementById('keyword-tags');
            keywordTagsContainer.innerHTML = '';
            
            keywords.forEach(keyword => {
              const tag = document.createElement('div');
              tag.className = 'keyword-tag';
              tag.textContent = keyword.value;
              tag.onclick = () => {
                document.getElementById('search-input').value = keyword.value;
                document.getElementById('search-button').click();
              };
              
              keywordTagsContainer.appendChild(tag);
            });
            
            if (keywords.length === 0) {
              keywordTagsContainer.innerHTML = '<p>No keywords found. Add some by searching.</p>';
            }
          } catch (error) {
            console.error('Failed to load keywords:', error);
          }
        }
        
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
              
              // Reload keywords after search to show any new additions
              loadKeywords();
            } else {
              statusDiv.textContent = \`✗ No results found for "\${keyword}": \${data.message || 'No data available'}\`;
              statusDiv.className = 'api-status error';
            }
          } catch (error) {
            statusDiv.textContent = \`✗ Search Failed: \${error.message}\`;
            statusDiv.className = 'api-status error';
          }
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('check-api').click();
          loadKeywords();
        });
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`> HTML Test server running on http://0.0.0.0:${PORT}`);
  console.log(`> API health check at http://0.0.0.0:${PORT}/api/health`);
  console.log(`> Backend proxy at http://0.0.0.0:${PORT}/api/backend`);
});
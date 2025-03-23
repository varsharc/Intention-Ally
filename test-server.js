const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
      <style>
        body {
          background-color: #1a1a1a;
          color: #f4f4f4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          border-radius: 0.5rem;
          background-color: #2a2a2a;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #ffcc00;
          margin-bottom: 1rem;
        }
        p {
          margin-bottom: 1.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Intention-Ally Test Page</h1>
        <p>This is a test page using the black, grey, and yellow color palette from Intention-Ally design guidelines.</p>
      </div>
    </body>
    </html>
  `);
});

// Listen on port 5000 instead of 8000
server.listen(5000, '0.0.0.0', () => {
  console.log('Test server running at http://0.0.0.0:5000/');
});
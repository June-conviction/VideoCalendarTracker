const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Basic routing
  let filePath = '';
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = 'simple-demo.html';
  } else if (req.url.startsWith('/public/')) {
    // Handle requests for static files in the public directory
    filePath = req.url.substring(1); // Remove the leading slash
  } else {
    // Default to simple-demo.html for any other route
    filePath = 'simple-demo.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type based on the file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.error(`File not found: ${filePath}`);
        fs.readFile('simple-demo.html', (err, content) => {
          if (err) {
            // If we can't even serve the demo page, return a 500
            res.writeHead(500);
            res.end('Error loading the demo page');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running on http://localhost:${PORT}`);
});
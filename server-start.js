// Simple demo server that serves the static HTML demo
const http = require('http');
const fs = require('fs');
const path = require('path');

// Fix the image paths in the HTML file
const demoHtml = fs.readFileSync('simple-demo.html', 'utf8')
  .replace(/\/public\/images\//g, '/images/');

fs.writeFileSync('simple-demo.html', demoHtml);

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);
  
  // Basic routing
  let filePath = '';
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = 'simple-demo.html';
  } else if (req.url.startsWith('/images/')) {
    // Handle requests for static image files
    filePath = path.join('public', req.url);
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
        res.writeHead(404);
        res.end('File not found');
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

const PORT = 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log('Open the URL shown in the Replit interface to view the demo');
});
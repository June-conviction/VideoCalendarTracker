// Simple static demo server
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received for: ${req.url}`);
  
  // Handle requests
  if (req.url === '/' || req.url === '/index.html') {
    // Serve the HTML demo
    fs.readFile('simple-demo.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading demo page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } 
  else if (req.url.startsWith('/images/')) {
    // Serve images from the public directory
    const imagePath = path.join('public', req.url);
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Image not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(data);
    });
  }
  else {
    // Default response for other paths
    res.writeHead(302, { 'Location': '/' });
    res.end();
  }
});

// Start the server
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple demo server is running on port ${PORT}`);
});
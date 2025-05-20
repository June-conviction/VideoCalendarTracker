// Simple static server to serve the iPod interface
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create the server
const server = http.createServer((req, res) => {
  // Parse URL
  let filepath = req.url;
  
  // Default to index.html
  if (filepath === '/' || filepath === '') {
    filepath = '/index.html';
  }
  
  // Get full path
  const fullPath = path.join(__dirname, 'public', filepath);
  
  // Get file extension
  const ext = path.extname(fullPath);
  let contentType = 'text/html';
  
  // Set content type based on file extension
  switch (ext) {
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
  
  // Read file
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      // Handle file not found
      if (err.code === 'ENOENT') {
        console.log(`File not found: ${fullPath}`);
        res.writeHead(404);
        res.end('404 - File Not Found');
      } else {
        // Handle server error
        console.log(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - return content
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Listen on port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to listen on
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log('Request URL:', req.url);
  
  // Serve the demo HTML file for the root path
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'simple-demo.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading the demo page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }
  
  // Handle requests for iPod images
  if (req.url.startsWith('/attached_assets/')) {
    const imagePath = path.join(__dirname, req.url);
    
    // Check if the file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end('Image not found');
        return;
      }
      
      // Serve the image
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading image');
          return;
        }
        
        const ext = path.extname(imagePath).toLowerCase();
        let contentType = 'image/png';
        
        if (ext === '.jpg' || ext === '.jpeg') {
          contentType = 'image/jpeg';
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
    return;
  }
  
  // Default 404 response for any other paths
  res.writeHead(404);
  res.end('Not found');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
// Simple server to run in Replit
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a server that serves the simple-demo.html file 
// and the required images
const server = http.createServer((req, res) => {
  console.log(`Request for: ${req.url}`);
  
  // Set CORS headers to allow the app to be viewed
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/' || req.url === '/index.html') {
    // Serve our demo HTML
    fs.readFile('simple-demo.html', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading demo');
        return;
      }
      
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
  } 
  else if (req.url.startsWith('/images/')) {
    // Handle image requests
    const imagePath = path.join('public', req.url);
    
    // Check if file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`Image not found: ${imagePath}`);
        res.writeHead(404);
        res.end('Image not found');
        return;
      }
      
      // Read and serve the image
      fs.readFile(imagePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading image');
          return;
        }
        
        // Set appropriate content type based on file extension
        const ext = path.extname(imagePath).toLowerCase();
        let contentType = 'image/png'; // default
        
        if (ext === '.jpg' || ext === '.jpeg') {
          contentType = 'image/jpeg';
        } else if (ext === '.svg') {
          contentType = 'image/svg+xml';
        }
        
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content);
      });
    });
  } 
  else {
    // Default redirect to main page
    res.writeHead(302, {'Location': '/'});
    res.end();
  }
});

// Start server on port 5000 (Replit standard port)
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`LinkPlaylist demo server running at http://0.0.0.0:${PORT}`);
  console.log('Open the URL shown in your Replit browser to view the demo');
});
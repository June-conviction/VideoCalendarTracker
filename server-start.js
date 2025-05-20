// This script will start the server on port 5000 (or the port defined in the PORT environment variable)
// which is what Replit expects

// Import required modules
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configure the development server
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Allow connections from all hosts
const port = parseInt(process.env.PORT || '5000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Start the server
app.prepare().then(() => {
  console.log(`> Starting server on port ${port}...`);
  
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
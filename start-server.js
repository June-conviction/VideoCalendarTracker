const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Set up proxy to forward requests to the Next.js dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  logLevel: 'silent'
}));

// Start the proxy server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`> Ready on port ${PORT}`);
  console.log(`> Proxying to Next.js on port 3000`);
});
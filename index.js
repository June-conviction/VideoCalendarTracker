// Simple Express server to display our iPod interface
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
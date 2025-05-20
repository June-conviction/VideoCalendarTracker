// Very simple HTTP server
const http = require('http');

// Create the simplest possible server that just returns a response
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>LinkPlaylist - Simple Test</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          h1 {
            font-size: 48px;
            background: linear-gradient(45deg, #ff6b6b, #5e60ce, #64dfdf, #ffbe0b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .container {
            max-width: 800px;
            padding: 20px;
          }
          .step {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>LinkPlaylist</h1>
          <p>Server is running successfully!</p>
          
          <div class="step">
            <h2>Step 1: Hello Page</h2>
            <p>Simple intro "hello" graphic</p>
          </div>
          
          <div class="step">
            <h2>Step 2: Select iPod Nano</h2>
            <p>Multiple iPod Nano models (different colors)</p>
          </div>
          
          <div class="step">
            <h2>Step 3: Select Music Service</h2>
            <p>Spotify, Apple Music, or Others</p>
          </div>
          
          <div class="step">
            <h2>Step 4: Submit Playlist URL</h2>
            <p>Input field for user's playlist URL</p>
          </div>
          
          <div class="step">
            <h2>Step 5: Loading Screen</h2>
            <p>Display loading animation</p>
          </div>
          
          <div class="step">
            <h2>Step 6: User Profile Page</h2>
            <p>User's personalized "iPod themed" page</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start the server on port 5000
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
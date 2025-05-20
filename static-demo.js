// This is a simple static file server to demonstrate the LinkPlaylist interface

const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Create a simple HTML page that showcases the app's features
const demoHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkPlaylist - iPod Styled Playlist Sharing</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #000;
      color: #fff;
    }
    .hello {
      font-family: 'Helvetica', sans-serif;
      background: linear-gradient(45deg, #ff6b6b, #5e60ce, #64dfdf, #ffbe0b);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 4rem;
      font-weight: bold;
      text-align: center;
    }
    .ipod-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .ipod {
      width: 140px;
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    .ipod:hover {
      transform: scale(1.05);
    }
    .ipod.selected {
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(255,255,255,0.5);
      border-radius: 10px;
    }
    .desktop-profile {
      background-image: url('https://images.unsplash.com/photo-1691252163653-5ba40ae7bede');
      background-size: cover;
      border-radius: 10px;
      overflow: hidden;
    }
    .desktop-icon {
      width: 70px;
      height: 70px;
      background-color: rgba(255,255,255,0.2);
      backdrop-filter: blur(5px);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .desktop-icon:hover {
      background-color: rgba(255,255,255,0.3);
    }
    .desktop-icon svg {
      width: 32px;
      height: 32px;
      margin-bottom: 5px;
    }
    .desktop-icon span {
      font-size: 12px;
      text-align: center;
      color: white;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }
    .step {
      display: none;
    }
    .step.active {
      display: block;
    }
    .coverflow {
      perspective: 1000px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
    .album {
      width: 200px;
      height: 200px;
      position: absolute;
      transition: all 0.5s ease;
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
      border-radius: 5px;
      background-size: cover;
      background-position: center;
    }
    .album.current {
      z-index: 10;
      transform: translateZ(50px) scale(1.1);
    }
    .album.prev {
      transform: translateX(-150px) rotateY(45deg) scale(0.8);
      z-index: 5;
      opacity: 0.7;
    }
    .album.next {
      transform: translateX(150px) rotateY(-45deg) scale(0.8);
      z-index: 5;
      opacity: 0.7;
    }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center">
  <div class="container mx-auto px-4 py-16 max-w-4xl">
    <!-- Step 1: Hello Splash -->
    <div id="step1" class="step active">
      <div class="mb-16 hello text-center">hello</div>
      <p class="text-center text-gray-400 text-lg mb-10">Welcome to LinkPlaylist - Your iPod styled playlist sharing experience</p>
      <div class="flex justify-center">
        <button id="nextToStep2" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
    
    <!-- Step 2: iPod Selection -->
    <div id="step2" class="step">
      <h2 class="text-3xl font-bold text-center mb-8">Pick your iPod Nano</h2>
      <div class="ipod-container mb-10">
        <img src="/images/iPod black new version.png" alt="Black iPod" data-color="black" class="ipod">
        <img src="/images/iPod silver.png" alt="Silver iPod" data-color="silver" class="ipod">
        <img src="/images/iPod blue.png" alt="Blue iPod" data-color="blue" class="ipod">
        <img src="/images/iPod red.png" alt="Red iPod" data-color="red" class="ipod">
        <img src="/images/iPod yellow.png" alt="Yellow iPod" data-color="yellow" class="ipod">
      </div>
      <div class="flex justify-center">
        <button id="backToStep1" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-4 transition-colors">
          Back
        </button>
        <button id="nextToStep3" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled>
          Continue
        </button>
      </div>
    </div>
    
    <!-- Step 3: Confirmation -->
    <div id="step3" class="step">
      <h2 class="text-3xl font-bold text-center mb-8">Your iPod is ready!</h2>
      <div class="flex justify-center mb-10">
        <img id="selectedIPod" src="/images/iPod black new version.png" alt="Selected iPod" class="h-80">
      </div>
      <div class="flex justify-center">
        <button id="backToStep2" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-4 transition-colors">
          Back
        </button>
        <button id="nextToStep4" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Continue
        </button>
      </div>
    </div>
    
    <!-- Step 4: Chat Interface -->
    <div id="step4" class="step">
      <div class="max-w-md mx-auto bg-gray-900 rounded-xl p-6">
        <div class="flex flex-col">
          <div class="bg-gray-800 rounded-lg p-4 mb-4 self-start max-w-[80%]">
            <p class="text-white">Hi I'm NotifyChat, what music streaming service do you use?</p>
          </div>
          
          <div class="flex flex-wrap justify-end space-x-2 mb-4">
            <button class="service-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Spotify
            </button>
            <button class="service-btn px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Apple Music
            </button>
            <button class="service-btn px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Other
            </button>
          </div>
          
          <div id="spotifyChat" class="hidden">
            <div class="bg-gray-800 rounded-lg p-4 mb-4 self-start max-w-[80%]">
              <p class="text-white">Alright! Please share one of your playlist links:</p>
            </div>
            
            <div class="mb-4">
              <input type="text" placeholder="https://open.spotify.com/playlist/..." class="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end">
              <button id="nextToStep5" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Submit</button>
            </div>
          </div>
          
          <div id="otherChat" class="hidden">
            <div class="bg-gray-800 rounded-lg p-4 mb-4 self-start max-w-[80%]">
              <p class="text-white">Sorry, we currently only support Spotify and Apple Music playlists.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center mt-6">
        <button id="backToStep3" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Back
        </button>
      </div>
    </div>
    
    <!-- Step 5: Profile Page -->
    <div id="step5" class="step">
      <div class="desktop-profile h-[600px] relative p-4 flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <button class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold text-white drop-shadow-md">
            {linkPlaylist}
          </h1>
        </div>
        
        <!-- Desktop Icons -->
        <div class="flex-1 flex flex-wrap content-start">
          <div class="desktop-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Wallpaper</span>
          </div>
          
          <div class="desktop-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Guest Note</span>
          </div>
          
          <div id="showCoverFlow" class="desktop-icon">
            <img id="profileIPod" src="/images/iPod black new version.png" alt="My iPod" class="h-12">
            <span>My iPod</span>
          </div>
          
          <div class="desktop-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share Playlist</span>
          </div>
          
          <div class="desktop-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>Post Playlist</span>
          </div>
        </div>
      </div>
      
      <!-- Cover Flow Modal -->
      <div id="coverFlowModal" class="hidden fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
        <div class="p-4 flex justify-between items-center w-full">
          <div class="w-1/3">
            <p class="text-gray-400 text-sm">Track 1 of 4</p>
          </div>
          
          <div class="w-1/3 flex justify-center">
            <button id="closeCoverFlow" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="w-1/3"></div>
        </div>
        
        <div class="coverflow my-12">
          <div class="album prev" style="background-image: url('https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400&h=400&fit=crop');"></div>
          <div class="album current" style="background-image: url('https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=400&fit=crop');"></div>
          <div class="album next" style="background-image: url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop');"></div>
        </div>
        
        <div class="text-center my-4">
          <h3 class="text-2xl font-bold text-white">Blinding Lights</h3>
          <p class="text-gray-400 mt-1">The Weeknd</p>
        </div>
        
        <div class="flex items-center justify-center space-x-6">
          <button class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Navigation between steps
    document.getElementById('nextToStep2').addEventListener('click', () => {
      document.getElementById('step1').classList.remove('active');
      document.getElementById('step2').classList.add('active');
    });
    
    document.getElementById('backToStep1').addEventListener('click', () => {
      document.getElementById('step2').classList.remove('active');
      document.getElementById('step1').classList.add('active');
    });
    
    document.getElementById('nextToStep3').addEventListener('click', () => {
      document.getElementById('step2').classList.remove('active');
      document.getElementById('step3').classList.add('active');
    });
    
    document.getElementById('backToStep2').addEventListener('click', () => {
      document.getElementById('step3').classList.remove('active');
      document.getElementById('step2').classList.add('active');
    });
    
    document.getElementById('nextToStep4').addEventListener('click', () => {
      document.getElementById('step3').classList.remove('active');
      document.getElementById('step4').classList.add('active');
    });
    
    document.getElementById('backToStep3').addEventListener('click', () => {
      document.getElementById('step4').classList.remove('active');
      document.getElementById('step3').classList.add('active');
    });
    
    document.getElementById('nextToStep5').addEventListener('click', () => {
      document.getElementById('step4').classList.remove('active');
      document.getElementById('step5').classList.add('active');
    });
    
    // iPod selection
    const ipods = document.querySelectorAll('.ipod');
    let selectedColor = null;
    
    ipods.forEach(ipod => {
      ipod.addEventListener('click', () => {
        // Remove selected class from all iPods
        ipods.forEach(i => i.classList.remove('selected'));
        
        // Add selected class to clicked iPod
        ipod.classList.add('selected');
        
        // Store selected color
        selectedColor = ipod.getAttribute('data-color');
        
        // Update the iPod image in step 3
        document.getElementById('selectedIPod').src = ipod.src;
        
        // Update the iPod image in profile
        document.getElementById('profileIPod').src = ipod.src;
        
        // Enable continue button
        document.getElementById('nextToStep3').disabled = false;
      });
    });
    
    // Chat service selection
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Reset all buttons
        serviceButtons.forEach(btn => {
          btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
          btn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        });
        
        // Highlight selected button
        button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        button.classList.add('bg-blue-600', 'hover:bg-blue-700');
        
        // Hide all chat views
        document.getElementById('spotifyChat').classList.add('hidden');
        document.getElementById('otherChat').classList.add('hidden');
        
        // Show appropriate chat view
        if (button.textContent.trim() === 'Spotify' || button.textContent.trim() === 'Apple Music') {
          document.getElementById('spotifyChat').classList.remove('hidden');
        } else {
          document.getElementById('otherChat').classList.remove('hidden');
        }
      });
    });
    
    // CoverFlow modal
    document.getElementById('showCoverFlow').addEventListener('click', () => {
      document.getElementById('coverFlowModal').classList.remove('hidden');
    });
    
    document.getElementById('closeCoverFlow').addEventListener('click', () => {
      document.getElementById('coverFlowModal').classList.add('hidden');
    });
  </script>
</body>
</html>
`;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log('Request URL:', req.url);
  
  // Serve the demo HTML for the root path
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(demoHTML);
    return;
  }
  
  // Handle requests for iPod images
  if (req.url.startsWith('/images/')) {
    const imageName = req.url.replace('/images/', '');
    const imagePath = path.join(__dirname, 'attached_assets', imageName);
    
    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      const imageContent = fs.readFileSync(imagePath);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(imageContent);
    } else {
      res.writeHead(404);
      res.end('Image not found');
    }
    return;
  }
  
  // Default 404 response for any other paths
  res.writeHead(404);
  res.end('Not found');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Static demo server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
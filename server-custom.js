// This file will act as a custom server wrapper
const { execSync } = require('child_process');

console.log('Starting LinkPlaylist application...');

try {
  // Set environment variables to ensure proper port binding
  process.env.PORT = '5000';
  process.env.HOSTNAME = '0.0.0.0';
  
  // Execute the next dev command
  execSync('next dev -p 5000 -H 0.0.0.0', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  console.error('Error starting the application:', error);
  process.exit(1);
}
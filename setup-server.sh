#!/bin/bash

# This script helps set up the Next.js application correctly for Replit
# Specifically addressing port forwarding issues and environment setup

echo "Setting up LinkPlaylist application for Replit..."

# Make sure package.json has the correct dev script
if grep -q "\"dev\": \"next dev\"" package.json; then
  echo "Updating Next.js dev script to bind to all interfaces with port 5000..."
  sed -i 's/"dev": "next dev"/"dev": "next dev -p 5000 -H 0.0.0.0"/' package.json
  echo "✅ Updated dev script in package.json"
else
  echo "⚠️ Could not find the dev script in package.json to update"
fi

# Create a local .env file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating local environment file..."
  echo "NEXT_PUBLIC_API_URL=http://0.0.0.0:5000" > .env.local
  echo "NEXT_PUBLIC_BASE_URL=http://0.0.0.0:5000" >> .env.local
  echo "PORT=5000" >> .env.local
  echo "✅ Created .env.local file"
else
  echo "✅ .env.local file already exists"
fi

# Make sure the workflow is using the correct port
echo "Note: Your 'Start application' workflow should use:"
echo "bash setup-server.sh && npm run dev"

echo "✅ Setup complete!"
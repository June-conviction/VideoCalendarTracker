#!/bin/bash
# This script is used to start the application in production mode
# It's especially useful for Railway deployment

echo "Starting LinkPlaylist in production mode..."

# Update the database schema if needed
echo "Running database migrations..."
npx prisma migrate deploy

# Build the application if not already built
if [ ! -d ".next" ]; then
  echo "Building application..."
  npm run build
fi

# Set the port for Railway deployment
export PORT=${PORT:-3000}

# Start the application
echo "Starting application on port $PORT..."
npm run start
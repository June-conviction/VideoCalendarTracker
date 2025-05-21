#!/bin/bash

# This script updates the package.json file for Vercel/Railway deployments
# when the file is expected to be rewritten on deployment platforms.

echo "Preparing package.json for deployment..."

# Create a target directory for deployment if it doesn't exist
mkdir -p deployment

# Copy the optimized package.json for deployment
cp package.json.vercel deployment/package.json

echo "✅ package.json prepared for deployment!"
echo ""
echo "IMPORTANT DEPLOYMENT INSTRUCTIONS:"
echo "----------------------------------"
echo "1. For Vercel deployment:"
echo "   - Use the file in deployment/package.json"
echo "   - This is compatible with React 18 that Framer Motion requires"
echo ""
echo "2. For Railway deployment:"
echo "   - Add legacy-peer-deps=true to your Railway environment"
echo "   - This will ensure compatibility with your package dependencies"
echo ""
echo "3. Important notes for both platforms:"
echo "   - The deployment-ready package.json addresses the version conflicts"
echo "   - React 19 causes compatibility issues with Framer Motion, Fixed in deployment version"
echo ""
echo "The application is now ready for both Vercel and Railway deployments!"
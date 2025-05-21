# LinkPlaylist Deployment Guide

This document provides complete instructions for deploying LinkPlaylist to both Vercel (frontend) and Railway (backend).

## Preparation

Before deploying, run the following script to prepare your package.json for deployment:
```bash
./update-package.json.sh
```

This will generate a deployment-ready package.json in the `deployment` folder.

## Vercel Deployment (Frontend)

### Prerequisites
1. Create a Vercel account at https://vercel.com
2. Install the Vercel CLI: `npm i -g vercel`

### Deployment Steps
1. Copy the optimized package.json: `cp deployment/package.json .`
2. Deploy using Vercel:
   ```bash
   vercel login
   vercel
   ```
3. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_BASE_URL`: Your Vercel deployment URL
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. Set your custom domain (drop.linkplaylist.xyz) in the Vercel dashboard under Project → Settings → Domains

## Railway Deployment (Backend)

### Prerequisites
1. Create a Railway account at https://railway.app
2. Install the Railway CLI: `npm i -g @railway/cli`

### Deployment Steps
1. Login to Railway CLI:
   ```bash
   railway login
   ```

2. Initialize the project:
   ```bash
   railway init
   ```

3. Create a new PostgreSQL database in Railway:
   - Through the Railway dashboard, create a new PostgreSQL database
   - Link it to your project

4. Configure the deployment:
   - In the Railway dashboard, add these environment variables:
     - `DATABASE_URL`: (Railway will set this automatically)
     - `PORT`: 5000
     - `NODE_ENV`: production
     - Add `legacy-peer-deps=true` as a build flag

5. Deploy your application:
   ```bash
   railway up
   ```

6. Configure the domain in Railway dashboard under Settings → Domains

## Troubleshooting

### Package Compatibility Issues
If you encounter React version compatibility issues:
- Ensure you're using the optimized package.json from the deployment folder
- Add `legacy-peer-deps=true` to your Railway project's environment variables

### Database Connection Issues
- Verify the `DATABASE_URL` is correctly set in Railway
- Check that the database is properly initialized

### General Deployment Issues
- Check deployment logs in the respective platform dashboards
- Ensure all required environment variables are properly set
- Verify that CORS settings allow communication between frontend and backend

## Important Notes
- The frontend is optimized for deployment on Vercel's Edge Network
- The backend is configured for Railway's containerized environment
- Always use the deployment-optimized package.json to avoid dependency conflicts
- The middleware.ts file contains security headers that should be preserved
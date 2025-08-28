# Vercel Deployment Guide

This guide explains how to deploy the AI-Powered PC Builder project to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
3. [Git](https://git-scm.com/) installed on your machine

## Step 1: Prepare Your MongoDB Database

1. Create a MongoDB Atlas cluster
2. Create a database named `ai-pc-builder`
3. Configure network access to allow connections from anywhere (for Vercel)
4. Create a database user with read/write permissions
5. Get your MongoDB connection string

## Step 2: Prepare Backend Files for Vercel Deployment

Before deploying, ensure your backend project is properly configured for Vercel's serverless architecture:

1. Make sure you have an `/api` folder with an `index.js` file that serves as the serverless function entry point:
   ```javascript
   // BackEnd/api/index.js
   const app = require('../server.js');
   
   module.exports = app;
   ```

2. Verify your `vercel.json` configuration is correctly set up:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "api/index.js"
       }
     ]
   }
   ```

3. Ensure your `server.js` file properly exports the Express app:
   ```javascript
   // At the end of server.js
   app.get('/', (req, res) => {
     res.json({ status: 'ok', message: 'API is running' });
   });
   
   // Add a health check endpoint
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', message: 'Server is healthy' });
   });
   
   module.exports = app;
   ```

## Step 3: Deploy the Backend

1. Login to Vercel and create a new project
2. Import your GitHub repository
3. Configure the project:
   - Set the root directory to `/BackEnd`
   - Set the build command to `npm install`
   - Set the output directory to `.`
   - Set the development command to `npm run dev`

4. Add the following environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT token generation
   - `NODE_ENV` - Set to `production`
   - `GOOGLE_API_KEY` - Your Google AI API key
   - `FRONTEND_URL` - The URL of your frontend deployment (once you have it)

5. Deploy the backend

## Step 4: Prepare Frontend Files for Vercel Deployment

Before deploying the frontend, make sure it's configured correctly to connect to the backend:

1. Verify the API configuration in `src/services/api.js`:
   ```javascript
   // The API should be set up to use the environment variable for the API URL
   const getApiBaseUrl = () => {
     if (import.meta.env.MODE === 'production') {
       return import.meta.env.VITE_API_URL || 'https://ai-powered-pc-builder-backend.vercel.app';
     }
     return 'http://localhost:11822';
   };
   ```

2. Make sure your `vercel.json` is configured properly:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

## Step 5: Deploy the Frontend

1. Login to Vercel and create a new project
2. Import your GitHub repository
3. Configure the project:
   - Set the root directory to `/FrontEnd`
   - Set the build command to `npm run build`
   - Set the output directory to `dist`
   - Set the development command to `npm run dev`

4. Add the following environment variables:
   - `VITE_API_URL` - URL of your deployed backend (e.g., https://ai-powered-pc-builder-backend.vercel.app)
   - `VITE_ENV` - Set to `production`

5. Deploy the frontend

## Step 6: Update CORS Settings

After both deployments are complete:

1. Get the URL of your frontend deployment
2. Go to the backend project settings in Vercel
3. Add the frontend URL to the `FRONTEND_URL` environment variable
4. Redeploy the backend

## Step 7: Test the Deployment

### Backend Testing
1. Run the backend deployment test script:
   ```bash
   node BackEnd/utils/deploymentTest.js
   ```
   
   Make sure to update the `API_URL` in the test script with your actual backend URL.

### Frontend-Backend Connectivity Testing
1. Run the connectivity test script:
   ```bash
   node FrontEnd/utils/connectivityTest.js
   ```
   
   Make sure to update the `FRONTEND_URL` and `BACKEND_URL` in the script with your actual deployed URLs.

### Manual Testing
1. Navigate to your frontend URL
2. Test registration and login
3. Test the PC build generator
4. Test the benchmarks page

## Troubleshooting

### 404 Errors on API Endpoints
If you're getting 404 errors when trying to access your API endpoints:

1. Verify the serverless function setup:
   - Make sure `api/index.js` correctly imports and exports your Express app
   - Check that `vercel.json` is pointing to `api/index.js` as the source
   - Confirm your routes in `vercel.json` are set to redirect all requests to your serverless function

2. Test your deployment using the provided test script:
   ```
   node utils/deploymentTest.js
   ```

3. Check Vercel logs:
   - Go to your Vercel dashboard
   - Select your backend project
   - Navigate to the "Deployments" tab
   - Click on the most recent deployment
   - Check the "Functions" section for errors

### Backend Connection Issues
- Check the MongoDB connection string in your Vercel environment variables
- Verify network access settings in MongoDB Atlas (IP access list should allow connections from anywhere)
- Check the application logs in Vercel for database connection errors
- Test database connectivity using the health endpoint: `/health`

### CORS Errors
- Ensure the frontend URL is correctly set in the backend's CORS configuration
- Check for protocol mismatches (http vs https)
- Verify that `FRONTEND_URL` environment variable is set correctly in your Vercel project

### JWT Authentication Problems
- Check if the `JWT_SECRET` is set correctly in your environment variables
- Verify that cookies are being properly set and sent
- Check for secure cookie issues (Vercel uses HTTPS, so cookies might need the secure flag)

### Database Seeding
If you need to seed your database with initial data, run the seeding script locally:
```
cd BackEnd
node utils/seedBenchmarks.js
```

### Testing Your Deployment
After deploying, you can run the deployment test script to verify your API endpoints:
```
cd BackEnd
node utils/deploymentTest.js
```

Make sure to update the `API_URL` in the test script with your actual deployed API URL.

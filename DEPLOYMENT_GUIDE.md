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

## Step 2: Deploy the Backend

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

## Step 3: Deploy the Frontend

1. Login to Vercel and create a new project
2. Import your GitHub repository
3. Configure the project:
   - Set the root directory to `/FrontEnd`
   - Set the build command to `npm run build`
   - Set the output directory to `dist`
   - Set the development command to `npm run dev`

4. Add the following environment variables:
   - `VITE_API_URL` - URL of your deployed backend
   - `VITE_ENV` - Set to `production`

5. Deploy the frontend

## Step 4: Update CORS Settings

After both deployments are complete:

1. Get the URL of your frontend deployment
2. Go to the backend project settings in Vercel
3. Add the frontend URL to the `FRONTEND_URL` environment variable
4. Redeploy the backend

## Step 5: Test the Deployment

1. Navigate to your frontend URL
2. Test registration and login
3. Test the PC build generator
4. Test the benchmarks page

## Troubleshooting

### Backend Connection Issues
- Check the MongoDB connection string
- Verify network access settings in MongoDB Atlas
- Check the application logs in Vercel

### CORS Errors
- Ensure the frontend URL is correctly set in the backend's CORS configuration
- Check for protocol mismatches (http vs https)

### JWT Authentication Problems
- Check if the JWT_SECRET is set correctly
- Verify that cookies are being properly set and sent

### Database Seeding
If you need to seed your database with initial data, run the seeding script locally:
```
cd BackEnd
node utils/seedBenchmarks.js
```

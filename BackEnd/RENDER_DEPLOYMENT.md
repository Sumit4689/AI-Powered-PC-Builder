# Deploying the Backend to Render

This guide will walk you through the process of deploying the AI Powered PC Builder backend API to Render.com.

## Prerequisites

1. Create a [Render account](https://render.com/signup)
2. Connect your GitHub repository to Render

## Deployment Options

There are two ways to deploy the application to Render:

### Option 1: Manual Deployment

1. **Create a New Web Service**:
   - From your Render dashboard, click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository with your backend code

2. **Configure the Web Service**:
   - **Name**: `ai-powered-pc-builder-api` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose "Free" or another plan that fits your needs

3. **Configure Environment Variables**:
   - Click on "Advanced" to expand advanced options
   - Add the following environment variables:
     - `PORT`: `10000` (Render will override this with its own port)
     - `NODE_ENV`: `production`
     - `CONNECTION_STRING`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `FRONTEND_URL`: Your frontend URL (e.g., `https://ai-powered-pc-builder.vercel.app`)
     - `GOOGLE_API_KEY`: Your Google AI API key (if applicable)

4. **Set Health Check Path**:
   - Add `/api/health` as the Health Check Path

5. **Create Web Service**:
   - Click "Create Web Service" to start the deployment process

### Option 2: Using render.yaml (Blueprint)

1. **Navigate to Blueprints**:
   - From your Render dashboard, click on "Blueprints"

2. **New Blueprint Instance**:
   - Click "New Blueprint Instance"
   - Select your GitHub repository
   - Render will detect the `render.yaml` file in your repository

3. **Configure Sensitive Environment Variables**:
   - You'll need to manually set sensitive environment variables like:
     - `CONNECTION_STRING`
     - `JWT_SECRET`
     - `GOOGLE_API_KEY` (if applicable)

4. **Apply Blueprint**:
   - Click "Apply" to create the services defined in your `render.yaml` file

## Verify Deployment

Once the deployment is complete, you can verify that your API is working by visiting:

```
https://your-service-name.onrender.com/api/health
```

You should receive a JSON response: `{"status":"Server is running"}`

## Common Issues and Troubleshooting

### CORS Errors

If you're experiencing CORS errors, make sure:

1. Your `FRONTEND_URL` environment variable is set correctly
2. The CORS configuration in `server.js` includes your frontend domain

### Database Connection Issues

If the API cannot connect to MongoDB:

1. Check that your `CONNECTION_STRING` is correct
2. Ensure your MongoDB Atlas IP whitelist includes Render's IPs or is set to allow access from anywhere (`0.0.0.0/0`)

### Memory Issues

If your app is crashing with memory errors on the free plan:

1. Optimize database queries
2. Implement pagination for large data responses
3. Consider upgrading to a paid plan with more resources

## Updating Your Deployment

When you push changes to your GitHub repository:

1. Render will automatically detect the changes
2. A new deployment will be triggered
3. Once the build is complete, your changes will be live

## Monitoring and Logs

From your Render dashboard:

1. Click on your web service
2. Navigate to the "Logs" tab to view real-time logs
3. Use these logs to debug any issues that occur in production

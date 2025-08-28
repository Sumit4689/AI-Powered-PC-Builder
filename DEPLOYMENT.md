# Deploying to Vercel

This guide explains how to deploy the AI-Powered PC Builder application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Git repository pushed to GitHub
3. MongoDB Atlas account with a database setup

## Deployment Steps

### 1. Clone the Repository

If you haven't already:

```bash
git clone https://github.com/Sumit4689/AI-Powered-PC-Builder.git
cd AI-Powered-PC-Builder
```

### 2. Install Vercel CLI (Optional but helpful for testing)

```bash
npm install -g vercel
```

### 3. Connect to Vercel

Log in to Vercel from the CLI:

```bash
vercel login
```

### 4. Set Up Environment Variables in Vercel

You'll need to set up the following environment variables in your Vercel project settings:

- `CONNECTION_STRING` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- `GOOGLE_API_KEY` - Your Google AI API key
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your deployed frontend URL (will be the same as your Vercel project URL)

### 5. Deploy to Vercel

Deploy using the Vercel CLI:

```bash
vercel
```

Or deploy directly from the Vercel dashboard by connecting your GitHub repository.

### 6. Verify Deployment

After deployment, verify that:

1. The frontend is accessible at your Vercel URL
2. API endpoints work correctly (e.g., `/api/health` should return a status message)
3. MongoDB connection is established

## Project Structure for Vercel Deployment

The project is configured with the following structure for Vercel deployment:

```
AI-Powered-PC-Builder/
├── BackEnd/            # Backend code
│   ├── api/
│   │   └── index.js    # Vercel API endpoint
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── server.js       # Server with production export
├── FrontEnd/           # Frontend code
│   ├── src/
│   └── ...
└── vercel.json         # Vercel configuration
```

The `vercel.json` file configures the build and routes for both frontend and backend.

## Important Files for Deployment

1. `vercel.json` - Defines how Vercel should build and route requests
2. `BackEnd/api/index.js` - Entry point for the Vercel serverless function
3. `BackEnd/server.js` - Configured to export the app for serverless environments
4. `FrontEnd/src/services/*.js` - API services updated to work in both development and production

## Troubleshooting

If you encounter any issues with your deployment:

1. Check Vercel logs for any errors
2. Verify that all environment variables are set correctly
3. Make sure MongoDB Atlas allows connections from Vercel's IP addresses
4. Check that the frontend is properly configured to call the API endpoints with the `/api` prefix

For MongoDB connection issues, add your current IP to the MongoDB Atlas network access whitelist during development.

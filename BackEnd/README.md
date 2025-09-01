# AI Powered PC Builder - Backend API

This is the backend API for the AI Powered PC Builder application. It handles user authentication, PC builds, and AI-powered build recommendations.

## Environment Setup

Before running the application, you need to set up the environment variables. Copy the `.env.example` file to a new file named `.env`:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual values:

- `PORT`: The port on which the server will run (default: 11822)
- `NODE_ENV`: The environment (development/production)
- `CONNECTION_STRING`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `FRONTEND_URL`: URL of the frontend application
- `GOOGLE_API_KEY`: API key for Google AI services (if applicable)

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

## Deployment to Render

This application is configured for easy deployment to Render.com web services.

### Manual Deployment Steps

1. Create a new Web Service on Render
2. Link to your GitHub repository
3. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all the variables from your `.env` file
   - **Health Check Path**: `/api/health`

### Using render.yaml (Blueprint)

Alternatively, you can use the included `render.yaml` file to set up the service:

1. On Render, navigate to Blueprints
2. Connect your repository
3. Render will automatically detect the `render.yaml` file and set up the services
4. You'll need to manually set sensitive environment variables like `CONNECTION_STRING` and `JWT_SECRET`

## API Documentation

### Health Check

- `GET /api/health`: Check if the server is running

### Authentication

- `POST /api/register`: Register a new user
- `POST /api/login`: Login user

### PC Builds

- `GET /api/builds/user`: Get user's saved builds
- `GET /api/builds/:id`: Get build by ID
- `POST /api/builds/save`: Save a new build
- `DELETE /api/builds/:id`: Delete a build

### Build Generation

- `POST /api/generateBuild`: Generate a PC build based on user requirements

### Benchmarks

- `GET /api/benchmarks`: Get all benchmarks
- `GET /api/benchmarks/:id`: Get benchmark by ID
- `POST /api/benchmarks/compare`: Compare multiple benchmarks
- `GET /api/benchmarks/types/all`: Get all component types
- `GET /api/benchmarks/brands/:componentType`: Get brands by component type

### User Management

- `PUT /api/users/update`: Update user profile
- `DELETE /api/users/delete`: Delete user account

### Admin Routes

- `GET /api/admin/users`: Get all users (admin only)
- `GET /api/admin/builds`: Get all builds (admin only)
- `DELETE /api/admin/users/:id`: Delete a user (admin only)
- `DELETE /api/admin/builds/:id`: Delete a build (admin only)

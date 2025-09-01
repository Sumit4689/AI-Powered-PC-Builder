# AI Powered PC Builder - Backend API

This is the backend API for the AI Powered PC Builder application. It handles user authentication, PC builds, and AI-powered build recommendations.

## Environment Setup

Create a `.env` file with the following variables:

- `PORT`: Server port (default: 11822)
- `CONNECTION_STRING`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `FRONTEND_URL`: Frontend application URL
- `GEMINI_API_KEY`: Google Gemini AI API key
- `YOUTUBE_API_KEY`: YouTube API key (if needed)

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Deployment to Render

1. Create a new Web Service on Render
2. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all required variables
   - **Health Check Path**: `/api/health`

## API Endpoints

### Authentication
- `POST /register`: Register a new user
- `POST /login`: Login user

### PC Builds
- `GET /builds/user`: Get user's saved builds
- `POST /builds/save`: Save a new build
- `GET /builds/:id`: Get build by ID
- `DELETE /builds/:id`: Delete a build
- `POST /generateBuild`: Generate a PC build

### Benchmarks
- `GET /benchmarks`: Get all benchmarks
- `GET /benchmarks/:id`: Get benchmark by ID
- `POST /benchmarks/compare`: Compare benchmarks

### User Management
- `PUT /users/update`: Update user profile
- `DELETE /users/delete`: Delete user account

### Admin (requires admin privileges)
- `GET /admin/users`: Get all users
- `GET /admin/builds`: Get all builds
- `DELETE /admin/users/:id`: Delete a user
- `DELETE /admin/builds/:id`: Delete a build

Note: In production, all routes are prefixed with `/api`

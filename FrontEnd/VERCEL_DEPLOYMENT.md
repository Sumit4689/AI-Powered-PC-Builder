# Frontend Deployment Instructions for Vercel

## Changes Made

1. **Modular API Structure**
   - Created centralized API service (`/src/services/api.js`) to handle all API calls
   - Environment variable-based API URL configuration
   - Organized services by domain (UserService, BuildService, AdminService)

2. **Environment Variables**
   - Created `.env.development` and `.env.production` files
   - All hardcoded URLs replaced with environment variables
   - Added `.env.example` for documentation

3. **Vercel Deployment Configuration**
   - Updated `vite.config.js` with production optimizations
   - Added SPA routing support
   - Created `vercel.json` with proper configurations for SPA

## Deployment Steps

### Step 1: Configure Environment Variables
Before deploying to Vercel, make sure to:
1. Update `.env.production` with the actual Render backend URL
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```

### Step 2: Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### Step 3: Deploy to Vercel
Option 1: Using Vercel CLI
```bash
cd FrontEnd
vercel
```

Option 2: Using Vercel Dashboard
1. Push your code to GitHub
2. Import your repository in Vercel dashboard
3. Set the following configuration:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Add the environment variable `VITE_API_URL` with your Render backend URL

### Step 4: Configure CORS on Backend
Ensure your Render backend allows requests from your Vercel frontend domain:

```javascript
// In your server.js or app.js
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app', 
    'http://localhost:5173'  // For local development
  ],
  credentials: true
}));
```

### Step 5: Verify Deployment
1. Check that your frontend can communicate with the backend API
2. Test authentication flows
3. Verify that all features are working as expected

## Troubleshooting

### API Connection Issues
- Check CORS configuration on your backend
- Verify environment variables are properly set in Vercel
- Check browser console for network errors

### 404 Errors on Page Refresh
- Confirm that `vercel.json` is properly configured with rewrites
- Check that build output is correctly generated

### Authentication Problems
- Ensure cookies/tokens are properly handled between domains
- Check for secure cookie settings that might prevent cross-domain usage

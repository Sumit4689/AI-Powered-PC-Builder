const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 11822;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/dbConnection');

const app = express();

// CORS configuration - Allow both production and development URLs
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://ai-powered-pc-builder.vercel.app', 'https://ai-powered-pc-builder-*.vercel.app'] 
        : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// Prefix all API routes when in production
const apiPrefix = process.env.NODE_ENV === 'production' ? '/api' : '';

app.use(`${apiPrefix}/register`, require('./routes/registerRouter'));
app.use(`${apiPrefix}/login`, require('./routes/loginRouter'));
app.use(`${apiPrefix}/generateBuild`, require('./routes/generateBuildRouter'));
app.use(`${apiPrefix}/builds`, require('./routes/buildRouter'));
app.use(`${apiPrefix}/users`, require('./routes/userRouter'));
app.use(`${apiPrefix}/admin`, require('./routes/adminRouter'));
app.use(`${apiPrefix}/benchmarks`, require('./routes/benchmarkRouter'));

// Add a health check route
app.get(`${apiPrefix}/health`, (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Add a root route for API verification
app.get(`/api`, (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});

// Connect to database
connectDb();

// For Vercel deployment, export the app
if (process.env.NODE_ENV === 'production') {
    // Export app for Vercel serverless function
    module.exports = app;
} else {
    // Start the server locally for development
    app.listen(port, () => {    
        console.log(`Server is running on the port: ${port}`);
        console.log(`http://localhost:${port}`);
    });
}
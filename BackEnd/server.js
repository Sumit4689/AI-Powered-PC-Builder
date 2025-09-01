const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 11822;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDb = require('./config/dbConnection');

const app = express();

// CORS configuration - Allow both production and development URLs
const corsOrigin = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://ai-powered-pc-builder.vercel.app'] 
    : ['http://localhost:5173'];

app.use(cors({
    origin: corsOrigin,
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

// Add health check route for monitoring
app.get(`${apiPrefix}/health`, async (req, res) => {
    try {
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.status(200).json({
            status: 'Server is running',
            database: dbStatus
        });
    } catch (error) {
        res.status(500).json({ status: 'error' });
    }
});

// Simple root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'AI Powered PC Builder API',
        endpoints: '/api'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});

// Connect to database
connectDb()
    .then(() => {
        // Start the server - Render will use this for both production and development
        app.listen(port, () => {    
            console.log(`Server is running on the port: ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to database. Server not started:', err);
    });
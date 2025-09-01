const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 11822;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDb = require('./config/dbConnection');

const app = express();

// CORS configuration - Allow both production and development URLs
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://ai-powered-pc-builder.vercel.app', 
    'https://ai-powered-pc-builder-*.vercel.app'
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (allowedOrigins.some(allowedOrigin => {
            // Handle wildcard domains
            if (allowedOrigin.includes('*')) {
                const pattern = new RegExp(allowedOrigin.replace('*', '.*'));
                return pattern.test(origin);
            }
            return allowedOrigin === origin;
        })) {
            return callback(null, true);
        }
        
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
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

// Add comprehensive health check routes
app.get(`${apiPrefix}/health`, async (req, res) => {
    try {
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        // Return detailed health information
        res.status(200).json({
            status: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: dbStatus,
                name: mongoose.connection.name || 'unknown'
            },
            uptime: process.uptime() + ' seconds'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Add a simple health check that returns 200 OK (for Render)
app.get(`/health`, (req, res) => {
    res.status(200).send('OK');
});

// Add a root route for API verification
app.get(`/api`, (req, res) => {
    res.status(200).json({ 
        message: 'API is working',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/api/health'
    });
});

// Add a fallback route for the root path
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'AI Powered PC Builder API',
        api: '/api',
        health: '/api/health'
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
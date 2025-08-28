const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 11822;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/dbConnection');

// Connect to database but handle errors gracefully for serverless environment
try {
    connectDb();
} catch (error) {
    console.error('Database connection error:', error);
}

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://ai-powered-pc-builder.vercel.app', 'https://ai-powered-pc-builder-frontend.vercel.app'] 
        : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

app.use('/register', require('./routes/registerRouter'));
app.use('/login', require('./routes/loginRouter'));
app.use('/generateBuild', require('./routes/generateBuildRouter'));
app.use('/builds', require('./routes/buildRouter'));
app.use('/users', require('./routes/userRouter'));
app.use('/admin', require('./routes/adminRouter'));
app.use('/benchmarks', require('./routes/benchmarkRouter'));

// Add a health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
  });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {    
        console.log(`Server is running on the port: ${port}`);
        console.log(`http://localhost:${port}`);
    });
}

// Export the app for Vercel
module.exports = app;
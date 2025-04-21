const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 2002;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/dbConnection');
connectDb();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

app.use('/register', require('./routes/registerRouter'));
app.use('/login', require('./routes/loginRouter'));
app.use('/generateBuild', require('./routes/generateBuildRouter'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});

app.listen(port, () => {    
    console.log(`Server is running on the port: ${port}`);
    console.log(`http://localhost:${port}`);
});
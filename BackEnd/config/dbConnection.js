const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return;
        }

        // Connection options for better reliability in serverless environment
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maintain up to 10 socket connections
        };

        const connect = await mongoose.connect(process.env.MONGODB_URI || process.env.CONNECTION_STRING, options);
        console.log("Database connected: ", 
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Don't exit in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDb;
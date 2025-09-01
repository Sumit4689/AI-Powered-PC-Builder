const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        // Add connection options optimized for Render deployment
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            // Connection options for better reliability in production environments
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            // Auto reconnect if connection is lost
            autoReconnect: true,
            // Maintain up to 10 socket connections
            poolSize: 10,
            // Keep trying to send operations for 5 seconds
            reconnectTries: 10,
            // Wait 500ms between retries
            reconnectInterval: 500,
            // Maintain up to 5 connections in the connection pool
            maxPoolSize: 5,
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            // Log queries if in development mode
            debug: process.env.NODE_ENV !== 'production'
        });
        
        console.log("Database connected : ", 
            connect.connection.host,
            connect.connection.name
        );
        
        // Add connection error handler
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        // Add disconnection handler
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected, attempting to reconnect...');
        });

        // Add successful reconnection handler
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });
        
        return connect;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        
        // For Render deployment, we want to retry rather than exit
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        
        throw error; // Re-throw for handling elsewhere
    }
}

module.exports = connectDb;
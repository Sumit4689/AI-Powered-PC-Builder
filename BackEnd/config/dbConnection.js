const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        // Add connection options optimized for Render deployment
        // Using only supported options in newer MongoDB versions
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            // Modern connection options for reliability
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            // Modern connection pool settings
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
            // Keep-alive settings
            keepAlive: true,
            keepAliveInitialDelay: 300000
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
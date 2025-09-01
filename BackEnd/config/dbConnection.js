const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        // Add connection options for better reliability in serverless environments
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        });
        
        console.log("Database connected : ", 
            connect.connection.host,
            connect.connection.name
        );
        return connect;
    } catch (error) {
        console.log("MongoDB connection error:", error);
        
        // In production (Vercel), we don't want to crash the serverless function
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        
        throw error; // Re-throw for handling elsewhere
    }
}

module.exports = connectDb;
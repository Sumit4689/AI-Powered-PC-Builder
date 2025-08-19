const mongoose = require('mongoose');

const benchmarkSchema = new mongoose.Schema({
    componentType: {
        type: String,
        required: true,
        enum: ['CPU', 'GPU', 'Cooler', 'RAM', 'SSD', 'HDD'] // Add more types as needed
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    scores: {
        // Different benchmark metrics based on component type
        singleCore: Number,
        multiCore: Number,
        gaming: Number,
        productivity: Number,
        thermals: Number,
        powerConsumption: Number,
        fps1080p: Number,
        fps1440p: Number,
        fps4k: Number,
        readSpeed: Number,
        writeSpeed: Number,
        randomRead: Number,
        randomWrite: Number,
        latency: Number
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    additionalInfo: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Create indexes for improved performance
benchmarkSchema.index({ componentType: 1 });
benchmarkSchema.index({ brand: 1 });
benchmarkSchema.index({ name: 1 });

const Benchmark = mongoose.model('Benchmark', benchmarkSchema);

module.exports = Benchmark;

const mongoose = require('mongoose');
const Benchmark = require('../models/benchmarkModel');
require('dotenv').config();
const connectDb = require('../config/dbConnection');

// Connect to MongoDB
connectDb();

// Sample benchmark data
const benchmarkData = [
    // CPUs
    {
        componentType: 'CPU',
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        scores: {
            singleCore: 2150,
            multiCore: 38650,
            gaming: 245,
            productivity: 315
        },
        year: 2022,
        price: 589
    },
    {
        componentType: 'CPU',
        name: 'Intel Core i7-13700K',
        brand: 'Intel',
        scores: {
            singleCore: 2045,
            multiCore: 30280,
            gaming: 230,
            productivity: 290
        },
        year: 2022,
        price: 409
    },
    {
        componentType: 'CPU',
        name: 'Intel Core i5-13600K',
        brand: 'Intel',
        scores: {
            singleCore: 1980,
            multiCore: 24360,
            gaming: 215,
            productivity: 260
        },
        year: 2022,
        price: 319
    },
    {
        componentType: 'CPU',
        name: 'AMD Ryzen 9 7950X',
        brand: 'AMD',
        scores: {
            singleCore: 2160,
            multiCore: 38450,
            gaming: 240,
            productivity: 320
        },
        year: 2022,
        price: 699
    },
    {
        componentType: 'CPU',
        name: 'AMD Ryzen 7 7800X3D',
        brand: 'AMD',
        scores: {
            singleCore: 1950,
            multiCore: 25800,
            gaming: 250,
            productivity: 265
        },
        year: 2023,
        price: 449
    },
    {
        componentType: 'CPU',
        name: 'AMD Ryzen 5 7600X',
        brand: 'AMD',
        scores: {
            singleCore: 1890,
            multiCore: 18750,
            gaming: 210,
            productivity: 230
        },
        year: 2022,
        price: 299
    },
    {
        componentType: 'CPU',
        name: 'Intel Core i9-12900K',
        brand: 'Intel',
        scores: {
            singleCore: 1980,
            multiCore: 30150,
            gaming: 220,
            productivity: 285
        },
        year: 2021,
        price: 589
    },
    {
        componentType: 'CPU',
        name: 'AMD Ryzen 9 5950X',
        brand: 'AMD',
        scores: {
            singleCore: 1680,
            multiCore: 28450,
            gaming: 200,
            productivity: 290
        },
        year: 2020,
        price: 799
    },
    
    // GPUs
    {
        componentType: 'GPU',
        name: 'NVIDIA RTX 4090',
        brand: 'NVIDIA',
        scores: {
            fps1080p: 380,
            fps1440p: 250,
            fps4k: 150
        },
        year: 2022,
        price: 1599
    },
    {
        componentType: 'GPU',
        name: 'NVIDIA RTX 4080',
        brand: 'NVIDIA',
        scores: {
            fps1080p: 350,
            fps1440p: 220,
            fps4k: 120
        },
        year: 2022,
        price: 1199
    },
    {
        componentType: 'GPU',
        name: 'AMD Radeon RX 7900 XTX',
        brand: 'AMD',
        scores: {
            fps1080p: 345,
            fps1440p: 215,
            fps4k: 118
        },
        year: 2022,
        price: 999
    },
    {
        componentType: 'GPU',
        name: 'NVIDIA RTX 4070 Ti',
        brand: 'NVIDIA',
        scores: {
            fps1080p: 315,
            fps1440p: 200,
            fps4k: 95
        },
        year: 2023,
        price: 799
    },
    {
        componentType: 'GPU',
        name: 'AMD Radeon RX 7800 XT',
        brand: 'AMD',
        scores: {
            fps1080p: 300,
            fps1440p: 190,
            fps4k: 85
        },
        year: 2023,
        price: 499
    },
    {
        componentType: 'GPU',
        name: 'NVIDIA RTX 3080',
        brand: 'NVIDIA',
        scores: {
            fps1080p: 280,
            fps1440p: 180,
            fps4k: 85
        },
        year: 2020,
        price: 699
    },
    
    // CPU Coolers
    {
        componentType: 'Cooler',
        name: 'Noctua NH-D15',
        brand: 'Noctua',
        scores: {
            thermals: 92,
            noise: 88
        },
        year: 2019,
        price: 99
    },
    {
        componentType: 'Cooler',
        name: 'Corsair iCUE H150i Elite Capellix',
        brand: 'Corsair',
        scores: {
            thermals: 95,
            noise: 82
        },
        year: 2021,
        price: 189
    },
    {
        componentType: 'Cooler',
        name: 'NZXT Kraken X63',
        brand: 'NZXT',
        scores: {
            thermals: 90,
            noise: 85
        },
        year: 2020,
        price: 149
    },
    {
        componentType: 'Cooler',
        name: 'Arctic Liquid Freezer II 360',
        brand: 'Arctic',
        scores: {
            thermals: 94,
            noise: 89
        },
        year: 2020,
        price: 129
    },
    
    // RAM
    {
        componentType: 'RAM',
        name: 'G.Skill Trident Z5 RGB DDR5-6000',
        brand: 'G.Skill',
        scores: {
            latency: 92,
            bandwidth: 96
        },
        year: 2022,
        price: 189
    },
    {
        componentType: 'RAM',
        name: 'Corsair Dominator Platinum RGB DDR5-5600',
        brand: 'Corsair',
        scores: {
            latency: 90,
            bandwidth: 94
        },
        year: 2022,
        price: 209
    },
    {
        componentType: 'RAM',
        name: 'Kingston Fury Beast DDR5-4800',
        brand: 'Kingston',
        scores: {
            latency: 85,
            bandwidth: 89
        },
        year: 2021,
        price: 129
    },
    
    // SSDs
    {
        componentType: 'SSD',
        name: 'Samsung 990 Pro 2TB',
        brand: 'Samsung',
        scores: {
            readSpeed: 7450,
            writeSpeed: 6900,
            randomRead: 1400,
            randomWrite: 1550
        },
        year: 2022,
        price: 249
    },
    {
        componentType: 'SSD',
        name: 'WD Black SN850X 1TB',
        brand: 'Western Digital',
        scores: {
            readSpeed: 7300,
            writeSpeed: 6600,
            randomRead: 1200,
            randomWrite: 1450
        },
        year: 2022,
        price: 159
    },
    {
        componentType: 'SSD',
        name: 'Crucial P5 Plus 1TB',
        brand: 'Crucial',
        scores: {
            readSpeed: 6600,
            writeSpeed: 5000,
            randomRead: 1000,
            randomWrite: 1200
        },
        year: 2021,
        price: 119
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Delete existing data
        await Benchmark.deleteMany({});
        console.log('Existing benchmark data deleted');

        // Insert new data
        await Benchmark.insertMany(benchmarkData);
        console.log(`${benchmarkData.length} benchmark records inserted successfully`);
        
        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase();

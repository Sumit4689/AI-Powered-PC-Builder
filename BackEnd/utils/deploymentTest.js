// A simple script to test the API endpoints after deployment
const https = require('https');

// Replace with your actual deployed API URL
const API_URL = 'https://ai-powered-pc-builder-backend.vercel.app';

// Test the root endpoint
function testRootEndpoint() {
    console.log('Testing root endpoint...');
    
    https.get(`${API_URL}`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status code: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log('Root endpoint is working!');
                console.log('Response:', JSON.parse(data));
            } else {
                console.log('Root endpoint error:', data);
            }
        });
    }).on('error', (err) => {
        console.error('Request error:', err);
    });
}

// Test the health check endpoint
function testHealthEndpoint() {
    console.log('\nTesting health endpoint...');
    
    https.get(`${API_URL}/health`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status code: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log('Health endpoint is working!');
                console.log('Response:', JSON.parse(data));
            } else {
                console.log('Health endpoint error:', data);
            }
        });
    }).on('error', (err) => {
        console.error('Request error:', err);
    });
}

// Test the benchmarks endpoint
function testBenchmarksEndpoint() {
    console.log('\nTesting benchmarks endpoint...');
    
    https.get(`${API_URL}/benchmarks/types/all`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status code: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log('Benchmarks endpoint is working!');
                console.log('Response data length:', data.length);
            } else {
                console.log('Benchmarks endpoint error:', data);
            }
        });
    }).on('error', (err) => {
        console.error('Request error:', err);
    });
}

// Run tests
console.log('Starting API deployment tests...');
console.log('----------------------------');
testRootEndpoint();
setTimeout(testHealthEndpoint, 1000);
setTimeout(testBenchmarksEndpoint, 2000);

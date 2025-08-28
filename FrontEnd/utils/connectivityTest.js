// A script to test frontend-backend connectivity after deployment
const https = require('https');

// Replace these with your actual deployed URLs
const FRONTEND_URL = 'https://ai-powered-pc-builder.vercel.app';
const BACKEND_URL = 'https://ai-powered-pc-builder-backend.vercel.app';

console.log('Starting deployment connectivity test...');
console.log('----------------------------');

// Test the backend directly
console.log('1. Testing backend API directly...');
https.get(`${BACKEND_URL}`, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`   Status code: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log('   ✅ Backend API is accessible!');
            console.log('   Response:', data);
        } else {
            console.log('   ❌ Backend API error:', data);
        }
        console.log();
        
        // After testing backend, check CORS configuration
        testCorsConfiguration();
    });
}).on('error', (err) => {
    console.error('   ❌ Backend request error:', err);
    console.log();
    testCorsConfiguration();
});

// Test CORS configuration
function testCorsConfiguration() {
    console.log('2. Testing CORS configuration...');
    
    const options = {
        method: 'OPTIONS',
        headers: {
            'Origin': FRONTEND_URL,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }
    };
    
    const req = https.request(`${BACKEND_URL}`, options, (res) => {
        console.log(`   Status code: ${res.statusCode}`);
        
        // Check for CORS headers
        const corsHeaders = {
            'access-control-allow-origin': res.headers['access-control-allow-origin'],
            'access-control-allow-methods': res.headers['access-control-allow-methods'],
            'access-control-allow-headers': res.headers['access-control-allow-headers'],
            'access-control-allow-credentials': res.headers['access-control-allow-credentials']
        };
        
        console.log('   CORS Headers:', corsHeaders);
        
        if (corsHeaders['access-control-allow-origin']) {
            console.log('   ✅ CORS headers are present!');
            
            // Check if the frontend origin is allowed
            if (corsHeaders['access-control-allow-origin'] === FRONTEND_URL || 
                corsHeaders['access-control-allow-origin'] === '*') {
                console.log('   ✅ Frontend origin is allowed by CORS!');
            } else {
                console.log(`   ❌ Frontend origin (${FRONTEND_URL}) is not allowed by CORS`);
                console.log('   Current allowed origin:', corsHeaders['access-control-allow-origin']);
                console.log('   You may need to update the FRONTEND_URL environment variable on the backend');
            }
        } else {
            console.log('   ❌ CORS headers are missing');
            console.log('   Make sure CORS middleware is correctly configured in the backend');
        }
        
        console.log();
        testEnvironmentVariables();
    });
    
    req.on('error', (err) => {
        console.error('   ❌ CORS request error:', err);
        console.log();
        testEnvironmentVariables();
    });
    
    req.end();
}

// Test that environment variables are correctly set
function testEnvironmentVariables() {
    console.log('3. Frontend API URL configuration check:');
    console.log(`   Your frontend should have VITE_API_URL set to: ${BACKEND_URL}`);
    console.log('   To verify:');
    console.log('   1. Go to Vercel dashboard > Frontend project > Settings > Environment Variables');
    console.log('   2. Check that VITE_API_URL is set correctly');
    console.log('   3. If not, add or update it and redeploy');
    
    console.log();
    console.log('4. Backend FRONTEND_URL configuration check:');
    console.log(`   Your backend should have FRONTEND_URL set to: ${FRONTEND_URL}`);
    console.log('   To verify:');
    console.log('   1. Go to Vercel dashboard > Backend project > Settings > Environment Variables');
    console.log('   2. Check that FRONTEND_URL is set correctly');
    console.log('   3. If not, add or update it and redeploy');
}

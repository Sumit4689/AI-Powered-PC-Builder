const dns = require('dns');
require('dotenv').config();

const mongoHost = (process.env.MONGODB_URI || process.env.CONNECTION_STRING || '')
    .split('//')
    .pop()
    .split('@')
    .pop()
    .split('/')[0]
    .split(':')[0];

console.log(`Testing DNS resolution for MongoDB host: ${mongoHost}`);

// Test DNS resolution
dns.lookup(mongoHost, (err, address, family) => {
    if (err) {
        console.error('DNS Lookup Error:', err);
        return;
    }
    console.log(`Address: ${address}, Family: IPv${family}`);
});

// Test TXT records
dns.resolveTxt(mongoHost, (err, records) => {
    if (err) {
        console.error('TXT Record Error:', err);
        return;
    }
    console.log('TXT Records:', records);
});

// Test A records
dns.resolve4(mongoHost, (err, addresses) => {
    if (err) {
        console.error('A Record Error:', err);
        return;
    }
    console.log('A Records:', addresses);
});

// Exit after tests
setTimeout(() => {
    console.log('DNS tests completed');
}, 5000);

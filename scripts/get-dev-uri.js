// Script to get the development redirect URI for Reddit OAuth
const os = require('os');
const interfaces = os.networkInterfaces();

// Function to get local IP addresses
function getLocalIpAddresses() {
  const addresses = [];
  
  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((iface) => {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        addresses.push(iface.address);
      }
    });
  });
  
  return addresses;
}

// Get all local IP addresses
const ipAddresses = getLocalIpAddresses();

console.log('\n=== Reddit OAuth Redirect URIs ===\n');

// Display development URIs for each IP address
console.log('Development URIs (add these to your Reddit developer console):');
ipAddresses.forEach(ip => {
  console.log(`exp://${ip}:19000/--/reddit-auth`);
});

// Display production URI
console.log('\nProduction URI (add this to your Reddit developer console):');
console.log('myapp://reddit-auth');

console.log('\nMake sure to add BOTH development and production URIs to your Reddit developer console.\n');

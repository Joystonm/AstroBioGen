/**
 * Script to save the server port to a file that the client can read
 */

const fs = require('fs');
const path = require('path');

// Get the port from command line arguments or use default
const port = process.argv[2] || process.env.PORT || '5003';

// Save to a file in the client's public directory
const publicDir = path.join(__dirname, '../client/public');
const filePath = path.join(publicDir, 'serverPort.json');

// Create the data
const data = {
  port: port,
  timestamp: new Date().toISOString()
};

// Ensure the directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`Server port ${port} saved to ${filePath}`);

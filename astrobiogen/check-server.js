/**
 * Script to check if the server is running and update the client with the correct port
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Ports to check
const portsToCheck = [5003, 5002, 5001, 5000, 3000];

// Function to check if a port is in use
const checkPort = (port) => {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: port,
      path: '/api/space-data/space-weather',
      timeout: 1000
    }, (res) => {
      console.log(`Port ${port} is in use, status: ${res.statusCode}`);
      resolve(port);
    });
    
    req.on('error', () => {
      console.log(`Port ${port} is not in use or not responding`);
      resolve(null);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`Request to port ${port} timed out`);
      resolve(null);
    });
  });
};

// Check all ports and find the first one that's in use
const findActivePort = async () => {
  for (const port of portsToCheck) {
    const activePort = await checkPort(port);
    if (activePort) {
      return activePort;
    }
  }
  return null;
};

// Update client files with the correct port
const updateClientFiles = (port) => {
  // Save to a file in the client's public directory
  const publicDir = path.join(__dirname, 'client/public');
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
  
  // Create a script that will set the port in localStorage when the client loads
  const scriptPath = path.join(publicDir, 'setServerPort.js');
  const scriptContent = `
// Set server port in localStorage
(function() {
  try {
    localStorage.setItem('serverPort', '${port}');
    console.log('Server port set to ${port} in localStorage');
  } catch (e) {
    console.error('Failed to set server port in localStorage:', e);
  }
})();
`;
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`Created script to set server port in localStorage: ${scriptPath}`);
  
  // Update the index.html to include the script
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check if the script is already included
    if (!indexContent.includes('setServerPort.js')) {
      // Add the script before the closing head tag
      indexContent = indexContent.replace(
        '</head>',
        '  <script src="/setServerPort.js"></script>\n</head>'
      );
      fs.writeFileSync(indexPath, indexContent);
      console.log(`Updated ${indexPath} to include the setServerPort.js script`);
    }
  }
};

// Main function
const main = async () => {
  console.log('Checking for active server...');
  const activePort = await findActivePort();
  
  if (activePort) {
    console.log(`Found active server on port ${activePort}`);
    updateClientFiles(activePort);
  } else {
    console.log('No active server found');
  }
};

// Run the main function
main();

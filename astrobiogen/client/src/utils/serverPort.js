/**
 * Utility to detect the server port and save it to localStorage
 */

import axios from 'axios';

/**
 * Detect which port the server is running on
 * @returns {Promise<string>} - The detected port
 */
export const detectServerPort = async () => {
  try {
    // First, try to get the port from the serverPort.json file
    const response = await fetch('/serverPort.json');
    if (response.ok) {
      const data = await response.json();
      if (data && data.port) {
        console.log(`Server port found in serverPort.json: ${data.port}`);
        localStorage.setItem('serverPort', data.port);
        return data.port;
      }
    }
  } catch (error) {
    console.log('No serverPort.json file found, trying to detect port...');
  }
  
  // Try ports in sequence
  const portsToTry = ['5003', '5002', '5001', '5000', '3000'];
  
  for (const port of portsToTry) {
    try {
      // Try to ping the server on this port
      const response = await axios.get(`http://localhost:${port}/api/space-data/space-weather`, {
        timeout: 1000 // Short timeout for quick checking
      });
      
      if (response.status === 200) {
        console.log(`Server detected on port ${port}`);
        localStorage.setItem('serverPort', port);
        return port;
      }
    } catch (error) {
      if (error.response) {
        // If we got any response, the server is there but endpoint might be wrong
        console.log(`Server detected on port ${port}`);
        localStorage.setItem('serverPort', port);
        return port;
      }
      // Otherwise, try the next port
      console.log(`No server on port ${port}`);
    }
  }
  
  // Default to 5003 if no server found
  console.log('No server detected, defaulting to port 5003');
  localStorage.setItem('serverPort', '5003');
  return '5003';
};

export default detectServerPort;

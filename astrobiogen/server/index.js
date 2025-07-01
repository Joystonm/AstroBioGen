require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const net = require('net');

// Import routes
const genelabRoutes = require('./routes/genelab');
const groqRoutes = require('./routes/groq');
const tavilyRoutes = require('./routes/tavily');
const spaceDataRoutes = require('./routes/spaceData');
const chatRoutes = require('./routes/chat');
const nasaRoutes = require('./routes/nasa');

const app = express();
// Try ports starting from 5003, then 5004, 5005, etc.
const BASE_PORT = process.env.PORT || 5003;

// Function to check if a port is in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is available
    });
    
    server.listen(port);
  });
};

// Find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  const MAX_PORT = startPort + 10; // Try up to 10 ports
  
  while (port < MAX_PORT) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
    port++;
  }
  
  throw new Error(`Could not find an available port between ${startPort} and ${MAX_PORT-1}`);
};

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/genelab', genelabRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/tavily', tavilyRoutes);
app.use('/api/space-data', spaceDataRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/nasa', nasaRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server on an available port
(async () => {
  try {
    const port = await findAvailablePort(BASE_PORT);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      
      // Write the port to a file so the client can read it
      const fs = require('fs');
      const path = require('path');
      
      // Save to server directory
      fs.writeFileSync(path.join(__dirname, 'port.txt'), port.toString());
      
      // Also save to client's public directory if it exists
      const clientPublicDir = path.join(__dirname, '../client/public');
      if (fs.existsSync(clientPublicDir)) {
        const portData = {
          port: port,
          timestamp: new Date().toISOString()
        };
        fs.writeFileSync(
          path.join(clientPublicDir, 'serverPort.json'), 
          JSON.stringify(portData, null, 2)
        );
      }
      
      console.log(`Port ${port} saved to port.txt file`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

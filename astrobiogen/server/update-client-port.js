const fs = require('fs');
const path = require('path');

// Read the port from port.txt
try {
  const port = fs.readFileSync(path.join(__dirname, 'port.txt'), 'utf8').trim();
  console.log(`Server is running on port ${port}`);
  
  // Update client API files
  const clientApiDir = path.join(__dirname, '../client/src/api');
  
  // List of API files to update
  const apiFiles = [
    'groq.js',
    'tavily.js',
    'genelab.js',
    'spaceData.js'
  ];
  
  // Update each file
  apiFiles.forEach(file => {
    const filePath = path.join(clientApiDir, file);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace any localhost:XXXX with the new port
      content = content.replace(/localhost:\d+/g, `localhost:${port}`);
      
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file} with port ${port}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  });
  
  // Update Planets.jsx file
  const planetsPath = path.join(__dirname, '../client/src/pages/Planets.jsx');
  if (fs.existsSync(planetsPath)) {
    let content = fs.readFileSync(planetsPath, 'utf8');
    content = content.replace(/localhost:\d+\/api\/chat/g, `localhost:${port}/api/chat`);
    fs.writeFileSync(planetsPath, content);
    console.log(`Updated Planets.jsx with port ${port}`);
  }
  
  console.log('All client files updated successfully!');
} catch (error) {
  console.error('Error updating client port:', error);
}

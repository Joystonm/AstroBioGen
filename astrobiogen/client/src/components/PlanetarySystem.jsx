import { useState, useEffect, useRef } from 'react';

const PlanetarySystem = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  
  // Planet data
  const planets = [
    { 
      name: 'Mercury', 
      distance: 30, 
      radius: 3, 
      color: '#a6a6a6', 
      speed: 0.04,
      description: 'Closest planet to the Sun with extreme temperature variations.'
    },
    { 
      name: 'Venus', 
      distance: 50, 
      radius: 6, 
      color: '#e39e54', 
      speed: 0.015,
      description: 'Similar in size to Earth but with a toxic atmosphere and extreme greenhouse effect.'
    },
    { 
      name: 'Earth', 
      distance: 70, 
      radius: 6.5, 
      color: '#6b93d6', 
      speed: 0.01,
      description: 'Our home planet, the only known world with liquid water and life.'
    },
    { 
      name: 'Mars', 
      distance: 90, 
      radius: 4, 
      color: '#c1440e', 
      speed: 0.008,
      description: 'The Red Planet, with polar ice caps and evidence of ancient water.'
    },
    { 
      name: 'Jupiter', 
      distance: 130, 
      radius: 15, 
      color: '#e0ae6f', 
      speed: 0.002,
      description: 'Largest planet in our solar system with a distinctive Great Red Spot.'
    },
    { 
      name: 'Saturn', 
      distance: 170, 
      radius: 13, 
      color: '#f4d4a9', 
      speed: 0.0009,
      description: 'Known for its spectacular ring system made mostly of ice particles.'
    },
    { 
      name: 'Uranus', 
      distance: 210, 
      radius: 9, 
      color: '#d1e7e7', 
      speed: 0.0004,
      description: 'Ice giant that rotates on its side, with a tilted magnetic field.'
    },
    { 
      name: 'Neptune', 
      distance: 240, 
      radius: 8.5, 
      color: '#5b5ddf', 
      speed: 0.0001,
      description: 'Windiest planet with the strongest storms in the solar system.'
    }
  ];
  
  // Initialize planet positions
  const [planetPositions, setPlanetPositions] = useState(
    planets.map((planet, index) => ({
      angle: (Math.PI * 2 / planets.length) * index,
      x: 0,
      y: 0
    }))
  );
  
  // Handle canvas click to select planets
  const handleCanvasClick = (event) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Check if any planet was clicked
    let clickedPlanet = null;
    
    planetPositions.forEach((position, index) => {
      const planet = planets[index];
      const dx = position.x + centerX - x;
      const dy = position.y + centerY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= planet.radius * 1.5) {
        clickedPlanet = planet;
      }
    });
    
    setSelectedPlanet(clickedPlanet);
  };
  
  // Animation effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;
    
    let lastTime = 0;
    
    // Animation function
    const animate = (currentTime) => {
      // Convert to seconds
      currentTime *= 0.001;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      
      // Draw stars
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random();
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      // Draw sun
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      
      // Create radial gradient for sun
      const sunGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 15
      );
      sunGradient.addColorStop(0, '#fff176');
      sunGradient.addColorStop(0.7, '#ffa726');
      sunGradient.addColorStop(1, '#ff7043');
      
      ctx.fillStyle = sunGradient;
      ctx.fill();
      
      // Draw sun glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 160, 0, 0.2)';
      ctx.fill();
      
      // Update planet positions and draw planets
      const newPositions = [...planetPositions];
      
      planets.forEach((planet, index) => {
        // Update angle based on speed
        newPositions[index].angle += planet.speed * deltaTime;
        
        // Calculate new position
        const x = Math.cos(newPositions[index].angle) * planet.distance;
        const y = Math.sin(newPositions[index].angle) * planet.distance;
        
        newPositions[index].x = x;
        newPositions[index].y = y;
        
        // Draw orbit
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw planet
        ctx.beginPath();
        ctx.arc(centerX + x, centerY + y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
        
        // Highlight selected planet
        if (selectedPlanet && selectedPlanet.name === planet.name) {
          ctx.beginPath();
          ctx.arc(centerX + x, centerY + y, planet.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Update state only if positions have changed significantly
      if (deltaTime > 0.1) {
        setPlanetPositions(newPositions);
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Add click event listener
    canvas.addEventListener('click', handleCanvasClick);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedPlanet]);
  
  return (
    <div className="planetary-system-container">
      <canvas 
        ref={canvasRef} 
        className="planetary-system-canvas"
        width={800}
        height={400}
      />
      
      {selectedPlanet && (
        <div className="planet-info">
          <h3 className="font-semibold text-lg mb-1">{selectedPlanet.name}</h3>
          <p className="text-sm">{selectedPlanet.description}</p>
        </div>
      )}
      
      {!selectedPlanet && (
        <div className="planet-info">
          <h3 className="font-semibold text-lg mb-1">Solar System</h3>
          <p className="text-sm">Click on a planet to learn more about it.</p>
        </div>
      )}
    </div>
  );
};

export default PlanetarySystem;

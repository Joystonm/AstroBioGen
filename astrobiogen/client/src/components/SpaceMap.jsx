import { useState, useEffect, useRef } from 'react';

const SpaceMap = () => {
  const [issPosition, setIssPosition] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Fetch ISS position
  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout
        
        const response = await fetch('http://api.open-notify.org/iss-now.json', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setIssPosition({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude)
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ISS position:', err);
        setError('Could not fetch ISS position. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchISSPosition();
    
    // Update position every 30 seconds
    const intervalId = setInterval(fetchISSPosition, 30000);
    
    return () => {
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Draw world map and ISS position
  useEffect(() => {
    if (!canvasRef.current || loading) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Function to convert lat/long to x/y coordinates
    const latLongToXY = (lat, long) => {
      const x = (long + 180) * (width / 360);
      const y = (90 - lat) * (height / 180);
      return { x, y };
    };
    
    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw world map background
      ctx.fillStyle = '#cddeff';
      ctx.fillRect(0, 0, width, height);
      
      // Draw simplified continents (rectangles for demonstration)
      ctx.fillStyle = '#a3c2ff';
      
      // North America
      ctx.fillRect(width * 0.05, height * 0.1, width * 0.2, height * 0.25);
      
      // South America
      ctx.fillRect(width * 0.15, height * 0.4, width * 0.15, height * 0.3);
      
      // Europe and Africa
      ctx.fillRect(width * 0.4, height * 0.15, width * 0.15, height * 0.5);
      
      // Asia
      ctx.fillRect(width * 0.6, height * 0.1, width * 0.25, height * 0.35);
      
      // Australia
      ctx.fillRect(width * 0.7, height * 0.55, width * 0.15, height * 0.15);
      
      // Draw grid lines
      ctx.strokeStyle = '#8ab0ff';
      ctx.lineWidth = 0.5;
      
      // Longitude lines
      for (let i = 0; i <= 360; i += 30) {
        ctx.beginPath();
        const x = i * (width / 360);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Latitude lines
      for (let i = 0; i <= 180; i += 30) {
        ctx.beginPath();
        const y = i * (height / 180);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw ISS position
      const issXY = latLongToXY(issPosition.latitude, issPosition.longitude);
      
      // Draw pulse effect
      const time = new Date().getTime() * 0.001;
      const pulseSize = 10 + Math.sin(time * 2) * 5;
      
      ctx.beginPath();
      ctx.arc(issXY.x, issXY.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fill();
      
      // Draw ISS marker
      ctx.beginPath();
      ctx.arc(issXY.x, issXY.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Animate
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [issPosition, loading]);
  
  // Format coordinates for display
  const formatCoordinate = (value, direction) => {
    const abs = Math.abs(value);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = Math.floor(((abs - deg) * 60 - min) * 60);
    
    const directionIndicator = direction === 'lat' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
      
    return `${deg}° ${min}' ${sec}" ${directionIndicator}`;
  };
  
  return (
    <div className="iss-tracker-container">
      <canvas 
        ref={canvasRef} 
        className="iss-tracker-map"
        width={800}
        height={400}
      />
      
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
          <p className="ml-3 text-gray-700">Fetching ISS location...</p>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="iss-info">
          <h3>International Space Station</h3>
          <p>Latitude: {formatCoordinate(issPosition.latitude, 'lat')}</p>
          <p>Longitude: {formatCoordinate(issPosition.longitude, 'long')}</p>
        </div>
      )}
    </div>
  );
};

export default SpaceMap;

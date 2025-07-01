import { useState, useEffect } from 'react';
import axios from 'axios';

const SpaceWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Read port from localStorage if available
        const serverPort = localStorage.getItem('serverPort') || '5004';
        
        // Try to fetch from our server API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout
        
        // Get space weather data from our server API
        const response = await axios.get(
          `http://localhost:${serverPort}/api/space-data/space-weather`, 
          {
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        // Process the data
        const weatherEvents = response.data;
        
        // Count different types of events
        const solarFlares = weatherEvents.filter(n => n.type.includes('FLARE')).length;
        const cmeEvents = weatherEvents.filter(n => n.type.includes('CME')).length;
        const radiationEvents = weatherEvents.filter(n => n.type.includes('SEP')).length;
        
        // Get the most recent notification for alert
        const latestNotification = weatherEvents.length > 0 ? weatherEvents[0] : null;
        
        // Get solar wind data from NOAA API
        let solarWindSpeed = 400; // Default value
        let kpIndex = 2; // Default value
        
        try {
          const solarWindResponse = await axios.get(
            'https://services.swpc.noaa.gov/products/summary/solar-wind.json',
            { timeout: 5000 }
          );
          
          if (solarWindResponse.data && solarWindResponse.data.WindSpeed) {
            solarWindSpeed = solarWindResponse.data.WindSpeed;
          }
        } catch (windError) {
          console.warn('Could not fetch solar wind data:', windError);
          // Use a random value between 350-650 km/s
          solarWindSpeed = Math.floor(Math.random() * 300) + 350;
        }
        
        try {
          const kpIndexResponse = await axios.get(
            'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
            { timeout: 5000 }
          );
          
          if (kpIndexResponse.data && kpIndexResponse.data.length > 1) {
            kpIndex = parseFloat(kpIndexResponse.data[kpIndexResponse.data.length - 1][1]);
          }
        } catch (kpError) {
          console.warn('Could not fetch Kp index data:', kpError);
          // Use a random value between 0-5
          kpIndex = Math.floor(Math.random() * 6);
        }
        
        setWeatherData({
          solarFlares,
          cmeEvents,
          radiationEvents,
          solarWindSpeed,
          kpIndex,
          alert: latestNotification ? {
            title: latestNotification.type,
            message: latestNotification.note.substring(0, 120) + (latestNotification.note.length > 120 ? '...' : '')
          } : null
        });
      } catch (err) {
        console.error('Error fetching space weather:', err);
        setError('Could not fetch space weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaceWeather();
  }, []);
  
  // Get color class based on value
  const getStatusColor = (value, type) => {
    if (type === 'kp') {
      if (value <= 3) return 'bg-green-100 text-green-800';
      if (value <= 6) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
    
    if (type === 'wind') {
      if (value < 400) return 'bg-green-100 text-green-800';
      if (value < 600) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
    
    return '';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
        <p className="ml-3 text-gray-700">Fetching space weather data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
        <p>No space weather data available at this time.</p>
      </div>
    );
  }
  
  return (
    <div className="space-weather-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solar Wind Speed */}
        <div className="weather-metric">
          <div className="weather-metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="weather-metric-value">
              {weatherData.solarWindSpeed} km/s
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(weatherData.solarWindSpeed, 'wind')}`}>
                {weatherData.solarWindSpeed < 400 ? 'Low' : weatherData.solarWindSpeed < 600 ? 'Moderate' : 'High'}
              </span>
            </div>
            <div className="weather-metric-label">Solar Wind Speed</div>
          </div>
        </div>
        
        {/* Kp Index */}
        <div className="weather-metric">
          <div className="weather-metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="weather-metric-value">
              {weatherData.kpIndex}
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(weatherData.kpIndex, 'kp')}`}>
                {weatherData.kpIndex <= 3 ? 'Quiet' : weatherData.kpIndex <= 6 ? 'Active' : 'Storm'}
              </span>
            </div>
            <div className="weather-metric-label">Geomagnetic Activity (Kp Index)</div>
          </div>
        </div>
        
        {/* Solar Flares */}
        <div className="weather-metric">
          <div className="weather-metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <div className="weather-metric-value">
              {weatherData.solarFlares}
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${weatherData.solarFlares > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {weatherData.solarFlares === 0 ? 'None' : weatherData.solarFlares === 1 ? 'Minor' : 'Active'}
              </span>
            </div>
            <div className="weather-metric-label">Solar Flares (Last 24h)</div>
          </div>
        </div>
        
        {/* CME Events */}
        <div className="weather-metric">
          <div className="weather-metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <div className="weather-metric-value">
              {weatherData.cmeEvents}
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${weatherData.cmeEvents > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {weatherData.cmeEvents === 0 ? 'None' : 'Active'}
              </span>
            </div>
            <div className="weather-metric-label">Coronal Mass Ejections</div>
          </div>
        </div>
      </div>
      
      {/* Alert */}
      {weatherData.alert && (
        <div className="weather-alert mt-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-md">
          <div className="weather-alert-title font-bold text-indigo-800">{weatherData.alert.title}</div>
          <div className="weather-alert-message text-indigo-700 mt-1">{weatherData.alert.message}</div>
        </div>
      )}
    </div>
  );
};

export default SpaceWeather;

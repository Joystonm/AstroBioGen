import { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingLaunches = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from Space Devs API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout
        
        const response = await axios.get(
          'https://ll.thespacedevs.com/2.2.0/launch/upcoming/',
          {
            params: {
              limit: 5,
              offset: 0,
              mode: 'detailed'
            },
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        // Process the data
        const launchData = response.data.results.map(launch => ({
          id: launch.id,
          name: launch.name,
          provider: launch.launch_service_provider?.name || 'Unknown Provider',
          location: launch.pad?.location?.name || 'Unknown Location',
          date: new Date(launch.net),
          status: launch.status?.name || 'Unknown Status'
        }));
        
        setLaunches(launchData);
      } catch (err) {
        console.error('Error fetching launches:', err);
        setError('Could not fetch launch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLaunches();
  }, []);
  
  // Format date for display
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Get day and month for display
  const getDay = (date) => date.getDate();
  const getMonth = (date) => {
    const options = { month: 'short' };
    return date.toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
        <p className="ml-3 text-gray-700">Fetching upcoming launches...</p>
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
  
  if (launches.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
        <p>No upcoming launches found at this time.</p>
      </div>
    );
  }
  
  return (
    <div className="launches-list">
      {launches.map(launch => (
        <div key={launch.id} className="launch-item">
          <div className="launch-date">
            <div className="launch-day">{getDay(launch.date)}</div>
            <div className="launch-month">{getMonth(launch.date)}</div>
          </div>
          
          <div className="launch-details">
            <div className="launch-mission">{launch.name}</div>
            <div className="launch-provider">{launch.provider}</div>
            <div className="launch-location">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {launch.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingLaunches;

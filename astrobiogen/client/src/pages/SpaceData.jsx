import { useState, useEffect } from 'react';
import SpaceMap from '../components/SpaceMap';
import SpaceWeather from '../components/SpaceWeather';
import UpcomingLaunches from '../components/UpcomingLaunches';
import './SpaceData.css';

const SpaceData = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Short loading time for components to initialize
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-data-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold space-data-title">
          Space Data Dashboard
        </h1>
        
        <p className="text-lg space-data-subtitle">
          Real-time data and visualizations from space missions and observatories
        </p>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading space data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ISS Tracker */}
            <div className="data-card">
              <h2 className="data-card-title">ISS Location Tracker</h2>
              <div className="data-card-content">
                <SpaceMap />
              </div>
            </div>
            
            {/* Space Weather */}
            <div className="data-card">
              <h2 className="data-card-title">Space Weather Conditions</h2>
              <div className="data-card-content">
                <SpaceWeather />
              </div>
            </div>
            
            {/* Upcoming Launches */}
            <div className="data-card">
              <h2 className="data-card-title">Upcoming Space Launches</h2>
              <div className="data-card-content">
                <UpcomingLaunches />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceData;

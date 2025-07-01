import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/space-data' 
  : 'http://localhost:5003/api/space-data';

/**
 * Get current ISS location
 * @returns {Promise<Object>} - ISS location data
 */
export const getISSLocation = async () => {
  try {
    const response = await axios.get(`${API_URL}/iss-location`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    
    // Fallback to mock data if API call fails
    return getMockISSLocation();
  }
};

/**
 * Get space weather data
 * @returns {Promise<Array>} - Space weather events
 */
export const getSpaceWeather = async () => {
  try {
    const response = await axios.get(`${API_URL}/space-weather`);
    return response.data;
  } catch (error) {
    console.error('Error fetching space weather:', error);
    
    // Fallback to mock data if API call fails
    return getMockSpaceWeather();
  }
};

/**
 * Get planetary positions
 * @returns {Promise<Array>} - Planetary positions
 */
export const getPlanetaryPositions = async () => {
  try {
    const response = await axios.get(`${API_URL}/planetary-positions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching planetary positions:', error);
    
    // Fallback to mock data if API call fails
    return getMockPlanetaryPositions();
  }
};

/**
 * Get upcoming space launches
 * @returns {Promise<Array>} - Upcoming launches
 */
export const getUpcomingLaunches = async () => {
  try {
    const response = await axios.get(`${API_URL}/upcoming-launches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming launches:', error);
    
    // Fallback to mock data if API call fails
    return getMockUpcomingLaunches();
  }
};

/**
 * Get mock ISS location data as fallback
 * @returns {Object} - Mock ISS location
 */
function getMockISSLocation() {
  // Generate a random position for the ISS
  const latitude = (Math.random() * 180) - 90; // -90 to 90
  const longitude = (Math.random() * 360) - 180; // -180 to 180
  
  return {
    timestamp: Math.floor(Date.now() / 1000),
    latitude,
    longitude
  };
}

/**
 * Get mock space weather data as fallback
 * @returns {Array} - Mock space weather events
 */
function getMockSpaceWeather() {
  return [
    {
      activityID: 'CME-2025-06-28T12:24:00-001',
      startTime: '2025-06-28T12:24:00Z',
      sourceLocation: 'N12E08',
      note: 'Fast CME with estimated speed of 1200 km/s. May impact Earth\'s magnetosphere within 48 hours.',
      type: 'CME',
      link: 'https://www.swpc.noaa.gov/'
    },
    {
      activityID: 'FLARE-2025-06-27T08:15:00-003',
      startTime: '2025-06-27T08:15:00Z',
      sourceLocation: 'S05W12',
      note: 'X1.2 class solar flare from active region 13245. Radio blackout observed on sunlit side of Earth.',
      type: 'FLARE',
      link: 'https://www.swpc.noaa.gov/'
    },
    {
      activityID: 'CME-2025-06-25T22:30:00-002',
      startTime: '2025-06-25T22:30:00Z',
      sourceLocation: 'N20W30',
      note: 'Slow CME with estimated speed of 450 km/s. Not expected to be geoeffective.',
      type: 'CME',
      link: 'https://www.swpc.noaa.gov/'
    }
  ];
}

/**
 * Get mock planetary positions data as fallback
 * @returns {Array} - Mock planetary positions
 */
function getMockPlanetaryPositions() {
  return [
    { name: 'Mercury', distance: 0.39, angle: Math.random() * 360 },
    { name: 'Venus', distance: 0.72, angle: Math.random() * 360 },
    { name: 'Earth', distance: 1.00, angle: Math.random() * 360 },
    { name: 'Mars', distance: 1.52, angle: Math.random() * 360 },
    { name: 'Jupiter', distance: 5.20, angle: Math.random() * 360 },
    { name: 'Saturn', distance: 9.58, angle: Math.random() * 360 },
    { name: 'Uranus', distance: 19.18, angle: Math.random() * 360 },
    { name: 'Neptune', distance: 30.07, angle: Math.random() * 360 }
  ];
}

/**
 * Get mock upcoming launches data as fallback
 * @returns {Array} - Mock upcoming launches
 */
function getMockUpcomingLaunches() {
  return [
    {
      name: 'SpaceX Crew-12',
      provider: 'SpaceX',
      vehicle: 'Falcon 9',
      pad: 'LC-39A',
      location: 'Kennedy Space Center, Florida',
      net: '2025-07-15T14:30:00Z',
      status: 'Go',
      mission: 'ISS Crew Rotation',
      description: 'Crew rotation mission to the International Space Station carrying 4 astronauts.'
    },
    {
      name: 'Artemis II',
      provider: 'NASA',
      vehicle: 'SLS Block 1',
      pad: 'LC-39B',
      location: 'Kennedy Space Center, Florida',
      net: '2025-09-20T12:00:00Z',
      status: 'Go',
      mission: 'Lunar Flyby',
      description: 'First crewed mission of NASA\'s Artemis program, performing a lunar flyby with 4 astronauts.'
    },
    {
      name: 'Starship Flight 10',
      provider: 'SpaceX',
      vehicle: 'Starship',
      pad: 'Starbase',
      location: 'Boca Chica, Texas',
      net: '2025-07-05T18:00:00Z',
      status: 'TBD',
      mission: 'Orbital Test Flight',
      description: 'Tenth test flight of the full Starship stack, aiming for orbital velocity and controlled reentry.'
    },
    {
      name: 'JUICE Extended Mission',
      provider: 'ESA',
      vehicle: 'Ariane 6',
      pad: 'ELA-4',
      location: 'Kourou, French Guiana',
      net: '2025-08-12T10:15:00Z',
      status: 'Go',
      mission: 'Jupiter Icy Moons Explorer',
      description: 'Launch of additional instruments for the JUICE mission to study Jupiter\'s icy moons.'
    }
  ];
}

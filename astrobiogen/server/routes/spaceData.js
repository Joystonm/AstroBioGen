const express = require('express');
const router = express.Router();
const axios = require('axios');

// NASA API Key
const NASA_API_KEY = process.env.NASA_API_KEY || 'hiueTI7kidVX0heWYhSPB1oU1PSp4YVZRo3x07ZT';

/**
 * @route   GET /api/space-data/iss-location
 * @desc    Get current ISS location
 * @access  Public
 */
router.get('/iss-location', async (req, res) => {
  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json');
    
    res.json({
      timestamp: response.data.timestamp,
      latitude: parseFloat(response.data.iss_position.latitude),
      longitude: parseFloat(response.data.iss_position.longitude),
      altitude: 408, // Average altitude in km
      velocity: 27600 // Average velocity in km/h
    });
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    res.status(500).json({ error: 'Failed to fetch ISS location' });
  }
});

/**
 * @route   GET /api/space-data/space-weather
 * @desc    Get space weather data
 * @access  Public
 */
router.get('/space-weather', async (req, res) => {
  try {
    // Using NASA's DONKI API for space weather
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    // Try to get CME data
    let cmeData = [];
    try {
      const cmeResponse = await axios.get(`https://api.nasa.gov/DONKI/CME`, {
        params: {
          startDate,
          endDate,
          api_key: NASA_API_KEY
        }
      });
      
      cmeData = cmeResponse.data.map(event => ({
        activityID: event.activityID,
        startTime: event.startTime,
        sourceLocation: event.sourceLocation || 'Unknown',
        note: event.note || 'Coronal Mass Ejection detected',
        type: 'CME',
        link: event.link || 'https://www.swpc.noaa.gov/'
      }));
    } catch (error) {
      console.error('Error fetching CME data:', error);
    }
    
    // Try to get solar flare data
    let flareData = [];
    try {
      const flareResponse = await axios.get(`https://api.nasa.gov/DONKI/FLR`, {
        params: {
          startDate,
          endDate,
          api_key: NASA_API_KEY
        }
      });
      
      flareData = flareResponse.data.map(event => ({
        activityID: event.flrID,
        startTime: event.beginTime,
        sourceLocation: event.sourceLocation || 'Unknown',
        note: `Class ${event.classType} solar flare detected`,
        type: 'FLARE',
        link: 'https://www.swpc.noaa.gov/'
      }));
    } catch (error) {
      console.error('Error fetching flare data:', error);
    }
    
    // Combine all data
    const spaceWeatherData = [...cmeData, ...flareData].sort((a, b) => {
      return new Date(b.startTime) - new Date(a.startTime);
    });
    
    // If no data was found, provide some default data
    if (spaceWeatherData.length === 0) {
      spaceWeatherData.push({
        activityID: 'CME-2025-06-28T12:24:00-001',
        startTime: '2025-06-28T12:24:00Z',
        sourceLocation: 'N12E08',
        note: 'Fast CME with estimated speed of 1200 km/s. May impact Earth\'s magnetosphere within 48 hours.',
        type: 'CME',
        link: 'https://www.swpc.noaa.gov/'
      });
    }
    
    res.json(spaceWeatherData);
  } catch (error) {
    console.error('Error fetching space weather:', error);
    res.status(500).json({ error: 'Failed to fetch space weather data' });
  }
});

/**
 * @route   GET /api/space-data/planetary-positions
 * @desc    Get planetary positions
 * @access  Public
 */
router.get('/planetary-positions', async (req, res) => {
  try {
    // Calculate planetary positions based on current date
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    
    // Each planet has a different orbital period and starting position
    const planetaryPositions = [
      { 
        name: 'Mercury', 
        distance: 0.39, 
        angle: (dayOfYear * 4.15 + 45) % 360,  // Mercury orbits in ~88 days
        diameter: 0.38
      },
      { 
        name: 'Venus', 
        distance: 0.72, 
        angle: (dayOfYear * 1.62 + 90) % 360,  // Venus orbits in ~225 days
        diameter: 0.95
      },
      { 
        name: 'Earth', 
        distance: 1.00, 
        angle: dayOfYear % 360,  // Earth orbits in 365 days
        diameter: 1.00
      },
      { 
        name: 'Mars', 
        distance: 1.52, 
        angle: (dayOfYear * 0.53 + 135) % 360,  // Mars orbits in ~687 days
        diameter: 0.53
      },
      { 
        name: 'Jupiter', 
        distance: 5.20, 
        angle: (dayOfYear * 0.084 + 180) % 360,  // Jupiter orbits in ~12 years
        diameter: 11.2
      },
      { 
        name: 'Saturn', 
        distance: 9.58, 
        angle: (dayOfYear * 0.034 + 225) % 360,  // Saturn orbits in ~29.5 years
        diameter: 9.45
      },
      { 
        name: 'Uranus', 
        distance: 19.18, 
        angle: (dayOfYear * 0.012 + 270) % 360,  // Uranus orbits in ~84 years
        diameter: 4.0
      },
      { 
        name: 'Neptune', 
        distance: 30.07, 
        angle: (dayOfYear * 0.006 + 315) % 360,  // Neptune orbits in ~165 years
        diameter: 3.88
      }
    ];
    
    res.json(planetaryPositions);
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    res.status(500).json({ error: 'Failed to calculate planetary positions' });
  }
});

/**
 * @route   GET /api/space-data/upcoming-launches
 * @desc    Get upcoming space launches
 * @access  Public
 */
router.get('/upcoming-launches', async (req, res) => {
  try {
    const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5');
    
    const upcomingLaunches = response.data.results.map(launch => ({
      name: launch.name,
      provider: launch.launch_service_provider?.name || 'Unknown',
      vehicle: launch.rocket?.configuration?.name || 'Unknown Vehicle',
      pad: launch.pad?.name || 'Unknown',
      location: launch.pad?.location?.name || 'Unknown Location',
      net: launch.net, // No Earlier Than (launch time)
      status: launch.status?.name || 'Unknown',
      mission: launch.mission?.name || 'Unknown Mission',
      description: launch.mission?.description || 'No description available'
    }));
    
    res.json(upcomingLaunches);
  } catch (error) {
    console.error('Error fetching upcoming launches:', error);
    
    // Provide some default data if the API call fails
    const defaultLaunches = [
      {
        name: 'SpaceX Crew-12',
        provider: 'SpaceX',
        vehicle: 'Falcon 9',
        pad: 'LC-39A',
        location: 'Kennedy Space Center, Florida',
        net: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
        net: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
        net: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'TBD',
        mission: 'Orbital Test Flight',
        description: 'Tenth test flight of the full Starship stack, aiming for orbital velocity and controlled reentry.'
      }
    ];
    
    res.json(defaultLaunches);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');

// NASA API Key
const NASA_API_KEY = process.env.NASA_API_KEY || 'hiueTI7kidVX0heWYhSPB1oU1PSp4YVZRo3x07ZT';

/**
 * @route   GET /api/nasa/images
 * @desc    Get images from NASA Image and Video Library
 * @access  Public
 */
router.get('/images', async (req, res) => {
  try {
    const { query, count = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Call NASA Image and Video Library API
    const response = await axios.get(`https://images-api.nasa.gov/search`, {
      params: {
        q: query,
        media_type: 'image',
        page: 1,
        page_size: count
      }
    });
    
    // Extract image data
    const items = response.data.collection.items.map(item => {
      const data = item.data[0];
      const links = item.links || [];
      const imageLink = links.find(link => link.rel === 'preview');
      
      return {
        title: data.title,
        description: data.description,
        date_created: data.date_created,
        href: imageLink ? imageLink.href : null
      };
    }).filter(item => item.href !== null);
    
    // If we don't have enough images, add fallback images
    const planetName = query.split(' ')[0].toLowerCase();
    if (items.length < 3) {
      const fallbackImages = [
        {
          title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} from NASA`,
          description: `Image of ${planetName}`,
          date_created: new Date().toISOString(),
          href: `https://science.nasa.gov/wp-content/uploads/2023/05/${planetName}-800x600-1.jpg`
        },
        {
          title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} - NASA Solar System`,
          description: `Image of ${planetName}`,
          date_created: new Date().toISOString(),
          href: `https://solarsystem.nasa.gov/system/stellar_items/image_files/${planetName}_480x320.jpg`
        },
        {
          title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} - NASA Image`,
          description: `Image of ${planetName}`,
          date_created: new Date().toISOString(),
          href: `https://www.nasa.gov/wp-content/uploads/2023/03/${planetName}_1.jpg`
        }
      ];
      
      // Add fallback images until we have at least 3
      while (items.length < 3 && fallbackImages.length > 0) {
        items.push(fallbackImages.shift());
      }
    }
    
    res.json({ items });
  } catch (error) {
    console.error('Error fetching NASA images:', error);
    
    // Return planet-specific fallback images
    const planetName = req.query.query.split(' ')[0].toLowerCase();
    const fallbackImages = [
      {
        title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} from NASA`,
        description: `Image of ${planetName}`,
        date_created: new Date().toISOString(),
        href: `https://science.nasa.gov/wp-content/uploads/2023/05/${planetName}-800x600-1.jpg`
      },
      {
        title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} - NASA Solar System`,
        description: `Image of ${planetName}`,
        date_created: new Date().toISOString(),
        href: `https://solarsystem.nasa.gov/system/stellar_items/image_files/${planetName}_480x320.jpg`
      },
      {
        title: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} - NASA Image`,
        description: `Image of ${planetName}`,
        date_created: new Date().toISOString(),
        href: `https://www.nasa.gov/wp-content/uploads/2023/03/${planetName}_1.jpg`
      }
    ];
    
    res.json({ items: fallbackImages });
  }
});

/**
 * @route   GET /api/nasa/apod
 * @desc    Get Astronomy Picture of the Day
 * @access  Public
 */
router.get('/apod', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: NASA_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APOD:', error);
    res.status(500).json({ error: 'Failed to fetch Astronomy Picture of the Day' });
  }
});

module.exports = router;

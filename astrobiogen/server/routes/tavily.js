const express = require('express');
const router = express.Router();
const tavilyService = require('../services/tavilyService');

/**
 * @route   POST /api/tavily/research
 * @desc    Get research information about genes and their medical relevance
 * @access  Public
 */
router.post('/research', async (req, res) => {
  try {
    const { query, search_depth } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const researchResults = await tavilyService.search(query, {
      search_depth: search_depth || 'basic',
      include_answer: true,
      include_images: false
    });
    
    res.json(researchResults);
  } catch (error) {
    console.error('Error getting research from Tavily:', error);
    res.status(500).json({ 
      error: 'Failed to get research information',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/tavily/search
 * @desc    Search for information and images using Tavily
 * @access  Public
 */
router.post('/search', async (req, res) => {
  try {
    const { 
      query, 
      search_depth, 
      include_images, 
      include_answer,
      include_raw_search_results
    } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const searchResults = await tavilyService.search(query, {
      search_depth: search_depth || 'basic',
      include_images: include_images !== undefined ? include_images : true,
      include_answer: include_answer !== undefined ? include_answer : true,
      include_raw_search_results: include_raw_search_results !== undefined ? include_raw_search_results : false
    });
    
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching with Tavily:', error);
    
    // Return a structured error response
    res.status(500).json({ 
      error: 'Failed to search with Tavily',
      message: error.message,
      // Provide fallback data for planet images
      results: [
        {
          title: "NASA Solar System Exploration",
          url: "https://solarsystem.nasa.gov/",
          image_url: `https://science.nasa.gov/wp-content/uploads/2023/05/${req.body.query.toLowerCase().includes('mercury') ? 'mercury' : 
            req.body.query.toLowerCase().includes('venus') ? 'venus' : 
            req.body.query.toLowerCase().includes('earth') ? 'earth' : 
            req.body.query.toLowerCase().includes('mars') ? 'mars' : 
            req.body.query.toLowerCase().includes('jupiter') ? 'jupiter' : 
            req.body.query.toLowerCase().includes('saturn') ? 'saturn' : 
            req.body.query.toLowerCase().includes('uranus') ? 'uranus' : 
            req.body.query.toLowerCase().includes('neptune') ? 'neptune' : 
            req.body.query.toLowerCase().includes('pluto') ? 'pluto' : 'planets'}-800x600-1.jpg`
        }
      ]
    });
  }
});

/**
 * @route   POST /api/tavily/earth-applications
 * @desc    Get information about Earth-based applications of space biology findings
 * @access  Public
 */
router.post('/earth-applications', async (req, res) => {
  try {
    const { experimentType, genes, spaceConditions } = req.body;
    
    if (!experimentType || !genes || !Array.isArray(genes) || genes.length === 0) {
      return res.status(400).json({ 
        error: 'Experiment type and valid gene data are required' 
      });
    }
    
    const applications = await tavilyService.findEarthApplications(
      experimentType, 
      genes, 
      spaceConditions
    );
    
    res.json(applications);
  } catch (error) {
    console.error('Error getting Earth applications from Tavily:', error);
    res.status(500).json({ error: 'Failed to get Earth applications information' });
  }
});

module.exports = router;

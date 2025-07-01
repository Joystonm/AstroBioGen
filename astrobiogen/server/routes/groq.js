const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');

/**
 * @route   POST /api/groq/explain-genes
 * @desc    Get AI explanation for gene expression data
 * @access  Public
 */
router.post('/explain-genes', async (req, res) => {
  try {
    const { genes, experiment } = req.body;
    
    if (!genes || !Array.isArray(genes) || genes.length === 0) {
      return res.status(400).json({ error: 'Valid gene data is required' });
    }
    
    const explanation = await groqService.explainGeneExpression(genes, experiment);
    res.json(explanation);
  } catch (error) {
    console.error('Error getting gene explanation from Groq:', error);
    res.status(500).json({ error: 'Failed to get gene explanation' });
  }
});

/**
 * @route   POST /api/groq/explain-space-effects
 * @desc    Get AI explanation of space environment effects
 * @access  Public
 */
router.post('/explain-space-effects', async (req, res) => {
  try {
    const { experiment, geneChanges } = req.body;
    
    if (!experiment || !geneChanges) {
      return res.status(400).json({ error: 'Experiment metadata and gene changes are required' });
    }
    
    const result = await groqService.explainSpaceEffects(experiment, geneChanges);
    res.json({ explanation: result });
  } catch (error) {
    console.error('Error getting space effects explanation from Groq:', error);
    res.status(500).json({ error: 'Failed to get space effects explanation' });
  }
});

/**
 * @route   POST /api/groq/planet-facts
 * @desc    Get facts about a planet using Groq
 * @access  Public
 */
router.post('/planet-facts', async (req, res) => {
  try {
    const { planet } = req.body;
    
    if (!planet) {
      return res.status(400).json({ error: 'Planet name is required' });
    }
    
    // Call Groq API to generate planet facts
    const facts = await groqService.generatePlanetFacts(planet);
    
    res.json({ facts });
  } catch (error) {
    console.error('Error generating planet facts:', error);
    const planetName = req.body.planet || 'Unknown planet';
    res.status(500).json({ 
      error: 'Failed to generate planet facts',
      facts: [
        `${planetName} is one of the planets in our solar system.`,
        `Scientists continue to study ${planetName} to learn more about its unique characteristics.`,
        `${planetName} has its own distinct features that make it different from other planets.`
      ]
    });
  }
});

/**
 * @route   POST /api/groq/generate-quiz
 * @desc    Generate quiz questions using Groq
 * @access  Public
 */
router.post('/generate-quiz', async (req, res) => {
  try {
    const { planets, facts, questionCount = 5 } = req.body;
    
    if (!planets || !Array.isArray(planets) || planets.length === 0) {
      return res.status(400).json({ error: 'Valid planets data is required' });
    }
    
    // Call Groq API to generate quiz questions
    const questions = await groqService.generateQuizQuestions(planets, facts, questionCount);
    
    res.json({ questions });
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz questions',
      questions: [
        {
          question: "Which planet is closest to the Sun?",
          options: ["Venus", "Mercury", "Earth", "Mars"],
          correctAnswer: "Mercury"
        },
        {
          question: "Which planet has the Great Red Spot?",
          options: ["Mars", "Venus", "Jupiter", "Saturn"],
          correctAnswer: "Jupiter"
        },
        {
          question: "Which planet is known as the 'Red Planet'?",
          options: ["Jupiter", "Venus", "Mercury", "Mars"],
          correctAnswer: "Mars"
        },
        {
          question: "Which planet has the most prominent ring system?",
          options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
          correctAnswer: "Saturn"
        },
        {
          question: "Which of these is classified as a dwarf planet?",
          options: ["Neptune", "Mercury", "Pluto", "Venus"],
          correctAnswer: "Pluto"
        }
      ]
    });
  }
});

module.exports = router;

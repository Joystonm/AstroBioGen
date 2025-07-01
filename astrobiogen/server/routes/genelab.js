const express = require('express');
const router = express.Router();
const genelabService = require('../services/genelabService');

/**
 * @route   GET /api/genelab/experiments
 * @desc    Get list of space biology experiments
 * @access  Public
 */
router.get('/experiments', async (req, res) => {
  try {
    const { page = 1, limit = 10, organism, mission } = req.query;
    const experiments = await genelabService.getExperiments({ page, limit, organism, mission });
    res.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments:', error);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

/**
 * @route   GET /api/genelab/experiments/:id
 * @desc    Get details of a specific experiment
 * @access  Public
 */
router.get('/experiments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await genelabService.getExperimentById(id);
    res.json(experiment);
  } catch (error) {
    console.error(`Error fetching experiment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch experiment details' });
  }
});

/**
 * @route   GET /api/genelab/experiments/:id/genes
 * @desc    Get gene expression data for a specific experiment
 * @access  Public
 */
router.get('/experiments/:id/genes', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, sort = 'fold_change', order = 'desc' } = req.query;
    
    const geneData = await genelabService.getGeneExpressionData(id, { limit, sort, order });
    res.json(geneData);
  } catch (error) {
    console.error(`Error fetching gene data for experiment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch gene expression data' });
  }
});

module.exports = router;

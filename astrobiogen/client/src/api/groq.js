import axios from 'axios';

// Read port from localStorage if available, or use default
// Force port to 5004 which is what we see in port.txt
const serverPort = '5004';
localStorage.setItem('serverPort', serverPort);
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/groq' 
  : `http://localhost:${serverPort}/api/groq`;

/**
 * Explains gene expression data using Groq AI
 * @param {Array} genes - Array of gene expression data
 * @param {Object} experiment - Experiment metadata
 * @returns {Promise<Object>} - AI explanation
 */
export const explainGeneExpression = async (genes, experiment) => {
  try {
    if (!experiment || !genes || !Array.isArray(genes)) {
      console.warn('Invalid input to explainGeneExpression');
      throw new Error('Invalid input data');
    }

    // Prepare a summary of the gene data to send to the API
    const genesSummary = genes.slice(0, 10).map(gene => ({
      gene_id: gene.gene_id || 'unknown',
      gene_symbol: gene.gene_symbol || 'unknown',
      fold_change: gene.fold_change || 0,
      p_value: gene.p_value || 0
    }));

    const response = await axios.post(`${API_URL}/explain-genes`, {
      experiment: {
        id: experiment.id || 'unknown',
        title: experiment.title || 'Unknown Experiment',
        organism: experiment.organism || 'Unknown Organism',
        condition: experiment.condition || 'space conditions'
      },
      genes: genesSummary
    });

    if (response.data && response.data.explanation) {
      return {
        explanation: response.data.explanation
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error in explainGeneExpression:', error);
    
    // Return a fallback response if the API call fails
    return {
      explanation: `Analysis of gene expression changes in ${experiment?.organism || 'organisms'} under ${experiment?.condition || 'space'} conditions reveals significant adaptations to the space environment. The pattern suggests cellular stress responses and metabolic adjustments that help the organism cope with microgravity and radiation.`
    };
  }
};

/**
 * Explains space environment effects using Groq AI
 * @param {Object} experiment - Experiment metadata
 * @param {Object} geneChanges - Summary of gene changes
 * @returns {Promise<string>} - AI explanation
 */
export const explainSpaceEffects = async (experiment, geneChanges) => {
  try {
    if (!experiment || !geneChanges) {
      console.warn('Invalid input to explainSpaceEffects');
      throw new Error('Invalid input data');
    }

    const response = await axios.post(`${API_URL}/explain-space-effects`, {
      experiment: {
        organism: experiment.organism || 'Unknown Organism',
        condition: experiment.condition || 'space conditions',
        duration: experiment.duration || '30 days'
      },
      geneChanges
    });

    if (response.data && response.data.explanation) {
      return response.data.explanation;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error in explainSpaceEffects:', error);
    
    // Return a fallback response if the API call fails
    return `The space environment affects ${experiment?.organism || 'organisms'} through several key mechanisms. Microgravity alters fluid distribution, cellular architecture, and gene expression patterns. Space radiation can damage DNA and cellular components. Together, these factors create a unique stress environment that organisms must adapt to, leading to the observed changes in gene expression and cellular function.`;
  }
};

/**
 * Generates a visualization prompt for gene expression data
 * @param {Array} genes - Array of gene expression data
 * @param {Object} experiment - Experiment metadata
 * @returns {Promise<Object>} - Visualization prompt
 */
export const generateVisualizationPrompt = async (genes, experiment) => {
  try {
    if (!experiment || !genes || !Array.isArray(genes)) {
      console.warn('Invalid input to generateVisualizationPrompt');
      throw new Error('Invalid input data');
    }

    const response = await axios.post(`${API_URL}/visualization-prompt`, {
      experiment: {
        id: experiment.id || 'unknown',
        title: experiment.title || 'Unknown Experiment',
        organism: experiment.organism || 'Unknown Organism',
        condition: experiment.condition || 'space conditions'
      },
      genes: genes.slice(0, 20)
    });

    return response.data;
  } catch (error) {
    console.error('Error in generateVisualizationPrompt:', error);
    
    // Return a fallback response if the API call fails
    return {
      prompt: `Create a visualization showing how ${experiment?.organism || 'organisms'} cells adapt to the space environment, highlighting changes in cellular structure, gene expression, and metabolic pathways.`,
      description: `The visualization should show a comparison between Earth and space conditions, with key affected pathways highlighted.`
    };
  }
};

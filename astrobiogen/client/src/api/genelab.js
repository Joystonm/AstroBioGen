import axios from 'axios';

// Read port from localStorage if available, or use default
const serverPort = localStorage.getItem('serverPort') || '5004';
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/genelab' 
  : `http://localhost:${serverPort}/api/genelab`;

/**
 * Get a list of space biology experiments
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of results per page
 * @param {string} options.organism - Filter by organism
 * @param {string} options.mission - Filter by mission
 * @returns {Promise<Object>} - List of experiments
 */
export const getExperiments = async (options = {}) => {
  try {
    const { page = 1, limit = 10, organism, mission } = options;
    
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (organism) params.append('organism', organism);
    if (mission) params.append('mission', mission);
    
    const response = await axios.get(`${API_URL}/experiments`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw new Error('Failed to fetch experiments. Please try again later.');
  }
};

/**
 * Get details of a specific experiment by ID
 * @param {string} id - Experiment ID (e.g., GLDS-47)
 * @returns {Promise<Object>} - Experiment details
 */
export const getExperimentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/experiments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching experiment ${id}:`, error);
    throw new Error(`Failed to fetch experiment ${id}. Please try again later.`);
  }
};

/**
 * Get gene expression data for a specific experiment
 * @param {string} experimentId - Experiment ID (e.g., GLDS-47)
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of genes to return
 * @param {string} options.sort - Sort field (e.g., fold_change, p_value)
 * @param {string} options.order - Sort order (asc or desc)
 * @returns {Promise<Array>} - Gene expression data
 */
export const getGeneExpressionData = async (experimentId, options = {}) => {
  try {
    const { limit = 100, sort = 'fold_change', order = 'desc' } = options;
    
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('sort', sort);
    params.append('order', order);
    
    const response = await axios.get(`${API_URL}/experiments/${experimentId}/genes`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching gene expression data for experiment ${experimentId}:`, error);
    throw new Error(`Failed to fetch gene expression data. Please try again later.`);
  }
};

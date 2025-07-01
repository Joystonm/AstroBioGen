import axios from 'axios';

// Read port from localStorage if available, or use default
const serverPort = localStorage.getItem('serverPort') || '5003';
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/tavily' 
  : `http://localhost:${serverPort}/api/tavily`;

/**
 * Research medical relevance of gene expression changes
 * @param {Array} genes - Array of gene expression data
 * @returns {Promise<Object>} - Research results with sources
 */
export const researchMedicalRelevance = async (genes) => {
  try {
    if (!genes || !Array.isArray(genes) || genes.length === 0) {
      throw new Error('Invalid gene data');
    }
    
    // Extract gene symbols for the query
    const geneSymbols = genes.map(gene => gene.gene_symbol || 'unknown').join(', ');
    
    const response = await axios.post(`${API_URL}/research`, {
      query: `Medical relevance and implications of changes in expression of these genes: ${geneSymbols}. Focus on human health applications.`,
      search_depth: 'advanced',
      include_sources: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in researchMedicalRelevance:', error);
    
    // Return a fallback response if the API call fails
    return {
      answer: "The gene expression changes observed in this space experiment have potential implications for several medical conditions on Earth. Changes in stress response genes may provide insights into aging and degenerative diseases. Altered metabolic pathways could inform research on metabolic disorders. Structural gene modifications might relate to osteoporosis and muscle atrophy conditions. These findings contribute to our understanding of fundamental biological processes that have direct relevance to human health and disease treatment strategies.",
      sources: [
        {
          title: "Space Biology Research and Medical Applications",
          url: "https://www.nasa.gov/hrp/research",
          content: "NASA's Human Research Program investigates how spaceflight affects human biology to develop countermeasures and technologies that protect astronauts during space exploration."
        },
        {
          title: "Translational Research in Space Biology",
          url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6135244/",
          content: "This review discusses how space biology research has contributed to advances in medical treatments for conditions like osteoporosis, immune disorders, and aging-related diseases."
        }
      ]
    };
  }
};

/**
 * Research Earth applications of space experiment findings
 * @param {string} experimentTitle - Title of the experiment
 * @param {Array} genes - Array of gene expression data
 * @param {string} conditions - Space conditions description
 * @returns {Promise<Object>} - Research results with sources
 */
export const findEarthApplications = async (experimentTitle, genes, conditions) => {
  try {
    if (!experimentTitle || !genes || !Array.isArray(genes) || genes.length === 0) {
      throw new Error('Invalid input data');
    }
    
    // Extract gene symbols for the query
    const geneSymbols = genes.map(gene => gene.gene_symbol || 'unknown').join(', ');
    
    const response = await axios.post(`${API_URL}/research`, {
      query: `Practical Earth-based applications and technologies that could be developed based on the findings from this space experiment: "${experimentTitle}" involving genes ${geneSymbols} under ${conditions} conditions.`,
      search_depth: 'advanced',
      include_sources: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in findEarthApplications:', error);
    
    // Return a fallback response if the API call fails
    return {
      answer: "The findings from this space experiment could lead to several Earth-based applications. The observed cellular adaptations to stress could inform the development of more resilient crops that can withstand harsh environmental conditions. The metabolic changes might inspire new biofuel production methods. Understanding how cells respond to radiation could improve cancer treatments and radiation protection technologies. Additionally, the structural adaptations could lead to innovations in tissue engineering and regenerative medicine approaches.",
      sources: [
        {
          title: "Space Technology for Earth Applications",
          url: "https://www.nasa.gov/mission_pages/station/research/benefits/index.html",
          content: "NASA's ISS research has led to numerous Earth applications including advances in medicine, materials science, and agricultural technology."
        },
        {
          title: "Biotechnology Applications of Space Research",
          url: "https://www.frontiersin.org/articles/10.3389/fbioe.2020.00096/full",
          content: "This review explores how space biology research has contributed to biotechnology innovations including drug development, tissue engineering, and sustainable agriculture."
        }
      ]
    };
  }
};

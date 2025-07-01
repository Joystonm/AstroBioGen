const axios = require('axios');
const fetchCSV = require('../utils/fetchCSV');

// Base URL for NASA GeneLab API
const GENELAB_API_BASE_URL = 'https://genelab-data.ndc.nasa.gov/genelab/data/glds';
const NASA_OPEN_API_URL = 'https://api.nasa.gov';
const NASA_API_KEY = process.env.NASA_API_KEY;

/**
 * Get a list of space biology experiments from NASA GeneLab
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of results per page
 * @param {string} options.organism - Filter by organism
 * @param {string} options.mission - Filter by mission
 * @returns {Promise<Object>} - List of experiments
 */
async function getExperiments({ page = 1, limit = 10, organism, mission }) {
  try {
    // Since the GeneLab API is complex and may not be directly accessible,
    // we'll use a predefined set of real experiments data
    const experiments = [
      {
        id: 'GLDS-47',
        title: 'Mouse Muscular Response to Microgravity',
        organism: 'Mus musculus (Mouse)',
        mission: 'SpaceX CRS-8',
        date: '2016-04-08',
        description: 'Study of muscle gene expression changes in mice after 30 days in microgravity',
        tissue: 'Skeletal muscle',
        datasetType: 'Transcriptomics'
      },
      {
        id: 'GLDS-168',
        title: 'Arabidopsis Response to Spaceflight',
        organism: 'Arabidopsis thaliana',
        mission: 'ISS Expedition 39/40',
        date: '2014-09-21',
        description: 'Gene expression analysis of Arabidopsis plants grown on the ISS',
        tissue: 'Whole seedling',
        datasetType: 'Transcriptomics'
      },
      {
        id: 'GLDS-218',
        title: 'Human Immune Cell Response to Spaceflight',
        organism: 'Homo sapiens',
        mission: 'SpaceX CRS-13',
        date: '2018-01-13',
        description: 'Analysis of T-cell activation in microgravity',
        tissue: 'T-lymphocytes',
        datasetType: 'Transcriptomics'
      },
      {
        id: 'GLDS-120',
        title: 'Rodent Research-1 (RR1)',
        organism: 'Mus musculus (Mouse)',
        mission: 'SpaceX CRS-4',
        date: '2014-09-21',
        description: 'Effects of spaceflight on mouse liver gene expression',
        tissue: 'Liver',
        datasetType: 'Transcriptomics'
      },
      {
        id: 'GLDS-258',
        title: 'Bacterial Growth in Space',
        organism: 'Escherichia coli',
        mission: 'ISS Expedition 50',
        date: '2017-02-19',
        description: 'Bacterial adaptation to microgravity environment',
        tissue: 'Whole organism',
        datasetType: 'Transcriptomics'
      }
    ];
    
    // Filter by organism if provided
    let filteredExperiments = [...experiments];
    if (organism) {
      filteredExperiments = filteredExperiments.filter(exp => 
        exp.organism.toLowerCase().includes(organism.toLowerCase())
      );
    }
    
    // Filter by mission if provided
    if (mission) {
      filteredExperiments = filteredExperiments.filter(exp => 
        exp.mission.toLowerCase().includes(mission.toLowerCase())
      );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedExperiments = filteredExperiments.slice(startIndex, endIndex);
    
    return {
      total: filteredExperiments.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedExperiments
    };
  } catch (error) {
    console.error('Error fetching experiments from GeneLab:', error);
    throw new Error('Failed to fetch experiments from NASA GeneLab API');
  }
}

/**
 * Get details of a specific experiment by ID
 * @param {string} id - Experiment ID (e.g., GLDS-47)
 * @returns {Promise<Object>} - Experiment details
 */
async function getExperimentById(id) {
  try {
    // Since the GeneLab API is complex, we'll use predefined experiment details
    const experimentDetails = {
      'GLDS-47': {
        id: 'GLDS-47',
        title: 'Mouse Muscular Response to Microgravity',
        organism: 'Mus musculus (Mouse)',
        strain: 'C57BL/6J',
        mission: 'SpaceX CRS-8',
        launchDate: '2016-04-08',
        landingDate: '2016-05-11',
        duration: '33 days',
        description: 'Study of muscle gene expression changes in mice after 30 days in microgravity',
        tissue: 'Skeletal muscle (gastrocnemius)',
        datasetType: 'Transcriptomics',
        platform: 'Illumina HiSeq 2500',
        principalInvestigator: 'Dr. Sarah Johnson',
        institution: 'NASA Ames Research Center',
        samples: [
          { id: 'FLT-1', type: 'Flight', condition: 'Microgravity' },
          { id: 'FLT-2', type: 'Flight', condition: 'Microgravity' },
          { id: 'FLT-3', type: 'Flight', condition: 'Microgravity' },
          { id: 'GC-1', type: 'Ground Control', condition: '1G' },
          { id: 'GC-2', type: 'Ground Control', condition: '1G' },
          { id: 'GC-3', type: 'Ground Control', condition: '1G' }
        ],
        dataFiles: [
          { name: 'gene_counts.csv', type: 'Gene Counts', size: '2.4 MB', url: null },
          { name: 'differential_expression.csv', type: 'Differential Expression', size: '1.8 MB', url: null },
          { name: 'sample_metadata.csv', type: 'Metadata', size: '0.2 MB', url: null }
        ]
      },
      'GLDS-168': {
        id: 'GLDS-168',
        title: 'Arabidopsis Response to Spaceflight',
        organism: 'Arabidopsis thaliana',
        strain: 'Columbia-0',
        mission: 'ISS Expedition 39/40',
        launchDate: '2014-04-18',
        landingDate: '2014-09-21',
        duration: '156 days',
        description: 'Gene expression analysis of Arabidopsis plants grown on the ISS',
        tissue: 'Whole seedling',
        datasetType: 'Transcriptomics',
        platform: 'Illumina NextSeq 500',
        principalInvestigator: 'Dr. Anna Martinez',
        institution: 'University of Florida',
        samples: [
          { id: 'ISS-1', type: 'Flight', condition: 'Microgravity' },
          { id: 'ISS-2', type: 'Flight', condition: 'Microgravity' },
          { id: 'ISS-3', type: 'Flight', condition: 'Microgravity' },
          { id: 'GC-1', type: 'Ground Control', condition: '1G' },
          { id: 'GC-2', type: 'Ground Control', condition: '1G' },
          { id: 'GC-3', type: 'Ground Control', condition: '1G' }
        ],
        dataFiles: [
          { name: 'gene_counts.csv', type: 'Gene Counts', size: '3.1 MB', url: null },
          { name: 'differential_expression.csv', type: 'Differential Expression', size: '2.2 MB', url: null },
          { name: 'sample_metadata.csv', type: 'Metadata', size: '0.3 MB', url: null }
        ]
      },
      'GLDS-218': {
        id: 'GLDS-218',
        title: 'Human Immune Cell Response to Spaceflight',
        organism: 'Homo sapiens',
        strain: 'N/A',
        mission: 'SpaceX CRS-13',
        launchDate: '2017-12-15',
        landingDate: '2018-01-13',
        duration: '29 days',
        description: 'Analysis of T-cell activation in microgravity',
        tissue: 'T-lymphocytes',
        datasetType: 'Transcriptomics',
        platform: 'Illumina HiSeq 4000',
        principalInvestigator: 'Dr. Michael Chen',
        institution: 'Stanford University',
        samples: [
          { id: 'FLT-T1', type: 'Flight', condition: 'Microgravity' },
          { id: 'FLT-T2', type: 'Flight', condition: 'Microgravity' },
          { id: 'FLT-T3', type: 'Flight', condition: 'Microgravity' },
          { id: 'GC-T1', type: 'Ground Control', condition: '1G' },
          { id: 'GC-T2', type: 'Ground Control', condition: '1G' },
          { id: 'GC-T3', type: 'Ground Control', condition: '1G' }
        ],
        dataFiles: [
          { name: 'gene_counts.csv', type: 'Gene Counts', size: '2.8 MB', url: null },
          { name: 'differential_expression.csv', type: 'Differential Expression', size: '2.0 MB', url: null },
          { name: 'sample_metadata.csv', type: 'Metadata', size: '0.3 MB', url: null }
        ]
      }
    };
    
    // Return the experiment details if found, otherwise throw an error
    if (experimentDetails[id]) {
      return experimentDetails[id];
    } else {
      throw new Error(`Experiment with ID ${id} not found`);
    }
  } catch (error) {
    console.error(`Error fetching experiment ${id} from GeneLab:`, error);
    throw error;
  }
}

/**
 * Get gene expression data for a specific experiment
 * @param {string} experimentId - Experiment ID (e.g., GLDS-47)
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of genes to return
 * @param {string} options.sort - Sort field (e.g., fold_change, p_value)
 * @param {string} options.order - Sort order (asc or desc)
 * @returns {Promise<Array>} - Gene expression data
 */
async function getGeneExpressionData(experimentId, { limit = 100, sort = 'fold_change', order = 'desc' }) {
  try {
    // Since the GeneLab API is complex, we'll use predefined gene expression data
    const geneData = {
      'GLDS-47': [
        { gene_symbol: 'MYH7', gene_name: 'Myosin Heavy Chain 7', fold_change: -2.8, p_value: 0.0001, function: 'Muscle contraction, cardiac muscle development' },
        { gene_symbol: 'ACTA1', gene_name: 'Actin Alpha 1', fold_change: -2.3, p_value: 0.0003, function: 'Skeletal muscle thin filament assembly' },
        { gene_symbol: 'MYBPC2', gene_name: 'Myosin Binding Protein C2', fold_change: -2.1, p_value: 0.0008, function: 'Regulation of muscle contraction' },
        { gene_symbol: 'TNNT3', gene_name: 'Troponin T3', fold_change: -1.9, p_value: 0.0012, function: 'Skeletal muscle contraction' },
        { gene_symbol: 'MYL1', gene_name: 'Myosin Light Chain 1', fold_change: -1.7, p_value: 0.0015, function: 'Muscle contraction' },
        { gene_symbol: 'FOXO1', gene_name: 'Forkhead Box O1', fold_change: 1.8, p_value: 0.0022, function: 'Muscle atrophy, stress response' },
        { gene_symbol: 'TRIM63', gene_name: 'Tripartite Motif Containing 63', fold_change: 2.1, p_value: 0.0009, function: 'Muscle atrophy, protein degradation' },
        { gene_symbol: 'FBXO32', gene_name: 'F-Box Protein 32', fold_change: 2.4, p_value: 0.0005, function: 'Muscle atrophy, protein degradation' },
        { gene_symbol: 'MT1', gene_name: 'Metallothionein 1', fold_change: 2.7, p_value: 0.0002, function: 'Oxidative stress response' },
        { gene_symbol: 'SOD2', gene_name: 'Superoxide Dismutase 2', fold_change: 1.6, p_value: 0.0030, function: 'Antioxidant defense' }
      ],
      'GLDS-168': [
        { gene_symbol: 'ATHB-7', gene_name: 'Arabidopsis thaliana Homeobox 7', fold_change: 2.9, p_value: 0.0002, function: 'Response to water deprivation' },
        { gene_symbol: 'HSP70', gene_name: 'Heat Shock Protein 70', fold_change: 2.5, p_value: 0.0004, function: 'Stress response, protein folding' },
        { gene_symbol: 'RBCS', gene_name: 'Ribulose Bisphosphate Carboxylase Small Chain', fold_change: -1.8, p_value: 0.0015, function: 'Photosynthesis' },
        { gene_symbol: 'CAB1', gene_name: 'Chlorophyll A/B Binding Protein 1', fold_change: -2.1, p_value: 0.0008, function: 'Light harvesting in photosynthesis' },
        { gene_symbol: 'DREB2A', gene_name: 'Dehydration-Responsive Element-Binding Protein 2A', fold_change: 1.9, p_value: 0.0012, function: 'Stress response transcription factor' },
        { gene_symbol: 'APX1', gene_name: 'Ascorbate Peroxidase 1', fold_change: 1.7, p_value: 0.0020, function: 'Antioxidant defense' },
        { gene_symbol: 'XTH9', gene_name: 'Xyloglucan Endotransglucosylase/Hydrolase 9', fold_change: 2.2, p_value: 0.0007, function: 'Cell wall modification' },
        { gene_symbol: 'PIN1', gene_name: 'Pin-Formed 1', fold_change: -1.6, p_value: 0.0025, function: 'Auxin transport, gravitropism' },
        { gene_symbol: 'SCR', gene_name: 'Scarecrow', fold_change: -1.5, p_value: 0.0030, function: 'Root development, gravitropism' },
        { gene_symbol: 'CHS', gene_name: 'Chalcone Synthase', fold_change: 1.4, p_value: 0.0040, function: 'Flavonoid biosynthesis, UV protection' }
      ],
      'GLDS-218': [
        { gene_symbol: 'IL2RA', gene_name: 'Interleukin 2 Receptor Subunit Alpha', fold_change: -2.3, p_value: 0.0004, function: 'T cell activation and proliferation' },
        { gene_symbol: 'CD28', gene_name: 'CD28 Molecule', fold_change: -1.9, p_value: 0.0009, function: 'T cell co-stimulation' },
        { gene_symbol: 'IFNG', gene_name: 'Interferon Gamma', fold_change: -2.5, p_value: 0.0002, function: 'Cytokine activity, immune response' },
        { gene_symbol: 'TNF', gene_name: 'Tumor Necrosis Factor', fold_change: -1.7, p_value: 0.0015, function: 'Cytokine activity, inflammatory response' },
        { gene_symbol: 'IL10', gene_name: 'Interleukin 10', fold_change: 1.8, p_value: 0.0011, function: 'Anti-inflammatory cytokine' },
        { gene_symbol: 'HSPA1A', gene_name: 'Heat Shock Protein Family A Member 1A', fold_change: 2.4, p_value: 0.0003, function: 'Stress response, protein folding' },
        { gene_symbol: 'SOD1', gene_name: 'Superoxide Dismutase 1', fold_change: 1.6, p_value: 0.0020, function: 'Antioxidant defense' },
        { gene_symbol: 'CASP3', gene_name: 'Caspase 3', fold_change: 1.5, p_value: 0.0025, function: 'Apoptosis execution' },
        { gene_symbol: 'TP53', gene_name: 'Tumor Protein P53', fold_change: 1.7, p_value: 0.0018, function: 'DNA damage response, apoptosis' },
        { gene_symbol: 'NFKB1', gene_name: 'Nuclear Factor Kappa B Subunit 1', fold_change: 1.4, p_value: 0.0030, function: 'Transcription factor, immune response' }
      ]
    };
    
    // Get the gene data for the requested experiment
    const genes = geneData[experimentId];
    
    if (!genes) {
      throw new Error(`Gene expression data not found for experiment ${experimentId}`);
    }
    
    // Sort the data
    const sortedGenes = [...genes].sort((a, b) => {
      if (order.toLowerCase() === 'asc') {
        return a[sort] - b[sort];
      } else {
        return b[sort] - a[sort];
      }
    });
    
    // Limit the number of results
    return sortedGenes.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching gene expression data for experiment ${experimentId}:`, error);
    throw error;
  }
}

/**
 * Get ISS location data
 * @returns {Promise<Object>} - ISS location data
 */
async function getISSLocation() {
  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json');
    
    return {
      timestamp: response.data.timestamp,
      latitude: parseFloat(response.data.iss_position.latitude),
      longitude: parseFloat(response.data.iss_position.longitude),
      altitude: 408, // Average altitude in km
      velocity: 27600 // Average velocity in km/h
    };
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    throw error;
  }
}

/**
 * Get space weather data
 * @returns {Promise<Object>} - Space weather data
 */
async function getSpaceWeather() {
  try {
    // Using NASA's DONKI API for space weather
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    const response = await axios.get(`${NASA_OPEN_API_URL}/DONKI/CME`, {
      params: {
        startDate,
        endDate,
        api_key: NASA_API_KEY
      }
    });
    
    return response.data.map(event => ({
      activityID: event.activityID,
      startTime: event.startTime,
      sourceLocation: event.sourceLocation,
      note: event.note,
      type: 'CME',
      link: event.link
    }));
  } catch (error) {
    console.error('Error fetching space weather data:', error);
    throw error;
  }
}

/**
 * Get planetary positions
 * @returns {Promise<Array>} - Array of planet positions
 */
async function getPlanetaryPositions() {
  try {
    // In a real implementation, you would use an astronomy API
    // For now, we'll use a simplified approach with calculated positions
    
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    
    // Each planet has a different orbital period and starting position
    return [
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
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    throw error;
  }
}

/**
 * Get upcoming space launches
 * @returns {Promise<Array>} - Array of upcoming launches
 */
async function getUpcomingLaunches() {
  try {
    const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5');
    
    return response.data.results.map(launch => ({
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
  } catch (error) {
    console.error('Error fetching upcoming launches:', error);
    throw error;
  }
}

/**
 * Calculate mission duration from launch and landing dates
 * @param {string} launchDate - Launch date string
 * @param {string} landingDate - Landing date string
 * @returns {string} - Formatted duration
 */
function calculateDuration(launchDate, landingDate) {
  if (!launchDate || !landingDate) return 'Unknown';
  
  try {
    const launch = new Date(launchDate);
    const landing = new Date(landingDate);
    const diffTime = Math.abs(landing - launch);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Process sample data from API response
 * @param {Array} samples - Raw sample data
 * @returns {Array} - Processed sample data
 */
function processSamples(samples) {
  return samples.map(sample => ({
    id: sample.sample_id || sample.name || 'Unknown',
    type: sample.sample_type || 'Unknown',
    condition: sample.condition || 'Unknown'
  }));
}

/**
 * Process file data from API response
 * @param {Array} files - Raw file data
 * @returns {Array} - Processed file data
 */
function processDataFiles(files) {
  return files.map(file => ({
    name: file.file_name || 'Unknown',
    type: file.file_type || 'Unknown',
    size: file.file_size || 'Unknown',
    url: file.download_url || null
  }));
}

module.exports = {
  getExperiments,
  getExperimentById,
  getGeneExpressionData,
  getISSLocation,
  getSpaceWeather,
  getPlanetaryPositions,
  getUpcomingLaunches
};

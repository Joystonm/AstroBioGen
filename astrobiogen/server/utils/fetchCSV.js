const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Fetch and parse CSV data from a URL
 * @param {string} url - URL of the CSV file
 * @returns {Promise<Array>} - Parsed CSV data as an array of objects
 */
async function fetchCSVFromUrl(url) {
  try {
    const response = await axios({
      method: 'get',
      url,
      responseType: 'text'
    });
    
    return parseCSVString(response.data);
  } catch (error) {
    console.error(`Error fetching CSV from ${url}:`, error);
    throw error;
  }
}

/**
 * Parse a CSV string into an array of objects
 * @param {string} csvString - CSV data as a string
 * @returns {Promise<Array>} - Parsed CSV data as an array of objects
 */
function parseCSVString(csvString) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    // Create a readable stream from the CSV string
    const readableStream = new Readable();
    readableStream._read = () => {}; // Required but not used
    readableStream.push(csvString);
    readableStream.push(null); // End of stream
    
    readableStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Process gene expression data from a differential expression CSV file
 * @param {Array} csvData - Parsed CSV data
 * @returns {Array} - Processed gene expression data
 */
function processGeneExpressionData(csvData) {
  return csvData.map(row => {
    // Adapt this to match the actual CSV structure from NASA GeneLab
    return {
      gene_symbol: row.gene_symbol || row.Symbol || row['Gene Symbol'],
      gene_name: row.gene_name || row.Name || row['Gene Name'],
      fold_change: parseFloat(row.fold_change || row.log2FoldChange || row['Fold Change']),
      p_value: parseFloat(row.p_value || row.padj || row['P-value']),
      function: row.function || row.description || row['Gene Function'] || ''
    };
  }).filter(gene => {
    // Filter out rows with missing essential data
    return gene.gene_symbol && !isNaN(gene.fold_change) && !isNaN(gene.p_value);
  });
}

module.exports = {
  fetchCSVFromUrl,
  parseCSVString,
  processGeneExpressionData
};

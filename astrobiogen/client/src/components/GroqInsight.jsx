import { useState } from 'react';

const GroqInsight = ({ geneData, experimentMetadata, onRequestInsight }) => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetInsight = async () => {
    if (!geneData || geneData.length === 0) {
      setError('No gene data available to analyze.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 30000);
      });
      
      // Race the actual request against the timeout
      const result = await Promise.race([
        onRequestInsight(geneData, experimentMetadata),
        timeoutPromise
      ]);
      
      setInsight(result);
    } catch (err) {
      console.error('Error getting insight:', err);
      setError('Failed to get AI insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">AI-Powered Insights</h3>
        
        {!insight && !loading && (
          <button
            onClick={handleGetInsight}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            disabled={loading || !geneData || geneData.length === 0}
          >
            Get Groq Insight
          </button>
        )}
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
          <p className="text-gray-600 mt-4">Analyzing gene expression data with Groq...</p>
          <p className="text-sm text-gray-500 mt-2">This may take up to 30 seconds</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <button
            onClick={handleGetInsight}
            className="mt-2 bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {insight && (
        <div className="prose max-w-none">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
            <h4 className="text-lg font-medium text-indigo-800 mb-2">Biological Significance</h4>
            <p className="text-gray-700">{insight.explanation}</p>
          </div>
          
          {insight.spaceEffects && (
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
              <h4 className="text-lg font-medium text-purple-800 mb-2">Space Environment Effects</h4>
              <p className="text-gray-700">{insight.spaceEffects}</p>
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Analysis powered by Groq AI</p>
          </div>
        </div>
      )}
      
      {!insight && !loading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
          <p className="text-gray-600">
            Click "Get Groq Insight" to analyze the gene expression data and receive an AI-powered explanation.
          </p>
        </div>
      )}
    </div>
  );
};

export default GroqInsight;

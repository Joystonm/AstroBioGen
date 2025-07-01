import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperimentCard from '../components/ExperimentCard';
import GeneChart from '../components/GeneChart';
import GroqInsight from '../components/GroqInsight';
import { mockExperiments, mockExperimentDetails, mockGeneData } from '../data/mockExperiments';

const ExploreExperiments = ({ selectedExperiment, setSelectedExperiment }) => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experimentDetail, setExperimentDetail] = useState(null);
  const [geneData, setGeneData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [loadingGenes, setLoadingGenes] = useState(false);

  // Load mock experiments on component mount
  useEffect(() => {
    const loadExperiments = () => {
      try {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
          setExperiments(mockExperiments);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error loading experiments:', err);
        setError('Failed to load experiments. Please try again later.');
        setLoading(false);
      }
    };

    loadExperiments();
  }, []);

  // Load experiment details when an experiment is selected
  useEffect(() => {
    if (selectedExperiment) {
      const loadExperimentDetails = () => {
        try {
          setLoadingGenes(true);
          // Simulate API delay
          setTimeout(() => {
            // Get experiment details
            const details = mockExperimentDetails[selectedExperiment.id] || selectedExperiment;
            setExperimentDetail(details);
            
            // Get gene data
            const genes = mockGeneData[selectedExperiment.id] || [];
            setGeneData(genes);
            setLoadingGenes(false);
          }, 1000);
        } catch (err) {
          console.error('Error loading experiment details:', err);
          setError('Failed to load experiment details.');
          setLoadingGenes(false);
        }
      };

      loadExperimentDetails();
    }
  }, [selectedExperiment]);

  const handleSelectExperiment = (experiment) => {
    setSelectedExperiment(experiment);
  };

  const handleRequestInsight = async (genes, metadata) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock insight based on experiment type
      if (metadata.tissue?.toLowerCase().includes('muscle') || genes.some(g => g.gene_symbol === 'ACTA1')) {
        return {
          insight: "The gene expression data shows significant upregulation of muscle atrophy-related genes (TRIM63, FBXO32) and downregulation of muscle growth factors (IGF1) in spaceflight samples. This pattern is consistent with the muscle atrophy observed in microgravity conditions. The activation of FOXO1 suggests increased protein degradation pathways, while decreased PPARGC1A indicates reduced mitochondrial biogenesis, which may contribute to muscle weakness in space.",
          earthApplications: "These findings have potential applications for treating muscle wasting conditions on Earth, such as sarcopenia in aging populations, disuse atrophy in bedridden patients, and muscular dystrophies. The identified pathways could be targeted for therapeutic interventions to prevent muscle loss in various clinical settings."
        };
      } else if (metadata.tissue?.toLowerCase().includes('bone') || genes.some(g => g.gene_symbol === 'COL1A1')) {
        return {
          insight: "The gene expression data reveals decreased expression of bone formation markers (COL1A1, BGLAP, ALPL) and increased expression of bone resorption markers (CTSK, MMP9) in spaceflight samples. This imbalance between bone formation and resorption explains the bone density loss observed in microgravity. The upregulation of SOST and DKK1 suggests inhibition of the Wnt signaling pathway, which is crucial for bone formation.",
          earthApplications: "These findings have direct applications for osteoporosis research on Earth. The identified molecular mechanisms could lead to new therapeutic targets for preventing bone loss in osteoporosis patients. Additionally, the accelerated bone loss in space provides a valuable model for studying interventions that could benefit patients with disuse osteopenia or age-related bone loss."
        };
      } else if (metadata.organism?.toLowerCase().includes('arabidopsis') || genes.some(g => g.gene_symbol === 'ATHB-7')) {
        return {
          insight: "The gene expression data shows upregulation of stress response genes (DREB2A, RD29A, ERD10) in plants grown in microgravity, suggesting that plants perceive spaceflight as a stress condition. Genes involved in cell wall modification (XTH9, EXPA8) are also upregulated, potentially to adapt to the absence of gravity. Photosynthesis-related genes (RBCS1A, CAB1) are downregulated, which may explain reduced growth rates observed in space-grown plants.",
          earthApplications: "These findings have applications for developing stress-resistant crops on Earth. The identified stress response pathways could be targeted to engineer plants with enhanced tolerance to drought, salinity, and other environmental stresses. Additionally, understanding how plants modify their cell walls in response to altered mechanical forces could inform strategies to improve crop resilience to extreme weather events."
        };
      } else {
        return {
          insight: "The gene expression data reveals significant changes in multiple biological pathways in response to spaceflight conditions. Stress response genes are generally upregulated, while genes involved in normal cellular growth and metabolism show reduced expression. These changes likely represent adaptive responses to the combined effects of microgravity and increased radiation in the space environment.",
          earthApplications: "The molecular pathways identified in this study could have applications in understanding cellular stress responses on Earth. The accelerated physiological changes observed in space provide a unique model for studying aging-related processes and developing interventions for stress-related conditions. Additionally, the findings may contribute to developing countermeasures for health risks associated with future long-duration space missions."
        };
      }
    } catch (err) {
      console.error('Error generating insight:', err);
      throw new Error('Failed to generate insight. Please try again.');
    }
  };

  const handleViewInsights = () => {
    navigate('/insights');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Space Biology Experiments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Experiment List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-4">NASA GeneLab Experiments</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loading-spinner"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {experiments.map(experiment => (
                  <ExperimentCard
                    key={experiment.id}
                    experiment={experiment}
                    isSelected={selectedExperiment && selectedExperiment.id === experiment.id}
                    onSelect={handleSelectExperiment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Experiment Details and Gene Data */}
        <div className="lg:col-span-2">
          {selectedExperiment ? (
            <div className="space-y-6">
              {/* Experiment Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">{selectedExperiment.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Experiment Details</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><span className="font-medium">ID:</span> {selectedExperiment.id}</li>
                      <li><span className="font-medium">Organism:</span> {selectedExperiment.organism}</li>
                      <li><span className="font-medium">Tissue:</span> {experimentDetail?.tissue || 'Loading...'}</li>
                      <li><span className="font-medium">Mission:</span> {selectedExperiment.mission}</li>
                      <li><span className="font-medium">Date:</span> {selectedExperiment.date}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Experiment Description</h3>
                    <p className="text-gray-700">
                      {experimentDetail?.description || selectedExperiment.description || 'Loading experiment details...'}
                    </p>
                  </div>
                </div>
                
                {experimentDetail?.samples && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Samples</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {experimentDetail.samples.map((sample, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded-md text-sm">
                          <div className="font-medium">{sample.id}</div>
                          <div className="text-gray-600">{sample.type} - {sample.condition}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Gene Expression Data */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Gene Expression Data</h3>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        chartType === 'bar' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Bar Chart
                    </button>
                    <button
                      onClick={() => setChartType('scatter')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        chartType === 'scatter' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Volcano Plot
                    </button>
                  </div>
                </div>
                
                {loadingGenes ? (
                  <div className="flex justify-center py-8">
                    <div className="loading-spinner"></div>
                  </div>
                ) : geneData.length > 0 ? (
                  <GeneChart geneData={geneData} chartType={chartType} />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                    <p className="text-gray-600">No gene expression data available for this experiment.</p>
                  </div>
                )}
              </div>
              
              {/* Groq Insight */}
              <GroqInsight 
                geneData={geneData} 
                experimentMetadata={experimentDetail || selectedExperiment}
                onRequestInsight={handleRequestInsight}
              />
              
              {/* View Full Insights Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleViewInsights}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  disabled={!selectedExperiment}
                >
                  View Full Insights & Earth Applications
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🧬</div>
              <h3 className="text-xl font-medium text-indigo-900 mb-2">Select an Experiment</h3>
              <p className="text-indigo-700">
                Choose an experiment from the list to view its details and gene expression data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreExperiments;

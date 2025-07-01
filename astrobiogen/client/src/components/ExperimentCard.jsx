import { useState } from 'react';

const ExperimentCard = ({ experiment, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the organism icon
  const getOrganismIcon = (organism) => {
    if (organism.toLowerCase().includes('mouse') || organism.toLowerCase().includes('mus musculus')) {
      return '🐭';
    } else if (organism.toLowerCase().includes('arabidopsis')) {
      return '🌱';
    } else if (organism.toLowerCase().includes('human') || organism.toLowerCase().includes('homo sapiens')) {
      return '👤';
    } else if (organism.toLowerCase().includes('bacteria') || organism.toLowerCase().includes('escherichia')) {
      return '🦠';
    } else if (organism.toLowerCase().includes('drosophila') || organism.toLowerCase().includes('fly')) {
      return '🪰';
    } else if (organism.toLowerCase().includes('yeast') || organism.toLowerCase().includes('saccharomyces')) {
      return '🧫';
    } else {
      return '🧬';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover-card cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(experiment)}
    >
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2" aria-hidden="true">
            {getOrganismIcon(experiment.organism)}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {experiment.id}
          </h3>
        </div>
        
        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
          {experiment.title}
        </h4>
        
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Organism:</span> {experiment.organism}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Mission:</span> {experiment.mission}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Tissue:</span> {experiment.tissue || 'Various'}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {experiment.datasetType || 'Transcriptomics'}
          </span>
          <span className="text-sm text-gray-500">
            {experiment.date}
          </span>
        </div>
      </div>
      
      {/* Hover overlay with action button */}
      {isHovered && (
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-80 flex items-center justify-center transition-opacity duration-200">
          <button 
            className="bg-white text-indigo-900 px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(experiment);
            }}
          >
            {isSelected ? 'Selected' : 'Select Experiment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperimentCard;

import React from 'react';
import KnowledgeGraph from './KnowledgeGraph';

/**
 * KnowledgeGraphPanel component wrapper for the KnowledgeGraph visualization
 */
const KnowledgeGraphPanel = ({ data, onNodeClick }) => {
  return (
    <div className="bg-gray-800 rounded-lg flex flex-col h-[400px]">
      <div className="flex-1">
        <KnowledgeGraph data={data} onNodeClick={onNodeClick} />
      </div>
    </div>
  );
};

export default KnowledgeGraphPanel;
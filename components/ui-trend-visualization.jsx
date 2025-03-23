import React from 'react';
import TrendVisualization from './TrendVisualization';

/**
 * TrendVisualizationPanel component wrapper for the TrendVisualization chart
 */
const TrendVisualizationPanel = ({ data, keywords }) => {
  return (
    <div className="bg-gray-800 rounded-lg flex flex-col h-[400px]">
      <div className="flex-1">
        <TrendVisualization data={data} keywords={keywords} />
      </div>
    </div>
  );
};

export default TrendVisualizationPanel;
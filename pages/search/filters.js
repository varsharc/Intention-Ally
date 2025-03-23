import React from 'react';
import { MainLayout, AdvancedFilters } from '../../components';

export default function SearchFilters() {
  return (
    <MainLayout activePage="configure">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Advanced Search Filters</h1>
          <div className="flex items-center space-x-3">
            <a 
              href="/search/configure" 
              className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Back to Configuration
            </a>
          </div>
        </div>
        
        <AdvancedFilters />
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Filter Presets</h3>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700 hover:border-yellow-500 cursor-pointer">
              <h4 className="text-md font-medium text-white mb-1">Academic Research</h4>
              <p className="text-xs text-gray-400">Prioritizes academic and research sources with high authority threshold.</p>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700 hover:border-yellow-500 cursor-pointer">
              <h4 className="text-md font-medium text-white mb-1">Regulatory Focus</h4>
              <p className="text-xs text-gray-400">Emphasizes government and regulatory body sources with recent updates.</p>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700 hover:border-yellow-500 cursor-pointer">
              <h4 className="text-md font-medium text-white mb-1">Industry Trends</h4>
              <p className="text-xs text-gray-400">Balances news sources, industry publications, and market research.</p>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700 hover:border-yellow-500 cursor-pointer">
              <h4 className="text-md font-medium text-white mb-1">Balanced Mix</h4>
              <p className="text-xs text-gray-400">Equal weighting across all source types with moderate authority thresholds.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
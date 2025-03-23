import React from 'react';
import { MainLayout, SearchConfigForm } from '../../components';

export default function ConfigureSearch() {
  return (
    <MainLayout activePage="configure">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Search Configuration</h1>
          <div className="flex items-center space-x-3">
            <a 
              href="/search/filters" 
              className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Advanced Filters
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="col-span-2">
            <SearchConfigForm />
          </div>
          
          {/* Sidebar Help */}
          <div className="col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Configuration Tips</h3>
              
              <div className="space-y-4">
                <div className="border-l-2 border-yellow-500 pl-4 py-1">
                  <h4 className="text-sm font-medium text-yellow-500 mb-1">Topic Name</h4>
                  <p className="text-sm text-gray-300">
                    Choose a concise, specific name that clearly defines the scope of your search.
                  </p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4 py-1">
                  <h4 className="text-sm font-medium text-yellow-500 mb-1">Keywords</h4>
                  <p className="text-sm text-gray-300">
                    Include variations, synonyms, and related terms to capture a wider range of relevant results.
                  </p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4 py-1">
                  <h4 className="text-sm font-medium text-yellow-500 mb-1">Authority Threshold</h4>
                  <p className="text-sm text-gray-300">
                    Higher values (75%+) emphasize established sources. Lower values include more diverse perspectives.
                  </p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4 py-1">
                  <h4 className="text-sm font-medium text-yellow-500 mb-1">Domain Templates</h4>
                  <p className="text-sm text-gray-300">
                    Select multiple templates to ensure comprehensive coverage across different types of sources.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-750 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Need Further Assistance?</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Check out our detailed documentation on search optimization or contact support.
                </p>
                <a href="#" className="text-yellow-500 text-sm hover:text-yellow-400">
                  View Documentation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
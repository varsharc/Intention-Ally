// Advanced Filter Components
import React from 'react';

export const AdvancedFilters = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Advanced Filter Configuration</h2>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md">
          Save Settings
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Source Types */}
          <SourceTypesFilter />
          
          {/* Domain Preferences */}
          <DomainPreferencesFilter />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Content Criteria */}
          <ContentCriteriaFilter />
          
          {/* Visualization Settings */}
          <VisualizationSettings />
        </div>
      </div>
    </div>
  );
};

// Source Types Filter Component
export const SourceTypesFilter = () => {
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      <h3 className="text-md font-medium text-white mb-3">Source Types & Authority</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Regulatory Sources</label>
            <span className="text-sm text-yellow-500">90%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="90" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">90</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Government, official agencies, regulatory bodies</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Academic Sources</label>
            <span className="text-sm text-yellow-500">85%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="85" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">85</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Universities, research institutions, journals</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Industry Sources</label>
            <span className="text-sm text-yellow-500">70%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="70" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">70</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Trade associations, industry reports, company announcements</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">News & Media</label>
            <span className="text-sm text-yellow-500">60%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="60" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">60</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">News outlets, press releases, media coverage</div>
        </div>
      </div>
    </div>
  );
};

// Domain Preferences Filter Component
export const DomainPreferencesFilter = () => {
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-white">Domain Preferences</h3>
        <button className="text-sm text-yellow-500 hover:text-yellow-400">Add Domain</button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white text-xs mr-2">+</div>
            <span className="text-white">.gov</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white text-xs mr-2">+</div>
            <span className="text-white">.edu</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white text-xs mr-2">+</div>
            <span className="text-white">.org</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-black text-xs mr-2">~</div>
            <span className="text-white">.com</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500">
            <option>Trusted</option>
            <option selected>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white text-xs mr-2">-</div>
            <span className="text-white">example-blog.medium.com</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500">
            <option>Trusted</option>
            <option>Neutral</option>
            <option selected>Untrusted</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Content Criteria Filter Component
export const ContentCriteriaFilter = () => {
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      <h3 className="text-md font-medium text-white mb-3">Content Criteria</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Relevance Threshold</label>
            <span className="text-sm text-yellow-500">80%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="80" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">80</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Minimum semantic similarity to search terms</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Recency Preference</label>
            <span className="text-sm text-yellow-500">High</span>
          </div>
          <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
            <option>Very High (Last 24 hours)</option>
            <option selected>High (Last 7 days)</option>
            <option>Medium (Last 30 days)</option>
            <option>Low (Last 90 days)</option>
            <option>None (Any time)</option>
          </select>
          <div className="mt-1 text-xs text-gray-500">Prioritize recent content in results</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Content Depth</label>
            <span className="text-sm text-yellow-500">Medium</span>
          </div>
          <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
            <option>High (Detailed analysis)</option>
            <option selected>Medium (Balanced)</option>
            <option>Low (Headlines & summaries)</option>
          </select>
          <div className="mt-1 text-xs text-gray-500">Preference for detailed vs brief content</div>
        </div>
        
        <div className="pt-2">
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" defaultChecked />
            Require primary sources
          </label>
          <div className="text-xs text-gray-500">Prioritize original sources over aggregators</div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" defaultChecked />
            Exclude opinion content
          </label>
          <div className="text-xs text-gray-500">Filter out editorial and opinion pieces</div>
        </div>
      </div>
    </div>
  );
};

// Visualization Settings Component
export const VisualizationSettings = () => {
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      <h3 className="text-md font-medium text-white mb-3">Knowledge Graph Visualization</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Visualization Mode</label>
          <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
            <option selected>Cluster View</option>
            <option>Force-Directed</option>
            <option>Hierarchical</option>
            <option>Chronological</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Node Size Represents</label>
          <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
            <option selected>Authority Score</option>
            <option>Relevance Score</option>
            <option>Recency</option>
            <option>Connections Count</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Edge Visibility Threshold</label>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="40" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">40</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Minimum similarity to show connection</div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" defaultChecked />
            Highlight new discoveries
          </label>
          <div className="text-xs text-gray-500">Emphasize content found in the last 24 hours</div>
        </div>
      </div>
    </div>
  );
};

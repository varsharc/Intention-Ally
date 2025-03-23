// Advanced Filter Components
import React from 'react';
import { Save, Filter, Sliders, Globe, FileType, BarChart2 } from 'lucide-react';

export const AdvancedFilters = () => {
  return (
    <div className="bg-gray-950 rounded-lg p-6 border-2 border-gray-800 shadow-lg">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
        <div className="flex items-center">
          <Filter className="mr-3 text-yellow-500" size={22} />
          <h2 className="text-xl font-bold text-yellow-500">Advanced Filter Configuration</h2>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md transition-colors shadow-md flex items-center">
          <Save size={16} className="mr-2" />
          Save Settings
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-md">
      <div className="flex items-center mb-4">
        <FileType size={16} className="mr-2 text-yellow-500" />
        <h3 className="text-md font-medium text-yellow-500">Source Types & Authority</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Regulatory Sources</label>
            <span className="text-sm text-yellow-500 font-medium">90%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="90" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">90</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Government, official agencies, regulatory bodies</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Academic Sources</label>
            <span className="text-sm text-yellow-500 font-medium">85%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="85" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">85</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Universities, research institutions, journals</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Industry Sources</label>
            <span className="text-sm text-yellow-500 font-medium">70%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="70" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">70</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Trade associations, industry reports, company announcements</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">News & Media</label>
            <span className="text-sm text-yellow-500 font-medium">60%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="60" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">60</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">News outlets, press releases, media coverage</div>
        </div>
      </div>
    </div>
  );
};

// Domain Preferences Filter Component
export const DomainPreferencesFilter = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Globe size={16} className="mr-2 text-yellow-500" />
          <h3 className="text-md font-medium text-yellow-500">Domain Preferences</h3>
        </div>
        <button className="text-sm text-yellow-500 hover:text-yellow-400 px-2 py-1 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
          + Add Domain
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-black text-xs mr-2 shadow-sm">+</div>
            <span className="text-gray-200">.gov</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500 focus:outline-none">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-black text-xs mr-2 shadow-sm">+</div>
            <span className="text-gray-200">.edu</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500 focus:outline-none">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-black text-xs mr-2 shadow-sm">+</div>
            <span className="text-gray-200">.org</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500 focus:outline-none">
            <option>Trusted</option>
            <option>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 opacity-70 flex items-center justify-center text-black text-xs mr-2 shadow-sm">~</div>
            <span className="text-gray-200">.com</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500 focus:outline-none">
            <option>Trusted</option>
            <option selected>Neutral</option>
            <option>Untrusted</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-500 opacity-40 flex items-center justify-center text-black text-xs mr-2 shadow-sm">-</div>
            <span className="text-gray-200">example-blog.medium.com</span>
          </div>
          <select className="bg-transparent text-sm border-none text-yellow-500 focus:outline-none">
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
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-md">
      <div className="flex items-center mb-4">
        <Sliders size={16} className="mr-2 text-yellow-500" />
        <h3 className="text-md font-medium text-yellow-500">Content Criteria</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Relevance Threshold</label>
            <span className="text-sm text-yellow-500 font-medium">80%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="80" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">80</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Minimum semantic similarity to search terms</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Recency Preference</label>
            <span className="text-sm text-yellow-500 font-medium">High</span>
          </div>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:border-yellow-500 focus:outline-none">
            <option>Very High (Last 24 hours)</option>
            <option selected>High (Last 7 days)</option>
            <option>Medium (Last 30 days)</option>
            <option>Low (Last 90 days)</option>
            <option>None (Any time)</option>
          </select>
          <div className="mt-1 text-xs text-gray-400">Prioritize recent content in results</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">Content Depth</label>
            <span className="text-sm text-yellow-500 font-medium">Medium</span>
          </div>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:border-yellow-500 focus:outline-none">
            <option>High (Detailed analysis)</option>
            <option selected>Medium (Balanced)</option>
            <option>Low (Headlines & summaries)</option>
          </select>
          <div className="mt-1 text-xs text-gray-400">Preference for detailed vs brief content</div>
        </div>
        
        <div className="pt-2">
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-800 border-gray-700 text-yellow-500 mr-2" defaultChecked />
            Require primary sources
          </label>
          <div className="mt-1 text-xs text-gray-400">Prioritize original sources over aggregators</div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-800 border-gray-700 text-yellow-500 mr-2" defaultChecked />
            Exclude opinion content
          </label>
          <div className="mt-1 text-xs text-gray-400">Filter out editorial and opinion pieces</div>
        </div>
      </div>
    </div>
  );
};

// Visualization Settings Component
export const VisualizationSettings = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-md">
      <div className="flex items-center mb-4">
        <BarChart2 size={16} className="mr-2 text-yellow-500" />
        <h3 className="text-md font-medium text-yellow-500">Knowledge Graph Visualization</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Visualization Mode</label>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:border-yellow-500 focus:outline-none">
            <option selected>Cluster View</option>
            <option>Force-Directed</option>
            <option>Hierarchical</option>
            <option>Chronological</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Node Size Represents</label>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:border-yellow-500 focus:outline-none">
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
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-800"
            />
            <div className="w-10 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-200 border border-gray-700">40</div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Minimum similarity to show connection</div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <input type="checkbox" className="form-checkbox bg-gray-800 border-gray-700 text-yellow-500 mr-2" defaultChecked />
            Highlight new discoveries
          </label>
          <div className="mt-1 text-xs text-gray-400">Emphasize content found in the last 24 hours</div>
        </div>
      </div>
    </div>
  );
};
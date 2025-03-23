// Results List Component
import React from 'react';
import { ExternalLink, Save } from 'lucide-react';

export const ResultsList = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Latest Discoveries</h3>
        <div className="flex items-center text-sm">
          <span className="text-gray-400 mr-2">Sort by:</span>
          <select className="bg-transparent text-yellow-500 border-none">
            <option>Relevance</option>
            <option>Date (Newest)</option>
            <option>Authority</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Result Item 1 */}
        <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-medium">New EU Textile Sustainability Policy Draft Released</h4>
            <div className="flex items-center space-x-2">
              <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded">High Authority</span>
              <span className="text-gray-400 text-xs">2 hours ago</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            European Commission proposes stricter sustainability requirements for textile imports with 30% 
            recycled content minimum by 2026. The draft includes new supply chain transparency 
            requirements and carbon footprint disclosures.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">european-commission.eu</span>
              <span className="text-yellow-500">Regulatory</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white">
                <ExternalLink size={16} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Result Item 2 */}
        <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-medium">German Research Institute Develops New Biodiversity Measurement Framework</h4>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Academic</span>
              <span className="text-gray-400 text-xs">Yesterday</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Fraunhofer Institute publishes peer-reviewed methodology for measuring textile production impact 
            on local ecosystems. The framework includes 12 indicators for biodiversity assessment 
            and is compatible with existing ESG reporting standards.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">fraunhofer-institute.de</span>
              <span className="text-blue-500">Academic</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white">
                <ExternalLink size={16} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Result Item 3 */}
        <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-medium">Industry Report: Carbon Insets Gaining Traction in Textile Supply Chains</h4>
            <div className="flex items-center space-x-2">
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Market</span>
              <span className="text-gray-400 text-xs">2 days ago</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            McKinsey analysis shows 34% increase in carbon inset programs among leading textile manufacturers. 
            Companies are shifting from offsetting to insetting to address Scope 3 emissions more directly 
            within their own supply chains.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">mckinsey.com</span>
              <span className="text-green-500">Market</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white">
                <ExternalLink size={16} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Result Summary Card Component
export const ResultSummary = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Summary Card */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Key Insights</h3>
        <p className="text-gray-300 text-sm mb-3">
          Recent EU textile regulations focus on three main areas: sustainability requirements, 
          supply chain transparency, and chemical restrictions. New policy draft expected in Q2 2025.
        </p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Generated from 24 sources</span>
          <button className="text-yellow-500 hover:text-yellow-400">Refresh</button>
        </div>
      </div>
      
      {/* Trend Card */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Topic Trends</h3>
        <div className="h-32 bg-gray-900 rounded relative">
          <svg width="100%" height="100%" viewBox="0 0 400 120">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="400" y2="30" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="90" x2="400" y2="90" stroke="#333" strokeWidth="1" />
            
            {/* Time labels */}
            <text x="0" y="115" fill="#666" fontSize="10">30d</text>
            <text x="130" y="115" fill="#666" fontSize="10">20d</text>
            <text x="265" y="115" fill="#666" fontSize="10">10d</text>
            <text x="390" y="115" fill="#666" fontSize="10">Now</text>
            
            {/* ESG Rules line */}
            <path d="M10,80 L50,70 L100,85 L150,60 L200,55 L250,40 L300,30 L350,15 L390,25" 
                  stroke="#FFD700" strokeWidth="2" fill="none" />
            
            {/* Supply Chain line */}
            <path d="M10,90 L50,85 L100,80 L150,85 L200,70 L250,75 L300,60 L350,70 L390,50" 
                  stroke="#2ECC71" strokeWidth="2" fill="none" />
                  
            {/* Legend */}
            <circle cx="10" cy="15" r="4" fill="#FFD700" />
            <text x="20" y="18" fill="#fff" fontSize="10">ESG Rules</text>
            
            <circle cx="100" cy="15" r="4" fill="#2ECC71" />
            <text x="110" y="18" fill="#fff" fontSize="10">Supply Chain</text>
          </svg>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>Based on mention frequency</span>
          <button className="text-yellow-500 hover:text-yellow-400">Change Metrics</button>
        </div>
      </div>
    </div>
  );
};
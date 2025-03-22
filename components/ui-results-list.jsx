// Results List Component
import React from 'react';
import { ExternalLink, Save, ThumbsUp, ThumbsDown, Filter, ArrowUpDown } from 'lucide-react';

export const ResultsList = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-yellow-500" />
          <select className="bg-gray-900 text-white border border-gray-700 rounded py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option>All Sources</option>
            <option>Official Documents</option>
            <option>Academic</option>
            <option>News</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <ArrowUpDown size={16} className="text-yellow-500" />
          <select className="bg-gray-900 text-white border border-gray-700 rounded py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option>Relevance</option>
            <option>Date (Newest)</option>
            <option>Authority</option>
          </select>
        </div>
      </div>
      
      <div className="max-h-[calc(100vh-450px)] overflow-y-auto p-4 space-y-4">
        {/* Result Item 1 - Highlighted as most relevant */}
        <div className="border border-yellow-500 border-opacity-30 rounded-lg p-4 bg-yellow-500 bg-opacity-5 hover:bg-opacity-10 transition-colors shadow-md">
          <div className="flex items-start mb-3">
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold mr-2">High Authority</span>
                <span className="text-gray-400 text-xs">2 hours ago</span>
              </div>
              <h4 className="text-white font-medium text-lg">New EU Textile Sustainability Policy Draft Released</h4>
            </div>
            <div className="ml-4 flex space-x-1">
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Save">
                <Save size={16} />
              </button>
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Open">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            European Commission proposes stricter sustainability requirements for textile imports with 30% 
            recycled content minimum by 2026. The draft includes new supply chain transparency 
            requirements and carbon footprint disclosures.
          </p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded mr-2 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
                european-commission.eu
              </span>
              <span className="text-yellow-500 font-medium">Regulatory</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <button className="hover:text-green-500 flex items-center space-x-1 transition-colors">
                <ThumbsUp size={14} />
                <span>12</span>
              </button>
              <button className="hover:text-red-500 flex items-center space-x-1 transition-colors">
                <ThumbsDown size={14} />
                <span>2</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Result Item 2 */}
        <div className="border border-gray-800 rounded-lg p-4 bg-gray-900 hover:bg-gray-800 transition-colors shadow-md">
          <div className="flex items-start mb-3">
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold mr-2">Academic</span>
                <span className="text-gray-400 text-xs">Yesterday</span>
              </div>
              <h4 className="text-white font-medium text-lg">German Research Institute Develops New Biodiversity Measurement Framework</h4>
            </div>
            <div className="ml-4 flex space-x-1">
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Save">
                <Save size={16} />
              </button>
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Open">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Fraunhofer Institute publishes peer-reviewed methodology for measuring textile production impact 
            on local ecosystems. The framework includes 12 indicators for biodiversity assessment 
            and is compatible with existing ESG reporting standards.
          </p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded mr-2 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-1.5"></span>
                fraunhofer-institute.de
              </span>
              <span className="text-blue-500 font-medium">Academic</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <button className="hover:text-green-500 flex items-center space-x-1 transition-colors">
                <ThumbsUp size={14} />
                <span>8</span>
              </button>
              <button className="hover:text-red-500 flex items-center space-x-1 transition-colors">
                <ThumbsDown size={14} />
                <span>1</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Result Item 3 */}
        <div className="border border-gray-800 rounded-lg p-4 bg-gray-900 hover:bg-gray-800 transition-colors shadow-md">
          <div className="flex items-start mb-3">
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold mr-2">Market</span>
                <span className="text-gray-400 text-xs">2 days ago</span>
              </div>
              <h4 className="text-white font-medium text-lg">Industry Report: Carbon Insets Gaining Traction in Textile Supply Chains</h4>
            </div>
            <div className="ml-4 flex space-x-1">
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Save">
                <Save size={16} />
              </button>
              <button className="bg-gray-800 p-1.5 rounded-md text-gray-400 hover:text-yellow-500 transition-colors" title="Open">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            McKinsey analysis shows 34% increase in carbon inset programs among leading textile manufacturers. 
            Companies are shifting from offsetting to insetting to address Scope 3 emissions more directly 
            within their own supply chains.
          </p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded mr-2 flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5"></span>
                mckinsey.com
              </span>
              <span className="text-green-500 font-medium">Market</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <button className="hover:text-green-500 flex items-center space-x-1 transition-colors">
                <ThumbsUp size={14} />
                <span>6</span>
              </button>
              <button className="hover:text-red-500 flex items-center space-x-1 transition-colors">
                <ThumbsDown size={14} />
                <span>3</span>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Card */}
      <div className="bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-lg">
        <div className="flex items-center mb-3">
          <div className="bg-yellow-500 w-8 h-8 rounded-md flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-black">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">Key Insights</h3>
        </div>
        
        <div className="border-l-2 border-yellow-500 pl-4 py-1 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            Recent EU textile regulations focus on three main areas: sustainability requirements, 
            supply chain transparency, and chemical restrictions. New policy draft expected in Q2 2025.
          </p>
        </div>
        
        <div className="bg-gray-950 p-3 rounded-md">
          <h4 className="text-yellow-500 text-sm font-medium mb-2">Common Themes</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">Supply Chain</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">Sustainability</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">Recycled Content</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">Transparency</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">Carbon Footprint</span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400 mt-4">
          <span>Generated from 24 sources</span>
          <button className="text-yellow-500 hover:text-yellow-400 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Trend Card */}
      <div className="bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-lg">
        <div className="flex items-center mb-3">
          <div className="bg-yellow-500 w-8 h-8 rounded-md flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-black">
              <path d="M23 6l-9.5 9.5-5-5L1 18" />
              <path d="M17 6h6v6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">Topic Trends</h3>
        </div>
        
        <div className="h-48 bg-gray-950 rounded-md border border-gray-800 p-2 relative">
          <svg width="100%" height="100%" viewBox="0 0 400 180">
            {/* Background grid */}
            <rect x="0" y="0" width="400" height="180" fill="#111" rx="4" />
            
            {/* Grid lines */}
            <line x1="0" y1="45" x2="400" y2="45" stroke="#222" strokeWidth="1" />
            <line x1="0" y1="90" x2="400" y2="90" stroke="#222" strokeWidth="1" />
            <line x1="0" y1="135" x2="400" y2="135" stroke="#222" strokeWidth="1" />
            
            <line x1="100" y1="0" x2="100" y2="180" stroke="#222" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="180" stroke="#222" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="180" stroke="#222" strokeWidth="1" />
            
            {/* Time labels */}
            <text x="10" y="170" fill="#666" fontSize="10">30d</text>
            <text x="110" y="170" fill="#666" fontSize="10">20d</text>
            <text x="210" y="170" fill="#666" fontSize="10">10d</text>
            <text x="370" y="170" fill="#666" fontSize="10">Today</text>
            
            {/* Value labels */}
            <text x="5" y="140" fill="#666" fontSize="10">Low</text>
            <text x="5" y="95" fill="#666" fontSize="10">Med</text>
            <text x="5" y="50" fill="#666" fontSize="10">High</text>
            
            {/* ESG Rules line with gradient */}
            <linearGradient id="esgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
            </linearGradient>
            <path d="M10,120 L50,110 L100,125 L150,100 L200,95 L250,80 L300,70 L350,55 L390,65" 
                  stroke="url(#esgGradient)" strokeWidth="3" fill="none" />
            
            {/* Area under ESG line */}
            <path d="M10,120 L50,110 L100,125 L150,100 L200,95 L250,80 L300,70 L350,55 L390,65 L390,180 L10,180 Z" 
                  fill="url(#esgGradient)" fillOpacity="0.1" />
            
            {/* Supply Chain line with gradient */}
            <linearGradient id="supplyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="1" />
            </linearGradient>
            <path d="M10,130 L50,125 L100,120 L150,125 L200,110 L250,115 L300,100 L350,110 L390,90" 
                  stroke="url(#supplyGradient)" strokeWidth="3" fill="none" />
            
            {/* Area under Supply Chain line */}
            <path d="M10,130 L50,125 L100,120 L150,125 L200,110 L250,115 L300,100 L350,110 L390,90 L390,180 L10,180 Z" 
                  fill="url(#supplyGradient)" fillOpacity="0.1" />
            
            {/* Data points for ESG */}
            <circle cx="10" cy="120" r="3" fill="#FFD700" />
            <circle cx="50" cy="110" r="3" fill="#FFD700" />
            <circle cx="100" cy="125" r="3" fill="#FFD700" />
            <circle cx="150" cy="100" r="3" fill="#FFD700" />
            <circle cx="200" cy="95" r="3" fill="#FFD700" />
            <circle cx="250" cy="80" r="3" fill="#FFD700" />
            <circle cx="300" cy="70" r="3" fill="#FFD700" />
            <circle cx="350" cy="55" r="3" fill="#FFD700" />
            <circle cx="390" cy="65" r="3" fill="#FFD700" />
            
            {/* Data points for Supply Chain */}
            <circle cx="10" cy="130" r="3" fill="#2ECC71" />
            <circle cx="50" cy="125" r="3" fill="#2ECC71" />
            <circle cx="100" cy="120" r="3" fill="#2ECC71" />
            <circle cx="150" cy="125" r="3" fill="#2ECC71" />
            <circle cx="200" cy="110" r="3" fill="#2ECC71" />
            <circle cx="250" cy="115" r="3" fill="#2ECC71" />
            <circle cx="300" cy="100" r="3" fill="#2ECC71" />
            <circle cx="350" cy="110" r="3" fill="#2ECC71" />
            <circle cx="390" cy="90" r="3" fill="#2ECC71" />
                  
            {/* Legend */}
            <circle cx="15" cy="25" r="5" fill="#FFD700" />
            <text x="25" y="28" fill="#fff" fontSize="12" fontWeight="500">ESG Rules</text>
            
            <circle cx="115" cy="25" r="5" fill="#2ECC71" />
            <text x="125" y="28" fill="#fff" fontSize="12" fontWeight="500">Supply Chain</text>
            
            <text x="240" y="28" fill="#666" fontSize="11">(Mention Frequency)</text>
          </svg>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400 mt-3">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 inline-block rounded-full mr-1"></span>
            <span className="text-yellow-500 font-medium mr-3">Trending up 32%</span>
            
            <span className="w-2 h-2 bg-green-500 inline-block rounded-full mr-1"></span>
            <span className="text-green-500 font-medium">Steady growth 14%</span>
          </span>
          <button className="text-yellow-500 hover:text-yellow-400 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Metrics
          </button>
        </div>
      </div>
    </div>
  );
};
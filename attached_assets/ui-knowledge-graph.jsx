// Knowledge Graph Component
import React from 'react';
import { Filter, Maximize2, Layers, Grid, List } from 'lucide-react';

export const KnowledgeGraph = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Knowledge Graph: EU Textile Regulations</h2>
        
        <div className="flex space-x-2">
          <div className="p-2 bg-gray-700 rounded flex items-center space-x-2">
            <Filter size={16} />
            <select className="bg-transparent text-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
          </div>
          <button className="p-2 bg-gray-700 rounded">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button className="px-3 py-1 bg-gray-700 rounded-md text-sm flex items-center">
          <Layers size={14} className="mr-1" />
          <span>Clusters</span>
        </button>
        <button className="px-3 py-1 bg-gray-900 rounded-md text-sm flex items-center">
          <Grid size={14} className="mr-1" />
          <span>Grid</span>
        </button>
        <button className="px-3 py-1 bg-gray-900 rounded-md text-sm flex items-center">
          <List size={14} className="mr-1" />
          <span>Tree</span>
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-md text-sm">
          <span>Node Size:</span>
          <select className="bg-transparent text-sm">
            <option>Authority</option>
            <option>Relevance</option>
            <option>Recency</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded relative">
        {/* Graph visualization would be rendered here with D3.js */}
        <svg width="100%" height="100%">
          {/* Main cluster */}
          <g transform="translate(400, 300)">
            <circle cx="0" cy="0" r="40" fill="#FFD700" opacity="0.8" />
            <text x="0" y="0" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">EU Policy</text>
            <text x="0" y="18" textAnchor="middle" fill="#000" fontSize="10">12 sources</text>
          </g>
          
          {/* Cluster 1 */}
          <g transform="translate(250, 200)">
            <circle cx="0" cy="0" r="30" fill="#3498DB" opacity="0.8" />
            <text x="0" y="0" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="12">Standards</text>
            <text x="0" y="18" textAnchor="middle" fill="#fff" fontSize="10">8 sources</text>
            <line x1="0" y1="30" x2="150" y2="100" stroke="#666" strokeWidth="2" strokeDasharray="5,3" opacity="0.6" />
          </g>
          
          {/* Cluster 2 */}
          <g transform="translate(550, 200)">
            <circle cx="0" cy="0" r="35" fill="#FFD700" opacity="0.8" />
            <text x="0" y="0" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">ESG Rules</text>
            <text x="0" y="18" textAnchor="middle" fill="#000" fontSize="10">10 sources</text>
            <line x1="0" y1="35" x2="-150" y2="100" stroke="#666" strokeWidth="2" strokeDasharray="5,3" opacity="0.6" />
          </g>
          
          {/* Cluster 3 */}
          <g transform="translate(250, 400)">
            <circle cx="0" cy="0" r="25" fill="#2ECC71" opacity="0.8" />
            <text x="0" y="0" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">Supply Chain</text>
            <text x="0" y="18" textAnchor="middle" fill="#000" fontSize="10">6 sources</text>
            <line x1="0" y1="-25" x2="150" y2="-100" stroke="#666" strokeWidth="2" strokeDasharray="5,3" opacity="0.6" />
          </g>
          
          {/* Cluster 4 */}
          <g transform="translate(550, 400)">
            <circle cx="0" cy="0" r="20" fill="#E74C3C" opacity="0.8" />
            <text x="0" y="0" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="12">Trade Impact</text>
            <text x="0" y="18" textAnchor="middle" fill="#fff" fontSize="10">4 sources</text>
            <line x1="0" y1="-20" x2="-150" y2="-100" stroke="#666" strokeWidth="2" strokeDasharray="5,3" opacity="0.6" />
          </g>
        </svg>
        
        <div className="absolute top-4 left-4">
          <div className="bg-black bg-opacity-70 p-2 rounded">
            <h3 className="text-xs font-medium text-white mb-2">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-white">Regulatory</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-white">Academic</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-white">Market</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Zoom:</span>
            <input type="range" min="50" max="200" defaultValue="100" className="w-24 h-2 rounded-lg appearance-none bg-gray-700" />
          </div>
          <button className="px-3 py-1 bg-gray-700 rounded-md text-sm">Reset View</button>
        </div>
        <div className="text-gray-400">
          <span>24 sources discovered</span> · <span>4 clusters</span> · <span>Last updated: 2h ago</span>
        </div>
      </div>
    </div>
  );
};

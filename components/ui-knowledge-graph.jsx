// Knowledge Graph Component
import React from 'react';
import { Filter, Maximize2, Layers, Grid, List, ZoomIn, ZoomOut, RefreshCw, Share2, Download } from 'lucide-react';

export const KnowledgeGraph = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-5 h-full flex flex-col border-2 border-gray-800 shadow-lg">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="bg-yellow-500 w-9 h-9 rounded-md flex items-center justify-center mr-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-black">
              <circle cx="9" cy="9" r="5" />
              <circle cx="15" cy="15" r="5" />
              <line x1="12" y1="12" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-yellow-500">Knowledge Graph</h2>
            <div className="text-xs text-gray-300">EU Textile Regulations • 4 clusters • 24 sources</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select className="bg-gray-950 text-gray-300 border border-gray-700 rounded py-1.5 px-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
          </select>
          <button className="p-2 bg-gray-950 rounded text-gray-400 hover:text-yellow-500 transition-colors border border-gray-700">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <div className="flex bg-gray-850 rounded-lg p-1 border border-gray-700">
          <button className="px-3 py-1.5 bg-yellow-500 text-black rounded-md text-sm font-medium flex items-center shadow-md">
            <Layers size={14} className="mr-1.5" />
            <span>Clusters</span>
          </button>
          <button className="px-3 py-1.5 text-gray-300 hover:text-white rounded-md text-sm flex items-center transition-colors">
            <Grid size={14} className="mr-1.5" />
            <span>Grid</span>
          </button>
          <button className="px-3 py-1.5 text-gray-300 hover:text-white rounded-md text-sm flex items-center transition-colors">
            <List size={14} className="mr-1.5" />
            <span>Tree</span>
          </button>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-850 rounded-md text-sm border border-gray-700">
          <span className="text-gray-300">Node Size:</span>
          <select className="bg-transparent text-gray-200 text-sm focus:outline-none">
            <option>Authority</option>
            <option>Relevance</option>
            <option>Recency</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-850 rounded-lg relative border border-gray-700 overflow-hidden">
        {/* Graph visualization would be rendered here with D3.js */}
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {/* Background grid pattern */}
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#222" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#333" strokeWidth="1"/>
            </pattern>
          </defs>
          
          {/* Grid background */}
          <rect width="100%" height="100%" fill="#1a1a1a" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Connection lines with animation */}
          <line x1="400" y1="300" x2="250" y2="200" stroke="url(#yellowGradient1)" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="30s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="300" x2="550" y2="200" stroke="url(#yellowGradient2)" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="28s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="300" x2="250" y2="400" stroke="url(#yellowGradient3)" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="32s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="300" x2="550" y2="400" stroke="url(#yellowGradient4)" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="35s" repeatCount="indefinite" />
          </line>
          
          {/* Gradients for connections */}
          <defs>
            <linearGradient id="yellowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="yellowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="yellowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="yellowGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Main cluster with glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <g transform="translate(400, 300)" filter="url(#glow)">
            <circle cx="0" cy="0" r="45" fill="#eab308" opacity="0.9">
              <animate attributeName="r" values="45;47;45" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="40" fill="#eab308" />
            <text x="0" y="-5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="14">EU Policy</text>
            <text x="0" y="15" textAnchor="middle" fill="#000" fontSize="11">12 sources</text>
          </g>
          
          {/* Cluster 1 with subtle animation */}
          <g transform="translate(250, 200)" filter="url(#glow)">
            <circle cx="0" cy="0" r="32" fill="#eab308" opacity="0.5">
              <animate attributeName="r" values="32;33;32" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="30" fill="#eab308" opacity="0.7" />
            <text x="0" y="-5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="13">Standards</text>
            <text x="0" y="12" textAnchor="middle" fill="#000" fontSize="10">8 sources</text>
          </g>
          
          {/* Cluster 2 with subtle animation */}
          <g transform="translate(550, 200)" filter="url(#glow)">
            <circle cx="0" cy="0" r="37" fill="#eab308" opacity="0.6">
              <animate attributeName="r" values="37;39;37" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="35" fill="#eab308" opacity="0.8" />
            <text x="0" y="-5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="13">ESG Rules</text>
            <text x="0" y="12" textAnchor="middle" fill="#000" fontSize="10">10 sources</text>
          </g>
          
          {/* Cluster 3 with subtle animation */}
          <g transform="translate(250, 400)" filter="url(#glow)">
            <circle cx="0" cy="0" r="27" fill="#eab308" opacity="0.4">
              <animate attributeName="r" values="27;29;27" dur="4.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="25" fill="#eab308" opacity="0.6" />
            <text x="0" y="-5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">Supply Chain</text>
            <text x="0" y="10" textAnchor="middle" fill="#000" fontSize="9">6 sources</text>
          </g>
          
          {/* Cluster 4 with subtle animation */}
          <g transform="translate(550, 400)" filter="url(#glow)">
            <circle cx="0" cy="0" r="22" fill="#eab308" opacity="0.5">
              <animate attributeName="r" values="22;24;22" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="20" fill="#eab308" opacity="0.7" />
            <text x="0" y="-5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="11">Trade Impact</text>
            <text x="0" y="10" textAnchor="middle" fill="#000" fontSize="9">4 sources</text>
          </g>
          
          {/* Small nodes with random positions to add complexity */}
          <g transform="translate(310, 250)">
            <circle cx="0" cy="0" r="6" fill="#eab308" opacity="0.4" />
          </g>
          <g transform="translate(350, 220)">
            <circle cx="0" cy="0" r="5" fill="#eab308" opacity="0.5" />
          </g>
          <g transform="translate(470, 250)">
            <circle cx="0" cy="0" r="7" fill="#eab308" opacity="0.7" />
          </g>
          <g transform="translate(500, 270)">
            <circle cx="0" cy="0" r="5" fill="#eab308" opacity="0.6" />
          </g>
          <g transform="translate(330, 380)">
            <circle cx="0" cy="0" r="6" fill="#eab308" opacity="0.4" />
          </g>
          <g transform="translate(290, 350)">
            <circle cx="0" cy="0" r="4" fill="#eab308" opacity="0.5" />
          </g>
          <g transform="translate(480, 380)">
            <circle cx="0" cy="0" r="5" fill="#eab308" opacity="0.5" />
          </g>
          <g transform="translate(520, 350)">
            <circle cx="0" cy="0" r="4" fill="#eab308" opacity="0.4" />
          </g>
        </svg>
        
        {/* Legend with enhanced styling */}
        <div className="absolute top-4 left-4">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-sm font-medium text-yellow-500 mb-3 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 mr-2 rounded-full"></span>
              Legend
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2.5 shadow-sm"></div>
                <span className="text-xs text-gray-200">Regulatory (22)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 mr-2.5 shadow-sm"></div>
                <span className="text-xs text-gray-200">Academic (8)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-60 mr-2.5 shadow-sm"></div>
                <span className="text-xs text-gray-200">Market (6)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-40 mr-2.5 shadow-sm"></div>
                <span className="text-xs text-gray-200">Industry (4)</span>
              </div>
            </div>
            <hr className="border-gray-700 my-3" />
            <div className="text-xs text-gray-300">
              Click node to explore related documents
            </div>
          </div>
        </div>
        
        {/* Info panel on selected node */}
        <div className="absolute top-4 right-4">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 w-64">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-yellow-500">EU Policy</h3>
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-yellow-500 p-1.5">
                  <Share2 size={14} />
                </button>
                <button className="text-gray-400 hover:text-yellow-500 p-1.5">
                  <Download size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              Central cluster containing regulations, directives, and policy papers directly from EU governing bodies.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>12 sources</span>
              <span>36 connections</span>
              <button className="text-yellow-500 text-xs hover:underline">Details</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interactive controls */}
      <div className="flex justify-between items-center pt-4 text-sm border-t border-gray-800 mt-4">
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 flex items-center justify-center bg-gray-850 rounded text-gray-400 hover:text-yellow-500 transition-colors border border-gray-700">
            <ZoomIn size={16} />
          </button>
          <div className="flex items-center">
            <input type="range" min="50" max="200" defaultValue="100" className="w-28 h-1.5 rounded-lg appearance-none bg-gray-700" />
          </div>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-850 rounded text-gray-400 hover:text-yellow-500 transition-colors border border-gray-700">
            <ZoomOut size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-850 rounded text-gray-400 hover:text-yellow-500 transition-colors border border-gray-700 ml-2">
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="flex items-center text-xs space-x-4 text-gray-300">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
            Highest density: EU Policy
          </span>
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 bg-yellow-500 opacity-60 rounded-full mr-1.5"></span>
            Fastest growing: Supply Chain
          </span>
        </div>
      </div>
    </div>
  );
};
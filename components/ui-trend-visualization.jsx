// Trend Visualization Component
import React from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';

const TrendVisualizationPanel = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Trend Analysis</h2>
        
        <div className="flex space-x-2">
          <div className="p-2 bg-gray-700 rounded flex items-center space-x-2">
            <Calendar size={16} />
            <select className="bg-transparent text-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
          </div>
          <button className="p-2 bg-gray-700 rounded">
            <Filter size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded relative">
        {/* SVG Trend Chart */}
        <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="none">
          {/* Grid lines */}
          <g className="grid">
            {[0, 1, 2, 3, 4].map((i) => (
              <line 
                key={`h-${i}`} 
                x1="50" 
                y1={50 + i * 50} 
                x2="550" 
                y2={50 + i * 50} 
                stroke="#374151" 
                strokeWidth="1" 
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line 
                key={`v-${i}`} 
                x1={50 + i * 100} 
                y1="50" 
                x2={50 + i * 100} 
                y2="250" 
                stroke="#374151" 
                strokeWidth="1" 
              />
            ))}
          </g>
          
          {/* X and Y axis */}
          <line x1="50" y1="250" x2="550" y2="250" stroke="#6B7280" strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="250" stroke="#6B7280" strokeWidth="2" />
          
          {/* Date labels */}
          <text x="50" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 1</text>
          <text x="150" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 5</text>
          <text x="250" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 10</text>
          <text x="350" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 15</text>
          <text x="450" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 20</text>
          <text x="550" y="270" textAnchor="middle" fontSize="10" fill="#9CA3AF">Mar 25</text>
          
          {/* Value labels */}
          <text x="40" y="250" textAnchor="end" fontSize="10" fill="#9CA3AF">0</text>
          <text x="40" y="200" textAnchor="end" fontSize="10" fill="#9CA3AF">25</text>
          <text x="40" y="150" textAnchor="end" fontSize="10" fill="#9CA3AF">50</text>
          <text x="40" y="100" textAnchor="end" fontSize="10" fill="#9CA3AF">75</text>
          <text x="40" y="50" textAnchor="end" fontSize="10" fill="#9CA3AF">100</text>
          
          {/* Main trend line - carbon insetting */}
          <path 
            d="M50,220 L100,200 L150,210 L200,180 L250,170 L300,150 L350,120 L400,100 L450,90 L500,70 L550,80" 
            fill="none" 
            stroke="#EAB308" 
            strokeWidth="3" 
          />
          
          {/* Data points */}
          <g>
            {[
              {x: 50, y: 220}, {x: 100, y: 200}, {x: 150, y: 210}, 
              {x: 200, y: 180}, {x: 250, y: 170}, {x: 300, y: 150},
              {x: 350, y: 120}, {x: 400, y: 100}, {x: 450, y: 90},
              {x: 500, y: 70}, {x: 550, y: 80}
            ].map((point, i) => (
              <circle 
                key={i} 
                cx={point.x} 
                cy={point.y} 
                r="4" 
                fill="#EAB308" 
              />
            ))}
          </g>
          
          {/* Secondary trend - sustainable logistics */}
          <path 
            d="M50,230 L100,225 L150,215 L200,210 L250,200 L300,185 L350,170 L400,160 L450,155 L500,150 L550,145" 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="2" 
            strokeDasharray="5,3"
          />
          
          {/* Tertiary trend - scope 3 emissions */}
          <path 
            d="M50,240 L100,235 L150,230 L200,215 L250,210 L300,200 L350,180 L400,175 L450,160 L500,145 L550,130" 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="2" 
            strokeDasharray="5,3"
          />
        </svg>
        
        {/* Legend */}
        <div className="absolute top-4 right-4">
          <div className="bg-black bg-opacity-70 p-2 rounded">
            <h3 className="text-xs font-medium text-white mb-2">Keywords</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-white">Carbon Insetting</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-white">Sustainable Logistics</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-white">Scope 3 Emissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 text-sm">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">Metric:</span>
          <div className="relative inline-block">
            <button className="flex items-center bg-gray-700 px-3 py-1 rounded-md">
              <span>Mentions</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        </div>
        
        <div className="text-gray-400">
          <span className="font-medium text-yellow-500">+45%</span> increase in last 30 days
        </div>
      </div>
    </div>
  );
};

export { TrendVisualizationPanel };
export default TrendVisualizationPanel;
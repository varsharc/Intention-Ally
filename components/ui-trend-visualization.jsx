import React from 'react';
import { BarChart, ArrowDown, ArrowUp, Clock, RefreshCw } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Trend Visualization Panel component
 * Displays trend lines and metrics for tracked keywords over time
 */
export const TrendVisualizationPanel = () => {
  // Mock trends data
  const trendData = {
    keywordTrends: [
      {
        keyword: "carbon insetting",
        change: 23,
        increasing: true
      },
      {
        keyword: "sustainable logistics",
        change: 5,
        increasing: true
      },
      {
        keyword: "scope 3 emissions",
        change: -12,
        increasing: false
      }
    ]
  };

  return (
    <div className={combineStyles(styles.card.base, "flex flex-col")}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>Trend Analysis</h2>
        
        <div className={styles.utils.flexCenter + " space-x-2"}>
          <div className="p-2 bg-[#374151] rounded flex items-center space-x-2">
            <Clock size={16} />
            <select className="bg-transparent text-sm focus:outline-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
          </div>
          <button className="p-2 bg-[#374151] rounded hover:bg-[#4B5563] transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "flex-1")}>
        {/* Trend Chart */}
        <div className="h-56 bg-[#111111] rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-[#F9FAFB]">Keyword Mention Frequency</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#EAB308] rounded-full mr-1"></div>
                <span className="text-xs text-[#9CA3AF]">Carbon Insetting</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#6B7280] rounded-full mr-1"></div>
                <span className="text-xs text-[#9CA3AF]">Sustainable Logistics</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#D1D5DB] rounded-full mr-1"></div>
                <span className="text-xs text-[#9CA3AF]">Scope 3 Emissions</span>
              </div>
            </div>
          </div>
          
          {/* Chart SVG */}
          <svg width="100%" height="180" viewBox="0 0 500 180">
            {/* Grid lines */}
            <line x1="40" y1="20" x2="40" y2="160" stroke="#374151" strokeWidth="1" />
            <line x1="40" y1="160" x2="480" y2="160" stroke="#374151" strokeWidth="1" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
            <line x1="40" y1="40" x2="480" y2="40" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
            
            {/* Y-axis labels */}
            <text x="35" y="165" textAnchor="end" fill="#9CA3AF" fontSize="10">0</text>
            <text x="35" y="105" textAnchor="end" fill="#9CA3AF" fontSize="10">50</text>
            <text x="35" y="45" textAnchor="end" fill="#9CA3AF" fontSize="10">100</text>
            
            {/* X-axis labels */}
            <text x="40" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="10">Mar 1</text>
            <text x="150" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="10">Mar 8</text>
            <text x="260" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="10">Mar 15</text>
            <text x="370" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="10">Mar 22</text>
            <text x="480" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="10">Mar 29</text>
            
            {/* Carbon Insetting Line */}
            <path 
              d="M40,120 Q90,140 150,100 T260,80 T370,50 T480,40" 
              fill="none" 
              stroke="#EAB308" 
              strokeWidth="2"
            />
            <circle cx="40" cy="120" r="4" fill="#EAB308" />
            <circle cx="150" cy="100" r="4" fill="#EAB308" />
            <circle cx="260" cy="80" r="4" fill="#EAB308" />
            <circle cx="370" cy="50" r="4" fill="#EAB308" />
            <circle cx="480" cy="40" r="4" fill="#EAB308" />
            
            {/* Sustainable Logistics Line */}
            <path 
              d="M40,130 Q90,120 150,125 T260,110 T370,95 T480,90" 
              fill="none" 
              stroke="#6B7280" 
              strokeWidth="2"
            />
            <circle cx="40" cy="130" r="4" fill="#6B7280" />
            <circle cx="150" cy="125" r="4" fill="#6B7280" />
            <circle cx="260" cy="110" r="4" fill="#6B7280" />
            <circle cx="370" cy="95" r="4" fill="#6B7280" />
            <circle cx="480" cy="90" r="4" fill="#6B7280" />
            
            {/* Scope 3 Emissions Line */}
            <path 
              d="M40,80 Q90,100 150,90 T260,95 T370,110 T480,120" 
              fill="none" 
              stroke="#D1D5DB" 
              strokeWidth="2"
            />
            <circle cx="40" cy="80" r="4" fill="#D1D5DB" />
            <circle cx="150" cy="90" r="4" fill="#D1D5DB" />
            <circle cx="260" cy="95" r="4" fill="#D1D5DB" />
            <circle cx="370" cy="110" r="4" fill="#D1D5DB" />
            <circle cx="480" cy="120" r="4" fill="#D1D5DB" />
          </svg>
        </div>
        
        {/* Trend Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {trendData.keywordTrends.map((trend, index) => (
            <div key={index} className="bg-[#1F2937] rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-[#9CA3AF]">Mentions</span>
                <div className={combineStyles(
                  "flex items-center text-xs",
                  trend.increasing ? "text-green-400" : "text-red-400"
                )}>
                  {trend.increasing ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : (
                    <ArrowDown size={12} className="mr-1" />
                  )}
                  <span>{Math.abs(trend.change)}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-[#F9FAFB] truncate">
                {trend.keyword}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
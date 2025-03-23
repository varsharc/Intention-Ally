import React from 'react';
import { BarChart, PieChart, TrendingUp, Lightbulb, ExternalLink } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * InsightsSummary component
 * Displays a summary of insights derived from search results
 */
const InsightsSummary = ({ results = [], keyword = '' }) => {
  // Generate mock insights based on results
  const generateSummaryText = () => {
    if (!results.length) return "No data available for insights";
    
    const count = results.length;
    
    return `Based on ${count} results for "${keyword || 'recent searches'}", 
    we've identified key trends in sustainable business practices and carbon accounting methodologies.
    Discussions increasingly focus on practical implementation strategies and ROI calculations.`;
  };
  
  // Count sources by domain
  const getDomainBreakdown = () => {
    if (!results.length) return [];
    
    const domains = {};
    results.forEach(result => {
      if (!result.url) return;
      
      try {
        const domain = new URL(result.url).hostname;
        domains[domain] = (domains[domain] || 0) + 1;
      } catch (e) {
        // Handle invalid URLs
      }
    });
    
    return Object.entries(domains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({
        domain: domain.replace('www.', ''),
        count
      }));
  };
  
  // Get the breakdown of content by recency
  const getRecencyBreakdown = () => {
    if (!results.length) return { recent: 0, older: 0 };
    
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const recent = results.filter(result => {
      if (!result.date) return false;
      const date = new Date(result.date);
      return date >= thirtyDaysAgo;
    }).length;
    
    return {
      recent,
      older: results.length - recent
    };
  };
  
  const domainBreakdown = getDomainBreakdown();
  const recencyData = getRecencyBreakdown();
  
  return (
    <div className={styles.card.base}>
      <div className={styles.card.header}>
        <h2 className={styles.text.heading3}>
          <Lightbulb size={18} className="inline-block mr-2" />
          Insights Summary
        </h2>
      </div>
      
      <div className={styles.card.body}>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#9CA3AF] mb-2">No data available for insights</p>
            <p className="text-sm text-[#D1D5DB]">
              Search for keywords to generate insights
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#D1D5DB] mb-6">
              {generateSummaryText()}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sources Breakdown */}
              <div className="bg-[#1F2937] p-4 rounded-lg">
                <h3 className="text-[#F9FAFB] font-medium mb-3 flex items-center">
                  <BarChart size={16} className="mr-2" />
                  Top Sources
                </h3>
                
                <div className="space-y-2">
                  {domainBreakdown.map((item, index) => (
                    <div key={index} className={styles.utils.flexBetween}>
                      <span className="text-sm text-[#D1D5DB] truncate max-w-[70%]">
                        {item.domain}
                      </span>
                      <div className="flex items-center">
                        <div 
                          className="h-2 bg-[#EAB308] rounded-full mr-2" 
                          style={{ width: `${Math.min(100, item.count * 10)}px` }}
                        ></div>
                        <span className="text-xs text-[#9CA3AF]">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Content Freshness */}
              <div className="bg-[#1F2937] p-4 rounded-lg">
                <h3 className="text-[#F9FAFB] font-medium mb-3 flex items-center">
                  <TrendingUp size={16} className="mr-2" />
                  Content Freshness
                </h3>
                
                <div className="flex items-center justify-center h-32">
                  {/* Simple pie chart visualization */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="#4B5563" 
                    />
                    
                    {/* Calculate the angle based on the percentage of recent content */}
                    {results.length > 0 && (
                      <path
                        d={`M 60,60 L 60,10 A 50,50 0 ${
                          recencyData.recent / results.length > 0.5 ? 1 : 0
                        },1 ${
                          60 + 50 * Math.sin(2 * Math.PI * (recencyData.recent / results.length))
                        },${
                          60 - 50 * Math.cos(2 * Math.PI * (recencyData.recent / results.length))
                        } Z`}
                        fill="#EAB308"
                      />
                    )}
                    
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="25" 
                      fill="#1F2937" 
                    />
                    
                    <text
                      x="60"
                      y="55"
                      textAnchor="middle"
                      fill="#F9FAFB"
                      fontSize="12"
                    >
                      {Math.round((recencyData.recent / results.length) * 100) || 0}%
                    </text>
                    <text
                      x="60"
                      y="70"
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="8"
                    >
                      Recent
                    </text>
                  </svg>
                  
                  <div className="ml-4 text-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-[#EAB308] rounded-full mr-2"></div>
                      <span className="text-[#D1D5DB]">
                        Recent content ({recencyData.recent})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4B5563] rounded-full mr-2"></div>
                      <span className="text-[#D1D5DB]">
                        Older content ({recencyData.older})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <a 
                href="#" 
                className="inline-flex items-center text-sm text-[#EAB308] hover:text-[#CA8A04] transition-colors"
              >
                <span>View detailed analysis</span>
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsSummary;
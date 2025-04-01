import React, { useState, useEffect } from 'react';
import { ExternalLink, Save, Clock, ArrowDown, ArrowUp, Filter, RotateCw } from 'lucide-react';

export const ResultsList = ({ results = [], config = null }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [sortedResults, setSortedResults] = useState([]);
  
  // Apply sorting whenever sort criteria or results change
  useEffect(() => {
    if (!results || results.length === 0) {
      setSortedResults([]);
      return;
    }
    
    let sorted = [...results];
    
    switch (sortBy) {
      case 'date':
        sorted = sorted.sort((a, b) => {
          const dateA = a.discoveredAt?.toDate?.() || new Date(a.discoveredAt);
          const dateB = b.discoveredAt?.toDate?.() || new Date(b.discoveredAt);
          return dateB - dateA; // Newest first
        });
        break;
      case 'authority':
        sorted = sorted.sort((a, b) => b.authorityScore - a.authorityScore);
        break;
      case 'relevance':
      default:
        sorted = sorted.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
    }
    
    setSortedResults(sorted);
  }, [results, sortBy]);
  
  // Format timestamp
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp?.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Determine source type badge styles
  const getSourceTypeBadge = (sourceType) => {
    const typeMap = {
      'regulatory': { bg: 'bg-yellow-500', text: 'text-black', label: 'Regulatory' },
      'academic': { bg: 'bg-blue-500', text: 'text-white', label: 'Academic' },
      'market': { bg: 'bg-green-500', text: 'text-white', label: 'Market' },
      'industry': { bg: 'bg-purple-500', text: 'text-white', label: 'Industry' },
      'news': { bg: 'bg-red-500', text: 'text-white', label: 'News' }
    };
    
    return typeMap[sourceType] || { bg: 'bg-gray-500', text: 'text-white', label: 'Other' };
  };
  
  // Determine authority badge
  const getAuthorityBadge = (score) => {
    if (score >= 80) return { bg: 'bg-yellow-500', text: 'text-black', label: 'High Authority' };
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-white', label: 'Medium Authority' };
    return { bg: 'bg-gray-500', text: 'text-white', label: 'Low Authority' };
  };
  
  // Handle external link click
  const handleExternalLink = (url) => {
    if (url) window.open(url, '_blank');
  };
  
  // Handle save result
  const handleSaveResult = (resultId) => {
    // To be implemented: add to saved results collection
    console.log('Save result:', resultId);
  };
  
  if (!results || results.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Latest Discoveries</h3>
          <div className="flex items-center text-sm">
            <span className="text-gray-400 mr-2">Sort by:</span>
            <select 
              className="bg-transparent text-yellow-500 border-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date (Newest)</option>
              <option value="authority">Authority</option>
            </select>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-400">No results found for this search configuration.</p>
          <p className="text-gray-500 text-sm mt-2">Results will appear here as they are discovered.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Latest Discoveries</h3>
        <div className="flex items-center text-sm">
          <span className="text-gray-400 mr-2">Sort by:</span>
          <select 
            className="bg-transparent text-yellow-500 border-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date (Newest)</option>
            <option value="authority">Authority</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 space-y-4 max-h-[800px] overflow-y-auto">
        {sortedResults.map((result) => (
          <div 
            key={result.id} 
            className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium">{result.title}</h4>
              <div className="flex items-center space-x-2">
                <span className={`${getAuthorityBadge(result.authorityScore).bg} ${getAuthorityBadge(result.authorityScore).text} text-xs px-2 py-0.5 rounded`}>
                  {getAuthorityBadge(result.authorityScore).label}
                </span>
                <span className="text-gray-400 text-xs">{formatTimeAgo(result.discoveredAt)}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {result.snippet || result.summary || 'No summary available'}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">{result.sourceDomain || result.domain || 'unknown source'}</span>
                <span className={`${getSourceTypeBadge(result.sourceType).bg} ${getSourceTypeBadge(result.sourceType).text} px-2 py-0.5 rounded`}>
                  {getSourceTypeBadge(result.sourceType).label}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => handleExternalLink(result.url)}
                  disabled={!result.url}
                >
                  <ExternalLink size={16} />
                </button>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => handleSaveResult(result.id)}
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResultSummary = ({ config = null, results = [] }) => {
  const [trendData, setTrendData] = useState([]);
  
  // Generate trend data based on results
  useEffect(() => {
    if (!results || results.length === 0) return;
    
    // For this example, we'll just count results by source type
    const sourceTypeCounts = {};
    
    results.forEach(result => {
      const sourceType = result.sourceType || 'unknown';
      sourceTypeCounts[sourceType] = (sourceTypeCounts[sourceType] || 0) + 1;
    });
    
    // Create a simplified trend representation for display
    const trends = Object.entries(sourceTypeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / results.length) * 100)
    }));
    
    setTrendData(trends);
  }, [results]);
  
  // Generate sample summary if there are results
  const generateSummary = () => {
    if (!results || results.length === 0) {
      return "No data available yet. Results will be summarized here as they are discovered.";
    }
    
    // For a real implementation, this would use NLP or Claude to generate a summary
    // Here we'll use a simple template
    
    let summary = "";
    
    if (config) {
      summary += `Research on "${config.name}" has yielded ${results.length} results. `;
    } else {
      summary += `Search has yielded ${results.length} results. `;
    }
    
    // Add info about source types
    const sourceTypes = [...new Set(results.map(r => r.sourceType).filter(Boolean))];
    if (sourceTypes.length > 0) {
      summary += `Sources include ${sourceTypes.join(', ')}. `;
    }
    
    // Add info about authority
    const highAuthority = results.filter(r => r.authorityScore >= 80).length;
    if (highAuthority > 0) {
      summary += `${highAuthority} sources have high authority ratings. `;
    }
    
    // Add recency info
    const recentResults = results.filter(r => {
      const date = r.discoveredAt?.toDate?.() || new Date(r.discoveredAt);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return diffHours < 48;
    }).length;
    
    if (recentResults > 0) {
      summary += `${recentResults} sources were discovered in the last 48 hours.`;
    }
    
    return summary;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Summary Card */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Key Insights</h3>
        <p className="text-gray-300 text-sm mb-3">
          {generateSummary()}
        </p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Generated from {results.length} sources</span>
          <button className="text-yellow-500 hover:text-yellow-400 flex items-center">
            <RotateCw size={14} className="mr-1" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Trend Card */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Source Distribution</h3>
        <div className="h-32 bg-gray-900 rounded relative">
          {trendData.length > 0 ? (
            <div className="flex h-full items-end p-2">
              {trendData.map((item, index) => {
                // Map source types to colors
                const colorMap = {
                  'regulatory': '#FFD700',
                  'academic': '#3498DB',
                  'market': '#2ECC71',
                  'industry': '#9B59B6',
                  'news': '#E74C3C',
                  'unknown': '#95A5A6'
                };
                
                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center justify-end h-full"
                    style={{ flex: 1 }}
                  >
                    <div 
                      className="w-full mx-1 rounded-t"
                      style={{ 
                        height: `${Math.max(5, item.percentage)}%`, 
                        backgroundColor: colorMap[item.type] || colorMap.unknown
                      }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-1">{item.type}</div>
                    <div className="text-xs text-white">{item.count}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-500">No data available</span>
            </div>
          )}
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>Based on source types</span>
          <button className="text-yellow-500 hover:text-yellow-400">Change Metrics</button>
        </div>
      </div>
    </div>
  );
};

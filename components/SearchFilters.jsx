import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Calendar, Hash, Award, FileText } from 'lucide-react';

/**
 * SearchFilters component with expandable filter options
 */
const SearchFilters = ({ onFilterChange = () => {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '7d',
    sourceType: 'all',
    sentiment: 'all',
    contentType: 'all'
  });
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  return (
    <div className="mb-6 bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <button 
        onClick={toggleExpanded}
        className="w-full px-4 py-3 flex justify-between items-center text-white hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center">
          <Filter size={18} className="mr-2 text-gray-400" />
          <span className="font-medium">Advanced Filters</span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-500 text-black rounded-full">
            {Object.values(filters).filter(v => v !== 'all').length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      
      {/* Filter options */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="flex items-center text-sm text-gray-400 mb-2">
                <Calendar size={14} className="mr-1.5" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All time</option>
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            
            {/* Source Type */}
            <div>
              <label className="flex items-center text-sm text-gray-400 mb-2">
                <Award size={14} className="mr-1.5" />
                Source Type
              </label>
              <select
                value={filters.sourceType}
                onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All sources</option>
                <option value="academic">Academic</option>
                <option value="news">News</option>
                <option value="industry">Industry</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="government">Government</option>
              </select>
            </div>
            
            {/* Sentiment */}
            <div>
              <label className="flex items-center text-sm text-gray-400 mb-2">
                <Hash size={14} className="mr-1.5" />
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            
            {/* Content Type */}
            <div>
              <label className="flex items-center text-sm text-gray-400 mb-2">
                <FileText size={14} className="mr-1.5" />
                Content Type
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All content</option>
                <option value="article">Articles</option>
                <option value="report">Reports</option>
                <option value="blog">Blogs</option>
                <option value="paper">Research Papers</option>
                <option value="news">News</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              onClick={() => {
                const resetFilters = {
                  dateRange: 'all',
                  sourceType: 'all',
                  sentiment: 'all',
                  contentType: 'all'
                };
                setFilters(resetFilters);
                onFilterChange(resetFilters);
              }}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Reset
            </button>
            <button 
              onClick={() => onFilterChange(filters)}
              className="px-4 py-2 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
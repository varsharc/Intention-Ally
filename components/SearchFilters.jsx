import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar, Globe, AlertTriangle, Check } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * SearchFilters component
 * Provides advanced filtering options for search results
 */
const SearchFilters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [sourceType, setSourceType] = useState('all');
  const [sentiment, setSentiment] = useState('all');
  const [contentType, setContentType] = useState('all');
  
  // Handle filter changes and notify parent
  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        dateRange,
        sourceType,
        sentiment,
        contentType
      });
    }
  };
  
  // Reset all filters to default values
  const resetFilters = () => {
    setDateRange('7d');
    setSourceType('all');
    setSentiment('all');
    setContentType('all');
    
    if (onFilterChange) {
      onFilterChange({
        dateRange: '7d',
        sourceType: 'all',
        sentiment: 'all',
        contentType: 'all'
      });
    }
  };
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={combineStyles(
          styles.button.outline,
          "w-full justify-between"
        )}
      >
        <div className="flex items-center">
          <Filter size={16} className="mr-2" />
          <span>Advanced Filters</span>
        </div>
        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-[#1F2937] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
                <Calendar size={14} className="inline mr-1" />
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={styles.input.default + " w-full"}
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            
            {/* Source Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
                <Globe size={14} className="inline mr-1" />
                Source Type
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className={styles.input.default + " w-full"}
              >
                <option value="all">All Sources</option>
                <option value="news">News Articles</option>
                <option value="academic">Academic Papers</option>
                <option value="blogs">Blog Posts</option>
                <option value="social">Social Media</option>
              </select>
            </div>
            
            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
                <AlertTriangle size={14} className="inline mr-1" />
                Sentiment
              </label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value)}
                className={styles.input.default + " w-full"}
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
                <Check size={14} className="inline mr-1" />
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className={styles.input.default + " w-full"}
              >
                <option value="all">All Content</option>
                <option value="article">Articles</option>
                <option value="report">Reports</option>
                <option value="case-study">Case Studies</option>
                <option value="whitepaper">Whitepapers</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-[#374151]">
            <button
              onClick={resetFilters}
              className="text-[#D1D5DB] hover:text-white transition-colors"
            >
              Reset Filters
            </button>
            
            <button
              onClick={() => {
                handleFilterChange();
                setIsOpen(false);
              }}
              className={styles.button.primary}
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
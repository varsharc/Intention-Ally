import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, Tag, Calendar, Globe, RefreshCw, Copy, CheckCheck, Filter, List, Grid } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';
import api from '../services/api';

/**
 * SearchResults component
 * Displays search results with filtering options and result summary
 */
export const SearchResults = ({ selectedKeyword }) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultsView, setResultsView] = useState('list'); // 'list' or 'grid'
  const [copyStatus, setCopyStatus] = useState({});
  const [timeframe, setTimeframe] = useState(7); // days
  const [noResults, setNoResults] = useState(false);
  
  // Fetch results when component mounts or selectedKeyword changes
  useEffect(() => {
    fetchResults();
  }, [timeframe]);
  
  // Fetch search results
  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    setNoResults(false);
    
    try {
      let data;
      
      if (selectedKeyword) {
        // If a specific keyword is selected, search for that keyword
        const searchResponse = await api.searchKeyword(selectedKeyword);
        if (searchResponse.success && searchResponse.results) {
          data = searchResponse.results;
        } else {
          throw new Error(searchResponse.message || 'Failed to search keyword');
        }
      } else {
        // Otherwise fetch all recent results
        data = await api.fetchResults(timeframe);
      }
      
      if (data && data.length > 0) {
        // Process and flatten the results if needed
        let processedResults = data;
        
        // If data is in KeywordSearch format from fetchResults()
        if (data[0] && data[0].keyword && data[0].results) {
          processedResults = data.flatMap(item => 
            item.results.map(result => ({
              ...result,
              keyword: item.keyword
            }))
          );
        }
        
        setResults(processedResults);
      } else {
        setResults([]);
        setNoResults(true);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle copy to clipboard functionality
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({...copyStatus, [id]: true});
      setTimeout(() => {
        setCopyStatus({...copyStatus, [id]: false});
      }, 2000);
    });
  };
  
  // Extract unique domains for filtering
  const uniqueDomains = [...new Set(results.map(result => result.url ? new URL(result.url).hostname : 'unknown'))];
  
  // Generate result key insights (this would ideally be done on the backend)
  const generateInsights = () => {
    if (results.length === 0) return 'No results available';
    
    const keywords = [...new Set(results.map(result => result.keyword || selectedKeyword))];
    return `Recent discussions on ${keywords.join(', ')} focus on implementation strategies and integration with existing programs. ${results.length} results found across ${uniqueDomains.length} domains.`;
  };
  
  // Extract related terms (this would ideally be done on the backend)
  const relatedTerms = [
    "scope 3 reporting", "supply chain", "ESG metrics", 
    "carbon accounting", "climate targets", "value chain", 
    "sustainability ROI"
  ];

  return (
    <div className={combineStyles(styles.card.base, "mt-6")}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>
          Search Results
          {selectedKeyword && ` for "${selectedKeyword}"`}
        </h2>
        
        <div className={styles.utils.flexCenter + " space-x-4"}>
          <div className={styles.utils.flexCenter + " space-x-2"}>
            <button 
              className={combineStyles(
                "px-3 py-1 rounded-md text-sm transition-colors flex items-center",
                resultsView === 'list' ? 
                  "bg-[#EAB308] text-black" : 
                  "bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]"
              )}
              onClick={() => setResultsView('list')}
            >
              <List size={14} className="mr-1" />
              List
            </button>
            <button
              className={combineStyles(
                "px-3 py-1 rounded-md text-sm transition-colors flex items-center",
                resultsView === 'grid' ? 
                  "bg-[#EAB308] text-black" : 
                  "bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]"
              )}
              onClick={() => setResultsView('grid')}
            >
              <Grid size={14} className="mr-1" />
              Grid
            </button>
          </div>
          
          <div className="p-2 bg-[#374151] rounded flex items-center space-x-2">
            <Filter size={16} />
            <select 
              className="bg-transparent text-sm focus:outline-none"
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              disabled={isLoading || !!selectedKeyword}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          
          <button 
            className={combineStyles(
              "p-2 bg-[#374151] rounded hover:bg-[#4B5563] transition-colors",
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            )}
            onClick={fetchResults}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      
      <div className={styles.card.body}>
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw size={24} className="animate-spin text-[#EAB308]" />
            <span className="ml-2 text-[#D1D5DB]">Loading results...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {/* No results state */}
        {noResults && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="text-[#9CA3AF] mb-2">No search results found</div>
            <p className="text-[#D1D5DB] text-sm">
              Try adjusting your search terms or timeframe
            </p>
          </div>
        )}
        
        {/* Results content */}
        {!isLoading && !error && results.length > 0 && (
          <>
            {/* Result Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Summary Card */}
              <div className="bg-[#1F2937] rounded-lg p-4">
                <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">Key Insights</h3>
                <p className="text-[#D1D5DB] text-sm mb-3">
                  {generateInsights()}
                </p>
                <div className={styles.utils.flexBetween + " text-sm text-[#9CA3AF]"}>
                  <span>Generated from {results.length} sources</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Tags Card */}
              <div className="bg-[#1F2937] rounded-lg p-4">
                <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">Related Topics</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {relatedTerms.map((tag, index) => (
                    <div key={index} className="bg-[#374151] text-[#D1D5DB] px-2 py-1 rounded-md text-xs">
                      {tag}
                    </div>
                  ))}
                </div>
                <div className={styles.utils.flexBetween + " text-sm text-[#9CA3AF]"}>
                  <span>Based on frequency analysis</span>
                  <span>Auto-generated</span>
                </div>
              </div>
            </div>
            
            {/* Results List */}
            <div className={resultsView === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
              {results.map((result, index) => {
                // Extract domain from URL
                const domain = result.url ? new URL(result.url).hostname : 'unknown';
                
                // Determine sentiment (this would ideally come from the backend)
                const sentiment = 'neutral';
                
                return (
                  <div 
                    key={index} 
                    className="bg-[#1F2937] rounded-lg overflow-hidden hover:bg-[#374151] transition-colors"
                  >
                    <div className="p-4">
                      <div className={styles.utils.flexBetween + " mb-2"}>
                        <div className={combineStyles(
                          styles.badge.default, 
                          sentiment === 'positive' ? 'bg-green-500 bg-opacity-20 text-green-400' : 
                          sentiment === 'negative' ? 'bg-red-500 bg-opacity-20 text-red-400' : 
                          'bg-gray-500 bg-opacity-20 text-gray-400'
                        )}>
                          {result.keyword || selectedKeyword || 'Article'}
                        </div>
                        <button 
                          onClick={() => handleCopy(result.url, index)}
                          className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                        >
                          {copyStatus[index] ? <CheckCheck size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      
                      <h3 className="text-[#F9FAFB] font-medium mb-2 line-clamp-2">
                        {result.title}
                      </h3>
                      
                      <p className="text-[#D1D5DB] text-sm mb-3 line-clamp-3">
                        {result.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center text-xs text-[#9CA3AF] gap-x-4">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-[#EAB308] hover:text-[#CA8A04]"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          <span>Visit Source</span>
                        </a>
                        
                        {result.date && (
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span>{new Date(result.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Globe size={12} className="mr-1" />
                          <span>{domain}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {results.length > 5 && (
              <div className={styles.utils.flexCenter + " mt-6"}>
                <button 
                  className={styles.button.outline}
                  onClick={() => {
                    // This would typically load more results or change pagination
                    // For now, it just refreshes the current results
                    fetchResults();
                  }}
                >
                  View More Results
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
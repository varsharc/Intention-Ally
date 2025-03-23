import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component with animated focus states and search history
 */
const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Enter keyword to track...' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'carbon insetting', 
    'sustainable logistics', 
    'scope 3 emissions'
  ]);
  const [showRecent, setShowRecent] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Perform search
    if (onSearch) {
      onSearch(searchTerm);
    }
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches].slice(0, 5));
    }
    
    // Reset search state after a delay
    setTimeout(() => {
      setIsSearching(false);
      setShowRecent(false);
    }, 1000);
  };
  
  const handleFocus = () => {
    setShowRecent(true);
  };
  
  const handleBlur = () => {
    // Delay hiding recent searches to allow clicking on them
    setTimeout(() => {
      setShowRecent(false);
    }, 200);
  };
  
  const handleClear = () => {
    setSearchTerm('');
  };
  
  const selectRecent = (term) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
    setShowRecent(false);
  };
  
  return (
    <div className="relative mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center relative">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className={`bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-r-md transition-colors duration-200 flex items-center ${
              isSearching ? 'opacity-75' : ''
            }`}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="mr-2">Searching</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
      
      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
          <div className="px-3 py-2 text-xs text-gray-400 uppercase font-semibold">Recent Searches</div>
          {recentSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => selectRecent(term)}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              <div className="flex items-center">
                <Search size={14} className="mr-2 text-gray-400" />
                {term}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
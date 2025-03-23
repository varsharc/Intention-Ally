import React, { useState } from 'react';
import { Search, Plus, Bookmark } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    
    // Call the onSearch prop with the keyword
    if (onSearch) {
      onSearch(keyword)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If no onSearch prop, simulate a loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search a keyword, topic, or domain..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-medium flex items-center transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center">
              <Search size={18} className="mr-1" />
              Search
            </span>
          )}
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
          title="Track this keyword"
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
          title="Bookmark this search"
        >
          <Bookmark size={18} />
        </button>
      </form>
      
      <div className="flex items-center mt-3 text-sm text-gray-400">
        <span className="mr-2">Trending:</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => setKeyword('carbon insetting')}
            className="text-yellow-500 hover:text-yellow-400"
          >
            carbon insetting
          </button>
          <button 
            onClick={() => setKeyword('sustainable logistics')}
            className="text-yellow-500 hover:text-yellow-400"
          >
            sustainable logistics
          </button>
          <button 
            onClick={() => setKeyword('scope 3 emissions')}
            className="text-yellow-500 hover:text-yellow-400"
          >
            scope 3 emissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
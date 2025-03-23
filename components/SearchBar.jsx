import React, { useState, useEffect } from 'react';
import { Search, X, PlusCircle, Tag, CheckCircle, RefreshCw } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';
import api from '../services/api';

/**
 * SearchBar component
 * Allows users to search for keywords and manages keyword tags
 */
const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addKeywordInput, setAddKeywordInput] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Fetch keywords when component mounts
  useEffect(() => {
    fetchKeywords();
  }, []);
  
  // Fetch keywords from API
  const fetchKeywords = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.fetchKeywords();
      setKeywords(data);
    } catch (err) {
      console.error('Failed to fetch keywords:', err);
      setError('Failed to load tracked keywords');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };
  
  // Add a new keyword to track
  const handleAddKeyword = async (e) => {
    e.preventDefault();
    
    if (!addKeywordInput.trim()) return;
    
    setIsAdding(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await api.addKeyword(addKeywordInput.trim());
      if (result.success) {
        setSuccessMessage(`Added "${addKeywordInput}" to tracked keywords`);
        setAddKeywordInput('');
        fetchKeywords(); // Refresh keywords list
      } else {
        setError(result.message || 'Failed to add keyword');
      }
    } catch (err) {
      console.error('Failed to add keyword:', err);
      setError('Failed to add keyword. Please try again.');
    } finally {
      setIsAdding(false);
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };
  
  // Remove a keyword from tracking
  const handleRemoveKeyword = async (keyword) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await api.removeKeyword(keyword);
      if (result.success) {
        setSuccessMessage(`Removed "${keyword}" from tracked keywords`);
        fetchKeywords(); // Refresh keywords list
      } else {
        setError(result.message || 'Failed to remove keyword');
      }
    } catch (err) {
      console.error('Failed to remove keyword:', err);
      setError('Failed to remove keyword. Please try again.');
    } finally {
      setIsLoading(false);
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };
  
  // Run a manual search for all keywords
  const handleRunSearch = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await api.runManualSearch();
      if (result.success) {
        setSuccessMessage('Manual search completed successfully');
      } else {
        setError(result.message || 'Failed to run manual search');
      }
    } catch (err) {
      console.error('Failed to run manual search:', err);
      setError('Failed to run manual search. Please try again.');
    } finally {
      setIsLoading(false);
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };
  
  return (
    <div className={styles.card.base}>
      <div className={styles.card.header}>
        <h2 className={styles.text.heading3}>Search & Track Keywords</h2>
      </div>
      
      <div className={styles.card.body}>
        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={combineStyles(
                styles.input.default, 
                "pl-10 pr-4 py-3 w-full"
              )}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap justify-between items-center">
            <button
              type="submit"
              disabled={!searchInput.trim()}
              className={combineStyles(
                styles.button.primary,
                !searchInput.trim() ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <Search size={16} className="mr-2" />
              Search Now
            </button>
            
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className={styles.button.outline}
            >
              {isAdding ? (
                <>
                  <X size={16} className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <PlusCircle size={16} className="mr-2" />
                  Track New Keyword
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Add keyword form */}
        {isAdding && (
          <div className="mb-6 p-4 bg-[#1F2937] rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-[#F9FAFB]">
              Add Keyword to Track
            </h3>
            <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter a keyword to track..."
                value={addKeywordInput}
                onChange={(e) => setAddKeywordInput(e.target.value)}
                className={combineStyles(
                  styles.input.default,
                  "flex-grow py-2"
                )}
              />
              <button
                type="submit"
                disabled={!addKeywordInput.trim() || isAdding}
                className={combineStyles(
                  styles.button.primary,
                  "py-2",
                  (!addKeywordInput.trim() || isAdding) ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                {isAdding ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <PlusCircle size={16} className="mr-2" />
                    Add
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {/* Error and success messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-400 rounded-md">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 text-green-400 rounded-md flex items-center">
            <CheckCircle size={16} className="mr-2" />
            {successMessage}
          </div>
        )}
        
        {/* Tracked keywords */}
        <div>
          <div className={styles.utils.flexBetween + " mb-3"}>
            <h3 className="text-lg font-medium text-[#F9FAFB]">
              Tracked Keywords
            </h3>
            
            <button
              onClick={handleRunSearch}
              disabled={isLoading || keywords.length === 0}
              className={combineStyles(
                "text-sm text-[#EAB308] hover:text-[#CA8A04] transition-colors flex items-center",
                (isLoading || keywords.length === 0) ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin mr-1" : "mr-1"} />
              Run Manual Search
            </button>
          </div>
          
          {isLoading && !keywords.length ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw size={20} className="animate-spin text-[#EAB308]" />
              <span className="ml-2 text-[#D1D5DB]">Loading keywords...</span>
            </div>
          ) : keywords.length === 0 ? (
            <div className="text-center py-8 bg-[#1F2937] rounded-lg">
              <p className="text-[#9CA3AF] mb-2">No keywords tracked yet</p>
              <p className="text-[#D1D5DB] text-sm">
                Add keywords to track search results over time
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className={combineStyles(
                    styles.utils.flexCenter,
                    styles.badge.colored,
                    keyword.is_active ? "bg-[#374151]" : "bg-[#1F2937] opacity-60",
                    "px-3 py-1.5 group"
                  )}
                >
                  <Tag size={14} className="mr-1.5" />
                  <span className="mr-2">
                    {keyword.value}
                  </span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword.value)}
                    className="hidden group-hover:block text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                    title="Remove keyword"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
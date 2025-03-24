/**
 * Search page component
 * 
 * This page provides the main search interface for the application,
 * displaying search controls, knowledge graph, and results.
 */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Filter, Grid, Clock, ArrowDown, Share2, ChevronDown } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useCollection } from '../../hooks/useFirestore';
import AuthModal from '../../components/auth/AuthModal';

// Search Page Component
export default function SearchPage() {
  const { user, loading: authLoading } = useFirebase();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('graph'); // 'graph' or 'list'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Fetch user's search configurations
  const { 
    data: searchConfigs, 
    loading: configsLoading, 
    error: configsError 
  } = useCollection(
    'searchConfigs', 
    user ? [['userId', '==', user.uid]] : null,
    ['createdAt', 'desc']
  );
  
  // Set the selected config based on URL params or default to first config
  useEffect(() => {
    if (!configsLoading && searchConfigs?.length > 0) {
      const configId = router.query.configId;
      
      if (configId) {
        const config = searchConfigs.find(c => c.id === configId);
        if (config) {
          setSelectedConfig(config);
        }
      } else if (!selectedConfig) {
        // Default to first config if none selected
        setSelectedConfig(searchConfigs[0]);
      }
    }
  }, [configsLoading, searchConfigs, router.query.configId, selectedConfig]);

  // Handle search query submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    if (!user) {
      // If not authenticated, open auth modal
      setAuthModalOpen(true);
      return;
    }
    
    // Navigate to search results with query parameter
    router.push({
      pathname: '/search',
      query: { q: searchQuery }
    });
  };
  
  // Handle filter toggle
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Handle search configuration selection
  const handleConfigSelect = (configId) => {
    const config = searchConfigs.find(c => c.id === configId);
    if (config) {
      setSelectedConfig(config);
      router.push({
        pathname: '/search',
        query: { configId }
      }, undefined, { shallow: true });
    }
  };

  return (
    <MainLayout activePage="search">
      <div className="space-y-6">
        {/* Search header */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h1 className="text-2xl font-bold text-white">Semantic Search</h1>
            
            {!authLoading && !user && (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center"
              >
                <Search size={18} className="mr-2" />
                Sign in to Search
              </button>
            )}
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="mt-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a topic, keyword, or phrase..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="flex gap-3">
                {!configsLoading && searchConfigs?.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      className="h-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center whitespace-nowrap"
                      onClick={() => toggleFilters()}
                    >
                      <span className="mr-2 max-w-[150px] truncate">
                        {selectedConfig ? selectedConfig.name : 'Select Config'}
                      </span>
                      <ChevronDown size={16} />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-700">
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">Search Configurations</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {searchConfigs.map((config) => (
                            <button
                              key={config.id}
                              type="button"
                              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 cursor-pointer ${
                                selectedConfig?.id === config.id ? 'bg-gray-700 text-white' : 'text-gray-300'
                              }`}
                              onClick={() => handleConfigSelect(config.id)}
                            >
                              {config.name}
                            </button>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-700">
                          <button
                            type="button"
                            className="w-full text-center text-sm text-yellow-500 hover:text-yellow-400"
                            onClick={() => router.push('/search/create')}
                          >
                            + Create New Configuration
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-md flex items-center"
                  disabled={!searchQuery.trim()}
                >
                  <Search size={18} className="mr-2" />
                  Search
                </button>
                
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-3 rounded-md"
                  onClick={toggleFilters}
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Search content */}
        {configsLoading || authLoading ? (
          // Loading state
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Tab navigation */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'graph'
                    ? 'text-white border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('graph')}
              >
                <div className="flex items-center">
                  <Grid size={16} className="mr-2" />
                  Knowledge Graph
                </div>
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'list'
                    ? 'text-white border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('list')}
              >
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  Recent Discoveries
                </div>
              </button>
              
              <div className="flex-1"></div>
              
              {/* Sort options */}
              <div className="flex items-center">
                <span className="text-gray-400 text-sm mr-2">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm border-none text-white focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (Newest)</option>
                  <option value="authority">Authority</option>
                </select>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'graph' ? (
              // Knowledge Graph view
              <div className="bg-gray-800 rounded-lg p-4 h-[600px] border border-gray-700 relative">
                {user ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    {selectedConfig ? (
                      <div className="text-center">
                        <p className="mb-4">Knowledge graph visualization for <strong>{selectedConfig.name}</strong></p>
                        <p className="text-sm">This is a placeholder for the D3.js graph visualization.</p>
                        <p className="text-sm mt-4">The actual graph will show connections between sources based on semantic similarity.</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p>No search configuration selected.</p>
                        <button
                          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md"
                          onClick={() => router.push('/search/create')}
                        >
                          Create Your First Search Config
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">Sign in to view and interact with your knowledge graph.</p>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md"
                        onClick={() => setAuthModalOpen(true)}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Graph controls */}
                {user && selectedConfig && (
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button className="p-2 bg-gray-900 rounded hover:bg-gray-700">
                      <ArrowDown size={16} className="text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-900 rounded hover:bg-gray-700">
                      <Share2 size={16} className="text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Recent discoveries list
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                {user ? (
                  <div className="text-center py-8 text-gray-400">
                    {selectedConfig ? (
                      <div>
                        <p>Recent discoveries for <strong>{selectedConfig.name}</strong> will appear here.</p>
                        <p className="text-sm mt-2">Try searching for content using the search bar above.</p>
                      </div>
                    ) : (
                      <div>
                        <p>No search configuration selected.</p>
                        <button
                          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md"
                          onClick={() => router.push('/search/create')}
                        >
                          Create Your First Search Config
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">Sign in to view your recent discoveries.</p>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md"
                        onClick={() => setAuthModalOpen(true)}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Auth modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialView="signin"
      />
    </MainLayout>
  );
}

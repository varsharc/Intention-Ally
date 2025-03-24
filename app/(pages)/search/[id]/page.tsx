// app/(pages)/search/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSearchConfig } from '@/app/hooks/useSearchConfig';
import { useSearchResults } from '@/app/hooks/useSearchResults';
import { 
  Maximize2, 
  RefreshCw, 
  Settings, 
  Clock, 
  Save, 
  Share2,
  ChevronDown,
  Download,
  Sparkles,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function SearchResultPage() {
  const params = useParams();
  const configId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { config, loading: configLoading } = useSearchConfig(configId);
  const { 
    results, 
    summary, 
    loading, 
    searching, 
    error, 
    runSearch, 
    runDeepSearch, 
    createSummary,
    filterByAuthority
  } = useSearchResults(configId);
  
  const [showSettings, setShowSettings] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [deepSearching, setDeepSearching] = useState(false);
  const [minAuthority, setMinAuthority] = useState(60);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'authority'>('date');
  const [filteredResults, setFilteredResults] = useState(results);
  
  // Update filtered results when results or filters change
  useEffect(() => {
    let filtered = filterByAuthority(minAuthority);
    
    // Sort results
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => 
        b.discoveredAt.getTime() - a.discoveredAt.getTime()
      );
    } else if (sortBy === 'authority') {
      filtered = [...filtered].sort((a, b) => 
        b.authorityScore - a.authorityScore
      );
    }
    
    setFilteredResults(filtered);
  }, [results, minAuthority, sortBy, filterByAuthority]);
  
  // Generate summary when requested
  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      await createSummary();
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };
  
  // Run deep search when requested
  const handleDeepSearch = async () => {
    try {
      setDeepSearching(true);
      await runDeepSearch();
    } catch (err) {
      console.error('Error running deep search:', err);
    } finally {
      setDeepSearching(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await runSearch(false); // Force new search without cache
    } catch (err) {
      console.error('Error refreshing search:', err);
    }
  };
  
  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get badge color based on source type
  const getSourceTypeColor = (sourceType?: string) => {
    switch (sourceType) {
      case 'government':
        return 'bg-yellow-500 text-black';
      case 'academic':
        return 'bg-blue-500 text-white';
      case 'organization':
        return 'bg-purple-500 text-white';
      case 'news':
        return 'bg-red-500 text-white';
      case 'technology':
        return 'bg-green-500 text-white';
      case 'claude_research':
        return 'bg-indigo-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Get badge for authority score
  const getAuthorityBadge = (score: number) => {
    if (score >= 85) return 'bg-green-700 text-white';
    if (score >= 75) return 'bg-yellow-500 text-black';
    if (score >= 60) return 'bg-orange-500 text-white';
    return 'bg-red-700 text-white';
  };
  
  if (configLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!config) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-2">Search Topic Not Found</h2>
        <p className="text-gray-400">The search topic you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{config.name}</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            {config.keywords.map((keyword) => (
              <span key={keyword} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button 
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Save to favorites"
          >
            <Save size={16} />
          </button>
          <button 
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Share"
          >
            <Share2 size={16} />
          </button>
          <button 
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            title="Full screen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-white">Search Settings</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronDown size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-gray-400 mb-1">Update Frequency</span>
              <span className="text-white">{config.updateFrequency}</span>
            </div>
            <div>
              <span className="block text-gray-400 mb-1">Authority Threshold</span>
              <span className="text-white">{config.authorityThreshold}%</span>
            </div>
            <div>
              <span className="block text-gray-400 mb-1">Domain Templates</span>
              <span className="text-white">{config.templateType}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary and stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Summary card */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-white">Key Insights</h3>
            <button 
              onClick={handleGenerateSummary}
              disabled={summaryLoading || results.length === 0}
              className="text-yellow-500 hover:text-yellow-400 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center text-sm"
            >
              {summaryLoading ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="mr-1" />
                  {summary ? 'Refresh' : 'Generate'}
                </>
              )}
            </button>
          </div>
          
          {summary ? (
            <p className="text-gray-300 text-sm">
              {summary}
            </p>
          ) : (
            <div className="bg-gray-750 rounded border border-gray-700 p-3 text-sm text-gray-400 italic">
              {results.length === 0 ? (
                "Discover some results first, then generate insights."
              ) : (
                "Click 'Generate' to create AI-powered insights from your search results."
              )}
            </div>
          )}
          
          <div className="flex justify-between text-xs text-gray-400 mt-3">
            <span>Based on {results.length} sources</span>
            {summary && (
              <button className="text-yellow-500 hover:text-yellow-400 flex items-center">
                <Download size={12} className="mr-1" />
                Export
              </button>
            )}
          </div>
        </div>
        
        {/* Stats card */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Search Statistics</h3>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <span className="text-gray-400">Total Results:</span>
              <span className="text-white ml-2">{results.length}</span>
            </div>
            <div>
              <span className="text-gray-400">High Authority:</span>
              <span className="text-white ml-2">
                {results.filter(r => r.authorityScore >= 75).length}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Last Updated:</span>
              <span className="text-white ml-2">
                {results.length > 0 
                  ? formatDate(new Date(Math.max(...results.map(r => r.discoveredAt.getTime()))))
                  : 'Never'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <span className="text-white ml-2">{formatDate(config.createdAt)}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <button 
              onClick={handleDeepSearch}
              disabled={deepSearching || !config.advancedParams.useDeepSearch}
              className={`w-full ${
                config.advancedParams.useDeepSearch 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              } text-white rounded py-2 px-3 flex items-center justify-center text-sm`}
            >
              {deepSearching ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Running Deep Research...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Run Deep Research with Claude
                </>
              )}
            </button>
            {!config.advancedParams.useDeepSearch && (
              <div className="text-xs text-gray-500 mt-2 text-center">
                Deep search is not enabled for this topic
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search results */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Latest Discoveries</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-400" />
              <label className="text-sm text-gray-400 mr-2">Min Authority:</label>
              <select 
                value={minAuthority}
                onChange={(e) => setMinAuthority(Number(e.target.value))}
                className="bg-gray-900 text-white text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value={0}>Any</option>
                <option value={60}>Medium (60+)</option>
                <option value={75}>High (75+)</option>
                <option value={85}>Very High (85+)</option>
              </select>
            </div>
            
            <div className="flex items-center text-sm">
              <span className="text-gray-400 mr-2">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'authority')}
                className="bg-transparent text-yellow-500 border-none"
              >
                <option value="date">Date (Newest)</option>
                <option value="authority">Authority</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={searching}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center disabled:opacity-50"
              title="Refresh search"
            >
              <RefreshCw size={16} className={searching ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-900/30 border-b border-red-800">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-400">Loading results...</p>
          </div>
        )}
        
        {/* Searching indicator */}
        {searching && (
          <div className="p-4 bg-yellow-900/20 border-b border-yellow-800">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
              <p className="text-yellow-500">Searching for new discoveries...</p>
            </div>
          </div>
        )}
        
        {/* Results list */}
        <div className="p-4 space-y-4">
          {!loading && !filteredResults.length && (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found matching your criteria.</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-yellow-500 hover:text-yellow-400"
              >
                Run a new search
              </button>
            </div>
          )}
          
          {filteredResults.map((result) => (
            <div key={result.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium">{result.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`${getAuthorityBadge(result.authorityScore)} text-xs px-2 py-0.5 rounded`}>
                    {result.authorityScore}% Authority
                  </span>
                  <span className="text-gray-400 text-xs">{formatDate(result.discoveredAt)}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                {result.snippet ? result.snippet.substring(0, 280) + (result.snippet.length > 280 ? '...' : '') : 'No snippet available'}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">
                    {result.sourceDomain}
                  </span>
                  <span className={`${getSourceTypeColor(result.metadata.sourceType as string)} px-2 py-0.5 rounded`}>
                    {result.metadata.sourceType || 'Unknown'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    className="text-gray-400 hover:text-white"
                    title="Save to favorites"
                  >
                    <Save size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
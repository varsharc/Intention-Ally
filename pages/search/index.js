import React, { useState } from 'react';
import Head from 'next/head';
import AppLayout from '../../components/ui-layout';
import SearchBar from '../../components/SearchBar';
import KeywordTags from '../../components/KeywordTags';
import SearchResults from '../../components/SearchResults';
import KnowledgeGraph from '../../components/ui-knowledge-graph';
import TrendVisualizationPanel from '../../components/ui-trend-visualization';

export default function SearchPage() {
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [keywords, setKeywords] = useState([
    'carbon insetting', 
    'sustainable logistics', 
    'scope 3 emissions'
  ]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle search from SearchBar
  const handleSearch = async (keyword) => {
    setIsLoading(true);
    setSelectedKeyword(keyword);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally be an API call
        setIsLoading(false);
        resolve({ success: true });
      }, 1000);
    });
  };
  
  // Handle keyword selection
  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    handleSearch(keyword);
  };
  
  // Handle keyword removal
  const handleKeywordRemove = (keyword) => {
    setKeywords(keywords.filter(k => k !== keyword));
    if (selectedKeyword === keyword) {
      setSelectedKeyword('');
    }
  };
  
  return (
    <AppLayout>
      <Head>
        <title>Search Dashboard | Intention-Ally</title>
        <meta name="description" content="Search and track keywords with Intention-Ally" />
      </Head>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Search Dashboard</h1>
          <p className="text-gray-400">
            Track keywords, discover trends, and visualize semantic relationships
          </p>
        </div>
        
        {/* Search functionality */}
        <SearchBar onSearch={handleSearch} />
        
        {/* Keyword Tags */}
        <KeywordTags 
          keywords={keywords}
          selectedKeyword={selectedKeyword}
          onSelect={handleKeywordSelect}
          onRemove={handleKeywordRemove}
        />
        
        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <KnowledgeGraph />
          <TrendVisualizationPanel />
        </div>
        
        {/* Search Results */}
        <SearchResults selectedKeyword={selectedKeyword} results={results} />
      </div>
    </AppLayout>
  );
}
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { styles, combineStyles } from '../../styles/app-styles';
import { AppLayout } from '../../components/ui-layout';
import { KnowledgeGraphPanel } from '../../components/ui-knowledge-graph';
import { TrendVisualizationPanel } from '../../components/ui-trend-visualization';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import SearchFilters from '../../components/SearchFilters';
import KeywordTags from '../../components/KeywordTags';
import InsightsSummary from '../../components/InsightsSummary';
import FirebaseTest from '../../components/FirebaseTest';
import ThemeProvider from '../../components/ThemeProvider';
import api from '../../services/api';

export default function SearchPage() {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '7d',
    sourceType: 'all',
    sentiment: 'all',
    contentType: 'all'
  });

  // Fetch keywords when component mounts
  useEffect(() => {
    fetchKeywords();
  }, []);
  
  // Fetch keywords from API
  const fetchKeywords = async () => {
    try {
      const data = await api.fetchKeywords();
      setKeywords(data);
    } catch (err) {
      console.error('Failed to fetch keywords:', err);
    }
  };

  // Function to handle searches from SearchBar
  const handleSearch = async (keyword) => {
    setSelectedKeyword(keyword);
    setIsLoading(true);
    
    try {
      const response = await api.searchKeyword(keyword);
      if (response.success && response.results) {
        setSearchResults(response.results);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle keyword selection from tag list
  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    handleSearch(keyword);
  };
  
  // Handle keyword removal
  const handleKeywordRemove = async (keyword) => {
    try {
      await api.removeKeyword(keyword);
      fetchKeywords(); // Refresh the keyword list
      if (selectedKeyword === keyword) {
        setSelectedKeyword(null);
      }
    } catch (err) {
      console.error('Failed to remove keyword:', err);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // In a real app, this would trigger a filtered search
  };

  return (
    <ThemeProvider>
      <Head>
        <title>Search | Intention-Ally</title>
        <meta name="description" content="Search and track keywords with Intention-Ally" />
      </Head>
      
      <AppLayout>
        <div className="mb-6">
          <h1 className={styles.text.heading1}>Search Dashboard</h1>
          <p className={styles.text.bodyLarge}>
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
        
        {/* Advanced Filters */}
        <SearchFilters onFilterChange={handleFilterChange} />
        
        {/* Visualizations Grid */}
        <div className={combineStyles(styles.grid.twoColumn, "mb-8")}>
          <KnowledgeGraphPanel />
          <TrendVisualizationPanel />
        </div>
        
        {/* Insights Summary */}
        <InsightsSummary 
          results={searchResults} 
          keyword={selectedKeyword} 
        />
        
        {/* Search Results */}
        <SearchResults selectedKeyword={selectedKeyword} />
        
        {/* Firebase Connection Test - Hidden in production */}
        <div className="mt-8 opacity-50 hover:opacity-100 transition-opacity">
          <details>
            <summary className="cursor-pointer text-sm text-[#9CA3AF] mb-2">
              System Diagnostics
            </summary>
            <FirebaseTest />
          </details>
        </div>
      </AppLayout>
    </ThemeProvider>
  );
}
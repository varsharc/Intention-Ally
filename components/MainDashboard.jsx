import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { styles, combineStyles } from '../styles/app-styles';
import { AppLayout } from './ui-layout';
import { KnowledgeGraphPanel } from './ui-knowledge-graph';
import { TrendVisualizationPanel } from './ui-trend-visualization';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import FirebaseTest from './FirebaseTest';
import api from '../services/api';

/**
 * MainDashboard component
 * The main dashboard page that integrates all the key components
 */
const MainDashboard = () => {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [keywordResults, setKeywordResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to handle searches from SearchBar
  const handleSearch = async (keyword) => {
    setSelectedKeyword(keyword);
    setIsLoading(true);
    
    try {
      const response = await api.searchKeyword(keyword);
      if (response.success && response.results) {
        setKeywordResults(response.results);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className={styles.text.heading1}>Search Dashboard</h1>
        <p className={styles.text.bodyLarge}>
          Track keywords, discover trends, and visualize semantic relationships
        </p>
      </div>
      
      {/* Search Controls */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Visualizations Grid */}
      <div className={combineStyles(styles.grid.twoColumn, "my-6")}>
        <KnowledgeGraphPanel />
        <TrendVisualizationPanel />
      </div>
      
      {/* Search Results */}
      <SearchResults selectedKeyword={selectedKeyword} />
      
      {/* Firebase connection test - can be commented out in production */}
      <div className="mt-8">
        <h2 className={styles.text.heading3}>System Diagnostics</h2>
        <FirebaseTest />
      </div>
    </AppLayout>
  );
};

export default MainDashboard;
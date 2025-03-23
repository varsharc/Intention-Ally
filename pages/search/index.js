import React, { useState } from 'react';
import Head from 'next/head';
import { styles, combineStyles } from '../../styles/app-styles';
import { AppLayout } from '../../components/ui-layout';
import { KnowledgeGraphPanel } from '../../components/ui-knowledge-graph';
import { TrendVisualizationPanel } from '../../components/ui-trend-visualization';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import FirebaseTest from '../../components/FirebaseTest';

export default function SearchPage() {
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  // Function to handle searches from SearchBar
  const handleSearch = (keyword) => {
    setSelectedKeyword(keyword);
  };

  return (
    <>
      <Head>
        <title>Search | Intention-Ally</title>
        <meta name="description" content="Search and track keywords with Intention-Ally" />
      </Head>
      
      <AppLayout>
        {/* Search functionality */}
        <SearchBar onSearch={handleSearch} />
        
        {/* Firebase Connection Test */}
        <FirebaseTest />
        
        {/* Visualizations Grid */}
        <div className={combineStyles(styles.grid.twoColumn, "mb-8")}>
          <KnowledgeGraphPanel />
          <TrendVisualizationPanel />
        </div>
        
        {/* Search Results */}
        <SearchResults selectedKeyword={selectedKeyword} />
      </AppLayout>
    </>
  );
}
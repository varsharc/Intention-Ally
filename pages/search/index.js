import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { styles, combineStyles } from '../../styles/app-styles';
import { AppLayout } from '../../components/ui-layout';
import { KnowledgeGraphPanel } from '../../components/ui-knowledge-graph';
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
        
        {/* Analytics link banner */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Analyze Keyword Trends</h2>
            <p className="text-gray-300">View enhanced interactive visualizations and trend analysis</p>
          </div>
          <Link 
            href="/analytics" 
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-colors text-white rounded-md flex items-center"
          >
            <span>Open Analytics</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Knowledge Graph */}
        <div className="mb-8">
          <KnowledgeGraphPanel />
        </div>
        
        {/* Firebase Connection Test */}
        <FirebaseTest />
        
        {/* Search Results */}
        <SearchResults selectedKeyword={selectedKeyword} />
      </AppLayout>
    </>
  );
}
import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/Search.module.css';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample hardcoded data (for demonstration)
  const demoKeywords = ['carbon insetting', 'sustainable logistics', 'scope 3 emissions'];
  
  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className={styles.main}>
      <Head>
        <title>Search | Intention-Ally</title>
        <meta name="description" content="Search and track keywords with Intention-Ally" />
      </Head>
      
      <div className={styles.container}>
        <h1 className={styles.title}>Search Dashboard</h1>
        <p className={styles.description}>
          Track keywords, discover trends, and visualize semantic relationships
        </p>
        
        {/* Search Box */}
        <div className={styles.card}>
          <form onSubmit={handleSearch} className="flex">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword to track..." 
              className="flex-1 p-2 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-r-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
        
        {/* Keywords List */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Tracked Keywords</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {demoKeywords.map((kw, index) => (
              <div 
                key={index}
                className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center"
              >
                <span>{kw}</span>
                <button className="ml-2 text-gray-400 hover:text-white">×</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visualization Placeholder */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Knowledge Graph</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-700 rounded">
            Knowledge Graph Visualization
          </div>
        </div>
        
        {/* Results Placeholder */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Search Results</h2>
          <div className="space-y-4 mt-4">
            <div className="border border-gray-700 rounded p-4">
              <h3 className="text-lg font-medium text-white mb-1">What is Carbon Insetting? Greener Logistics Starts Here</h3>
              <p className="text-sm text-gray-400 mb-2">sustainablelogistics.com</p>
              <p className="text-gray-300">Carbon insetting is the practice of investing in supply chain sustainability projects that benefit your business...</p>
            </div>
            <div className="border border-gray-700 rounded p-4">
              <h3 className="text-lg font-medium text-white mb-1">Carbon Insetting vs. Carbon Offsetting: Key Differences</h3>
              <p className="text-sm text-gray-400 mb-2">climateaction.org</p>
              <p className="text-gray-300">Unlike carbon offsetting which funds external projects, carbon insetting directly addresses emissions...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
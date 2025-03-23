import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { styles, combineStyles } from '../styles/app-styles';
import { AppLayout } from '../components/ui-layout';
import { InteractiveKnowledgeGraph } from '../components/ui-knowledge-graph';
import { EnhancedTrendVisualization } from '../components/ui-trend-visualization';

export default function AnalyticsPage() {
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(7); // Default 7 days
  const [useFirebase, setUseFirebase] = useState(true); // Default use Firebase
  
  // Fetch search results on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch data from the backend API
        const response = await fetch(`/api/backend/results?days=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results from API');
        }
        const data = await response.json();
        setSearchData(data);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setError('Failed to load search data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedTimeframe, useFirebase]);
  
  return (
    <>
      <Head>
        <title>Analytics | Intention-Ally</title>
        <meta name="description" content="Search trend analytics and visualizations" />
      </Head>
      
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Search Analytics</h1>
          <p className="text-gray-300">Explore search trends and visualize keyword relationships</p>
          
          {/* Data Source & Timeframe Selection */}
          <div className="flex gap-4 my-4">
            <div className="bg-gray-800 p-4 rounded-lg flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Data Source</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setUseFirebase(true)}
                  className={combineStyles(
                    "px-4 py-2 rounded transition-colors",
                    useFirebase 
                      ? "bg-yellow-600 text-white" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  Firebase
                </button>
                <button
                  onClick={() => setUseFirebase(false)}
                  className={combineStyles(
                    "px-4 py-2 rounded transition-colors",
                    !useFirebase 
                      ? "bg-yellow-600 text-white" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  Local Storage
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Timeframe</h3>
              <div className="flex gap-2">
                {[7, 14, 30, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setSelectedTimeframe(days)}
                    className={combineStyles(
                      "px-4 py-2 rounded transition-colors",
                      selectedTimeframe === days 
                        ? "bg-yellow-600 text-white" 
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    )}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Messages */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            <span className="ml-2 text-gray-300">Loading analytics data...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-500 bg-opacity-20 text-red-400 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Interactive Knowledge Graph - Full Width */}
        {!isLoading && !error && (
          <div className="mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Interactive Knowledge Graph</h2>
              <div className="h-[600px] w-full">
                <InteractiveKnowledgeGraph data={searchData} />
              </div>
            </div>
          </div>
        )}
        
        {/* Trend Visualization Section */}
        {!isLoading && !error && (
          <div className="mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Search Trend Analysis</h2>
              <EnhancedTrendVisualization data={searchData} timeframe={selectedTimeframe} />
            </div>
          </div>
        )}
      </AppLayout>
    </>
  );
}
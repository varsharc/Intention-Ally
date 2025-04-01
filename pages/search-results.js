import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import KnowledgeGraph from '../components/Graph/KnowledgeGraph';
import { ResultsList, ResultSummary } from '../components/Results/ResultComponents';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { Loader, AlertCircle } from 'lucide-react';

const SearchResultsPage = () => {
  const router = useRouter();
  const { configId } = router.query;
  const { user, loading: authLoading } = useAuth();
  const { getDocument, getDocuments } = useFirestore();
  
  const [searchConfig, setSearchConfig] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch search configuration
  useEffect(() => {
    const fetchSearchConfig = async () => {
      if (!configId || authLoading) return;
      
      try {
        setLoading(true);
        const config = await getDocument('searchConfigs', configId);
        
        if (!config) {
          setError('Search configuration not found');
          setLoading(false);
          return;
        }
        
        if (config.userId !== user?.uid) {
          setError('You do not have permission to view this search configuration');
          setLoading(false);
          return;
        }
        
        setSearchConfig(config);
        
        // Fetch search results
        const results = await getDocuments(
          'searchResults', 
          'configId', 
          '==', 
          configId
        );
        
        setSearchResults(results);
        
        // Convert to graph data format
        const graphData = convertToGraphData(results, config);
        setGraphData(graphData);
        
      } catch (err) {
        console.error('Error fetching search data:', err);
        setError('Failed to load search data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && configId) {
      fetchSearchConfig();
    }
  }, [configId, user, authLoading, getDocument, getDocuments]);
  
  // Convert search results to graph data format
  const convertToGraphData = (results, config) => {
    // Group nodes by cluster
    const clusterMap = {};
    results.forEach(result => {
      if (result.cluster) {
        if (!clusterMap[result.cluster]) {
          clusterMap[result.cluster] = {
            id: result.cluster,
            label: result.clusterLabel || `Cluster ${result.cluster}`,
            description: "",
            node_count: 0
          };
        }
        clusterMap[result.cluster].node_count++;
      }
    });
    
    // Create nodes and edges
    const nodes = results.map(result => ({
      id: result.id,
      title: result.title,
      url: result.url,
      cluster: result.cluster,
      authority: result.authorityScore,
      x: result.x || Math.random() * 500,
      y: result.y || Math.random() * 500,
      date: result.discoveredAt?.toDate()?.toISOString() || new Date().toISOString(),
      source_type: result.sourceType || 'unknown'
    }));
    
    // Generate edges based on similarity or explicit connections
    const edges = [];
    
    // If the results have explicit connections, use those
    if (results.some(r => r.connections && r.connections.length > 0)) {
      results.forEach(result => {
        if (result.connections && result.connections.length > 0) {
          result.connections.forEach(conn => {
            edges.push({
              source: result.id,
              target: conn.targetId,
              weight: conn.similarity || 0.5
            });
          });
        }
      });
    } else {
      // Otherwise generate edges based on cluster membership
      // Connect nodes within the same cluster
      const clusterNodes = {};
      nodes.forEach(node => {
        if (node.cluster) {
          if (!clusterNodes[node.cluster]) {
            clusterNodes[node.cluster] = [];
          }
          clusterNodes[node.cluster].push(node);
        }
      });
      
      // Create edges within clusters
      Object.values(clusterNodes).forEach(nodeGroup => {
        for (let i = 0; i < nodeGroup.length; i++) {
          for (let j = i + 1; j < nodeGroup.length; j++) {
            edges.push({
              source: nodeGroup[i].id,
              target: nodeGroup[j].id,
              weight: 0.7 // Default weight for cluster members
            });
          }
        }
      });
    }
    
    return {
      nodes,
      edges,
      clusters: Object.values(clusterMap)
    };
  };
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);
  
  if (!user) {
    return null;
  }
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
          <Loader className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading search results...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md mt-4"
            onClick={() => router.push('/search-config')}
          >
            Return to Search Topics
          </button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            {searchConfig ? searchConfig.name : 'Search Results'}
          </h1>
          {searchConfig && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchConfig.keywords.map((keyword, index) => (
                <span key={index} className="bg-gray-700 text-sm text-gray-300 px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <ResultSummary 
          config={searchConfig}
          results={searchResults}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
            <KnowledgeGraph 
              data={graphData}
              title={`Knowledge Graph: ${searchConfig?.name || ""}`}
            />
          </div>
          <div className="lg:col-span-1">
            <ResultsList 
              results={searchResults}
              config={searchConfig}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResultsPage;
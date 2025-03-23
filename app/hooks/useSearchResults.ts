'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { searchResultService } from '@/lib/firestoreService';
import { executeSearch, executeDeepSearch, generateSummary } from '@/lib/searchService';
import { SearchResult, ResultCluster } from '@/types/database.types';

export function useSearchResults(configId: string | null) {
  const { user } = useAuth();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [clusters, setClusters] = useState<ResultCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load existing results when component mounts
  useEffect(() => {
    async function fetchResults() {
      if (!user || !configId) {
        setResults([]);
        setClusters([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load results from database
        const searchResults = await searchResultService.getResultsForConfig(configId);
        setResults(searchResults);
        
        // Find all cluster IDs from the results
        const clusterIds = new Set<string>();
        searchResults.forEach(result => {
          if (result.metadata.cluster) {
            clusterIds.add(result.metadata.cluster as string);
          }
        });
        
        // For now, we'll just set empty clusters as this requires
        // another implementation to fetch clusters
        setClusters([]);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching search results:', err);
        setError(err.message || 'Failed to load search results');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [user, configId]);

  // Function to execute a new search
  const runSearch = async (useCache = true) => {
    if (!user || !configId) {
      throw new Error('You must be logged in and have a valid configuration to search');
    }

    try {
      setSearching(true);
      setError(null);
      
      // Execute search
      const { results: newResults, clusters: newClusters } = await executeSearch(
        configId,
        user.uid,
        useCache
      );
      
      // Update state with new results
      setResults(prevResults => {
        // Merge existing and new results, removing duplicates by URL
        const urlMap = new Map<string, SearchResult>();
        
        // Add existing results to map
        prevResults.forEach(result => {
          urlMap.set(result.url, result);
        });
        
        // Add or update with new results
        newResults.forEach(result => {
          urlMap.set(result.url, result);
        });
        
        // Convert map back to array and sort by discovery date (newest first)
        return Array.from(urlMap.values())
          .sort((a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime());
      });
      
      // Update clusters
      setClusters(newClusters);
      
      return newResults;
    } catch (err: any) {
      console.error('Error executing search:', err);
      setError(err.message || 'Failed to execute search');
      throw err;
    } finally {
      setSearching(false);
    }
  };

  // Function to execute a deep search with Claude
  const runDeepSearch = async () => {
    if (!user || !configId) {
      throw new Error('You must be logged in and have a valid configuration to search');
    }

    try {
      setSearching(true);
      setError(null);
      
      // Execute deep search
      const researchResults = await executeDeepSearch(configId, user.uid);
      
      // Reload results to get the newly added items
      const updatedResults = await searchResultService.getResultsForConfig(configId);
      setResults(updatedResults);
      
      return researchResults;
    } catch (err: any) {
      console.error('Error executing deep search:', err);
      setError(err.message || 'Failed to execute deep search');
      throw err;
    } finally {
      setSearching(false);
    }
  };

  // Function to generate a summary of the search results
  const createSummary = async () => {
    if (!user || !configId) {
      throw new Error('You must be logged in and have a valid configuration to generate a summary');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Generate summary
      const newSummary = await generateSummary(configId, user.uid);
      setSummary(newSummary);
      
      return newSummary;
    } catch (err: any) {
      console.error('Error generating summary:', err);
      setError(err.message || 'Failed to generate summary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filterByAuthority = (minAuthority: number) => {
    return results.filter(result => result.authorityScore >= minAuthority);
  };

  const filterByCluster = (clusterId: string | null) => {
    if (!clusterId) return results;
    return results.filter(result => result.metadata.cluster === clusterId);
  };

  const filterBySourceType = (sourceType: string | null) => {
    if (!sourceType) return results;
    return results.filter(result => result.metadata.sourceType === sourceType);
  };

  const filterByDateRange = (startDate: Date, endDate: Date) => {
    return results.filter(result => {
      const date = result.discoveredAt;
      return date >= startDate && date <= endDate;
    });
  };

  return {
    results,
    clusters,
    loading,
    searching,
    summary,
    error,
    runSearch,
    runDeepSearch,
    createSummary,
    filterByAuthority,
    filterByCluster,
    filterBySourceType,
    filterByDateRange,
  };
}
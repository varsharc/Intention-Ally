// lib/searchService.ts
import { v4 as uuidv4 } from 'uuid';
import { tavilyClient, calculateAuthorityScore } from './tavily';
import { claudeClient } from './claude';
import { 
  searchConfigService, 
  searchResultService, 
  clusterService,
  usageLogService 
} from './firestoreService';
import { 
  SearchConfig, 
  SearchResult, 
  ResultCluster 
} from '@/types/database.types';

// Cache for storing search results (in-memory, will reset on server restart)
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Generate a cache key based on search parameters
function getCacheKey(configId: string, params: any): string {
  return `${configId}:${JSON.stringify(params)}`;
}

// Check if a cached value is still valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

// Execute a search based on a search configuration
export async function executeSearch(
  configId: string, 
  userId: string,
  useCache = true
): Promise<{ results: SearchResult[]; clusters: ResultCluster[] }> {
  try {
    // Get the search configuration
    const config = await searchConfigService.getSearchConfig(configId);
    if (!config) {
      throw new Error(`Search configuration with ID ${configId} not found`);
    }
    
    // Verify ownership
    if (config.userId !== userId) {
      throw new Error('Unauthorized access to search configuration');
    }
    
    // Check cache
    const cacheKey = getCacheKey(configId, { timestamp: new Date().toISOString().split('T')[0] });
    if (useCache && searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey)!;
      if (isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }
    
    // Log usage
    await usageLogService.logUsage({
      userId,
      service: 'tavily',
      action: 'executeSearch',
      resourcesConsumed: {
        apiCalls: 1
      }
    });
    
    // Execute search using Tavily
    const queryString = config.keywords.join(' ');
    const tavilyResponse = await tavilyClient.enhancedSearch(
      queryString,
      config.templateType,
      config.authorityThreshold,
      {
        include_domains: config.advancedParams.trustedDomains,
        exclude_domains: config.advancedParams.excludedDomains
      }
    );
    
    // Process results
    const processedResults: SearchResult[] = [];
    
    for (const result of tavilyResponse.results) {
      // Calculate authority score
      const authorityScore = calculateAuthorityScore(result);
      
      // Skip results below the authority threshold
      if (authorityScore < config.authorityThreshold) {
        continue;
      }
      
      // Create search result object
      const searchResult: Omit<SearchResult, 'id'> = {
        configId,
        title: result.title,
        url: result.url,
        snippet: result.content,
        sourceDomain: result.domain,
        authorityScore,
        discoveredAt: new Date(),
        metadata: {
          sourceType: determineSourceType(result.domain),
          publicationDate: result.published_date ? new Date(result.published_date) : undefined
        }
      };
      
      processedResults.push(searchResult as SearchResult);
    }
    
    // Save results to database
    const resultIds = await searchResultService.addMultipleSearchResults(
      processedResults.map(({ id, ...result }) => result)
    );
    
    // Assign IDs to processed results
    resultIds.forEach((id, index) => {
      processedResults[index].id = id;
    });
    
    // Perform clustering if we have enough results
    let clusters: ResultCluster[] = [];
    if (processedResults.length >= 3) {
      clusters = await clusterResults(processedResults);
    }
    
    // Cache the results
    const result = { results: processedResults, clusters };
    searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error executing search:', error);
    throw error;
  }
}

// Execute a deep search using Claude if requested
export async function executeDeepSearch(
  configId: string,
  userId: string
): Promise<string> {
  try {
    // Get the search configuration
    const config = await searchConfigService.getSearchConfig(configId);
    if (!config) {
      throw new Error(`Search configuration with ID ${configId} not found`);
    }
    
    // Verify ownership
    if (config.userId !== userId) {
      throw new Error('Unauthorized access to search configuration');
    }
    
    // Check if deep search is enabled
    if (!config.advancedParams.useDeepSearch) {
      throw new Error('Deep search is not enabled for this configuration');
    }
    
    // Log usage
    await usageLogService.logUsage({
      userId,
      service: 'claude',
      action: 'executeDeepSearch',
      resourcesConsumed: {
        apiCalls: 1,
        tokensUsed: 2000 // Approximate
      }
    });
    
    // Execute research using Claude
    const queryString = config.keywords.join(' ');
    const research = await claudeClient.researchTopic(
      queryString,
      config.templateType,
      {
        recencyWindow: config.advancedParams.recencyWindow || '30 days',
        keywords: config.keywords
      }
    );
    
    // Parse research results
    const parsedResults = claudeClient.parseResearchResults(research);
    
    // Process results and save to database
    const processedResults: Omit<SearchResult, 'id'>[] = [];
    
    for (const result of parsedResults) {
      // Create search result object
      const searchResult: Omit<SearchResult, 'id'> = {
        configId,
        title: result.title,
        url: result.url,
        snippet: result.insights.join('\n'),
        sourceDomain: new URL(result.url).hostname,
        authorityScore: 85, // Claude tends to find high-quality sources
        discoveredAt: new Date(),
        metadata: {
          sourceType: 'claude_research',
          publicationDate: new Date(result.date),
          insights: result.insights
        }
      };
      
      processedResults.push(searchResult);
    }
    
    // Save results to database
    await searchResultService.addMultipleSearchResults(processedResults);
    
    return research;
  } catch (error) {
    console.error('Error executing deep search:', error);
    throw error;
  }
}

// Generate a summary for a set of search results
export async function generateSummary(
  configId: string,
  userId: string
): Promise<string> {
  try {
    // Get the search configuration
    const config = await searchConfigService.getSearchConfig(configId);
    if (!config) {
      throw new Error(`Search configuration with ID ${configId} not found`);
    }
    
    // Verify ownership
    if (config.userId !== userId) {
      throw new Error('Unauthorized access to search configuration');
    }
    
    // Get search results
    const results = await searchResultService.getResultsForConfig(configId, {
      minAuthority: 60,
      limit: 10,
      sortBy: 'authorityScore',
      sortDirection: 'desc'
    });
    
    if (results.length === 0) {
      return "Not enough high-quality results to generate a summary.";
    }
    
    // Log usage
    await usageLogService.logUsage({
      userId,
      service: 'claude',
      action: 'generateSummary',
      resourcesConsumed: {
        apiCalls: 1,
        tokensUsed: 1500 // Approximate
      }
    });
    
    // Format results for Claude
    const sources = results.map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet || ''
    }));
    
    // Generate summary
    const topic = config.name;
    const summary = await claudeClient.generateSummary(topic, sources);
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

// Simple clustering algorithm based on source type and domain
async function clusterResults(results: SearchResult[]): Promise<ResultCluster[]> {
  try {
    // Group results by source type
    const groupedByType = results.reduce((groups, result) => {
      const sourceType = result.metadata.sourceType || 'unknown';
      if (!groups[sourceType]) {
        groups[sourceType] = [];
      }
      groups[sourceType].push(result);
      return groups;
    }, {} as Record<string, SearchResult[]>);
    
    // Create clusters for each source type
    const clusters: ResultCluster[] = [];
    
    for (const [sourceType, typeResults] of Object.entries(groupedByType)) {
      // Skip if too few results of this type
      if (typeResults.length < 2) {
        continue;
      }
      
      // Create a cluster for this source type
      const cluster: Omit<ResultCluster, 'id'> = {
        name: formatClusterName(sourceType),
        description: `Sources classified as ${sourceType}`,
        createdAt: new Date(),
        memberships: {}
      };
      
      // Add all results to the cluster with a similarity score of 1
      typeResults.forEach(result => {
        cluster.memberships[result.id] = { similarityScore: 1 };
      });
      
      // Save cluster to database
      const clusterId = await clusterService.createCluster(cluster);
      
      // Update results with cluster ID
      for (const result of typeResults) {
        await searchResultService.updateSearchResult(result.id, {
          metadata: {
            ...result.metadata,
            cluster: clusterId
          }
        });
      }
      
      // Add ID to cluster and add to results
      clusters.push({ id: clusterId, ...cluster } as ResultCluster);
    }
    
    return clusters;
  } catch (error) {
    console.error('Error clustering results:', error);
    throw error;
  }
}

// Helper function to determine source type from domain
function determineSourceType(domain: string): string {
  domain = domain.toLowerCase();
  
  if (domain.endsWith('.gov')) {
    return 'government';
  } else if (domain.endsWith('.edu')) {
    return 'academic';
  } else if (domain.endsWith('.org')) {
    return 'organization';
  } else if (
    domain.includes('news') || 
    domain.includes('times') || 
    domain.includes('post') ||
    domain.includes('tribune') ||
    domain.includes('guardian') ||
    domain.includes('bbc') ||
    domain.includes('cnn') ||
    domain.includes('nytimes')
  ) {
    return 'news';
  } else if (
    domain.includes('github') || 
    domain.includes('stackoverflow') ||
    domain.includes('dev.to') ||
    domain.includes('medium')
  ) {
    return 'technology';
  }
  
  return 'commercial';
}

// Format cluster name for better readability
function formatClusterName(sourceType: string): string {
  // Capitalize first letter and replace underscores with spaces
  return sourceType.charAt(0).toUpperCase() + 
    sourceType.slice(1).replace(/_/g, ' ');
}
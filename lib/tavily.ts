// lib/tavily.ts
import axios from 'axios';

interface TavilySearchParams {
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_domains?: string[];
  exclude_domains?: string[];
  max_results?: number;
  include_raw_content?: boolean;
  include_images?: boolean;
  include_answer?: boolean;
  topic?: 'general' | 'news';
}

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  domain: string;
  published_date?: string;
  raw_content?: string;
  images?: string[];
}

interface TavilyResponse {
  results: TavilySearchResult[];
  answer?: string;
  query: string;
  search_depth: string;
  max_results: number;
}

export class TavilyClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.tavily.com/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async search(params: TavilySearchParams): Promise<TavilyResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/search`,
        {
          api_key: this.apiKey,
          ...params
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Tavily search error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error performing search');
    }
  }
  
  // Helper method to enhance search with template-specific parameters
  async enhancedSearch(
    query: string, 
    templateType: string,
    authorityThreshold: number,
    additionalParams: Partial<TavilySearchParams> = {}
  ): Promise<TavilyResponse> {
    // Configure search depth based on authority threshold
    const searchDepth = authorityThreshold > 80 ? 'advanced' : 'basic';
    
    // Apply template-specific configurations
    let templateParams: Partial<TavilySearchParams> = {};
    
    switch (templateType) {
      case 'regulatory':
        templateParams = {
          include_domains: [
            '.gov', 
            '.org', 
            'legislation.gov',
            'regulations.gov',
            'eur-lex.europa.eu'
          ],
          topic: 'general'
        };
        break;
        
      case 'academic':
        templateParams = {
          include_domains: [
            '.edu', 
            'scholar.google.com',
            'ncbi.nlm.nih.gov',
            'researchgate.net',
            'academia.edu'
          ],
          topic: 'general'
        };
        break;
        
      case 'technology':
        templateParams = {
          include_domains: [
            'github.com',
            'stackoverflow.com',
            'ieee.org',
            'techcrunch.com',
            'wired.com'
          ],
          topic: 'general'
        };
        break;
        
      case 'market':
        templateParams = {
          include_domains: [], // No specific domains for market research
          topic: 'news'
        };
        break;
        
      default:
        templateParams = {
          topic: 'general'
        };
    }
    
    // Set max results based on authority threshold
    // Higher threshold = fewer, higher quality results
    const maxResults = Math.max(5, Math.round(20 - (authorityThreshold / 10)));
    
    // Merge all parameters, with additionalParams taking precedence
    const searchParams: TavilySearchParams = {
      query,
      search_depth: searchDepth,
      max_results: maxResults,
      ...templateParams,
      ...additionalParams
    };
    
    // Remove any duplicate domains if both include_domains exist in templateParams and additionalParams
    if (searchParams.include_domains && additionalParams.include_domains) {
      searchParams.include_domains = [...new Set([...searchParams.include_domains, ...additionalParams.include_domains])];
    }
    
    return this.search(searchParams);
  }
  
  // Static factory method to create client from environment variable
  static fromEnv(): TavilyClient {
    const apiKey = process.env.NEXT_PUBLIC_TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('Tavily API key not found in environment variables');
    }
    return new TavilyClient(apiKey);
  }
}

// Export an instance for convenience
export const tavilyClient = (() => {
  // We use a function to defer initialization until the API key is available
  // This is especially important in SSR contexts
  try {
    return TavilyClient.fromEnv();
  } catch (error) {
    console.warn('Failed to initialize Tavily client:', error);
    // Return a dummy client that will throw errors when used
    return new TavilyClient('dummy_key');
  }
})();

// Calculate authority score for a search result
export function calculateAuthorityScore(result: TavilySearchResult): number {
  let score = 0;
  const domain = result.domain.toLowerCase();
  
  // Domain-based scoring (40 points max)
  if (domain.endsWith('.gov')) {
    score += 40;
  } else if (domain.endsWith('.edu')) {
    score += 38;
  } else if (domain.endsWith('.org')) {
    score += 30;
  } else if (domain.endsWith('.com')) {
    score += 20;
  } else {
    score += 15;
  }
  
  // Content quality (30 points max)
  const contentLength = result.content.length;
  if (contentLength > 5000) {
    score += 30;
  } else if (contentLength > 2000) {
    score += 25;
  } else if (contentLength > 1000) {
    score += 20;
  } else if (contentLength > 500) {
    score += 15;
  } else {
    score += 10;
  }
  
  // Relevance score from Tavily (30 points max)
  score += Math.min(result.score * 30, 30);
  
  return Math.min(Math.round(score), 100);
}
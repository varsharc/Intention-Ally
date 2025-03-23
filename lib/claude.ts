// lib/claude.ts
import axios from 'axios';

interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClaudeCompletionParams {
  model: string;
  messages: ClaudeMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
}

interface ClaudeCompletionResponse {
  id: string;
  type: string;
  role: string;
  content: {
    type: string;
    text: string;
  }[];
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1';
  private defaultModel: string = 'claude-3-7-sonnet-20250219';
  
  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    if (model) {
      this.defaultModel = model;
    }
  }
  
  async complete(params: Omit<ClaudeCompletionParams, 'model'> & { model?: string }): Promise<ClaudeCompletionResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: params.model || this.defaultModel,
          ...params
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Claude API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Error calling Claude API');
    }
  }
  
  // Method for deep research on a topic
  async researchTopic(
    query: string,
    templateType: string,
    params: {
      recencyWindow?: string;
      keywords?: string[];
    } = {}
  ): Promise<string> {
    const recencyWindow = params.recencyWindow || '30 days';
    const keywords = params.keywords || [];
    
    const prompt = `
    I need comprehensive research on the following topic:
    
    TOPIC: ${query}
    
    Requirements:
    1. Focus on ${templateType} sources with high credibility
    2. Prioritize information from the past ${recencyWindow}
    3. For each finding, include:
       - Source (URL)
       - Publication date
       - Key insights
       - Relevance to the topic
    
    ${keywords.length > 0 ? `Search specifically for information related to: ${keywords.join(', ')}` : ''}
    
    Format your findings as:
    [SOURCE TITLE](URL) - DATE
    * Key insight 1
    * Key insight 2
    
    Please ensure all sources are reputable and relevant.
    `;
    
    const response = await this.complete({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4000
    });
    
    return response.content[0].text;
  }
  
  // Method to generate a summary from multiple sources
  async generateSummary(
    topic: string,
    sources: Array<{ title: string, url: string, snippet: string }>
  ): Promise<string> {
    const sourceText = sources.map(source => 
      `Source: ${source.title}\nURL: ${source.url}\nExcerpt: ${source.snippet}\n`
    ).join('\n');
    
    const prompt = `
    Based on the following sources related to ${topic}, provide:
    
    1. A concise summary of the key findings (3-5 sentences)
    2. The main trends or patterns across these sources
    3. Any significant contrasting viewpoints
    
    Sources:
    ${sourceText}
    
    Focus on extracting the most important insights relevant to the topic.
    `;
    
    const response = await this.complete({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    return response.content[0].text;
  }
  
  // Parse Claude's research results into structured data
  parseResearchResults(response: string): Array<{
    title: string;
    url: string;
    date: string;
    insights: string[];
  }> {
    const results = [];
    const sourcePattern = /\[(.*?)\]\((https?:\/\/.*?)\) - (.*?)$/;
    
    const lines = response.split('\n');
    let currentSource = null;
    let insights = [];
    
    for (const line of lines) {
      const sourceMatch = line.match(sourcePattern);
      if (sourceMatch) {
        // Save previous source if exists
        if (currentSource) {
          results.push({
            ...currentSource,
            insights
          });
          insights = [];
        }
        
        // Start new source
        const [, title, url, date] = sourceMatch;
        currentSource = {
          title,
          url,
          date
        };
      } else if (line.trim().startsWith('*') && currentSource) {
        insights.push(line.trim().slice(2));
      }
    }
    
    // Add the last source
    if (currentSource) {
      results.push({
        ...currentSource,
        insights
      });
    }
    
    return results;
  }
  
  // Static factory method to create client from environment variable
  static fromEnv(): ClaudeClient {
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not found in environment variables');
    }
    return new ClaudeClient(apiKey);
  }
}

// Export an instance for convenience
export const claudeClient = (() => {
  try {
    return ClaudeClient.fromEnv();
  } catch (error) {
    console.warn('Failed to initialize Claude client:', error);
    // Return a dummy client that will throw errors when used
    // This allows the app to start even if the API key is missing
    return new ClaudeClient('dummy_key');
  }
})();
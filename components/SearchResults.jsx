import React, { useState } from 'react';
import { List, Grid, ExternalLink, Star, Info, ArrowUpRight, Tag, Copy, BookOpen } from 'lucide-react';

/**
 * SearchResults component with grid/list view toggle and advanced filtering
 */
const SearchResults = ({ selectedKeyword, results: propResults }) => {
  const [view, setView] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'date', 'source'
  const [showFilters, setShowFilters] = useState(false);
  
  // Use sample results if none provided
  const results = propResults || [
    {
      id: 1,
      title: "What is Carbon Insetting? Greener Logistics Starts Here",
      url: "https://sustainablelogistics.com/carbon-insetting",
      description: "Carbon insetting is the practice of making investments in sustainable practices directly within a company's own supply chain...",
      date: "2025-03-20T15:32:00Z",
      source: "Sustainable Logistics",
      sourceType: "industry",
      relevanceScore: 95,
      sentiment: "positive"
    },
    {
      id: 2,
      title: "Carbon Insetting vs Offsetting: The Key Differences Explained",
      url: "https://climateaction.org/insights/insetting-vs-offsetting",
      description: "While carbon offsetting focuses on compensating for emissions by funding external projects, carbon insetting aims to reduce emissions directly within your value chain...",
      date: "2025-03-15T09:15:00Z",
      source: "Climate Action",
      sourceType: "nonprofit",
      relevanceScore: 90,
      sentiment: "neutral"
    },
    {
      id: 3,
      title: "Implementing Carbon Insetting in Logistics Networks",
      url: "https://logisticsweekly.com/carbon-strategies",
      description: "Organizations are increasingly turning to carbon insetting as a strategy to reduce emissions throughout their logistics and supply chain operations...",
      date: "2025-02-28T12:45:00Z",
      source: "Logistics Weekly",
      sourceType: "news",
      relevanceScore: 88,
      sentiment: "positive"
    },
    {
      id: 4,
      title: "The Business Case for Carbon Insetting: ROI Analysis",
      url: "https://sustainabilitymagazine.com/carbon-insetting-roi",
      description: "New research shows that companies implementing carbon insetting programs are seeing an average return on investment of 22% over five years...",
      date: "2025-03-10T14:20:00Z",
      source: "Sustainability Magazine",
      sourceType: "academic",
      relevanceScore: 85,
      sentiment: "positive"
    },
    {
      id: 5,
      title: "Critical Review: Are Carbon Insetting Programs Effective?",
      url: "https://environmentalscience.org/climate/insetting-effectiveness",
      description: "A critical examination of carbon insetting initiatives reveals mixed results across different industry sectors, with some companies achieving significant reductions while others struggle...",
      date: "2025-03-05T10:30:00Z",
      source: "Environmental Science",
      sourceType: "academic",
      relevanceScore: 82,
      sentiment: "negative"
    }
  ];
  
  // Sort results based on current sortBy value
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'relevance') {
      return b.relevanceScore - a.relevanceScore;
    } else if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'source') {
      return a.source.localeCompare(b.source);
    }
    return 0;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get sentiment badge color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500 bg-opacity-20 text-green-500';
      case 'negative':
        return 'bg-red-500 bg-opacity-20 text-red-500';
      case 'neutral':
      default:
        return 'bg-blue-500 bg-opacity-20 text-blue-500';
    }
  };
  
  // Get source type icon
  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case 'academic':
        return <BookOpen size={14} className="mr-1" />;
      case 'news':
        return <Copy size={14} className="mr-1" />;
      case 'nonprofit':
        return <Info size={14} className="mr-1" />;
      case 'industry':
      default:
        return <Tag size={14} className="mr-1" />;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {selectedKeyword ? (
              <>Search Results for "{selectedKeyword}"</>
            ) : (
              <>Recent Search Results</>
            )}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Found {results.length} results
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="bg-gray-700 rounded-md flex">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-l-md ${view === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-r-md ${view === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>
          
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="date">Sort: Date</option>
            <option value="source">Sort: Source</option>
          </select>
          
          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              showFilters 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Filters
          </button>
        </div>
      </div>
      
      {/* Filter bar */}
      {showFilters && (
        <div className="bg-gray-700 p-3 rounded-md mb-4 flex flex-wrap gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date Range</label>
            <select className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-sm">
              <option>All time</option>
              <option>Last week</option>
              <option>Last month</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Source Type</label>
            <select className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-sm">
              <option>All sources</option>
              <option>Academic</option>
              <option>News</option>
              <option>Industry</option>
              <option>Nonprofit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sentiment</label>
            <select className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-sm">
              <option>All</option>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
          </div>
          
          <div className="self-end">
            <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm">Apply</button>
          </div>
        </div>
      )}
      
      {/* Grid or List view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedResults.map(result => (
            <div
              key={result.id}
              className="bg-gray-900 p-4 rounded-md border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium flex items-center text-gray-400">
                  {getSourceIcon(result.sourceType)}
                  {result.source}
                </span>
                <span className="text-xs text-gray-500">{formatDate(result.date)}</span>
              </div>
              
              <h3 className="text-yellow-500 font-medium mb-2 line-clamp-2">{result.title}</h3>
              
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">{result.description}</p>
              
              <div className="flex justify-between items-center">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-blue-400 hover:text-blue-300"
                >
                  Visit <ArrowUpRight size={12} className="ml-1" />
                </a>
                
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(result.sentiment)}`}>
                    {result.sentiment}
                  </span>
                  <button className="text-gray-400 hover:text-yellow-500">
                    <Star size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedResults.map(result => (
            <div
              key={result.id}
              className="bg-gray-900 p-4 rounded-md border-l-4 border-yellow-500"
            >
              <div className="flex flex-wrap justify-between items-start mb-1">
                <h3 className="text-yellow-500 font-medium mr-2 mb-1">{result.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(result.sentiment)}`}>
                    {result.sentiment}
                  </span>
                  <button className="text-gray-400 hover:text-yellow-500">
                    <Star size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                <div className="flex items-center">
                  {getSourceIcon(result.sourceType)}
                  {result.source}
                </div>
                <span>{formatDate(result.date)}</span>
              </div>
              
              <p className="text-gray-300 text-sm mb-2">{result.description}</p>
              
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                {result.url.replace(/^https?:\/\//, '').split('/')[0]}
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      )}
      
      {results.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-400">No results found.</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
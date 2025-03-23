import React from 'react';
import { Globe, Clock, Calendar, ExternalLink, Bookmark, Share2 } from 'lucide-react';

const SearchResults = ({ selectedKeyword, results = [] }) => {
  // Sample data for demonstration
  const demoResults = [
    {
      title: "What is Carbon Insetting? Greener Logistics Starts Here",
      url: "https://sustainablelogistics.com/carbon-insetting",
      domain: "sustainablelogistics.com",
      description: "Carbon insetting is the practice of investing in supply chain sustainability projects that benefit your business directly while reducing greenhouse gas emissions.",
      date: "2024-02-10",
      relevanceScore: 0.92,
      cluster: "definition"
    },
    {
      title: "Carbon Insetting vs. Carbon Offsetting: Key Differences",
      url: "https://climateaction.org/insetting-vs-offsetting",
      domain: "climateaction.org",
      description: "Unlike carbon offsetting which funds external projects, carbon insetting directly addresses emissions within your own value chain and offers multiple co-benefits.",
      date: "2024-01-15",
      relevanceScore: 0.87,
      cluster: "comparison"
    },
    {
      title: "How Major Corporations Are Implementing Carbon Insetting",
      url: "https://corporatesustainability.com/insetting-case-studies",
      domain: "corporatesustainability.com",
      description: "Leading companies like Nestlé, L'Oréal, and Ben & Jerry's have implemented carbon insetting programs to reduce emissions in their supply chains while improving resilience.",
      date: "2023-11-22",
      relevanceScore: 0.82,
      cluster: "case studies"
    },
    {
      title: "The Business Case for Carbon Insetting: ROI and Benefits",
      url: "https://hbr.org/carbon-insetting-benefits",
      domain: "hbr.org",
      description: "Research shows that carbon insetting projects deliver an average 3.5x return on investment through reduced costs, improved supply security, and stronger stakeholder relationships.",
      date: "2023-09-05",
      relevanceScore: 0.78,
      cluster: "business impact"
    }
  ];
  
  // Use provided results or fall back to demo data
  const displayResults = results.length > 0 ? results : demoResults;
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          {selectedKeyword ? `Results for "${selectedKeyword}"` : 'Recent Search Results'}
        </h2>
        
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center text-gray-400">
            <Calendar size={14} className="mr-1" />
            <select className="bg-transparent border-none focus:outline-none">
              <option>Any time</option>
              <option>Past week</option>
              <option>Past month</option>
              <option>Past year</option>
            </select>
          </div>
          
          <div className="flex items-center text-gray-400">
            <Globe size={14} className="mr-1" />
            <select className="bg-transparent border-none focus:outline-none">
              <option>All sources</option>
              <option>Academic</option>
              <option>News</option>
              <option>Corporate</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayResults.map((result, index) => (
          <div key={index} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-white mb-1 flex-1">
                {result.title}
              </h3>
              <div className="flex space-x-1 text-gray-400">
                <button className="p-1 hover:text-white" title="Bookmark">
                  <Bookmark size={16} />
                </button>
                <button className="p-1 hover:text-white" title="Share">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="mr-3">{result.domain}</span>
              <span className="flex items-center mr-3">
                <Clock size={14} className="mr-1" />
                {result.date ? formatDate(result.date) : 'Unknown date'}
              </span>
              {result.cluster && (
                <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                  {result.cluster}
                </span>
              )}
              {result.relevanceScore && (
                <span className="ml-auto text-xs">
                  Relevance: {Math.round(result.relevanceScore * 100)}%
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mb-2">{result.description}</p>
            
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center"
            >
              View Source <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <span>{displayResults.length} results</span>
        
        <div className="flex space-x-1">
          <button className="px-3 py-1 bg-gray-700 rounded-md">Previous</button>
          <button className="px-3 py-1 bg-yellow-500 text-black rounded-md">1</button>
          <button className="px-3 py-1 bg-gray-700 rounded-md">2</button>
          <button className="px-3 py-1 bg-gray-700 rounded-md">3</button>
          <button className="px-3 py-1 bg-gray-700 rounded-md">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
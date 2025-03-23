import React, { useState } from 'react';
import { ExternalLink, Clock, Tag, Calendar, Globe, RefreshCw, Copy, CheckCheck } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Search Results List component
 * Displays search results with filtering options and result summary
 */
export const SearchResultsList = () => {
  const [resultsView, setResultsView] = useState('list'); // 'list' or 'grid'
  const [copyStatus, setCopyStatus] = useState({});

  // Sample search results data
  const searchResults = [
    {
      id: 1,
      title: "What is Carbon Insetting? Greener Logistics Starts Inside Your Company",
      url: "https://example.com/carbon-insetting-guide",
      description: "Carbon insetting is a direct investment in sustainability projects within your own supply chain. Unlike carbon offsetting, which invests in environmental projects outside your business's value chain, insetting focuses on reducing emissions within your operational ecosystem.",
      date: "2025-03-15",
      domain: "example.com",
      category: "Guide",
      sentiment: "positive"
    },
    {
      id: 2,
      title: "EU Announces New Scope 3 Emissions Tracking Requirements for 2026",
      url: "https://example.com/eu-scope3-requirements",
      description: "The European Union has announced new regulations requiring companies with over 500 employees to track and report all Scope 3 emissions starting January 2026. The directive aims to create transparent supply chain emissions data and accelerate corporate climate action.",
      date: "2025-03-10",
      domain: "example.com",
      category: "News",
      sentiment: "neutral"
    },
    {
      id: 3,
      title: "Sustainable Logistics: 5 Companies Leading the Way in Carbon Reduction",
      url: "https://example.com/sustainable-logistics-leaders",
      description: "These five logistics companies are pioneering innovative approaches to sustainability, from electric vehicle fleets to AI-optimized routing that has reduced their carbon footprint by up to 35% in some corridors. Their case studies provide valuable insights for the industry.",
      date: "2025-03-01",
      domain: "example.com",
      category: "Case Study",
      sentiment: "positive"
    },
    {
      id: 4,
      title: "Carbon Insetting vs. Offsetting: What's the Difference?",
      url: "https://example.com/insetting-vs-offsetting",
      description: "While carbon offsetting involves purchasing credits to fund external environmental projects, carbon insetting directs investments to your own value chain. This article explores the benefits, challenges, and effectiveness of both approaches for logistics companies.",
      date: "2025-02-25",
      domain: "example.com",
      category: "Analysis",
      sentiment: "neutral"
    }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({...copyStatus, [id]: true});
      setTimeout(() => {
        setCopyStatus({...copyStatus, [id]: false});
      }, 2000);
    });
  };

  return (
    <div className={combineStyles(styles.card.base, "mt-6")}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>Search Results</h2>
        
        <div className={styles.utils.flexCenter + " space-x-4"}>
          <div className={styles.utils.flexCenter + " space-x-2"}>
            <button 
              className={combineStyles(
                "px-3 py-1 rounded-md text-sm transition-colors",
                resultsView === 'list' ? 
                  "bg-[#EAB308] text-black" : 
                  "bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]"
              )}
              onClick={() => setResultsView('list')}
            >
              List View
            </button>
            <button
              className={combineStyles(
                "px-3 py-1 rounded-md text-sm transition-colors",
                resultsView === 'grid' ? 
                  "bg-[#EAB308] text-black" : 
                  "bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]"
              )}
              onClick={() => setResultsView('grid')}
            >
              Grid View
            </button>
          </div>
          
          <button className="p-2 bg-[#374151] rounded hover:bg-[#4B5563] transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className={styles.card.body}>
        {/* Result Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Summary Card */}
          <div className="bg-[#1F2937] rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">Key Insights</h3>
            <p className="text-[#D1D5DB] text-sm mb-3">
              Recent discussions on carbon insetting focus on implementation strategies, 
              ROI measurement, and integration with existing sustainability programs. 
              Companies are increasingly viewing insetting as complementary to offsetting rather than a replacement.
            </p>
            <div className={styles.utils.flexBetween + " text-sm text-[#9CA3AF]"}>
              <span>Generated from 16 sources</span>
              <button className="text-[#EAB308] hover:text-[#CA8A04]">Refresh</button>
            </div>
          </div>
          
          {/* Tags Card */}
          <div className="bg-[#1F2937] rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">Related Topics</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {["scope 3 reporting", "supply chain", "ESG metrics", "carbon accounting", "climate targets", "value chain", "sustainability ROI"].map((tag, index) => (
                <div key={index} className="bg-[#374151] text-[#D1D5DB] px-2 py-1 rounded-md text-xs">
                  {tag}
                </div>
              ))}
            </div>
            <div className={styles.utils.flexBetween + " text-sm text-[#9CA3AF]"}>
              <span>Based on frequency analysis</span>
              <button className="text-[#EAB308] hover:text-[#CA8A04]">Expand</button>
            </div>
          </div>
        </div>
        
        {/* Results List */}
        <div className={resultsView === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
          {searchResults.map((result) => (
            <div 
              key={result.id} 
              className="bg-[#1F2937] rounded-lg overflow-hidden hover:bg-[#374151] transition-colors"
            >
              <div className="p-4">
                <div className={styles.utils.flexBetween + " mb-2"}>
                  <div className={combineStyles(
                    styles.badge.default, 
                    result.sentiment === 'positive' ? 'bg-green-500 bg-opacity-20 text-green-400' : 
                    result.sentiment === 'negative' ? 'bg-red-500 bg-opacity-20 text-red-400' : 
                    'bg-gray-500 bg-opacity-20 text-gray-400'
                  )}>
                    {result.category}
                  </div>
                  <button 
                    onClick={() => handleCopy(result.url, result.id)}
                    className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                  >
                    {copyStatus[result.id] ? <CheckCheck size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                
                <h3 className="text-[#F9FAFB] font-medium mb-2 line-clamp-2">
                  {result.title}
                </h3>
                
                <p className="text-[#D1D5DB] text-sm mb-3 line-clamp-3">
                  {result.description}
                </p>
                
                <div className="flex flex-wrap items-center text-xs text-[#9CA3AF] gap-x-4">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[#EAB308] hover:text-[#CA8A04]"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    <span>Visit Source</span>
                  </a>
                  
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>{result.date}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe size={12} className="mr-1" />
                    <span>{result.domain}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.utils.flexCenter + " mt-6"}>
          <button className={styles.button.outline}>View More Results</button>
        </div>
      </div>
    </div>
  );
};
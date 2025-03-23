// Search Results List Component
import React, { useState } from 'react';
import { 
  List, 
  Grid, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Star,
  ArrowUpDown,
  Clock,
  Bookmark
} from 'lucide-react';

// Search Results Summary Component
export const ResultSummary = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h1 className="text-2xl font-bold text-white mb-3">
        Search Results: <span className="text-yellow-500">EU Textile Regulations</span>
      </h1>
      
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
          textile regulation
        </div>
        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
          EU sustainability
        </div>
        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
          carbon textile
        </div>
        <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <Filter size={14} className="mr-1" />
          Add Filter
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-300">
        <div>
          <span className="mr-1 text-gray-400">36 results found</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="text-gray-400">Last updated: </span>
          <span>March 23, 2025 - 12:45 PM</span>
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0">
          <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-l flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Latest First</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 border-l border-gray-600 rounded-r">
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Results List Component
export const ResultsList = () => {
  const [viewMode, setViewMode] = useState('list');
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Results</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-700 rounded">
            <button 
              className={`p-1.5 ${viewMode === 'list' ? 'bg-yellow-500 text-black' : 'text-white hover:bg-gray-600'} rounded-l`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </button>
            <button 
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'text-white hover:bg-gray-600'} rounded-r`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
          </div>
          
          <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded" title="Filter Results">
            <Filter size={16} className="text-white" />
          </button>
          
          <select className="bg-gray-700 text-white text-sm p-1.5 rounded border-none focus:outline-none">
            <option>All Sources</option>
            <option>Academic</option>
            <option>Regulatory</option>
            <option>Industry</option>
            <option>News</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {viewMode === 'list' ? (
          <ListViewResults />
        ) : (
          <GridViewResults />
        )}
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="flex bg-gray-700 rounded text-sm">
          <button className="px-3 py-1 border-r border-gray-600">
            Prev
          </button>
          <button className="px-3 py-1 bg-yellow-500 text-black">
            1
          </button>
          <button className="px-3 py-1 border-l border-gray-600">
            2
          </button>
          <button className="px-3 py-1 border-l border-gray-600">
            3
          </button>
          <button className="px-3 py-1 border-l border-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// List View Component
const ListViewResults = () => {
  return (
    <>
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-white mb-1 flex-1">
            <a href="#" className="hover:text-yellow-400">European Commission Adopts New Textile Strategy for Sustainable Products</a>
          </h3>
          <div className="flex items-center">
            <span className="text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 px-2 py-0.5 rounded mr-1">
              REGULATORY
            </span>
            <button className="text-gray-400 hover:text-white">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">
          The European Commission has adopted a comprehensive strategy to transition the EU textile industry towards sustainability and circularity...
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-400">ec.europa.eu</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-400">Mar 18, 2025</span>
          </div>
          <a href="#" className="text-gray-400 hover:text-white flex items-center">
            <span className="mr-1">Read more</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-white mb-1 flex-1">
            <a href="#" className="hover:text-yellow-400">Research Paper: Carbon Footprint Metrics in Textile Manufacturing</a>
          </h3>
          <div className="flex items-center">
            <span className="text-xs text-blue-500 bg-blue-500 bg-opacity-10 px-2 py-0.5 rounded mr-1">
              ACADEMIC
            </span>
            <button className="text-gray-400 hover:text-white">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">
          This paper presents a comprehensive analysis of carbon footprint measurement methodologies specific to textile manufacturing processes...
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-400">sciencedirect.com</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-400">Mar 15, 2025</span>
          </div>
          <a href="#" className="text-gray-400 hover:text-white flex items-center">
            <span className="mr-1">Read more</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-white mb-1 flex-1">
            <a href="#" className="hover:text-yellow-400">Industry Response to New EU Textile Regulation Requirements</a>
          </h3>
          <div className="flex items-center">
            <span className="text-xs text-purple-500 bg-purple-500 bg-opacity-10 px-2 py-0.5 rounded mr-1">
              INDUSTRY
            </span>
            <button className="text-gray-400 hover:text-white">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">
          European textile industry leaders outlined adaptation strategies at the annual Textile Sustainability Conference in response to the EU's new regulations...
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-400">textilefederation.eu</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-400">Mar 12, 2025</span>
          </div>
          <a href="#" className="text-gray-400 hover:text-white flex items-center">
            <span className="mr-1">Read more</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-white mb-1 flex-1">
            <a href="#" className="hover:text-yellow-400">New Carbon Textile Tracking Technology Launched by Tech Startup</a>
          </h3>
          <div className="flex items-center">
            <span className="text-xs text-green-500 bg-green-500 bg-opacity-10 px-2 py-0.5 rounded mr-1">
              TECHNOLOGY
            </span>
            <button className="text-gray-400 hover:text-white">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">
          TechFabrix introduces a groundbreaking blockchain-based platform for tracking carbon emissions throughout the textile supply chain...
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-400">techcrunch.com</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-400">Mar 10, 2025</span>
          </div>
          <a href="#" className="text-gray-400 hover:text-white flex items-center">
            <span className="mr-1">Read more</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-white mb-1 flex-1">
            <a href="#" className="hover:text-yellow-400">Sustainability in Textile Manufacturing: Compliance Guide 2025</a>
          </h3>
          <div className="flex items-center">
            <span className="text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 px-2 py-0.5 rounded mr-1">
              REGULATORY
            </span>
            <button className="text-white">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">
          Comprehensive guide to meeting the latest EU textile sustainability regulations, including carbon footprint requirements and circularity assessments...
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-400">sustainabletextileguide.org</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-400">Mar 5, 2025</span>
          </div>
          <a href="#" className="text-gray-400 hover:text-white flex items-center">
            <span className="mr-1">Read more</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </>
  );
};

// Grid View Component
const GridViewResults = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 px-2 py-0.5 rounded">
            REGULATORY
          </span>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={14} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">European Commission Adopts New Textile Strategy</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">ec.europa.eu</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 18, 2025</span>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-blue-500 bg-blue-500 bg-opacity-10 px-2 py-0.5 rounded">
            ACADEMIC
          </span>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={14} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">Carbon Footprint Metrics in Textile Manufacturing</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">sciencedirect.com</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 15, 2025</span>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-purple-500 bg-purple-500 bg-opacity-10 px-2 py-0.5 rounded">
            INDUSTRY
          </span>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={14} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">Industry Response to New EU Textile Regulation</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">textilefederation.eu</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 12, 2025</span>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-green-500 bg-green-500 bg-opacity-10 px-2 py-0.5 rounded">
            TECHNOLOGY
          </span>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={14} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">New Carbon Textile Tracking Technology</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">techcrunch.com</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 10, 2025</span>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 px-2 py-0.5 rounded">
            REGULATORY
          </span>
          <button className="text-white">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">Sustainability in Textile Manufacturing Guide</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">sustainabletextileguide.org</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 5, 2025</span>
        </div>
      </div>
      
      <div className="bg-gray-700 hover:bg-gray-650 p-3 rounded flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-500 bg-gray-500 bg-opacity-10 px-2 py-0.5 rounded">
            NEWS
          </span>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={14} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-white mb-auto">
          <a href="#" className="hover:text-yellow-400">Global Implications of EU's Textile Sustainability Rules</a>
        </h3>
        <div className="text-xs mt-2">
          <span className="text-blue-400">reuters.com</span>
          <span className="mx-1 text-gray-500">|</span>
          <span className="text-gray-400">Mar 2, 2025</span>
        </div>
      </div>
    </div>
  );
};
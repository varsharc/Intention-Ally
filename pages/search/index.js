import React from 'react';
import Link from 'next/link';
import { PlusCircle, Tag, Search, RefreshCw, List, BarChart2, Network, ArrowLeft, Home } from 'lucide-react';

// Import the result components
import { ResultsList, ResultSummary } from '../../components/ui-results-list';
import { KnowledgeGraph } from '../../components/ui-knowledge-graph';

// Import layout and UI components
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-black p-4 border-b-2 border-yellow-500 shadow-md">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-bold text-black text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Intention-Ally</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-gray-700 transition-colors border border-gray-700 shadow-md">
              <Home size={16} className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6 bg-gray-900">
        {children}
      </main>
      
      <footer className="bg-black p-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          <p>Intention-Ally © 2025 | Semantic Search & Clustering Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default function SearchPage() {
  // Sample tags for demonstration
  const selectedTags = ['sustainability', 'regulation', 'textile', 'EU policy', 'recycling'];

  return (
    <AppLayout>
      {/* Page Header with current search topic */}
      <div className="bg-gray-950 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 mb-2 flex items-center">
              <Search className="mr-3 text-yellow-500" size={24} />
              EU Textile Regulations
            </h2>
            <p className="text-gray-300">Last updated: March 22, 2025 • 24 sources • 3 clusters discovered</p>
          </div>
          
          <div className="flex space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors shadow-md border border-gray-700">
              <PlusCircle size={18} />
              <span>Add to Favorites</span>
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center space-x-2 font-medium transition-colors shadow-md">
              <RefreshCw size={18} className="mr-1" />
              Update Search
            </button>
          </div>
        </div>

        {/* Selected Keyword Tags Section - Visually distinct area for keywords */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center mb-3">
            <Tag size={16} className="mr-2 text-yellow-500" />
            <h3 className="text-sm font-semibold text-yellow-500 uppercase">Selected Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedTags.map((tag, index) => (
              <span key={index} className="bg-gray-800 text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500 border-opacity-50 shadow-sm">
                {tag}
              </span>
            ))}
            <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors border border-gray-700">
              + Add Tag
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Insights Summary with section heading - Clear visual section for trends */}
      <div className="mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-800">
          <BarChart2 size={20} className="mr-3 text-yellow-500" />
          <h3 className="text-xl font-semibold text-yellow-500">Trend Insights</h3>
        </div>
        <ResultSummary />
      </div>
      
      {/* Main Content - Results and Knowledge Graph with clear visual separation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Results List with section heading */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-gray-800">
            <List size={20} className="mr-3 text-yellow-500" />
            <h3 className="text-xl font-semibold text-yellow-500">Latest Discoveries</h3>
          </div>
          <ResultsList />
        </div>
        
        {/* Knowledge Graph with section heading */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-gray-800">
            <Network size={20} className="mr-3 text-yellow-500" />
            <h3 className="text-xl font-semibold text-yellow-500">Knowledge Graph</h3>
          </div>
          <div className="h-[calc(100vh-380px)]">
            <KnowledgeGraph />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
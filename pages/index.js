import React from 'react';
import { AppLayout } from '../components/ui-layout';
import { ResultsList, ResultSummary } from '../components/ui-results-list';
import { KnowledgeGraph } from '../components/ui-knowledge-graph';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">EU Textile Regulations</h2>
        
        <div className="flex space-x-4">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
            <PlusCircle size={18} />
            <span>Add to Favorites</span>
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md">
            Configure Search
          </button>
        </div>
      </div>
      
      {/* Search Insights Summary */}
      <ResultSummary />
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          {/* Results List */}
          <ResultsList />
        </div>
        
        <div className="h-[calc(100vh-320px)]">
          {/* Knowledge Graph */}
          <KnowledgeGraph />
        </div>
      </div>
    </AppLayout>
  );
}
import React from 'react';

export default function TestPage() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-yellow-500 mb-4">Intention-Ally Test Page</h1>
      <p className="mb-6">This is a simple test page to verify routing is working properly.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">About the Project</h2>
          <p className="text-gray-300">
            Intention-Ally is a semantic search and clustering tool that organizes search results
            by relevance, making it easier to find and track information that matters.
          </p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Features</h2>
          <ul className="list-disc pl-5 text-gray-300">
            <li>Knowledge graph visualization</li>
            <li>Intelligent result clustering</li>
            <li>Trend analysis</li>
            <li>Customizable search parameters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
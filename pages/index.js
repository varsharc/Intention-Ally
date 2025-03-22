import React from 'react';
import Link from 'next/link';
import { Settings, User, Clock, Star, Search, Filter, Analytics, ArrowRight } from 'lucide-react';

// Minimal home page with improved styling
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-black p-4 border-b border-yellow-500 shadow-md">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-bold text-black text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Intention-Ally</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-yellow-500 transition-colors">
              <User size={22} />
            </button>
            <button className="p-2 text-gray-300 hover:text-yellow-500 transition-colors">
              <Settings size={22} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-950 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-800">
            <h2 className="text-2xl font-bold text-yellow-500 mb-3 flex items-center">
              <Search className="mr-3 text-yellow-500" size={24} />
              Intention-Ally Search Interface
            </h2>
            <p className="text-gray-300 text-base">
              Welcome to the Intention-Ally semantic search and clustering tool. This interface allows you to
              explore complex topics with advanced visualization and insight extraction.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-900 p-5 rounded-lg border-2 border-gray-800 shadow-md">
                <h3 className="text-xl font-semibold text-yellow-500 mb-3">Key Features</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    Knowledge Graph Visualization
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    Semantic Clustering
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    Trend Insights
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    Source Discovery
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-5 rounded-lg border-2 border-gray-800 shadow-md">
                <h3 className="text-xl font-semibold text-yellow-500 mb-3">Getting Started</h3>
                <p className="text-gray-300 mb-4">
                  Begin by selecting a search topic or creating a new one to explore relevant content, 
                  visualize connections, and discover insights.
                </p>
                <Link href="/search" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-3 rounded-md transition-colors shadow-lg flex items-center justify-center">
                  <Search size={18} className="mr-2" />
                  View Search Results
                </Link>
              </div>
            </div>
          </div>

          {/* Demo section */}
          <div className="bg-gray-950 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-800">
            <h2 className="text-xl font-bold text-yellow-500 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3 text-black">
                <span>→</span>
              </span>
              Current Active Searches
            </h2>
            
            <div className="space-y-4">
              <Link href="/search" className="block bg-gray-900 p-5 rounded-lg border-2 border-gray-800 hover:border-yellow-500 transition-colors shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-yellow-500">EU Textile Regulations</h3>
                    <p className="text-gray-300 text-sm">24 sources • Last updated: 2 hours ago</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-md">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
              
              <Link href="/search" className="block bg-gray-900 p-5 rounded-lg border-2 border-gray-700 hover:border-yellow-500 transition-colors shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Biodiversity Metrics</h3>
                    <p className="text-gray-400 text-sm">8 sources • Last updated: Yesterday</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 shadow-md">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
              
              <Link href="/search" className="block bg-gray-900 p-5 rounded-lg border-2 border-gray-700 hover:border-yellow-500 transition-colors shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Carbon Insets</h3>
                    <p className="text-gray-400 text-sm">12 sources • Last updated: 3 days ago</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 shadow-md">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-black p-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          <p>Intention-Ally © 2025 | Semantic Search & Clustering Tool</p>
        </div>
      </footer>
    </div>
  );
}
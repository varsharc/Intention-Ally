// Intention-Ally Main Layout Components
import React from 'react';
import { Settings, User, Clock, Star, Search, Filter, Analytics } from 'lucide-react';

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col shadow-xl">
      <div className="p-5 flex-1">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Search size={18} className="mr-2 text-yellow-500" />
          Navigation
        </h2>
        
        <div className="space-y-2 mb-8">
          <div className="flex items-center space-x-3 p-3 bg-yellow-600 bg-opacity-20 rounded-md text-white border-l-4 border-yellow-500">
            <Clock size={18} className="text-yellow-500" />
            <span className="font-medium">Today</span>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-md text-gray-300 hover:text-white transition-colors">
            <Star size={18} />
            <span>Favorites</span>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-md text-gray-300 hover:text-white transition-colors">
            <Clock size={18} />
            <span>History</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-md uppercase text-yellow-500 font-semibold mb-3 flex items-center">
            <Filter size={16} className="mr-2" />
            My Search Topics
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-yellow-600 bg-opacity-20 rounded-md text-white border-l-4 border-yellow-500">
              <span className="font-medium">EU Textile Regulations</span>
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">2</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-md text-gray-300 hover:text-white transition-colors">
              <span>Biodiversity Metrics</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">0</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-md text-gray-300 hover:text-white transition-colors">
              <span>Carbon Insets</span>
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">1</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h2 className="text-md uppercase text-yellow-500 font-semibold mb-3 flex items-center">
            <Analytics size={16} className="mr-2" />
            Key Metrics
          </h2>
          <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Search Accuracy</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Trend Match</span>
                <span className="text-white font-medium">88%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '88%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 border-t border-gray-800">
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-3 rounded-md transition-colors shadow-lg flex items-center justify-center">
          <Search size={18} className="mr-2" />
          New Search Topic
        </button>
      </div>
    </div>
  );
};

// Main Layout Component
export const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="bg-black p-4 border-b border-yellow-600">
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
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};
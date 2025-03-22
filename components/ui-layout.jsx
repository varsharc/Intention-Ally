// Intention-Ally Main Layout Components
import React from 'react';
import { Settings, User, Clock, Star } from 'lucide-react';

// Main Layout Component
export const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <header className="bg-black p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-black">A</span>
            </div>
            <h1 className="text-xl font-bold text-white">Intention-Ally</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white">
              <User size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
export const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 flex-1">
        <div className="space-y-1 mb-8">
          <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded text-white">
            <Clock size={18} />
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
            <Star size={18} />
            <span>Favorites</span>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
            <Clock size={18} />
            <span>History</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">My Search Topics</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-white">
              <span>EU Textile Regulations</span>
              <span className="text-xs bg-yellow-500 text-black px-1 rounded">2</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <span>Biodiversity Metrics</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-1 rounded">0</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <span>Carbon Insets</span>
              <span className="text-xs bg-yellow-500 text-black px-1 rounded">1</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md">
          New Search Topic
        </button>
      </div>
    </div>
  );
};
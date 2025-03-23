import React, { useState } from 'react';
import { Menu, X, Search, Trending, Zap, Settings, User, Home, BarChart, BookOpen, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Main application layout with responsive sidebar
 */
export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <header className="bg-black p-4 border-b border-gray-800 z-20">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white md:hidden mr-2"
            >
              <Menu size={24} />
            </button>
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
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      
        {/* Sidebar - responsive */}
        <aside 
          className={`fixed md:relative w-64 bg-gray-900 border-r border-gray-800 h-full z-20 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex justify-between items-center p-4 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-black text-xs">A</span>
              </div>
              <span className="font-bold">Intention-Ally</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <SidebarContent />
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * Sidebar content component
 */
export const SidebarContent = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  // Helper to determine if a link is active
  const isActive = (path) => {
    return currentPath === path ? 
      'bg-gray-800 text-white' : 
      'text-gray-400 hover:bg-gray-800 hover:text-white';
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1 mb-8">
          <Link href="/search" className={`flex items-center space-x-2 p-2 rounded ${isActive('/search')}`}>
            <Search size={18} />
            <span>Search</span>
          </Link>
          <Link href="/trends" className={`flex items-center space-x-2 p-2 rounded ${isActive('/trends')}`}>
            <Trending size={18} />
            <span>Trends</span>
          </Link>
          <Link href="/insights" className={`flex items-center space-x-2 p-2 rounded ${isActive('/insights')}`}>
            <Zap size={18} />
            <span>Insights</span>
          </Link>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">My Search Topics</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-white">
              <span>Carbon Insetting</span>
              <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded">3</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <span>Sustainable Logistics</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">2</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <span>Scope 3 Emissions</span>
              <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded">1</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Collections</h2>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <Star size={18} />
              <span>Favorites</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <Clock size={18} />
              <span>Recent Searches</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
              <BookOpen size={18} />
              <span>Research Library</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md transition-colors duration-200">
          New Search Topic
        </button>
      </div>
    </div>
  );
};

export default AppLayout;
// Main UI Layout Component
import React from 'react';
import { Search, BarChart2, Settings, Users, Menu, X, Bell, MessageCircle } from 'lucide-react';

// Main Layout Component with Sidebar and Content Areas
export const MainLayout = ({ children, activePage = 'search' }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-800 flex items-center">
          <div className="bg-yellow-500 rounded-md w-8 h-8 flex items-center justify-center mr-3">
            <span className="text-black font-bold">I</span>
          </div>
          <span className="font-bold text-lg">Intention-Ally</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Core Features
          </div>
          <NavItem 
            icon={<Search size={18} />} 
            label="Search" 
            isActive={activePage === 'search'} 
            href="/search"
          />
          <NavItem 
            icon={<BarChart2 size={18} />} 
            label="Analytics" 
            isActive={activePage === 'analytics'} 
            href="/analytics"
          />
          <NavItem 
            icon={<Settings size={18} />} 
            label="Configure" 
            isActive={activePage === 'configure'} 
            href="/search/configure"
          />
          
          <div className="px-4 my-2 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Administration
          </div>
          <NavItem 
            icon={<Users size={18} />} 
            label="Admin Panel" 
            isActive={activePage === 'admin'} 
            href="/admin"
          />
        </nav>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
              <span className="font-bold text-xs text-black">A</span>
            </div>
            <div>
              <div className="font-medium">Archit</div>
              <div className="text-xs text-gray-500">Premium Plan</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button className="text-gray-400 hover:text-white mr-4">
              <Menu size={20} />
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-gray-800 text-white px-4 py-2 pr-8 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <Search size={16} className="absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center text-black text-xs">2</span>
            </button>
            <button className="text-gray-400 hover:text-white">
              <MessageCircle size={20} />
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded text-sm">
              Upgrade
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Sidebar Navigation Item Component
const NavItem = ({ icon, label, isActive, href }) => {
  return (
    <a 
      href={href} 
      className={`flex items-center px-4 py-2 my-1 text-sm ${
        isActive 
          ? 'bg-gray-800 text-yellow-500 border-l-2 border-yellow-500' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </a>
  );
};

// Search Page Layout with Selected Keywords, Graph, and Results
export const SearchPageLayout = ({ children }) => {
  return (
    <div className="space-y-6">
      {/* Selected Keywords */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-white">Active Search Topics</h2>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm">
            + Add New Topic
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <KeywordTag label="EU Textile Regulations" isActive={true} count={24} />
          <KeywordTag label="Carbon Insetting" isActive={false} count={11} />
          <KeywordTag label="Supply Chain Traceability" isActive={false} count={18} />
          <KeywordTag label="Fashion ESG Standards" isActive={false} count={9} />
        </div>
      </div>
      
      {/* Main Content */}
      {children}
    </div>
  );
};

// Keyword Tag Component
export const KeywordTag = ({ label, isActive, count }) => {
  return (
    <div className={`rounded-full px-3 py-1 flex items-center text-sm ${
      isActive ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'
    }`}>
      <span>{label}</span>
      {count && (
        <span className={`ml-2 rounded-full w-5 h-5 flex items-center justify-center text-xs ${
          isActive ? 'bg-black text-white' : 'bg-gray-600 text-gray-200'
        }`}>
          {count}
        </span>
      )}
      <button className="ml-2 focus:outline-none">
        <X size={14} className={isActive ? 'text-black' : 'text-gray-400'} />
      </button>
    </div>
  );
};
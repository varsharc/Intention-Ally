import React from 'react';
import Link from 'next/link';
import { Home, Search, BarChart2, Settings, User, List, X } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Sidebar component with navigation links
 */
export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div 
      className={combineStyles(
        "fixed inset-y-0 left-0 z-30 w-64 bg-[#111827] shadow-xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
        "sm:static sm:w-20 sm:translate-x-0 flex flex-col"
      )}
    >
      {/* Close button (mobile only) */}
      <div className="sm:hidden p-4 flex justify-end">
        <button onClick={onClose} className="text-[#9CA3AF] hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      {/* Logo */}
      <div className="p-4 flex justify-center">
        <Link href="/" className="text-white">
          <div className="bg-[#EAB308] h-10 w-10 rounded-md flex items-center justify-center text-black font-bold text-xl">
            IA
          </div>
        </Link>
      </div>
      
      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink href="/" icon={<Home size={20} />} label="Home" />
        <NavLink href="/search" icon={<Search size={20} />} label="Search" />
        <NavLink href="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
        <NavLink href="/admin" icon={<Settings size={20} />} label="Settings" />
      </nav>
      
      {/* User */}
      <div className="p-4 border-t border-[#374151]">
        <div className="flex items-center sm:justify-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#374151] text-white">
            <User size={14} />
          </div>
          <span className="ml-2 text-[#D1D5DB] sm:hidden">User</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual nav link component
 */
const NavLink = ({ href, icon, label }) => {
  // Check if current page matches the link
  const isActive = typeof window !== 'undefined' && window.location.pathname === href;
  
  return (
    <Link 
      href={href}
      className={combineStyles(
        "flex items-center py-2 px-4 rounded-md transition-colors",
        "sm:flex-col sm:justify-center sm:px-0 sm:py-3",
        isActive ? 
          "bg-[#1F2937] text-[#EAB308]" : 
          "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"
      )}
    >
      <div className="sm:mb-1">{icon}</div>
      <span className="ml-3 sm:ml-0 sm:text-xs">{label}</span>
    </Link>
  );
};

/**
 * Main layout component with header, sidebar, and content area
 */
export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-[#111827] shadow-md py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
              {/* Hamburger menu (mobile only) */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="sm:hidden text-[#9CA3AF] hover:text-white mr-4"
              >
                <List size={24} />
              </button>
              <h1 className="text-xl font-semibold text-white">Intention-Ally</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-[#D1D5DB]">Semantic Search & Clustering</span>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#111827] p-6">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="bg-[#111827] border-t border-[#1F2937] py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-[#9CA3AF]">
                © 2025 Intention-Ally
              </div>
              <div className="text-sm text-[#9CA3AF]">
                Version 1.0.0
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
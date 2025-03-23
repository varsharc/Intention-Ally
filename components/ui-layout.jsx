import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BarChart3, Settings, Bookmark, ChevronRight, ChevronLeft, Bell, User, Home, LogOut } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * AppLayout component
 * Provides consistent layout with sidebar navigation for the application
 */
export const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Navigation */}
      <div 
        className={combineStyles(
          "bg-[#111827] border-r border-[#374151] transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand/Logo */}
        <div className={combineStyles(
          "py-6 px-4 border-b border-[#374151] flex items-center",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-[#EAB308]">Intention-Ally</h1>
              <p className="text-xs text-[#9CA3AF]">Semantic Search Tool</p>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="h-8 w-8 bg-[#EAB308] rounded-full flex items-center justify-center">
              <span className="font-bold text-black">IA</span>
            </div>
          )}
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[#D1D5DB] hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="py-4">
          <ul>
            <NavigationItem 
              href="/"
              icon={<Home size={20} />}
              label="Home"
              collapsed={sidebarCollapsed}
              active={true}
            />
            <NavigationItem 
              href="/search"
              icon={<Search size={20} />}
              label="Search"
              collapsed={sidebarCollapsed}
              active={true} // Since we're on the search page
            />
            <NavigationItem 
              href="/analytics"
              icon={<BarChart3 size={20} />}
              label="Analytics"
              collapsed={sidebarCollapsed}
            />
            <NavigationItem 
              href="/saved"
              icon={<Bookmark size={20} />}
              label="Saved"
              collapsed={sidebarCollapsed}
            />
            <NavigationItem 
              href="/settings"
              icon={<Settings size={20} />}
              label="Settings"
              collapsed={sidebarCollapsed}
            />
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className={combineStyles(
          "mt-auto border-t border-[#374151] p-4",
          sidebarCollapsed ? "text-center" : ""
        )}>
          {!sidebarCollapsed ? (
            <div className="flex items-center">
              <div className="bg-[#4B5563] rounded-full h-10 w-10 flex items-center justify-center">
                <User size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#F9FAFB]">User</p>
                <p className="text-xs text-[#9CA3AF]">Researcher</p>
              </div>
              <button className="ml-auto text-[#9CA3AF] hover:text-[#F9FAFB]">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-[#4B5563] rounded-full h-10 w-10 flex items-center justify-center mb-2">
                <User size={20} />
              </div>
              <LogOut size={18} className="text-[#9CA3AF] hover:text-[#F9FAFB] cursor-pointer" />
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#111827] border-b border-[#374151] py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-medium text-white">Search Dashboard</h1>
          
          <div className="flex items-center">
            {/* Notifications */}
            <button className="p-2 text-[#D1D5DB] hover:text-white rounded-full hover:bg-[#374151] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-[#EAB308] h-2 w-2 rounded-full"></span>
            </button>
            
            {/* User */}
            <button className="ml-3 p-2 text-[#D1D5DB] hover:text-white rounded-full hover:bg-[#374151] transition-colors">
              <User size={20} />
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-[#111827] border-t border-[#374151] py-4 px-6 text-center">
          <p className="text-sm text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} Intention-Ally | Semantic Search and Clustering Tool
          </p>
        </footer>
      </div>
    </div>
  );
};

/**
 * NavigationItem component
 * Individual navigation item for the sidebar
 */
const NavigationItem = ({ href, icon, label, active = false, collapsed = false }) => {
  return (
    <li className="mb-1">
      <Link 
        href={href}
        className={combineStyles(
          "flex items-center py-3 px-4 rounded-md transition-colors",
          active 
            ? "bg-[#EAB308] bg-opacity-10 text-[#EAB308]" 
            : "text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white",
          collapsed ? "justify-center" : ""
        )}
      >
        <span className={collapsed ? "" : "mr-3"}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
};
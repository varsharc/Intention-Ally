/**
 * MainLayout.jsx
 * 
 * Main application layout component with navigation, authentication and responsive design
 */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Search, BarChart2, Settings, User, LogOut, Menu, X, ChevronDown,
  Home, Star, Clock, Bell, HelpCircle, Sun, Moon
} from 'lucide-react';
import { useFirebase } from '../../contexts/FirebaseContext';
import AuthModal from '../auth/AuthModal';

/**
 * Main layout component for the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.activePage - Current active page for navigation highlighting
 * @param {boolean} props.fullWidth - Whether to use full width layout
 * @param {boolean} props.requireAuth - Whether authentication is required
 */
const MainLayout = ({ 
  children, 
  activePage = 'home', 
  fullWidth = false,
  requireAuth = false
}) => {
  const { user, loading, signOut } = useFirebase();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Handle authentication redirection
  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // Redirect to home page if authentication is required but user is not logged in
      router.push('/');
      return;
    }
  }, [loading, requireAuth, user, router]);

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Handle sidebar toggle for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Handle user menu toggle
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
      if (requireAuth) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Open authentication modal
  const openAuthModal = () => {
    setAuthModalOpen(true);
    setUserMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Header/Navigation */}
      <header className="bg-black p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button 
              className="p-2 text-gray-400 hover:text-white md:hidden" 
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-black">A</span>
                </div>
                <h1 className="text-xl font-bold text-white hidden sm:block">Intention-Ally</h1>
              </div>
            </Link>
          </div>
          
          {/* Main navigation - desktop only */}
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/" icon={<Home size={18} />} isActive={activePage === 'home'}>
              Home
            </NavLink>
            <NavLink href="/search" icon={<Search size={18} />} isActive={activePage === 'search'}>
              Search
            </NavLink>
            <NavLink href="/analytics" icon={<BarChart2 size={18} />} isActive={activePage === 'analytics'}>
              Analytics
            </NavLink>
            <NavLink href="/settings" icon={<Settings size={18} />} isActive={activePage === 'settings'}>
              Settings
            </NavLink>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* Theme toggle */}
            <button 
              className="p-2 text-gray-400 hover:text-white" 
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* User menu */}
            <div className="relative">
              {loading ? (
                // Loading state
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
              ) : user ? (
                // Logged in user
                <button 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800"
                  onClick={toggleUserMenu}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>
              ) : (
                // Not logged in
                <button 
                  className="flex items-center space-x-2 py-2 px-4 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600"
                  onClick={openAuthModal}
                >
                  <User size={16} />
                  <span className="hidden sm:block">Sign In</span>
                </button>
              )}
              
              {/* User dropdown menu */}
              {userMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/profile">
                    <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
                      Your Profile
                    </div>
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  <div 
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer border-t border-gray-700" 
                    onClick={handleSignOut}
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - mobile version is conditionally shown */}
        <aside 
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} 
            md:block
            w-64 bg-gray-900 border-r border-gray-800 
            fixed md:static top-[73px] bottom-0 
            z-40 overflow-y-auto
          `}
        >
          <div className="p-4 flex flex-col h-full">
            {/* Sidebar sections */}
            <div className="space-y-6 flex-1">
              {/* Quick access section */}
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Quick Access</h3>
                <div className="space-y-1">
                  <SidebarLink href="/" icon={<Home size={18} />} isActive={activePage === 'home'}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink href="/favorites" icon={<Star size={18} />} isActive={activePage === 'favorites'}>
                    Favorites
                  </SidebarLink>
                  <SidebarLink href="/history" icon={<Clock size={18} />} isActive={activePage === 'history'}>
                    History
                  </SidebarLink>
                </div>
              </div>
              
              {/* Search topics section */}
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Search Topics</h3>
                <div className="space-y-1">
                  <SidebarLink 
                    href="/search/topic/eu-textiles" 
                    badge="2"
                    isActive={router.query.topicId === 'eu-textiles'}
                  >
                    EU Textile Regulations
                  </SidebarLink>
                  <SidebarLink 
                    href="/search/topic/biodiversity" 
                    badge="0"
                    isActive={router.query.topicId === 'biodiversity'}
                  >
                    Biodiversity Metrics
                  </SidebarLink>
                  <SidebarLink 
                    href="/search/topic/carbon-insets" 
                    badge="1"
                    isActive={router.query.topicId === 'carbon-insets'}
                  >
                    Carbon Insets
                  </SidebarLink>
                </div>
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="pt-4 border-t border-gray-800">
              <Link href="/search/create">
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md">
                  New Search Topic
                </button>
              </Link>
              
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <Link href="/help">
                  <div className="flex items-center hover:text-gray-300 cursor-pointer">
                    <HelpCircle size={14} className="mr-1" />
                    Help
                  </div>
                </Link>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 overflow-auto p-4 ${sidebarOpen ? 'md:ml-0' : ''}`}>
          <div className={fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>
      
      {/* Auth modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialView="signin"
      />
    </div>
  );
};

// Helper component for main nav links
const NavLink = ({ href, icon, children, isActive }) => {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors
          ${isActive
            ? 'text-white bg-gray-800'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'}
        `}
      >
        <span className="mr-2">{icon}</span>
        <span>{children}</span>
      </div>
    </Link>
  );
};

// Helper component for sidebar links
const SidebarLink = ({ href, icon, badge, children, isActive }) => {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors
          ${isActive
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
        `}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <span>{children}</span>
        </div>
        {badge && (
          <span className={`
            text-xs px-1.5 rounded-full
            ${badge === '0'
              ? 'bg-gray-700 text-gray-300'
              : 'bg-yellow-500 text-black'}
          `}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

export default MainLayout;

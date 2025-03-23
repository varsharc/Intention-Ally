// Main Application Layout and Sidebar
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, 
  Settings, 
  Home, 
  Sliders, 
  FileText,
  BarChart, 
  User, 
  LogOut, 
  HelpCircle
} from 'lucide-react';

// Main Application Layout
export const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Application Header
const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md py-3 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-yellow-500">Intention</span>
            <span className="text-xl font-bold text-white">Ally</span>
          </Link>
          
          <div className="hidden md:flex items-center bg-gray-700 rounded-md py-1 px-3">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search knowledge base..." 
              className="bg-transparent border-none focus:outline-none text-white w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2">
            <HelpCircle size={18} className="text-yellow-500" />
          </button>
          
          <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2">
            <Settings size={18} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="font-medium text-black">JD</span>
            </div>
            <span className="hidden md:inline-block">Jane Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Navigation
export const Sidebar = () => {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path;
  };
  
  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <Home size={20} />, 
      path: '/' 
    },
    { 
      label: 'Search', 
      icon: <Search size={20} />, 
      path: '/search' 
    },
    { 
      label: 'Insights', 
      icon: <BarChart size={20} />, 
      path: '/insights' 
    },
    { 
      label: 'Documents', 
      icon: <FileText size={20} />, 
      path: '/documents' 
    },
    { 
      label: 'Settings', 
      icon: <Sliders size={20} />, 
      path: '/settings' 
    },
    { 
      label: 'Admin', 
      icon: <User size={20} />, 
      path: '/admin' 
    },
  ];
  
  return (
    <aside className="w-20 md:w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center md:justify-start p-4 border-b border-gray-700">
        <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center">
          <span className="font-bold text-xl text-black">IA</span>
        </div>
        <span className="hidden md:block ml-2 text-xl font-bold text-white">Intention<span className="text-yellow-500">Ally</span></span>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center py-3 px-4 md:px-6 ${
                  isActive(item.path) 
                    ? 'bg-gray-700 border-l-4 border-yellow-500' 
                    : 'border-l-4 border-transparent hover:bg-gray-700'
                }`}
              >
                <span className={`${isActive(item.path) ? 'text-yellow-500' : 'text-gray-300'}`}>
                  {item.icon}
                </span>
                <span className={`hidden md:block ml-3 ${isActive(item.path) ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center justify-center md:justify-start w-full p-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-700">
          <LogOut size={20} />
          <span className="hidden md:block ml-2">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
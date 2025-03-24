/**
 * Home page component
 * 
 * This is the main landing page for the application that displays
 * different content for authenticated vs non-authenticated users.
 */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, BarChart2, Settings, Users, ChevronRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useFirebase } from '../contexts/FirebaseContext';
import AuthModal from '../components/auth/AuthModal';

// Home Page Component
export default function Home() {
  const { user, loading } = useFirebase();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Open authentication modal
  const openAuthModal = (view = 'signin') => {
    setAuthModalOpen(true);
  };

  return (
    <MainLayout activePage="home">
      <div className="space-y-8">
        {loading ? (
          // Loading state
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        ) : user ? (
          // Authenticated user view
          <AuthenticatedView user={user} />
        ) : (
          // Guest view
          <GuestView onGetStarted={openAuthModal} />
        )}
        
        {/* Auth modal */}
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          initialView="signin"
        />
      </div>
    </MainLayout>
  );
}

// View for authenticated users
const AuthenticatedView = ({ user }) => {
  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.displayName || user.email.split('@')[0]}</h1>
            <p className="text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/search">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center">
                <Search size={18} className="mr-2" />
                New Search
              </button>
            </Link>
            <Link href="/settings">
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md flex items-center">
                <Settings size={18} className="mr-2" />
                Settings
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Recent Activities</h2>
            <Link href="/history">
              <div className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center cursor-pointer">
                View All <ChevronRight size={16} />
              </div>
            </Link>
          </div>
          
          <div className="space-y-2">
            <ActivityItem 
              title="EU Textile Regulations" 
              description="2 new results discovered"
              time="2 hours ago"
              tag="Search"
            />
            <ActivityItem 
              title="Carbon Insets" 
              description="New cluster identified: 'Market Trends'"
              time="Yesterday"
              tag="Analysis"
            />
            <ActivityItem 
              title="Biodiversity Metrics" 
              description="Added to favorites"
              time="3 days ago"
              tag="Action"
            />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Analytics Overview</h2>
          
          <div className="space-y-4">
            <StatItem 
              label="Active Search Topics" 
              value="3"
              change="+1"
              positive={true}
            />
            <StatItem 
              label="Discoveries This Week" 
              value="17"
              change="+5"
              positive={true}
            />
            <StatItem 
              label="Authority Score (avg)" 
              value="78.3"
              change="-2.1"
              positive={false}
            />
          </div>
          
          <div className="mt-6">
            <Link href="/analytics">
              <button className="w-full border border-gray-600 hover:border-gray-500 text-white font-medium px-4 py-2 rounded-md text-sm">
                View Detailed Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Upcoming Features</h2>
            <p className="text-gray-400 mb-4">
              Check out what's coming next to Intention-Ally.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">1</div>
                <p className="text-white">Advanced search filtering with custom authority weights</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">2</div>
                <p className="text-white">Integration with personal knowledge bases (Notion, Obsidian)</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">3</div>
                <p className="text-white">Custom notification rules based on discoveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// View for non-authenticated users (guests)
const GuestView = ({ onGetStarted }) => {
  return (
    <>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Intention-Ally</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Your semantic search and clustering tool for focused research and discovery.
          Track keywords, visualize relationships, and stay on top of emerging trends.
        </p>
        
        <div className="mt-8 space-x-4">
          <button 
            onClick={() => onGetStarted('signup')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-md"
          >
            Get Started
          </button>
          <Link href="/about">
            <button className="bg-transparent border border-gray-600 hover:border-gray-500 text-white font-medium px-6 py-3 rounded-md">
              Learn More
            </button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Feature cards */}
        <FeatureCard 
          title="Intelligent Search" 
          description="Discover high-quality information using authority-based ranking and semantic relevance."
          icon={<Search size={24} className="text-yellow-500" />}
        />
        <FeatureCard 
          title="Knowledge Graphs" 
          description="Visualize connections between sources to uncover hidden relationships and patterns."
          icon={<BarChart2 size={24} className="text-yellow-500" />}
        />
        <FeatureCard 
          title="Customizable" 
          description="Configure search parameters, domain preferences, and visualization settings to your needs."
          icon={<Settings size={24} className="text-yellow-500" />}
        />
        <FeatureCard 
          title="Collaboration" 
          description="Share insights with team members and work together on focused research projects."
          icon={<Users size={24} className="text-yellow-500" />}
        />
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mt-8 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Start Your Research Journey?</h2>
            <p className="text-gray-400 mb-4 md:mb-0">
              Create an account to begin discovering valuable information and insights.
            </p>
          </div>
          
          <button 
            onClick={() => onGetStarted('signup')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-md"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </>
  );
};

// Helper component for feature cards
const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
  );
};

// Helper component for activity items
const ActivityItem = ({ title, description, time, tag }) => {
  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case 'search': return 'bg-blue-500';
      case 'analysis': return 'bg-purple-500';
      case 'action': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-3 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-white">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)} text-white`}>
            {tag}
          </span>
          <span className="text-xs text-gray-500 mt-1">{time}</span>
        </div>
      </div>
    </div>
  );
};

// Helper component for stat items
const StatItem = ({ label, value, change, positive }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-xs ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

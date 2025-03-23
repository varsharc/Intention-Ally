import React from 'react';
import { MainLayout } from '../components';
import Link from 'next/link';
import { Search, BarChart2, Settings, Users } from 'lucide-react';

export default function Home() {
  return (
    <MainLayout activePage="home">
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Intention-Ally</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your semantic search and clustering tool for focused research and discovery.
            Track keywords, visualize relationships, and stay on top of emerging trends.
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {/* Search Card */}
          <NavigationCard 
            title="Search Dashboard" 
            description="Explore your tracked topics, visualize knowledge graphs, and review latest discoveries."
            icon={<Search size={24} />}
            href="/search"
            primary
          />
          
          {/* Analytics Card */}
          <NavigationCard 
            title="Analytics" 
            description="Analyze search trends, topic relationships, and content distribution over time."
            icon={<BarChart2 size={24} />}
            href="/analytics"
          />
          
          {/* Configure Card */}
          <NavigationCard 
            title="Configure" 
            description="Set up new search topics, customize parameters, and manage keywords."
            icon={<Settings size={24} />}
            href="/search/configure"
          />
          
          {/* Admin Card */}
          <NavigationCard 
            title="Admin Panel" 
            description="Monitor system usage, manage users, and configure global settings."
            icon={<Users size={24} />}
            href="/admin"
          />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Getting Started</h2>
              <p className="text-gray-400 mb-4">
                Follow these simple steps to begin your focused research journey.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">1</div>
                  <p className="text-white">Configure your first search topic with relevant keywords</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">2</div>
                  <p className="text-white">Adjust search parameters and domain preferences</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">3</div>
                  <p className="text-white">Explore the knowledge graph to discover content relationships</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mr-3">4</div>
                  <p className="text-white">Save important discoveries and monitor emerging trends</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4 w-64">
              <h3 className="font-medium text-white mb-2">Latest Updates</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="text-yellow-500">New Feature</p>
                  <p className="text-white">Knowledge graph visualization</p>
                </div>
                <div className="text-sm">
                  <p className="text-yellow-500">Enhancement</p>
                  <p className="text-white">Improved clustering algorithm</p>
                </div>
                <div className="text-sm">
                  <p className="text-yellow-500">Update</p>
                  <p className="text-white">Expanded source coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Navigation Card Component
const NavigationCard = ({ title, description, icon, href, primary = false }) => {
  return (
    <Link 
      href={href}
      className={`block rounded-lg p-6 transition-all hover:translate-y-[-4px] ${
        primary 
          ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
          : 'bg-gray-800 text-white hover:bg-gray-750'
      }`}
    >
      <div className={`mb-4 ${primary ? 'text-black' : 'text-yellow-500'}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-medium mb-2 ${primary ? 'text-black' : 'text-white'}`}>
        {title}
      </h3>
      <p className={primary ? 'text-gray-800' : 'text-gray-400'}>
        {description}
      </p>
    </Link>
  );
};
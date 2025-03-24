// app/(pages)/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';
import { useSearchConfigs } from '@/app/hooks/useSearchConfig';
import { Search, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, userSettings, loading: authLoading } = useAuth();
  const { configs, loading: configsLoading } = useSearchConfigs();
  
  if (authLoading || configsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link href="/search/new">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center">
            <Plus size={18} className="mr-1" />
            New Search Topic
          </button>
        </Link>
      </div>
      
      {/* Welcome section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Welcome, {user?.email}</h2>
        <p className="text-gray-400 mb-4">
          Intention-Ally helps you discover high-quality information from across the web, 
          filtered and organized to meet your specific needs.
        </p>
        
        {configs.length === 0 ? (
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Get Started</h3>
            <p className="text-gray-400 mb-3">
              Create your first search topic to begin discovering relevant information.
            </p>
            <Link href="/search/new">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center">
                <Search size={18} className="mr-1" />
                Create Search Topic
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Your Search Topics</h3>
            <p className="text-gray-400 mb-3">
              You have {configs.length} active search {configs.length === 1 ? 'topic' : 'topics'}.
            </p>
            <Link href={`/search/${configs[0].id}`}>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center">
                <ArrowRight size={18} className="mr-1" />
                View Latest Results
              </button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Search Topics section */}
      {configs.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Search Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <Link key={config.id} href={`/search/${config.id}`}>
                <div className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-yellow-500 transition-colors">
                  <h3 className="text-lg font-medium text-white mb-1">{config.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {config.keywords.slice(0, 3).map((keyword) => (
                      <span key={keyword} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                    {config.keywords.length > 3 && (
                      <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                        +{config.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-gray-500'} mr-1`}></span>
                      <span className="text-gray-400">{config.updateFrequency}</span>
                    </div>
                    <span className="text-gray-400">Min. Authority: {config.authorityThreshold}%</span>
                  </div>
                </div>
              </Link>
            ))}
            
            <Link href="/search/new">
              <div className="bg-gray-750 rounded-lg p-4 border border-dashed border-gray-600 hover:border-yellow-500 transition-colors flex flex-col items-center justify-center h-full">
                <Plus size={24} className="text-yellow-500 mb-2" />
                <span className="text-yellow-500">Create New Search Topic</span>
              </div>
            </Link>
          </div>
        </div>
      )}
      
      {/* Quick Tips section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Tips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Authority Scores</h3>
            <p className="text-gray-400 text-sm">
              Higher authority scores indicate more reliable sources. Government (.gov) and educational (.edu) 
              domains typically receive the highest scores.
            </p>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Domain Templates</h3>
            <p className="text-gray-400 text-sm">
              Combine multiple domain templates (Regulatory, Academic, Technology, Market) 
              to get a more diverse set of results.
            </p>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Resource Usage</h3>
            <p className="text-gray-400 text-sm">
              Deep searches with Claude AI provide richer insights but consume more resources. 
              Consider using them for your most important topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
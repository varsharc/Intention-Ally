import React from 'react';
import { TrendingUp, TrendingDown, Zap, AlertCircle, Calendar, Share2 } from 'lucide-react';

/**
 * InsightsSummary component displays key insights from search results
 */
const InsightsSummary = ({ results = [], keyword = null }) => {
  // If no keyword or results, show placeholder
  if (!keyword || results.length === 0) {
    return (
      <div className="mb-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Insights Summary</h2>
          <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center">
            <Share2 size={14} className="mr-1.5" />
            Share Insights
          </button>
        </div>
        <div className="text-center py-6 text-gray-400">
          <AlertCircle size={24} className="mx-auto mb-2" />
          <p>No insights available. Search for a keyword to see AI-generated insights.</p>
        </div>
      </div>
    );
  }

  // Hardcoded demo insights for display purposes
  const insights = [
    {
      type: 'trend',
      icon: <TrendingUp className="text-green-500" />,
      title: 'Increasing Interest',
      description: `Search volume for "${keyword}" has increased by 32% in the last 30 days.`
    },
    {
      type: 'sentiment',
      icon: <Zap className="text-yellow-500" />,
      title: 'Positive Sentiment',
      description: 'Recent discussions show predominantly positive sentiment (78%) around this topic.'
    },
    {
      type: 'events',
      icon: <Calendar className="text-blue-500" />,
      title: 'Upcoming Events',
      description: '3 major industry conferences will focus on this topic in the next quarter.'
    }
  ];

  return (
    <div className="mb-6 bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Insights Summary</h2>
        <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center">
          <Share2 size={14} className="mr-1.5" />
          Share Insights
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gray-900 p-4 rounded border-l-2 border-yellow-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                {insight.icon}
              </div>
              <h3 className="font-medium text-white">{insight.title}</h3>
            </div>
            <p className="text-sm text-gray-300">{insight.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-900 p-3 rounded">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-0.5">
            <Zap size={14} className="text-yellow-500" />
          </div>
          <div>
            <h4 className="font-medium text-white text-sm mb-1">AI Summary</h4>
            <p className="text-sm text-gray-300">
              {keyword ? (
                `${keyword} is an emerging topic in sustainability with strong industry interest. Recent publications focus on implementation strategies and ROI analysis. Companies in logistics and supply chain sectors are the primary adopters, with 68% reporting positive outcomes.`
              ) : (
                'Search for a keyword to see AI-generated summary.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSummary;
import React, { useState } from 'react';
import { X, Filter, Calendar, Globe, BookOpen, BarChart2, AlertCircle, Check } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Advanced Filters Sidebar component
 * Provides filtering options for search results
 */
export const AdvancedFilters = ({ isOpen, onClose }) => {
  // Filter state
  const [dateRange, setDateRange] = useState('30');
  const [selectedSources, setSelectedSources] = useState(['news', 'academic', 'government']);
  const [selectedSentiments, setSelectedSentiments] = useState(['all']);
  
  const toggleSource = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };
  
  const toggleSentiment = (sentiment) => {
    if (sentiment === 'all') {
      setSelectedSentiments(['all']);
    } else {
      const newSentiments = selectedSentiments.filter(s => s !== 'all');
      
      if (newSentiments.includes(sentiment)) {
        newSentiments.splice(newSentiments.indexOf(sentiment), 1);
      } else {
        newSentiments.push(sentiment);
      }
      
      setSelectedSentiments(newSentiments.length ? newSentiments : ['all']);
    }
  };
  
  // Apply filters function
  const applyFilters = () => {
    // Here you would typically dispatch an action or call a function to apply filters
    console.log('Applying filters:', { dateRange, selectedSources, selectedSentiments });
    onClose();
  };
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={combineStyles(
        "fixed inset-y-0 right-0 w-80 bg-[#111111] border-l border-[#374151] z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4">
          <div className={styles.utils.flexBetween + " mb-6"}>
            <h2 className={styles.text.heading3}>Advanced Filters</h2>
            <button 
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Date Range Filter */}
          <div className="mb-6">
            <h3 className={combineStyles(styles.text.heading3, "text-lg mb-3 flex items-center")}>
              <Calendar size={16} className="mr-2" />
              Date Range
            </h3>
            <div className="space-y-2">
              {[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: '365', label: 'Last year' }
              ].map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`date-${option.value}`}
                    name="dateRange"
                    value={option.value}
                    checked={dateRange === option.value}
                    onChange={() => setDateRange(option.value)}
                    className="mr-2 accent-[#EAB308]"
                  />
                  <label 
                    htmlFor={`date-${option.value}`}
                    className="text-[#D1D5DB] text-sm cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Source Types Filter */}
          <div className="mb-6">
            <h3 className={combineStyles(styles.text.heading3, "text-lg mb-3 flex items-center")}>
              <Globe size={16} className="mr-2" />
              Source Types
            </h3>
            <div className="space-y-2">
              {[
                { value: 'news', label: 'News Articles' },
                { value: 'academic', label: 'Academic Papers' },
                { value: 'government', label: 'Government Resources' },
                { value: 'corporate', label: 'Corporate Reports' },
                { value: 'blogs', label: 'Industry Blogs' }
              ].map((source) => (
                <div key={source.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`source-${source.value}`}
                    checked={selectedSources.includes(source.value)}
                    onChange={() => toggleSource(source.value)}
                    className="mr-2 accent-[#EAB308]"
                  />
                  <label 
                    htmlFor={`source-${source.value}`}
                    className="text-[#D1D5DB] text-sm cursor-pointer"
                  >
                    {source.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sentiment Filter */}
          <div className="mb-6">
            <h3 className={combineStyles(styles.text.heading3, "text-lg mb-3 flex items-center")}>
              <BarChart2 size={16} className="mr-2" />
              Sentiment
            </h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Sentiments', icon: Filter },
                { value: 'positive', label: 'Positive', icon: Check },
                { value: 'neutral', label: 'Neutral', icon: BookOpen },
                { value: 'negative', label: 'Negative', icon: AlertCircle }
              ].map((sentiment) => {
                const Icon = sentiment.icon;
                return (
                  <div key={sentiment.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`sentiment-${sentiment.value}`}
                      checked={selectedSentiments.includes(sentiment.value)}
                      onChange={() => toggleSentiment(sentiment.value)}
                      className="mr-2 accent-[#EAB308]"
                    />
                    <label 
                      htmlFor={`sentiment-${sentiment.value}`}
                      className="text-[#D1D5DB] text-sm cursor-pointer flex items-center"
                    >
                      <Icon size={14} className="mr-2" />
                      {sentiment.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-[#374151]">
            <button
              onClick={applyFilters}
              className={styles.button.primary + " flex-1"}
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setDateRange('30');
                setSelectedSources(['news', 'academic', 'government']);
                setSelectedSentiments(['all']);
              }}
              className={styles.button.secondary + " flex-1"}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
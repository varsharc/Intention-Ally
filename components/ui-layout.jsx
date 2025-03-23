import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { AdvancedFiltersSidebar } from './ui-advanced-filters';
import { KnowledgeGraphPanel } from './ui-knowledge-graph';
import { TrendVisualizationPanel } from './ui-trend-visualization';
import { SearchResultsList } from './ui-results-list';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Main application layout component
 */
export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={styles.layout.page}>
      {/* Header */}
      <header className="bg-[#000000] border-b border-[#374151]">
        <div className={styles.layout.container}>
          <div className={styles.utils.flexBetween + " py-4"}>
            <div className={styles.utils.flexStart + " space-x-2"}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-[#EAB308]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
              </svg>
              <h1 className="text-2xl font-bold text-[#EAB308]">Intention-Ally</h1>
            </div>
            <div className={styles.utils.flexCenter + " space-x-4"}>
              <button className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={combineStyles(styles.layout.container, styles.layout.section)}>
        {children}
      </main>
      
      {/* Advanced Filters Sidebar */}
      <AdvancedFiltersSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-[#000000] text-[#9CA3AF] py-6 border-t border-[#374151]">
        <div className={combineStyles(styles.layout.container, styles.utils.flexCenter)}>
          <p className={styles.text.muted}>Intention-Ally © 2025 | Semantic Search & Clustering Tool</p>
        </div>
      </footer>
    </div>
  );
};

/**
 * Search page layout with all components
 */
export const SearchPageLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeywords, setActiveKeywords] = useState([
    'carbon insetting', 
    'sustainable logistics', 
    'scope 3 emissions'
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && !activeKeywords.includes(searchTerm.trim())) {
      setActiveKeywords([...activeKeywords, searchTerm.trim()]);
      setSearchTerm('');
    }
  };

  const removeKeyword = (keyword) => {
    setActiveKeywords(activeKeywords.filter(k => k !== keyword));
  };

  return (
    <AppLayout>
      {/* Search Bar */}
      <div className="mb-6">
        <h2 className={combineStyles(styles.text.heading1, "mb-4")}>Semantic Search & Clustering</h2>
        <form onSubmit={handleSearch} className={styles.utils.flexRow + " mb-4"}>
          <input
            type="text"
            placeholder="Enter keyword to track..."
            className="flex-1 bg-[#374151] border border-[#4B5563] rounded-l-md p-3 text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#EAB308] focus:border-[#EAB308]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className={styles.button.primary + " rounded-l-none"}
          >
            Search
          </button>
        </form>
        
        {/* Keyword Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activeKeywords.map((keyword, index) => (
            <div 
              key={index} 
              className={combineStyles(styles.badge.yellow, styles.utils.flexCenter)}
            >
              {keyword}
              <button 
                onClick={() => removeKeyword(keyword)}
                className="ml-2 focus:outline-none"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Visualizations Grid */}
      <div className={combineStyles(styles.grid.twoColumn, "mb-8")}>
        <KnowledgeGraphPanel />
        <TrendVisualizationPanel />
      </div>
      
      {/* Search Results */}
      <SearchResultsList />
    </AppLayout>
  );
};
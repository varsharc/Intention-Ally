import React from 'react';
import { Filter, Maximize2, Layers, Grid, List } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Knowledge Graph Panel component
 * Displays a visual representation of relationships between search topics
 */
export const KnowledgeGraphPanel = () => {
  return (
    <div className={combineStyles(styles.card.base, "flex flex-col")}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>Knowledge Graph: EU Textile Regulations</h2>
        
        <div className={combineStyles(styles.utils.flexCenter, "space-x-2")}>
          <div className="p-2 bg-[#374151] rounded flex items-center space-x-2">
            <Filter size={16} />
            <select className="bg-transparent text-sm focus:outline-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
          </div>
          <button className="p-2 bg-[#374151] rounded hover:bg-[#4B5563] transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "flex-1")}>
        <div className={styles.utils.flexStart + " space-x-2 mb-4"}>
          <button className="px-3 py-1 bg-[#EAB308] text-black rounded-md text-sm flex items-center">
            <Layers size={14} className="mr-1" />
            <span>Clusters</span>
          </button>
          <button className="px-3 py-1 bg-[#374151] hover:bg-[#4B5563] rounded-md text-sm flex items-center transition-colors">
            <Grid size={14} className="mr-1" />
            <span>Grid</span>
          </button>
          <button className="px-3 py-1 bg-[#374151] hover:bg-[#4B5563] rounded-md text-sm flex items-center transition-colors">
            <List size={14} className="mr-1" />
            <span>Tree</span>
          </button>
        </div>

        {/* Mock Knowledge Graph Visualization */}
        <div className="relative h-64 bg-[#111111] rounded-lg p-4 flex items-center justify-center">
          {/* This is a simplified visual representation of a knowledge graph */}
          <svg width="100%" height="100%" viewBox="0 0 500 200">
            {/* Central Node */}
            <circle cx="250" cy="100" r="20" fill="#EAB308" />
            <text x="250" y="105" textAnchor="middle" fill="#000" fontSize="10">EU Textile</text>
            
            {/* Connection Lines */}
            <line x1="250" y1="100" x2="150" y2="50" stroke="#EAB308" strokeWidth="2" />
            <line x1="250" y1="100" x2="150" y2="150" stroke="#EAB308" strokeWidth="2" />
            <line x1="250" y1="100" x2="350" y2="50" stroke="#EAB308" strokeWidth="2" />
            <line x1="250" y1="100" x2="350" y2="150" stroke="#EAB308" strokeWidth="2" />
            <line x1="150" y1="50" x2="70" y2="50" stroke="#6B7280" strokeWidth="1" />
            <line x1="150" y1="150" x2="70" y2="150" stroke="#6B7280" strokeWidth="1" />
            <line x1="350" y1="50" x2="430" y2="50" stroke="#6B7280" strokeWidth="1" />
            <line x1="350" y1="150" x2="430" y2="150" stroke="#6B7280" strokeWidth="1" />
            
            {/* Secondary Nodes */}
            <circle cx="150" cy="50" r="15" fill="#374151" />
            <text x="150" y="54" textAnchor="middle" fill="#F9FAFB" fontSize="8">Sustainability</text>
            
            <circle cx="150" cy="150" r="15" fill="#374151" />
            <text x="150" y="154" textAnchor="middle" fill="#F9FAFB" fontSize="8">Transparency</text>
            
            <circle cx="350" cy="50" r="15" fill="#374151" />
            <text x="350" y="54" textAnchor="middle" fill="#F9FAFB" fontSize="8">Chemicals</text>
            
            <circle cx="350" cy="150" r="15" fill="#374151" />
            <text x="350" y="154" textAnchor="middle" fill="#F9FAFB" fontSize="8">Compliance</text>
            
            {/* Tertiary Nodes */}
            <circle cx="70" cy="50" r="10" fill="#1F2937" />
            <text x="70" y="54" textAnchor="middle" fill="#F9FAFB" fontSize="6">Recycling</text>
            
            <circle cx="70" cy="150" r="10" fill="#1F2937" />
            <text x="70" y="154" textAnchor="middle" fill="#F9FAFB" fontSize="6">Supply Chain</text>
            
            <circle cx="430" cy="50" r="10" fill="#1F2937" />
            <text x="430" y="54" textAnchor="middle" fill="#F9FAFB" fontSize="6">REACH</text>
            
            <circle cx="430" cy="150" r="10" fill="#1F2937" />
            <text x="430" y="154" textAnchor="middle" fill="#F9FAFB" fontSize="6">Standards</text>
          </svg>
        </div>

        <div className={combineStyles(styles.utils.flexBetween, "mt-3 text-xs text-[#9CA3AF]")}>
          <span>16 related concepts identified</span>
          <span>Last updated: 2 hours ago</span>
        </div>
      </div>
    </div>
  );
};
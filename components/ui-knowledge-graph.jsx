import React, { useEffect, useRef } from 'react';
import { Network, BrainCircuit, Filter, Download } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * KnowledgeGraphPanel component
 * Displays an interactive knowledge graph visualization
 */
export const KnowledgeGraphPanel = () => {
  const graphRef = useRef(null);
  
  // Sample graph data structure
  // In a real application, this would come from backend API
  const graphData = {
    nodes: [
      { id: 1, label: 'carbon insetting', group: 'primary', size: 25 },
      { id: 2, label: 'supply chain', group: 'related', size: 20 },
      { id: 3, label: 'carbon accounting', group: 'related', size: 18 },
      { id: 4, label: 'scope 3 emissions', group: 'related', size: 22 },
      { id: 5, label: 'sustainable logistics', group: 'primary', size: 23 },
      { id: 6, label: 'ESG metrics', group: 'related', size: 18 },
      { id: 7, label: 'GHG protocol', group: 'related', size: 16 },
      { id: 8, label: 'climate targets', group: 'related', size: 17 },
      { id: 9, label: 'carbon offsetting', group: 'related', size: 20 },
      { id: 10, label: 'value chain', group: 'related', size: 19 },
    ],
    links: [
      { source: 1, target: 2, strength: 0.7 },
      { source: 1, target: 3, strength: 0.8 },
      { source: 1, target: 4, strength: 0.9 },
      { source: 1, target: 5, strength: 0.6 },
      { source: 1, target: 9, strength: 0.9 },
      { source: 4, target: 7, strength: 0.7 },
      { source: 4, target: 8, strength: 0.6 },
      { source: 5, target: 2, strength: 0.8 },
      { source: 5, target: 6, strength: 0.7 },
      { source: 5, target: 10, strength: 0.6 },
      { source: 3, target: 7, strength: 0.7 },
      { source: 6, target: 8, strength: 0.6 },
      { source: 9, target: 3, strength: 0.7 },
      { source: 10, target: 2, strength: 0.8 },
    ]
  };
  
  useEffect(() => {
    if (graphRef.current) {
      // Clear any existing content
      while (graphRef.current.firstChild) {
        graphRef.current.removeChild(graphRef.current.firstChild);
      }
      
      // Create SVG container
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.minHeight = "300px";
      graphRef.current.appendChild(svg);
      
      // Define graph dimensions
      const width = 500;
      const height = 300;
      
      // Create groups for links and nodes
      const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      linksGroup.setAttribute("stroke", "#374151");
      linksGroup.setAttribute("stroke-opacity", "0.6");
      
      const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      nodesGroup.setAttribute("stroke", "#1F2937");
      nodesGroup.setAttribute("stroke-width", "1.5");
      
      svg.appendChild(linksGroup);
      svg.appendChild(nodesGroup);
      
      // Simple force-directed layout simulation
      // In a real app, we'd use a library like d3-force
      const nodePositions = {};
      
      // Initialize node positions (static for the demo)
      graphData.nodes.forEach(node => {
        // Place nodes in a circle
        const angle = (node.id / graphData.nodes.length) * 2 * Math.PI;
        const radius = Math.min(width, height) / 3;
        const x = (width / 2) + radius * Math.cos(angle);
        const y = (height / 2) + radius * Math.sin(angle);
        
        nodePositions[node.id] = { x, y };
      });
      
      // Draw links
      graphData.links.forEach(link => {
        const source = nodePositions[link.source];
        const target = nodePositions[link.target];
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", source.x);
        line.setAttribute("y1", source.y);
        line.setAttribute("x2", target.x);
        line.setAttribute("y2", target.y);
        line.setAttribute("stroke-width", Math.max(1, link.strength * 3));
        
        linksGroup.appendChild(line);
      });
      
      // Draw nodes
      graphData.nodes.forEach(node => {
        const pos = nodePositions[node.id];
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Node circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pos.x);
        circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", node.size * 0.6);
        
        // Style based on group
        if (node.group === 'primary') {
          circle.setAttribute("fill", "#EAB308");
        } else {
          circle.setAttribute("fill", "#4B5563");
        }
        
        // Node label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", pos.x);
        text.setAttribute("y", pos.y + node.size + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#D1D5DB");
        text.setAttribute("font-size", "10px");
        text.textContent = node.label;
        
        group.appendChild(circle);
        group.appendChild(text);
        nodesGroup.appendChild(group);
      });
    }
  }, []);
  
  return (
    <div className={styles.card.base}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>
          <Network size={18} className="inline-block mr-2" />
          Knowledge Graph
        </h2>
        
        <div className="flex space-x-2">
          <select className="bg-[#1F2937] text-[#D1D5DB] text-sm border border-[#374151] rounded-md py-1 px-2">
            <option>Connection Strength</option>
            <option>Frequency</option>
            <option>Recency</option>
          </select>
          
          <button className={styles.button.icon} title="Filter">
            <Filter size={16} />
          </button>
          
          <button className={styles.button.icon} title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "h-80")}>
        <div ref={graphRef} className="w-full h-full">
          {/* Graph will be rendered here */}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center text-sm text-[#D1D5DB] space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#EAB308] mr-2"></div>
            <span>Primary keywords</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4B5563] mr-2"></div>
            <span>Related concepts</span>
          </div>
          
          <div className="flex items-center">
            <BrainCircuit size={16} className="mr-2 text-[#9CA3AF]" />
            <span>Cognitive connections</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useRef } from 'react';
import { NetworkIcon, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * KnowledgeGraphPanel component
 * Displays a knowledge graph visualization of search results
 */
export const KnowledgeGraphPanel = () => {
  const graphRef = useRef(null);
  
  // Simulate graph data
  const sampleData = {
    nodes: [
      { id: 'carbon-insetting', label: 'Carbon Insetting', group: 'primary' },
      { id: 'sustainable-logistics', label: 'Sustainable Logistics', group: 'secondary' },
      { id: 'scope3', label: 'Scope 3 Emissions', group: 'secondary' },
      { id: 'supply-chain', label: 'Supply Chain', group: 'tertiary' },
      { id: 'climate-targets', label: 'Climate Targets', group: 'tertiary' },
      { id: 'offsetting', label: 'Carbon Offsetting', group: 'related' },
      { id: 'esg', label: 'ESG Metrics', group: 'tertiary' },
    ],
    links: [
      { source: 'carbon-insetting', target: 'sustainable-logistics', strength: 0.8 },
      { source: 'carbon-insetting', target: 'scope3', strength: 0.9 },
      { source: 'sustainable-logistics', target: 'supply-chain', strength: 0.7 },
      { source: 'scope3', target: 'climate-targets', strength: 0.6 },
      { source: 'carbon-insetting', target: 'offsetting', strength: 0.5 },
      { source: 'sustainable-logistics', target: 'esg', strength: 0.4 },
    ]
  };
  
  useEffect(() => {
    // This would typically load D3 and create a proper knowledge graph
    // For now, let's just create a placeholder visualization
    if (graphRef.current) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.minHeight = "200px";
      
      // Clear existing content
      while (graphRef.current.firstChild) {
        graphRef.current.removeChild(graphRef.current.firstChild);
      }
      
      // Placeholder circles and lines to represent a graph
      sampleData.links.forEach((link, index) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const sourceNode = sampleData.nodes.find(n => n.id === link.source);
        const targetNode = sampleData.nodes.find(n => n.id === link.target);
        
        const sourceIndex = sampleData.nodes.indexOf(sourceNode);
        const targetIndex = sampleData.nodes.indexOf(targetNode);
        
        // Position based on index
        const centerX = 150;
        const centerY = 100;
        const radius = 80;
        const sourceAngle = (sourceIndex / sampleData.nodes.length) * Math.PI * 2;
        const targetAngle = (targetIndex / sampleData.nodes.length) * Math.PI * 2;
        
        const x1 = centerX + radius * Math.cos(sourceAngle);
        const y1 = centerY + radius * Math.sin(sourceAngle);
        const x2 = centerX + radius * Math.cos(targetAngle);
        const y2 = centerY + radius * Math.sin(targetAngle);
        
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#4B5563");
        line.setAttribute("stroke-width", link.strength * 2);
        line.setAttribute("opacity", "0.6");
        svg.appendChild(line);
      });
      
      sampleData.nodes.forEach((node, index) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        const centerX = 150;
        const centerY = 100;
        const radius = 80;
        const angle = (index / sampleData.nodes.length) * Math.PI * 2;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Circle for node
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", node.group === 'primary' ? 8 : node.group === 'secondary' ? 6 : 4);
        circle.setAttribute("fill", node.group === 'primary' ? "#EAB308" : 
                             node.group === 'secondary' ? "#9CA3AF" : 
                             node.group === 'tertiary' ? "#4B5563" : "#6B7280");
        
        // Text label
        text.setAttribute("x", x);
        text.setAttribute("y", y + 15);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#D1D5DB");
        text.setAttribute("font-size", "8px");
        text.textContent = node.label;
        
        svg.appendChild(circle);
        svg.appendChild(text);
      });
      
      graphRef.current.appendChild(svg);
    }
  }, []);
  
  return (
    <div className={styles.card.base}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>
          <NetworkIcon size={18} className="inline-block mr-2" />
          Knowledge Graph
        </h2>
        
        <div className="flex space-x-2">
          <button className={styles.button.icon} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button className={styles.button.icon} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className={styles.button.icon} title="Information">
            <Info size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "h-64")}>
        <div ref={graphRef} className="w-full h-full">
          {/* Graph will be rendered here */}
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Basic Knowledge Graph Panel component for the search page
 */
export const KnowledgeGraphPanel = () => {
  return (
    <div className={styles.card.base}>
      <div className={styles.card.header}>
        <h2 className={styles.text.heading3}>Knowledge Graph</h2>
      </div>
      <div className={styles.card.body + " min-h-[300px] flex items-center justify-center"}>
        <p className="text-gray-400 text-center">
          Simplified knowledge graph visualization.<br />
          <a href="/analytics" className="text-yellow-500 hover:underline">
            View enhanced interactive version →
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Enhanced Interactive Knowledge Graph for the analytics page
 * Allows zooming, panning, and interactive exploration of search result relationships
 */
export const InteractiveKnowledgeGraph = ({ data = [] }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [zoom, setZoom] = useState(1);
  
  // Process data to create graph nodes and links
  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Create nodes and links from search data
      const processedNodes = [];
      const processedLinks = [];
      const nodeMap = new Map();
      
      // Process keywords as primary nodes
      data.forEach(session => {
        if (!session.keyword || !session.results) return;
        
        // Add keyword node if it doesn't exist
        if (!nodeMap.has(session.keyword)) {
          const keywordNode = {
            id: session.keyword,
            name: session.keyword,
            type: 'keyword',
            group: 1,
            count: 1,
            size: 20 // Larger size for keywords
          };
          processedNodes.push(keywordNode);
          nodeMap.set(session.keyword, keywordNode);
        } else {
          // Increment existing node count
          const existingNode = nodeMap.get(session.keyword);
          existingNode.count += 1;
          existingNode.size = Math.min(30, 20 + (existingNode.count * 2));
        }
        
        // Process results and connect to keyword
        if (session.results && session.results.length > 0) {
          // Take only top 5 results to avoid cluttering
          const topResults = session.results.slice(0, 5); 
          
          topResults.forEach((result, index) => {
            // Create a simplified ID from the result title
            const resultId = `result-${result.title.slice(0, 20).replace(/\s+/g, '-')}`;
            
            // Add result node if it doesn't exist
            if (!nodeMap.has(resultId)) {
              const resultNode = {
                id: resultId,
                name: result.title,
                type: 'result',
                url: result.url,
                group: 2,
                size: 10 // Smaller size for results
              };
              processedNodes.push(resultNode);
              nodeMap.set(resultId, resultNode);
            }
            
            // Create link between keyword and result
            processedLinks.push({
              source: session.keyword,
              target: resultId,
              value: 5 - index // Stronger links for top results
            });
          });
        }
      });
      
      setNodes(processedNodes);
      setLinks(processedLinks);
      setLoading(false);
    } catch (error) {
      console.error('Error processing graph data:', error);
      setLoading(false);
    }
  }, [data]);
  
  // Create and update the D3 visualization
  useEffect(() => {
    if (loading || !svgRef.current || nodes.length === 0) return;
    
    // Clear any existing graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Add zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        setZoom(event.transform.k);
        container.attr("transform", event.transform);
      });
    
    svg.call(zoomBehavior);
    
    // Create container for all elements
    const container = svg.append("g");
    
    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size * 1.5));
    
    // Add links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));
    
    // Add nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));
    
    // Add node circles with different colors based on type
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.type === 'keyword' ? "#EAB308" : "#4B5563")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
    
    // Add node labels
    node.append("text")
      .attr("x", 0)
      .attr("y", d => d.type === 'keyword' ? -d.size - 5 : d.size + 15)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.type === 'keyword' ? "#EAB308" : "#D1D5DB")
      .attr("font-weight", d => d.type === 'keyword' ? "bold" : "normal")
      .attr("font-size", d => d.type === 'keyword' ? "14px" : "12px")
      .text(d => d.name)
      .each(function(d) {
        // Truncate long text
        const text = d3.select(this);
        const maxLength = d.type === 'keyword' ? 15 : 25;
        let textContent = d.name;
        
        if (textContent.length > maxLength) {
          textContent = textContent.substring(0, maxLength - 3) + "...";
        }
        
        text.text(textContent);
      });
    
    // Add tooltips on hover
    node.append("title")
      .text(d => `${d.name}${d.type === 'result' ? '\n' + d.url : ''}`);
    
    // Add click behavior for nodes
    node.on("click", (event, d) => {
      if (d.type === 'result' && d.url) {
        window.open(d.url, '_blank');
      }
    });
    
    // Update node positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag behavior function
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [nodes, links, loading]);
  
  // Zoom controls
  const handleZoomIn = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 1.5);
  };
  
  const handleZoomOut = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 0.75);
  };
  
  const handleReset = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().transform, d3.zoomIdentity);
  };
  
  return (
    <div className="w-full h-full">
      {/* Controls */}
      <div className="flex justify-end mb-2">
        <div className="bg-gray-700 rounded-lg p-1 flex">
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-300 hover:text-white"
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-300 hover:text-white"
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-300 hover:text-white"
            title="Reset View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Graph */}
      <div 
        ref={containerRef} 
        className="w-full h-[560px] bg-gray-900 rounded-lg overflow-hidden"
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-300">Building knowledge graph...</span>
          </div>
        ) : nodes.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No data available for visualization
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full h-full cursor-move"
            style={{ cursor: "grab" }}
          />
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex justify-center">
        <div className="flex items-center space-x-6 text-sm text-gray-300">
          <div className="flex items-center">
            <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
            <span>Keywords</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-gray-500 rounded-full mr-2"></span>
            <span>Search Results</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 italic">(Click any result to open URL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
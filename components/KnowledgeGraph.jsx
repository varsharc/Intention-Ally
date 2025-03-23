import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RefreshCw, ZoomIn, ZoomOut, Maximize2, Search } from 'lucide-react';

/**
 * KnowledgeGraph component visualizes semantic relationships between search results
 * using D3 force-directed graph
 */
const KnowledgeGraph = ({ data, onNodeClick }) => {
  const svgRef = useRef(null);
  const graphRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data if none provided
  const sampleData = {
    nodes: [
      { id: "carbon insetting", group: 1, size: 18 },
      { id: "supply chain", group: 2, size: 12 },
      { id: "emissions reduction", group: 2, size: 14 },
      { id: "climate action", group: 3, size: 10 },
      { id: "scope 3", group: 2, size: 13 },
      { id: "sustainable logistics", group: 1, size: 16 },
      { id: "carbon credits", group: 3, size: 11 },
      { id: "net zero", group: 3, size: 12 },
      { id: "offsetting", group: 2, size: 13 },
      { id: "value chain", group: 2, size: 11 },
      { id: "sustainability reporting", group: 3, size: 10 }
    ],
    links: [
      { source: "carbon insetting", target: "supply chain", value: 8 },
      { source: "carbon insetting", target: "emissions reduction", value: 10 },
      { source: "carbon insetting", target: "climate action", value: 6 },
      { source: "carbon insetting", target: "scope 3", value: 9 },
      { source: "carbon insetting", target: "sustainable logistics", value: 11 },
      { source: "carbon insetting", target: "carbon credits", value: 7 },
      { source: "carbon insetting", target: "offsetting", value: 9 },
      { source: "sustainable logistics", target: "supply chain", value: 7 },
      { source: "sustainable logistics", target: "emissions reduction", value: 9 },
      { source: "sustainable logistics", target: "scope 3", value: 8 },
      { source: "emissions reduction", target: "net zero", value: 7 },
      { source: "emissions reduction", target: "climate action", value: 8 },
      { source: "scope 3", target: "value chain", value: 8 },
      { source: "scope 3", target: "sustainability reporting", value: 6 },
      { source: "carbon credits", target: "offsetting", value: 10 },
      { source: "offsetting", target: "net zero", value: 7 }
    ]
  };

  // Use provided data or sample data
  const graphData = data || sampleData;

  // Create and update graph
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear existing graph
    svg.selectAll("*").remove();
    
    // Simulation setup with forces
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(d => 150 - d.value * 5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d.size || 10) + 10));
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k.toFixed(1));
      });
    
    svg.call(zoom);
    
    // Create container for all elements
    const g = svg.append("g");
    graphRef.current = g;
    
    // Color scale for nodes
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Create links
    const link = g.append("g")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 0.5);
    
    // Create nodes
    const node = g.append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation))
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d);
      });
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.size || 10)
      .attr("fill", d => d.group === 1 ? "#FFD700" : color(d.group))
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5);
    
    // Add text labels to nodes
    node.append("text")
      .attr("dx", d => (d.size || 10) + 5)
      .attr("dy", ".35em")
      .attr("font-size", d => d.group === 1 ? "12px" : "10px")
      .attr("font-weight", d => d.group === 1 ? "bold" : "normal")
      .style("fill", "#fff")
      .text(d => d.id);
    
    // Add title tooltips to nodes
    node.append("title")
      .text(d => d.id);
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag behavior for nodes
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
    
    // Center the view
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1)
      .translate(-width / 2, -height / 2);
    
    svg.call(zoom.transform, initialTransform);
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeClick]);

  // Zoom in function
  const handleZoomIn = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 1.3);
  };

  // Zoom out function
  const handleZoomOut = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 0.7);
  };

  // Reset zoom function
  const handleResetZoom = () => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    d3.select(svgRef.current)
      .transition()
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1)
          .translate(-width / 2, -height / 2)
      );
  };

  // Simulate refreshing the graph
  const handleRefresh = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // For demo purposes, just re-render the same graph
      const svg = d3.select(svgRef.current);
      const simulation = d3.forceSimulation(graphData.nodes)
        .force("link", d3.forceLink(graphData.links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(
          svgRef.current.clientWidth / 2,
          svgRef.current.clientHeight / 2
        ));
      
      simulation.alpha(1).restart();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">Knowledge Graph</h2>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded">
            Zoom: {zoomLevel}x
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            title="Refresh Graph"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            title="Reset View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mb-3 flex items-center">
        <Search size={14} className="mr-1" />
        Click on a node to search for that term
      </div>
      
      <div className="relative flex-1 bg-gray-900 rounded overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mb-2"></div>
              <span className="text-sm text-gray-300">Updating graph...</span>
            </div>
          </div>
        )}
        <svg 
          ref={svgRef} 
          className="w-full h-full cursor-move"
          aria-label="Interactive knowledge graph showing semantic relationships between search terms"
        ></svg>
      </div>
      
      <div className="mt-3 bg-gray-900 p-2 rounded text-xs text-gray-400">
        <div className="mb-1 flex items-center">
          <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block mr-2"></span>
          Primary topic
        </div>
        <div className="mb-1 flex items-center">
          <span className="h-3 w-3 rounded-full bg-blue-500 inline-block mr-2"></span>
          Related concepts
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-2"></span>
          Secondary topics
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
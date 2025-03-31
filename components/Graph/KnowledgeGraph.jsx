import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Filter, Maximize2, Layers, Grid, List, ZoomIn, ZoomOut } from 'lucide-react';

export const KnowledgeGraph = ({ data, title = "Knowledge Graph" }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('clusters');
  const [timeRange, setTimeRange] = useState('30');
  const [nodeSizeMetric, setNodeSizeMetric] = useState('authority');
  
  // Default data structure if no data provided
  const defaultData = {
    nodes: [
      { id: 1, title: "EU Regulatory Framework", url: "#", cluster: 1, authority: 85, x: 0, y: 0, date: new Date().toISOString(), source_type: "regulatory" },
      { id: 2, title: "Academic Research on Standards", url: "#", cluster: 2, authority: 75, x: -150, y: -150, date: new Date().toISOString(), source_type: "academic" },
      { id: 3, title: "Market Analysis Report", url: "#", cluster: 3, authority: 65, x: 150, y: -150, date: new Date().toISOString(), source_type: "market" },
      { id: 4, title: "Supply Chain Guidelines", url: "#", cluster: 4, authority: 55, x: -150, y: 150, date: new Date().toISOString(), source_type: "industry" },
      { id: 5, title: "Trade Impact Assessment", url: "#", cluster: 4, authority: 45, x: 150, y: 150, date: new Date().toISOString(), source_type: "news" },
    ],
    edges: [
      { source: 1, target: 2, weight: 0.8 },
      { source: 1, target: 3, weight: 0.7 },
      { source: 1, target: 4, weight: 0.6 },
      { source: 2, target: 3, weight: 0.5 },
      { source: 4, target: 5, weight: 0.9 },
    ],
    clusters: [
      { id: 1, label: "EU Policy", description: "European Union policy guidelines", node_count: 1 },
      { id: 2, label: "Standards", description: "Technical standards", node_count: 1 },
      { id: 3, label: "Market", description: "Market analysis", node_count: 1 },
      { id: 4, label: "Supply Chain", description: "Supply chain and logistics", node_count: 2 },
    ]
  };
  
  // Use provided data or default data
  const graphData = data || defaultData;
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.parentElement.clientWidth;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    // Clear previous visualization
    svg.selectAll("*").remove();
    
    // Create a group for the graph
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Define color scale for node types
    const colorScale = d3.scaleOrdinal()
      .domain(["regulatory", "academic", "market", "industry", "news"])
      .range(["#FFD700", "#3498DB", "#2ECC71", "#9B59B6", "#E74C3C"]);
    
    // Define node size scale based on authority
    const nodeSizeScale = d3.scaleLinear()
      .domain([0, 100])
      .range([5, 25]);
    
    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .attr("class", "absolute bg-black bg-opacity-80 text-white p-2 rounded text-xs z-50 pointer-events-none");
    
    // Function to show tooltip
    const showTooltip = (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          <div class="font-bold">${d.title}</div>
          <div>Authority: ${d.authority}%</div>
          <div>Type: ${d.source_type}</div>
          <div class="text-xs italic mt-1">Click to view source</div>
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    };
    
    // Function to hide tooltip
    const hideTooltip = () => {
      tooltip.style("opacity", 0);
    };
    
    // Setup force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges)
        .id(d => d.id)
        .distance(d => 200 - (d.weight * 100)) // Closer links for stronger weights
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => nodeSizeScale(d.authority) + 10));
    
    // Add edges
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.edges)
      .enter()
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-width", d => d.weight * 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", d => d.weight < 0.7 ? "5,3" : "none");
    
    // Add nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip)
      .on("click", (event, d) => {
        if (d.url && d.url !== '#') {
          window.open(d.url, '_blank');
        }
      });
    
    // Add node circles
    node.append("circle")
      .attr("r", d => nodeSizeScale(d.authority))
      .attr("fill", d => colorScale(d.source_type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.8);
    
    // Add node labels
    node.append("text")
      .text(d => {
        // Truncate long titles
        return d.title.length > 20 ? d.title.substring(0, 20) + "..." : d.title;
      })
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .attr("dy", d => nodeSizeScale(d.authority) + 12)
      .attr("text-anchor", "middle");
    
    // Add cluster label nodes for cluster view
    if (viewMode === 'clusters') {
      // Create cluster groups
      const clusters = {};
      graphData.nodes.forEach(node => {
        if (node.cluster !== undefined && node.cluster !== null) {
          if (!clusters[node.cluster]) {
            clusters[node.cluster] = {
              nodes: [],
              x: 0,
              y: 0,
              size: 0
            };
          }
          clusters[node.cluster].nodes.push(node);
        }
      });
      
      // Calculate cluster centers and add labels
      Object.keys(clusters).forEach(clusterId => {
        const cluster = clusters[clusterId];
        
        // Calculate average position and total size of cluster
        let sumX = 0, sumY = 0;
        cluster.nodes.forEach(node => {
          sumX += node.x;
          sumY += node.y;
          cluster.size += nodeSizeScale(node.authority);
        });
        
        cluster.x = sumX / cluster.nodes.length;
        cluster.y = sumY / cluster.nodes.length;
        
        // Find matching cluster info
        const clusterInfo = graphData.clusters.find(c => c.id == clusterId);
        if (clusterInfo) {
          // Add cluster label
          g.append("text")
            .attr("x", cluster.x)
            .attr("y", cluster.y - cluster.size - 20)
            .text(clusterInfo.label)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#fff");
          
          // Add node count
          g.append("text")
            .attr("x", cluster.x)
            .attr("y", cluster.y - cluster.size - 5)
            .text(`${clusterInfo.node_count} sources`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "#ccc");
        }
      });
    }
    
    // Add legend
    const legendGroup = svg.append("g")
      .attr("transform", `translate(20, 20)`)
      .attr("class", "legend");
    
    legendGroup.append("rect")
      .attr("width", 120)
      .attr("height", 130)
      .attr("fill", "black")
      .attr("fill-opacity", 0.7)
      .attr("rx", 5);
    
    legendGroup.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("Legend")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
    
    const sourceLegends = [
      { type: "regulatory", label: "Regulatory" },
      { type: "academic", label: "Academic" },
      { type: "market", label: "Market" },
      { type: "industry", label: "Industry" },
      { type: "news", label: "News & Media" }
    ];
    
    sourceLegends.forEach((source, i) => {
      legendGroup.append("circle")
        .attr("cx", 15)
        .attr("cy", 35 + (i * 18))
        .attr("r", 5)
        .attr("fill", colorScale(source.type));
      
      legendGroup.append("text")
        .attr("x", 25)
        .attr("y", 39 + (i * 18))
        .text(source.label)
        .attr("fill", "white")
        .attr("font-size", "10px");
    });
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(Math.round(event.transform.k * 100));
      });
    
    svg.call(zoom);
    
    // Function to handle manual zoom
    window.handleZoom = (direction) => {
      const currentTransform = d3.zoomTransform(svg.node());
      const scale = direction === 'in' ? 1.2 : 0.8;
      const newScale = currentTransform.k * scale;
      
      if (newScale >= 0.1 && newScale <= 2) {
        svg.transition().duration(300).call(
          zoom.transform,
          d3.zoomIdentity
            .translate(currentTransform.x, currentTransform.y)
            .scale(newScale)
        );
      }
    };
    
    return () => {
      simulation.stop();
    };
  }, [graphData, viewMode, nodeSizeMetric]);
  
  // Handle zoom buttons
  const handleZoomIn = () => {
    window.handleZoom('in');
  };
  
  const handleZoomOut = () => {
    window.handleZoom('out');
  };
  
  // Handle reset view
  const handleResetView = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
      );
    setZoomLevel(100);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        
        <div className="flex space-x-2">
          <div className="p-2 bg-gray-700 rounded flex items-center space-x-2">
            <Filter size={16} />
            <select 
              className="bg-transparent text-sm"
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
            >
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
              <option value="1">Last 24 hours</option>
            </select>
          </div>
          <button className="p-2 bg-gray-700 rounded">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'clusters' ? 'bg-gray-700' : 'bg-gray-900'}`}
          onClick={() => setViewMode('clusters')}
        >
          <Layers size={14} className="mr-1" />
          <span>Clusters</span>
        </button>
        <button 
          className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-900'}`}
          onClick={() => setViewMode('grid')}
        >
          <Grid size={14} className="mr-1" />
          <span>Grid</span>
        </button>
        <button 
          className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'tree' ? 'bg-gray-700' : 'bg-gray-900'}`}
          onClick={() => setViewMode('tree')}
        >
          <List size={14} className="mr-1" />
          <span>Tree</span>
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-md text-sm">
          <span>Node Size:</span>
          <select 
            className="bg-transparent text-sm"
            value={nodeSizeMetric}
            onChange={e => setNodeSizeMetric(e.target.value)}
          >
            <option value="authority">Authority</option>
            <option value="relevance">Relevance</option>
            <option value="recency">Recency</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded relative">
        {/* Graph visualization with D3.js */}
        <svg ref={svgRef} width="100%" height="100%"></svg>
        
        {/* Tooltip */}
        <div ref={tooltipRef}></div>
      </div>
      
      <div className="flex justify-between items-center pt-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 bg-gray-700 rounded hover:bg-gray-600"
              onClick={handleZoomOut}
            >
              <ZoomOut size={16} />
            </button>
            <div className="flex items-center">
              <span className="text-gray-400 mx-2">Zoom: {zoomLevel}%</span>
            </div>
            <button 
              className="p-1 bg-gray-700 rounded hover:bg-gray-600"
              onClick={handleZoomIn}
            >
              <ZoomIn size={16} />
            </button>
          </div>
          <button 
            className="px-3 py-1 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
            onClick={handleResetView}
          >
            Reset View
          </button>
        </div>
        <div className="text-gray-400">
          <span>{graphData.nodes.length} sources discovered</span> · 
          <span>{graphData.clusters.length} clusters</span> · 
          <span>Last updated: 2h ago</span>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
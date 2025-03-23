// Knowledge Graph Visualization Component
import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Filter, 
  Download, 
  Maximize,
  Grid,
  Network
} from 'lucide-react';

// Knowledge Graph Component
export const KnowledgeGraph = () => {
  const [visualizationMode, setVisualizationMode] = useState('clusters');
  const graphContainerRef = useRef(null);
  
  // This would normally connect to D3.js or another visualization library
  useEffect(() => {
    if (graphContainerRef.current) {
      renderMockGraph();
    }
  }, [visualizationMode]);
  
  // Placeholder for actual D3.js implementation
  const renderMockGraph = () => {
    const container = graphContainerRef.current;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create SVG representation of the graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    
    // Create elements based on visualization mode
    if (visualizationMode === 'clusters') {
      createClusterVisualization(svg);
    } else if (visualizationMode === 'network') {
      createNetworkVisualization(svg);
    } else if (visualizationMode === 'timeline') {
      createTimelineVisualization(svg);
    }
    
    container.appendChild(svg);
  };
  
  // Mock cluster visualization
  const createClusterVisualization = (svg) => {
    const clusters = [
      { cx: 200, cy: 300, r: 80, color: '#FFC107', label: 'Regulatory', count: 8 },
      { cx: 400, cy: 200, r: 100, color: '#9C27B0', label: 'Industry', count: 12 },
      { cx: 600, cy: 300, r: 70, color: '#03A9F4', label: 'Academic', count: 6 },
      { cx: 400, cy: 450, r: 90, color: '#4CAF50', label: 'Technology', count: 10 }
    ];
    
    // Add clusters
    clusters.forEach(cluster => {
      // Cluster circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cluster.cx);
      circle.setAttribute('cy', cluster.cy);
      circle.setAttribute('r', cluster.r);
      circle.setAttribute('fill', `${cluster.color}30`); // 30% opacity
      circle.setAttribute('stroke', cluster.color);
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
      
      // Cluster label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cluster.cx);
      text.setAttribute('y', cluster.cy);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-weight', 'bold');
      text.textContent = cluster.label;
      svg.appendChild(text);
      
      // Count
      const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      countText.setAttribute('x', cluster.cx);
      countText.setAttribute('y', cluster.cy + 20);
      countText.setAttribute('text-anchor', 'middle');
      countText.setAttribute('fill', 'white');
      countText.setAttribute('font-size', '12');
      countText.textContent = `${cluster.count} items`;
      svg.appendChild(countText);
      
      // Add small nodes inside clusters
      for (let i = 0; i < cluster.count; i++) {
        const angle = (2 * Math.PI * i) / cluster.count;
        const distance = cluster.r * 0.6;
        const nx = cluster.cx + distance * Math.cos(angle);
        const ny = cluster.cy + distance * Math.sin(angle);
        
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', nx);
        node.setAttribute('cy', ny);
        node.setAttribute('r', 6);
        node.setAttribute('fill', 'white');
        node.setAttribute('stroke', cluster.color);
        node.setAttribute('stroke-width', '2');
        svg.appendChild(node);
      }
    });
    
    // Add connections between clusters
    const connections = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },
      { from: 0, to: 2 }
    ];
    
    connections.forEach(conn => {
      const c1 = clusters[conn.from];
      const c2 = clusters[conn.to];
      
      // Calculate angle between clusters
      const dx = c2.cx - c1.cx;
      const dy = c2.cy - c1.cy;
      const angle = Math.atan2(dy, dx);
      
      // Adjust start and end points to be on the edge of the circles
      const startX = c1.cx + c1.r * Math.cos(angle);
      const startY = c1.cy + c1.r * Math.sin(angle);
      const endX = c2.cx - c2.r * Math.cos(angle);
      const endY = c2.cy - c2.r * Math.sin(angle);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startX);
      line.setAttribute('y1', startY);
      line.setAttribute('x2', endX);
      line.setAttribute('y2', endY);
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,2');
      svg.appendChild(line);
    });
  };
  
  // Mock network visualization
  const createNetworkVisualization = (svg) => {
    const nodes = [
      { x: 400, y: 300, r: 15, color: '#FFC107', label: 'Main Topic' },
      { x: 200, y: 200, r: 10, color: '#03A9F4', label: 'Subtopic 1' },
      { x: 600, y: 200, r: 10, color: '#03A9F4', label: 'Subtopic 2' },
      { x: 300, y: 400, r: 10, color: '#03A9F4', label: 'Subtopic 3' },
      { x: 500, y: 400, r: 10, color: '#03A9F4', label: 'Subtopic 4' },
      { x: 150, y: 300, r: 8, color: '#4CAF50', label: 'Source 1' },
      { x: 250, y: 100, r: 8, color: '#4CAF50', label: 'Source 2' },
      { x: 650, y: 300, r: 8, color: '#4CAF50', label: 'Source 3' },
      { x: 550, y: 100, r: 8, color: '#4CAF50', label: 'Source 4' },
      { x: 200, y: 450, r: 8, color: '#4CAF50', label: 'Source 5' },
      { x: 400, y: 500, r: 8, color: '#4CAF50', label: 'Source 6' },
      { x: 600, y: 450, r: 8, color: '#4CAF50', label: 'Source 7' }
    ];
    
    const links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 1, target: 5 },
      { source: 1, target: 6 },
      { source: 2, target: 7 },
      { source: 2, target: 8 },
      { source: 3, target: 9 },
      { source: 3, target: 10 },
      { source: 4, target: 11 }
    ];
    
    // Draw links
    links.forEach(link => {
      const source = nodes[link.source];
      const target = nodes[link.target];
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', source.x);
      line.setAttribute('y1', source.y);
      line.setAttribute('x2', target.x);
      line.setAttribute('y2', target.y);
      line.setAttribute('stroke', '#555');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.r);
      circle.setAttribute('fill', node.color);
      svg.appendChild(circle);
      
      // Node labels (only for larger nodes)
      if (node.r >= 10) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + node.r + 12);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.textContent = node.label;
        svg.appendChild(text);
      }
    });
  };
  
  // Mock timeline visualization
  const createTimelineVisualization = (svg) => {
    // Timeline axis
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 100);
    line.setAttribute('y1', 300);
    line.setAttribute('x2', 700);
    line.setAttribute('y2', 300);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
    
    // Time markers
    const timeMarkers = [
      { x: 100, label: 'Jan 1' },
      { x: 200, label: 'Jan 8' },
      { x: 300, label: 'Jan 15' },
      { x: 400, label: 'Jan 22' },
      { x: 500, label: 'Jan 29' },
      { x: 600, label: 'Feb 5' },
      { x: 700, label: 'Feb 12' }
    ];
    
    timeMarkers.forEach(marker => {
      // Marker line
      const markerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      markerLine.setAttribute('x1', marker.x);
      markerLine.setAttribute('y1', 295);
      markerLine.setAttribute('x2', marker.x);
      markerLine.setAttribute('y2', 305);
      markerLine.setAttribute('stroke', '#666');
      markerLine.setAttribute('stroke-width', '1');
      svg.appendChild(markerLine);
      
      // Marker label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', marker.x);
      text.setAttribute('y', 325);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12');
      text.textContent = marker.label;
      svg.appendChild(text);
    });
    
    // Event nodes
    const events = [
      { x: 150, y: 200, color: '#FFC107', label: 'New Regulation' },
      { x: 250, y: 250, color: '#03A9F4', label: 'Industry Response' },
      { x: 300, y: 150, color: '#4CAF50', label: 'Research Paper' },
      { x: 450, y: 200, color: '#9C27B0', label: 'Market Impact' },
      { x: 550, y: 150, color: '#4CAF50', label: 'Case Study' },
      { x: 650, y: 250, color: '#E91E63', label: 'Key Development' }
    ];
    
    events.forEach(event => {
      // Event line to timeline
      const eventLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      eventLine.setAttribute('x1', event.x);
      eventLine.setAttribute('y1', event.y);
      eventLine.setAttribute('x2', event.x);
      eventLine.setAttribute('y2', 300);
      eventLine.setAttribute('stroke', '#666');
      eventLine.setAttribute('stroke-width', '1');
      eventLine.setAttribute('stroke-dasharray', '3,2');
      svg.appendChild(eventLine);
      
      // Event node
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', event.x);
      circle.setAttribute('cy', event.y);
      circle.setAttribute('r', 8);
      circle.setAttribute('fill', event.color);
      svg.appendChild(circle);
      
      // Event label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', event.x);
      text.setAttribute('y', event.y - 12);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12');
      text.textContent = event.label;
      svg.appendChild(text);
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Knowledge Graph</h2>
        
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gray-700 rounded">
            <select 
              className="bg-transparent text-sm border-none focus:outline-none text-white"
              value={visualizationMode}
              onChange={(e) => setVisualizationMode(e.target.value)}
            >
              <option value="clusters">Cluster View</option>
              <option value="network">Network View</option>
              <option value="timeline">Timeline View</option>
            </select>
          </div>
          
          <div className="flex bg-gray-700 rounded">
            <button className="p-1.5 hover:bg-gray-600" title="Zoom In">
              <ZoomIn size={16} className="text-white" />
            </button>
            <button className="p-1.5 hover:bg-gray-600" title="Zoom Out">
              <ZoomOut size={16} className="text-white" />
            </button>
            <button className="p-1.5 hover:bg-gray-600" title="Reset View">
              <RefreshCw size={16} className="text-white" />
            </button>
          </div>
          
          <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded" title="Filter Results">
            <Filter size={16} className="text-white" />
          </button>
          
          <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded" title="Download Visualization">
            <Download size={16} className="text-white" />
          </button>
          
          <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded" title="Fullscreen">
            <Maximize size={16} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded overflow-hidden relative min-h-[400px]">
        <div className="absolute inset-0" ref={graphContainerRef}></div>
        
        {/* Legend */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded p-2">
          <div className="text-xs font-medium text-white mb-1">Legend</div>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-xs text-white">Regulatory</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-xs text-white">Industry</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-white">Academic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-white">Technology</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <span className="mr-2">View mode:</span>
          <div className="flex bg-gray-700 rounded">
            <button 
              className={`p-1 ${visualizationMode === 'clusters' ? 'bg-yellow-500 text-black' : 'text-white hover:bg-gray-600'} rounded-l flex items-center`}
              onClick={() => setVisualizationMode('clusters')}
              title="Cluster View"
            >
              <Grid size={14} className="mr-1" />
              <span className="text-xs">Clusters</span>
            </button>
            <button 
              className={`p-1 ${visualizationMode === 'network' ? 'bg-yellow-500 text-black' : 'text-white hover:bg-gray-600'} rounded-r flex items-center`}
              onClick={() => setVisualizationMode('network')}
              title="Network View"
            >
              <Network size={14} className="mr-1" />
              <span className="text-xs">Network</span>
            </button>
          </div>
        </div>
        
        <div>
          <span className="mr-1">Nodes:</span>
          <span className="text-white">36</span>
          <span className="mx-2">|</span>
          <span className="mr-1">Edges:</span>
          <span className="text-white">48</span>
          <span className="mx-2">|</span>
          <span className="mr-1">Clusters:</span>
          <span className="text-white">4</span>
        </div>
      </div>
    </div>
  );
};
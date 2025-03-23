import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Calendar, Filter, DownloadCloud, Sliders } from 'lucide-react';

/**
 * TrendVisualization component displays keyword tracking data over time
 * with interactive filters and tooltips
 */
const TrendVisualization = ({ data, keywords = [] }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [timeRange, setTimeRange] = useState('month');  // 'week', 'month', 'year'
  const [metricType, setMetricType] = useState('volume'); // 'volume', 'sentiment', 'relevance'
  const [showAllKeywords, setShowAllKeywords] = useState(true);
  const [visibleKeywords, setVisibleKeywords] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Sample data if none provided
  const sampleData = [
    {
      keyword: "carbon insetting",
      trends: [
        { date: "2025-02-23", volume: 34, sentiment: 0.65, relevance: 0.82 },
        { date: "2025-02-24", volume: 42, sentiment: 0.72, relevance: 0.85 },
        { date: "2025-02-25", volume: 38, sentiment: 0.68, relevance: 0.80 },
        { date: "2025-02-26", volume: 45, sentiment: 0.71, relevance: 0.83 },
        { date: "2025-02-27", volume: 52, sentiment: 0.75, relevance: 0.87 },
        { date: "2025-02-28", volume: 48, sentiment: 0.73, relevance: 0.84 },
        { date: "2025-03-01", volume: 41, sentiment: 0.69, relevance: 0.81 },
        { date: "2025-03-02", volume: 46, sentiment: 0.70, relevance: 0.83 },
        { date: "2025-03-03", volume: 55, sentiment: 0.76, relevance: 0.88 },
        { date: "2025-03-04", volume: 60, sentiment: 0.78, relevance: 0.90 },
        { date: "2025-03-05", volume: 58, sentiment: 0.77, relevance: 0.89 },
        { date: "2025-03-06", volume: 64, sentiment: 0.80, relevance: 0.92 },
        { date: "2025-03-07", volume: 72, sentiment: 0.82, relevance: 0.94 },
        { date: "2025-03-08", volume: 68, sentiment: 0.81, relevance: 0.93 },
        { date: "2025-03-09", volume: 75, sentiment: 0.83, relevance: 0.95 },
        { date: "2025-03-10", volume: 80, sentiment: 0.85, relevance: 0.96 },
        { date: "2025-03-11", volume: 74, sentiment: 0.82, relevance: 0.94 },
        { date: "2025-03-12", volume: 78, sentiment: 0.84, relevance: 0.95 },
        { date: "2025-03-13", volume: 85, sentiment: 0.86, relevance: 0.97 },
        { date: "2025-03-14", volume: 90, sentiment: 0.87, relevance: 0.98 },
        { date: "2025-03-15", volume: 86, sentiment: 0.85, relevance: 0.96 },
        { date: "2025-03-16", volume: 92, sentiment: 0.88, relevance: 0.98 },
        { date: "2025-03-17", volume: 98, sentiment: 0.90, relevance: 0.99 },
        { date: "2025-03-18", volume: 94, sentiment: 0.89, relevance: 0.98 },
        { date: "2025-03-19", volume: 100, sentiment: 0.91, relevance: 1.00 },
        { date: "2025-03-20", volume: 95, sentiment: 0.88, relevance: 0.97 },
        { date: "2025-03-21", volume: 97, sentiment: 0.89, relevance: 0.98 },
        { date: "2025-03-22", volume: 93, sentiment: 0.87, relevance: 0.96 },
        { date: "2025-03-23", volume: 96, sentiment: 0.88, relevance: 0.97 }
      ]
    },
    {
      keyword: "sustainable logistics",
      trends: [
        { date: "2025-02-23", volume: 28, sentiment: 0.60, relevance: 0.75 },
        { date: "2025-02-24", volume: 32, sentiment: 0.62, relevance: 0.76 },
        { date: "2025-02-25", volume: 30, sentiment: 0.61, relevance: 0.75 },
        { date: "2025-02-26", volume: 35, sentiment: 0.63, relevance: 0.77 },
        { date: "2025-02-27", volume: 38, sentiment: 0.64, relevance: 0.78 },
        { date: "2025-02-28", volume: 36, sentiment: 0.63, relevance: 0.77 },
        { date: "2025-03-01", volume: 34, sentiment: 0.62, relevance: 0.76 },
        { date: "2025-03-02", volume: 37, sentiment: 0.64, relevance: 0.78 },
        { date: "2025-03-03", volume: 40, sentiment: 0.65, relevance: 0.79 },
        { date: "2025-03-04", volume: 42, sentiment: 0.66, relevance: 0.80 },
        { date: "2025-03-05", volume: 41, sentiment: 0.65, relevance: 0.79 },
        { date: "2025-03-06", volume: 44, sentiment: 0.67, relevance: 0.81 },
        { date: "2025-03-07", volume: 48, sentiment: 0.69, relevance: 0.83 },
        { date: "2025-03-08", volume: 46, sentiment: 0.68, relevance: 0.82 },
        { date: "2025-03-09", volume: 50, sentiment: 0.70, relevance: 0.84 },
        { date: "2025-03-10", volume: 52, sentiment: 0.71, relevance: 0.85 },
        { date: "2025-03-11", volume: 49, sentiment: 0.70, relevance: 0.84 },
        { date: "2025-03-12", volume: 51, sentiment: 0.71, relevance: 0.85 },
        { date: "2025-03-13", volume: 54, sentiment: 0.72, relevance: 0.86 },
        { date: "2025-03-14", volume: 56, sentiment: 0.73, relevance: 0.87 },
        { date: "2025-03-15", volume: 55, sentiment: 0.72, relevance: 0.86 },
        { date: "2025-03-16", volume: 58, sentiment: 0.74, relevance: 0.88 },
        { date: "2025-03-17", volume: 60, sentiment: 0.75, relevance: 0.89 },
        { date: "2025-03-18", volume: 57, sentiment: 0.73, relevance: 0.87 },
        { date: "2025-03-19", volume: 61, sentiment: 0.75, relevance: 0.89 },
        { date: "2025-03-20", volume: 59, sentiment: 0.74, relevance: 0.88 },
        { date: "2025-03-21", volume: 60, sentiment: 0.75, relevance: 0.89 },
        { date: "2025-03-22", volume: 58, sentiment: 0.74, relevance: 0.88 },
        { date: "2025-03-23", volume: 59, sentiment: 0.74, relevance: 0.88 }
      ]
    },
    {
      keyword: "scope 3 emissions",
      trends: [
        { date: "2025-02-23", volume: 22, sentiment: 0.55, relevance: 0.70 },
        { date: "2025-02-24", volume: 25, sentiment: 0.56, relevance: 0.71 },
        { date: "2025-02-25", volume: 24, sentiment: 0.56, relevance: 0.71 },
        { date: "2025-02-26", volume: 27, sentiment: 0.57, relevance: 0.72 },
        { date: "2025-02-27", volume: 29, sentiment: 0.58, relevance: 0.73 },
        { date: "2025-02-28", volume: 28, sentiment: 0.58, relevance: 0.73 },
        { date: "2025-03-01", volume: 26, sentiment: 0.57, relevance: 0.72 },
        { date: "2025-03-02", volume: 28, sentiment: 0.58, relevance: 0.73 },
        { date: "2025-03-03", volume: 30, sentiment: 0.59, relevance: 0.74 },
        { date: "2025-03-04", volume: 31, sentiment: 0.59, relevance: 0.74 },
        { date: "2025-03-05", volume: 30, sentiment: 0.59, relevance: 0.74 },
        { date: "2025-03-06", volume: 32, sentiment: 0.60, relevance: 0.75 },
        { date: "2025-03-07", volume: 35, sentiment: 0.61, relevance: 0.76 },
        { date: "2025-03-08", volume: 33, sentiment: 0.60, relevance: 0.75 },
        { date: "2025-03-09", volume: 36, sentiment: 0.62, relevance: 0.77 },
        { date: "2025-03-10", volume: 38, sentiment: 0.63, relevance: 0.78 },
        { date: "2025-03-11", volume: 37, sentiment: 0.62, relevance: 0.77 },
        { date: "2025-03-12", volume: 39, sentiment: 0.63, relevance: 0.78 },
        { date: "2025-03-13", volume: 41, sentiment: 0.64, relevance: 0.79 },
        { date: "2025-03-14", volume: 43, sentiment: 0.65, relevance: 0.80 },
        { date: "2025-03-15", volume: 42, sentiment: 0.64, relevance: 0.79 },
        { date: "2025-03-16", volume: 44, sentiment: 0.65, relevance: 0.80 },
        { date: "2025-03-17", volume: 46, sentiment: 0.66, relevance: 0.81 },
        { date: "2025-03-18", volume: 45, sentiment: 0.66, relevance: 0.81 },
        { date: "2025-03-19", volume: 47, sentiment: 0.67, relevance: 0.82 },
        { date: "2025-03-20", volume: 46, sentiment: 0.66, relevance: 0.81 },
        { date: "2025-03-21", volume: 47, sentiment: 0.67, relevance: 0.82 },
        { date: "2025-03-22", volume: 45, sentiment: 0.66, relevance: 0.81 },
        { date: "2025-03-23", volume: 46, sentiment: 0.66, relevance: 0.81 }
      ]
    }
  ];
  
  // Use provided data or sample data
  const chartData = data || sampleData;
  
  // Set default visible keywords using all keywords
  useEffect(() => {
    setVisibleKeywords(chartData.map(item => item.keyword));
  }, [chartData]);
  
  // Filter data based on time range
  const getFilteredData = () => {
    let filtered = [];
    
    chartData.forEach(item => {
      if (visibleKeywords.includes(item.keyword) || showAllKeywords) {
        let startDate = new Date();
        
        // Calculate start date based on time range
        if (timeRange === 'week') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (timeRange === 'month') {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (timeRange === 'year') {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }
        
        const filteredTrends = item.trends.filter(trend => {
          const trendDate = new Date(trend.date);
          return trendDate >= startDate;
        });
        
        filtered.push({
          keyword: item.keyword,
          trends: filteredTrends
        });
      }
    });
    
    return filtered;
  };
  
  // Draw chart when data or filters change
  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous chart
    svg.selectAll("*").remove();
    
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return;
    
    // Get dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create chart group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Collect all dates from all trends
    const allDates = [];
    filteredData.forEach(item => {
      item.trends.forEach(trend => {
        if (!allDates.includes(trend.date)) {
          allDates.push(trend.date);
        }
      });
    });
    
    // Sort dates
    allDates.sort((a, b) => new Date(a) - new Date(b));
    
    // Create scales
    const x = d3.scaleTime()
      .domain([new Date(allDates[0]), new Date(allDates[allDates.length - 1])])
      .range([0, innerWidth]);
    
    // Determine y-scale based on metric type
    let yMax = 0;
    filteredData.forEach(item => {
      item.trends.forEach(trend => {
        const value = trend[metricType];
        if (value > yMax) yMax = value;
      });
    });
    
    // Add 10% padding to y-scale
    yMax = yMax * 1.1;
    
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);
    
    // Create color scale for keywords
    const color = d3.scaleOrdinal()
      .domain(filteredData.map(d => d.keyword))
      .range(['#FFD700', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c']);
    
    // Create line generator
    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d[metricType]))
      .curve(d3.curveMonotoneX);
    
    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("class", "x-axis")
      .style("color", "#999")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
    
    // Add y-axis
    g.append("g")
      .attr("class", "y-axis")
      .style("color", "#999")
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
    
    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "#333")
      .attr("stroke-opacity", 0.3);
    
    // Add lines for each keyword
    const lines = g.selectAll(".line")
      .data(filteredData)
      .join("path")
      .attr("class", "line")
      .attr("d", d => line(d.trends))
      .attr("fill", "none")
      .attr("stroke", d => color(d.keyword))
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 0.8);
    
    // Add animated transition for lines
    lines.each(function(d) {
      const path = d3.select(this);
      const totalLength = path.node().getTotalLength();
      
      path.attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);
    });
    
    // Add dots for each data point
    filteredData.forEach(item => {
      g.selectAll(`.dot-${item.keyword.replace(/\s+/g, '-')}`)
        .data(item.trends)
        .join("circle")
        .attr("class", `dot dot-${item.keyword.replace(/\s+/g, '-')}`)
        .attr("cx", d => x(new Date(d.date)))
        .attr("cy", d => y(d[metricType]))
        .attr("r", 5)
        .attr("fill", color(item.keyword))
        .attr("stroke", "#222")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
          const [mx, my] = d3.pointer(event, document.body);
          
          // Format date and value
          const formatDate = d3.timeFormat("%b %d, %Y");
          let formattedValue = d[metricType];
          if (metricType === 'sentiment' || metricType === 'relevance') {
            formattedValue = (formattedValue * 100).toFixed(1) + '%';
          }
          
          // Show tooltip
          tooltip
            .style("display", "block")
            .style("left", `${mx + 10}px`)
            .style("top", `${my - 20}px`)
            .html(`
              <div class="font-semibold">${item.keyword}</div>
              <div>${formatDate(new Date(d.date))}</div>
              <div class="mt-1 font-semibold text-yellow-400">${getMetricLabel()}: ${formattedValue}</div>
            `);
          
          // Highlight dot
          d3.select(this)
            .attr("r", 7)
            .attr("stroke-width", 2);
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.style("display", "none");
          
          // Reset dot size
          d3.select(this)
            .attr("r", 5)
            .attr("stroke-width", 1);
        });
    });
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, 10)`)
      .attr("class", "legend")
      .selectAll("g")
      .data(filteredData)
      .join("g")
      .attr("transform", (d, i) => `translate(${i * 150}, 0)`);
    
    legend.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => color(d.keyword));
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .text(d => d.keyword);
    
  }, [chartData, timeRange, metricType, visibleKeywords, showAllKeywords]);
  
  // Get label for selected metric
  const getMetricLabel = () => {
    switch (metricType) {
      case 'volume':
        return 'Search Volume';
      case 'sentiment':
        return 'Sentiment Score';
      case 'relevance':
        return 'Relevance Score';
      default:
        return 'Value';
    }
  };
  
  // Toggle keyword visibility
  const toggleKeyword = (keyword) => {
    if (visibleKeywords.includes(keyword)) {
      setVisibleKeywords(visibleKeywords.filter(k => k !== keyword));
    } else {
      setVisibleKeywords([...visibleKeywords, keyword]);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">Trend Visualization</h2>
        <div className="flex items-center">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              isFiltersOpen ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'
            }`}
          >
            <Filter size={14} className="mr-1" />
            Filters
          </button>
          <button
            className="ml-2 p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            title="Export Data"
          >
            <DownloadCloud size={16} />
          </button>
        </div>
      </div>
      
      {/* Filters panel */}
      {isFiltersOpen && (
        <div className="bg-gray-700 p-3 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Time Range</label>
              <div className="flex">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`flex-1 px-3 py-1 text-sm rounded-l ${
                    timeRange === 'week' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`flex-1 px-3 py-1 text-sm ${
                    timeRange === 'month' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`flex-1 px-3 py-1 text-sm rounded-r ${
                    timeRange === 'year' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Metric</label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="volume">Search Volume</option>
                <option value="sentiment">Sentiment Score</option>
                <option value="relevance">Relevance Score</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Keywords</label>
              <div className="bg-gray-600 border border-gray-500 rounded p-2 max-h-24 overflow-y-auto">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={showAllKeywords}
                    onChange={() => setShowAllKeywords(!showAllKeywords)}
                    className="form-checkbox h-4 w-4 text-yellow-500 rounded"
                  />
                  <span className="ml-2 text-white text-sm">Show All</span>
                </label>
                
                {!showAllKeywords && chartData.map((item, idx) => (
                  <label key={idx} className="flex items-center mb-1 last:mb-0">
                    <input
                      type="checkbox"
                      checked={visibleKeywords.includes(item.keyword)}
                      onChange={() => toggleKeyword(item.keyword)}
                      className="form-checkbox h-4 w-4 text-yellow-500 rounded"
                    />
                    <span className="ml-2 text-white text-sm">{item.keyword}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chart area */}
      <div className="relative flex-1 min-h-[300px] bg-gray-900 rounded">
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          aria-label={`Trend visualization showing ${getMetricLabel()} over time`}
        ></svg>
        
        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="absolute hidden bg-gray-800 border border-gray-700 shadow-lg rounded p-2 text-xs text-white z-10 pointer-events-none"
        ></div>
      </div>
      
      {/* Legend */}
      <div className="mt-3 bg-gray-900 p-2 rounded flex flex-wrap gap-3">
        <div className="flex items-center text-xs">
          <Calendar size={14} className="mr-1.5 text-gray-400" />
          <span className="text-gray-400">Time Range: </span>
          <span className="text-white ml-1 font-medium">
            {timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
          </span>
        </div>
        <div className="flex items-center text-xs">
          <Sliders size={14} className="mr-1.5 text-gray-400" />
          <span className="text-gray-400">Metric: </span>
          <span className="text-white ml-1 font-medium">
            {getMetricLabel()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendVisualization;
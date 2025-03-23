import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * Basic Trend Visualization Panel for the search page
 */
export const TrendVisualizationPanel = () => {
  return (
    <div className={styles.card.base}>
      <div className={styles.card.header}>
        <h2 className={styles.text.heading3}>Trend Visualization</h2>
      </div>
      <div className={styles.card.body + " min-h-[300px] flex items-center justify-center"}>
        <p className="text-gray-400 text-center">
          Simplified trend visualization.<br />
          <a href="/analytics" className="text-yellow-500 hover:underline">
            View enhanced analytics →
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Enhanced Trend Visualization component for the analytics page
 * Shows trends over time for all tracked keywords
 */
export const EnhancedTrendVisualization = ({ data = [], timeframe = 7 }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);

  // Process data for visualization
  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Group data by day and keyword
      const keywordSet = new Set();
      const dateMap = new Map();
      
      // Get all dates in range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - timeframe);
      
      // Generate all dates in the range
      const dateRange = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dateRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Initialize dateMap with all dates in range
      dateRange.forEach(date => {
        const dateKey = date.toISOString().split('T')[0];
        dateMap.set(dateKey, new Map());
      });
      
      // Process search data
      data.forEach(session => {
        if (!session.keyword || !session.timestamp) return;
        
        // Add to keywords set
        keywordSet.add(session.keyword);
        
        // Get date and create a key
        const date = new Date(session.timestamp);
        const dateKey = date.toISOString().split('T')[0];
        
        // If this date is in our range
        if (dateMap.has(dateKey)) {
          const keywordMap = dateMap.get(dateKey);
          
          // Count results for this keyword on this date
          const count = keywordMap.get(session.keyword) || 0;
          keywordMap.set(session.keyword, count + 1);
        }
      });
      
      // Convert to array format for D3
      const allKeywordsArray = Array.from(keywordSet);
      const result = [];
      
      // For each date, create an entry with counts for each keyword
      dateMap.forEach((keywordMap, dateKey) => {
        const entry = { date: new Date(dateKey) };
        
        // Add all keywords (with 0 if no data)
        allKeywordsArray.forEach(keyword => {
          entry[keyword] = keywordMap.get(keyword) || 0;
        });
        
        result.push(entry);
      });
      
      // Sort by date
      result.sort((a, b) => a.date - b.date);
      
      // Store processed data
      setProcessedData(result);
      setAllKeywords(allKeywordsArray);
      
      // Initial selection of keywords (top 5 or all if less than 5)
      setSelectedKeywords(
        allKeywordsArray.length <= 5 
          ? allKeywordsArray 
          : allKeywordsArray.slice(0, 5)
      );
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing trend data:', error);
      setLoading(false);
    }
  }, [data, timeframe]);

  // Create and update the D3 visualization
  useEffect(() => {
    if (loading || !svgRef.current || processedData.length === 0 || selectedKeywords.length === 0) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Set up dimensions
    const margin = { top: 20, right: 80, bottom: 40, left: 60 };
    const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date))
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => {
        // Get max value across all selected keywords
        return d3.max(selectedKeywords, keyword => d[keyword] || 0);
      }) * 1.1]) // Add 10% padding at top
      .range([height, 0]);
    
    // Create a color scale for keywords
    const colorScale = d3.scaleOrdinal()
      .domain(selectedKeywords)
      .range(d3.schemeTableau10);
    
    // Create main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeDay.every(Math.ceil(timeframe / 10))) // Adjust tick density
      .tickFormat(d => {
        // Format date based on timeframe
        if (timeframe <= 14) {
          return d3.timeFormat("%b %d")(d);
        } else {
          return d3.timeFormat("%b %d")(d);
        }
      });
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => d);
    
    // Add x-axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
        .attr("fill", "#D1D5DB")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    
    // Add y-axis
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
        .attr("fill", "#D1D5DB");
    
    // Add grid lines
    g.append("g")
      .attr("class", "grid-lines")
      .selectAll("line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("stroke", "#374151")
        .attr("stroke-dasharray", "2,2");
    
    // Create a line generator
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));
    
    // Create area generator for hover effect
    const area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value));
    
    // Draw lines for each selected keyword
    selectedKeywords.forEach(keyword => {
      // Prepare the data for this keyword
      const keywordData = processedData.map(d => ({
        date: d.date,
        value: d[keyword] || 0,
        keyword
      }));
      
      // Add the line
      const keywordLine = g.append("path")
        .datum(keywordData)
        .attr("class", `line-${keyword.replace(/\s+/g, '-')}`)
        .attr("fill", "none")
        .attr("stroke", colorScale(keyword))
        .attr("stroke-width", 2.5)
        .attr("d", line);
      
      // Add data points
      g.selectAll(`.point-${keyword.replace(/\s+/g, '-')}`)
        .data(keywordData)
        .enter()
        .append("circle")
          .attr("class", `point-${keyword.replace(/\s+/g, '-')}`)
          .attr("cx", d => xScale(d.date))
          .attr("cy", d => yScale(d.value))
          .attr("r", 4)
          .attr("fill", colorScale(keyword))
          .attr("stroke", "#111827")
          .attr("stroke-width", 1.5)
          .on("mouseover", function(event, d) {
            // Highlight the data point
            d3.select(this)
              .attr("r", 6)
              .attr("stroke-width", 2);
            
            // Format date
            const formattedDate = d3.timeFormat("%b %d, %Y")(d.date);
            
            // Show tooltip
            tooltip
              .style("opacity", 1)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 30) + "px")
              .html(`
                <div class="font-medium">${d.keyword}</div>
                <div>${formattedDate}: ${d.value} result(s)</div>
              `);
          })
          .on("mouseout", function() {
            // Reset highlight
            d3.select(this)
              .attr("r", 4)
              .attr("stroke-width", 1.5);
            
            // Hide tooltip
            tooltip.style("opacity", 0);
          });
    });
    
    // Add axis labels
    g.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .text("Date");
    
    g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .text("Search Frequency");
    
    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + margin.left + 10}, ${margin.top})`);
    
    selectedKeywords.forEach((keyword, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      
      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colorScale(keyword));
      
      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .attr("fill", "#D1D5DB")
        .style("font-size", "12px")
        .text(keyword);
    });
    
    // Fix styles of axis elements
    svg.selectAll(".domain").attr("stroke", "#4B5563");
    svg.selectAll(".tick line").attr("stroke", "#4B5563");
    
  }, [processedData, selectedKeywords, loading, timeframe]);

  // Toggle keyword selection
  const toggleKeyword = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      // Remove if already selected (unless it's the last one)
      if (selectedKeywords.length > 1) {
        setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
      }
    } else {
      // Add if not selected
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };
  
  // Select all keywords
  const selectAllKeywords = () => {
    setSelectedKeywords([...allKeywords]);
  };
  
  // Clear all keywords (except one)
  const clearKeywords = () => {
    setSelectedKeywords([allKeywords[0]]);
  };

  return (
    <div className="w-full">
      {/* Keyword filter section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-medium text-gray-300">Filter Keywords:</h3>
          <div className="space-x-2">
            <button
              onClick={selectAllKeywords}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            >
              Select All
            </button>
            <button
              onClick={clearKeywords}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allKeywords.map(keyword => (
            <button
              key={keyword}
              onClick={() => toggleKeyword(keyword)}
              className={combineStyles(
                "px-3 py-1 text-sm rounded-full transition-colors",
                selectedKeywords.includes(keyword)
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              )}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
      
      {/* Visualization */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {loading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-300">Processing trend data...</span>
          </div>
        ) : processedData.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
            No trend data available for the selected timeframe
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              className="w-full"
              height="420"
            />
            <div
              ref={tooltipRef}
              className="absolute z-10 bg-gray-800 text-white text-sm p-2 rounded shadow-lg opacity-0 pointer-events-none transition-opacity"
            />
          </>
        )}
      </div>
      
      {/* Analysis summary */}
      {!loading && processedData.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-md font-medium text-white mb-2">Analysis Highlights:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>
              Showing search data for past {timeframe} days
            </li>
            <li>
              Total keywords tracked: {allKeywords.length}
            </li>
            <li>
              Most active day: {
                (() => {
                  // Find day with most activity
                  let maxDay = processedData[0];
                  let maxCount = 0;
                  
                  processedData.forEach(day => {
                    const dayTotal = selectedKeywords.reduce((sum, keyword) => sum + (day[keyword] || 0), 0);
                    if (dayTotal > maxCount) {
                      maxCount = dayTotal;
                      maxDay = day;
                    }
                  });
                  
                  return `${maxDay.date.toLocaleDateString()} (${maxCount} searches)`;
                })()
              }
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
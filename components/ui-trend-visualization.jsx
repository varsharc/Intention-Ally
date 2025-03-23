import React, { useEffect, useRef } from 'react';
import { BarChart2, Calendar, ChevronDown, Info, Filter } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * TrendVisualizationPanel component
 * Displays trend lines for search results over time
 */
export const TrendVisualizationPanel = () => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // This would typically use a proper charting library like D3 or Chart.js
    // For now, let's create a simple SVG visualization
    if (chartRef.current) {
      // Create SVG element
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.minHeight = "200px";
      
      // Clear existing content
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
      
      // Define chart dimensions
      const width = 300;
      const height = 150;
      const padding = 40;
      
      // Sample data (keyword mentions over time)
      const data = [
        { keyword: 'carbon insetting', values: [5, 8, 12, 10, 15, 18, 22] },
        { keyword: 'sustainable logistics', values: [8, 10, 9, 11, 14, 12, 15] },
        { keyword: 'scope 3 emissions', values: [3, 6, 8, 7, 10, 9, 12] }
      ];
      
      // Define date labels (last 7 days)
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      // Draw grid lines
      const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (height - padding * 2) * (1 - i / 5);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - padding);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#374151");
        line.setAttribute("stroke-width", i === 0 ? "1.5" : "0.5");
        line.setAttribute("stroke-dasharray", i === 0 ? "" : "2,2");
        gridGroup.appendChild(line);
        
        // Y-axis labels
        if (i > 0) {
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", padding - 10);
          text.setAttribute("y", y + 4);
          text.setAttribute("text-anchor", "end");
          text.setAttribute("font-size", "8px");
          text.setAttribute("fill", "#9CA3AF");
          text.textContent = (i * 5).toString();
          gridGroup.appendChild(text);
        }
      }
      
      // X-axis with date labels
      for (let i = 0; i < dates.length; i++) {
        const x = padding + (width - padding * 2) * (i / (dates.length - 1));
        
        // X-axis tick
        const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.setAttribute("x1", x);
        tick.setAttribute("y1", height - padding);
        tick.setAttribute("x2", x);
        tick.setAttribute("y2", height - padding + 5);
        tick.setAttribute("stroke", "#4B5563");
        tick.setAttribute("stroke-width", "1");
        gridGroup.appendChild(tick);
        
        // X-axis label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", height - padding + 15);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "8px");
        text.setAttribute("fill", "#9CA3AF");
        text.textContent = dates[i];
        gridGroup.appendChild(text);
      }
      
      svg.appendChild(gridGroup);
      
      // Draw trend lines for each keyword
      const colors = ["#EAB308", "#9CA3AF", "#6B7280"];
      
      data.forEach((series, seriesIndex) => {
        // Create line path
        const pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathD = "";
        
        // Calculate max value for scaling
        const maxValue = 25; // Use a fixed max for simplicity
        
        // Build the path
        series.values.forEach((value, index) => {
          const x = padding + (width - padding * 2) * (index / (series.values.length - 1));
          const y = padding + (height - padding * 2) * (1 - value / maxValue);
          
          if (index === 0) {
            pathD += `M ${x} ${y}`;
          } else {
            pathD += ` L ${x} ${y}`;
          }
          
          // Add circles at data points
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", x);
          circle.setAttribute("cy", y);
          circle.setAttribute("r", "3");
          circle.setAttribute("fill", colors[seriesIndex]);
          pathGroup.appendChild(circle);
        });
        
        path.setAttribute("d", pathD);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", colors[seriesIndex]);
        path.setAttribute("stroke-width", "2");
        pathGroup.appendChild(path);
        
        svg.appendChild(pathGroup);
      });
      
      // Add legend
      const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      legendGroup.setAttribute("transform", `translate(${padding}, 15)`);
      
      data.forEach((series, index) => {
        const legendItem = document.createElementNS("http://www.w3.org/2000/svg", "g");
        legendItem.setAttribute("transform", `translate(${index * 100}, 0)`);
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "10");
        rect.setAttribute("height", "3");
        rect.setAttribute("fill", colors[index]);
        legendItem.appendChild(rect);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "15");
        text.setAttribute("y", "3");
        text.setAttribute("font-size", "8px");
        text.setAttribute("fill", "#D1D5DB");
        text.textContent = series.keyword;
        legendItem.appendChild(text);
        
        legendGroup.appendChild(legendItem);
      });
      
      svg.appendChild(legendGroup);
      
      chartRef.current.appendChild(svg);
    }
  }, []);
  
  return (
    <div className={styles.card.base}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>
          <BarChart2 size={18} className="inline-block mr-2" />
          Trend Visualization
        </h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <button className={combineStyles(styles.button.icon, "flex items-center")} title="Time Range">
              <Calendar size={16} className="mr-1" />
              <span className="text-xs">7d</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
          
          <button className={styles.button.icon} title="Filter">
            <Filter size={16} />
          </button>
          
          <button className={styles.button.icon} title="Information">
            <Info size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "h-64")}>
        <div ref={chartRef} className="w-full h-full">
          {/* Chart will be rendered here */}
        </div>
      </div>
    </div>
  );
};
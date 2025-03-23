import React, { useEffect, useRef } from 'react';
import { TrendingUp, Calendar, Filter, ChevronDown } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * TrendVisualizationPanel component
 * Displays trend visualization charts for keyword search results over time
 */
export const TrendVisualizationPanel = () => {
  const chartRef = useRef(null);
  
  // Sample trend data
  const trendData = {
    labels: ['Mar 16', 'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20', 'Mar 21', 'Mar 22'],
    datasets: [
      {
        keyword: 'carbon insetting',
        values: [12, 19, 15, 28, 22, 36, 41],
        color: '#EAB308'
      },
      {
        keyword: 'sustainable logistics',
        values: [8, 15, 12, 17, 10, 14, 19],
        color: '#6B7280'
      },
      {
        keyword: 'scope 3 emissions',
        values: [5, 11, 10, 13, 9, 16, 15],
        color: '#9CA3AF'
      }
    ]
  };
  
  useEffect(() => {
    // This would typically use a charting library like Chart.js
    // For now, let's create a simple SVG chart
    if (chartRef.current) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.minHeight = "200px";
      
      // Clear existing content
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
      
      // Chart dimensions
      const padding = 30;
      const width = 300;
      const height = 200;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      
      // Find max value for scaling
      const maxValue = Math.max(
        ...trendData.datasets.flatMap(dataset => dataset.values)
      );
      
      // Draw axes
      const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      xAxis.setAttribute("x1", padding);
      xAxis.setAttribute("y1", height - padding);
      xAxis.setAttribute("x2", width - padding);
      xAxis.setAttribute("y2", height - padding);
      xAxis.setAttribute("stroke", "#4B5563");
      xAxis.setAttribute("stroke-width", "1");
      svg.appendChild(xAxis);
      
      const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      yAxis.setAttribute("x1", padding);
      yAxis.setAttribute("y1", padding);
      yAxis.setAttribute("x2", padding);
      yAxis.setAttribute("y2", height - padding);
      yAxis.setAttribute("stroke", "#4B5563");
      yAxis.setAttribute("stroke-width", "1");
      svg.appendChild(yAxis);
      
      // Draw lines for each dataset
      trendData.datasets.forEach(dataset => {
        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        const points = dataset.values.map((value, index) => {
          const x = padding + (index / (dataset.values.length - 1)) * chartWidth;
          const y = height - padding - (value / maxValue) * chartHeight;
          return `${x},${y}`;
        }).join(' ');
        
        polyline.setAttribute("points", points);
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", dataset.color);
        polyline.setAttribute("stroke-width", "2");
        svg.appendChild(polyline);
        
        // Draw dots at each data point
        dataset.values.forEach((value, index) => {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          const x = padding + (index / (dataset.values.length - 1)) * chartWidth;
          const y = height - padding - (value / maxValue) * chartHeight;
          
          circle.setAttribute("cx", x);
          circle.setAttribute("cy", y);
          circle.setAttribute("r", "3");
          circle.setAttribute("fill", dataset.color);
          svg.appendChild(circle);
        });
      });
      
      // X-axis labels
      trendData.labels.forEach((label, index) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const x = padding + (index / (trendData.labels.length - 1)) * chartWidth;
        const y = height - padding / 2;
        
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#9CA3AF");
        text.setAttribute("font-size", "8px");
        text.textContent = label;
        svg.appendChild(text);
      });
      
      // Legend
      trendData.datasets.forEach((dataset, datasetIndex) => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const x = padding;
        const y = padding / 2 + datasetIndex * 15;
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", "10");
        rect.setAttribute("height", "10");
        rect.setAttribute("fill", dataset.color);
        group.appendChild(rect);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 15);
        text.setAttribute("y", y + 8);
        text.setAttribute("fill", "#D1D5DB");
        text.setAttribute("font-size", "8px");
        text.textContent = dataset.keyword;
        group.appendChild(text);
        
        svg.appendChild(group);
      });
      
      chartRef.current.appendChild(svg);
    }
  }, []);
  
  return (
    <div className={styles.card.base}>
      <div className={combineStyles(styles.card.header, styles.utils.flexBetween)}>
        <h2 className={styles.text.heading3}>
          <TrendingUp size={18} className="inline-block mr-2" />
          Trend Visualization
        </h2>
        
        <div className="flex space-x-2">
          <button className={combineStyles(styles.button.outline, "text-sm py-1")}>
            <Calendar size={14} className="mr-1" />
            Last 7 days
            <ChevronDown size={14} className="ml-1" />
          </button>
          <button className={styles.button.icon} title="Filter">
            <Filter size={16} />
          </button>
        </div>
      </div>
      
      <div className={combineStyles(styles.card.body, "h-64")}>
        <div ref={chartRef} className="w-full h-full">
          {/* Chart will be rendered here */}
        </div>
        
        <div className="mt-4 text-[#D1D5DB] text-sm">
          <p>Showing trend data for tracked keywords over the past week</p>
        </div>
      </div>
    </div>
  );
};
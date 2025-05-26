import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import NavBar from '../components/NavBar';
import '../styles/Visualize.css';

const clusterColors = d3.schemeCategory10;

const Visualize = () => {
  const svgRef = useRef();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/tsne');
        if (!response.ok) throw new Error('Failed to fetch TSNE data');
        const tsneData = await response.json();
        setData(tsneData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching TSNE data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (loading || error || !data.length) return;    // Get the container dimensions
    const container = d3.select(svgRef.current).node().parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 80, right: 100, bottom: 80, left: 100 };  // Increased margins

    // Clear existing SVG content
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#1f1f1f");

    svg.selectAll("*").remove();    // Calculate domains with padding
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    
    // Add 50% padding to the domains and ensure symmetrical bounds
    const xPadding = Math.max(Math.abs(xExtent[1]), Math.abs(xExtent[0])) * 0.5;
    const yPadding = Math.max(Math.abs(yExtent[1]), Math.abs(yExtent[0])) * 0.5;

    // Create scales with proper margins and padding, using symmetrical bounds
    const xScale = d3.scaleLinear()
      .domain([-xPadding * 1.5, xPadding * 1.5]) // Increased padding factor to 1.5
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-yPadding * 1.5, yPadding * 1.5]) // Increased padding factor to 1.5
      .range([height - margin.bottom, margin.top]);

    // Add axes with proper styling
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add X axis with label
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("color", "white")
      .call(xAxis.ticks(10).tickSize(-5))
      .call(g => g.select(".domain").attr("stroke", "white").attr("stroke-width", 2))
      .call(g => g.selectAll(".tick line").attr("stroke", "white"))
      .call(g => g.selectAll(".tick text").attr("fill", "white").attr("dy", "1em"));

    // Add X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 4)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("t-SNE Dimension 1");

    // Add Y axis with label
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("color", "white")
      .call(yAxis.ticks(10).tickSize(-5))
      .call(g => g.select(".domain").attr("stroke", "white"))
      .call(g => g.selectAll(".tick line").attr("stroke", "white"));

    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .text("t-SNE Dimension 2");

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis.tickSize(-height + margin.top + margin.bottom).tickFormat(""));

    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis.tickSize(-width + margin.left + margin.right).tickFormat(""));

    // Add circles with transition
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 0)
      .attr("fill", d => clusterColors[d.cluster])
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .transition()
      .duration(1000)
      .attr("r", 8);

    // Add legend
    const uniqueClusters = [...new Set(data.map(d => d.cluster))].sort((a, b) => a - b);
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    legend.selectAll("g")
      .data(uniqueClusters)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .each(function(d) {
        d3.select(this)
          .append("circle")
          .attr("r", 6)
          .attr("fill", clusterColors[d]);
        
        d3.select(this)
          .append("text")
          .attr("x", 15)
          .attr("y", 5)
          .attr("fill", "white")
          .text(`Cluster ${d}`);
      });

    // Tooltip
    const tooltip = d3.select("#tooltip");

    // Add interactivity
    svg.selectAll("circle")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 12);

        tooltip.style("opacity", 1)
          .html(`📄 ${d.id}<br/>Cluster: ${d.cluster}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 8);

        tooltip.style("opacity", 0);
      })
      .on("click", (_, d) => {
        window.location.href = `/view/${d.id}`;
      });
  }, [data, loading, error]);
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="visualization-container">
        <h1 className="visualization-title text-2xl font-bold">Document Visualization</h1>
        <div className="scatter-container">
          {loading ? (
            <div className="loading">Loading visualization...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : data.length === 0 ? (
            <div className="empty">No documents available for visualization</div>
          ) : (
            <>
              <svg ref={svgRef} className="scatter-plot" />
              <div id="tooltip" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualize;
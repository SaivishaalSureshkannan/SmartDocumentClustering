import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import NavBar from '../components/NavBar';
import '../styles/Visualize.css';

const mockData = [
  { id: "textA.txt", x: 10, y: 20, cluster: 0 },
  { id: "textB.txt", x: 20, y: 30, cluster: 0 },
  { id: "textC.txt", x: 50, y: 60, cluster: 1 },
  { id: "textD.txt", x: 70, y: 40, cluster: 1 },
  { id: "textE.txt", x: 90, y: 20, cluster: 2 },
];

const clusterColors = d3.schemeCategory10;

const Visualize = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Get the container dimensions
    const container = d3.select(svgRef.current).node().parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // Clear existing SVG content
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#1f1f1f");

    svg.selectAll("*").remove();

    // Create scales with proper margins
    const xScale = d3.scaleLinear()
      .domain(d3.extent(mockData, d => d.x))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(mockData, d => d.y))
      .range([height - margin.bottom, margin.top]);

    // Add axes with proper styling
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("color", "white")
      .call(xAxis);

    // Add Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("color", "white")
      .call(yAxis);

    // Add grid lines (optional)
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
      .data(mockData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 0)  // Start with radius 0
      .attr("fill", d => clusterColors[d.cluster])
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .transition()  // Add transition
      .duration(1000)
      .attr("r", 8);  // End with radius 8

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
        alert(`You clicked ${d.id}`);
        // Optionally route to document viewer
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="visualization-container">
        <h1 className="visualization-title text-2xl font-bold"> Document Visualization</h1>
        <div className="scatter-container">
          <svg ref={svgRef} className="scatter-plot" />
          <div id="tooltip" />
        </div>
      </div>
    </div>
  );
};

export default Visualize;
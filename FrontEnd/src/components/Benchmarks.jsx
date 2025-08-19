import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import BenchmarkService from "../services/BenchmarkService";
import * as d3 from "d3";
import "../styles/Benchmarks.css";

function Benchmarks({ isDarkMode, toggleTheme }) {
    const [user, setUser] = useState(null);
    const [componentTypes, setComponentTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [benchmarks, setBenchmarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedBenchmarks, setSelectedBenchmarks] = useState([]);
    const [chartMetric, setChartMetric] = useState("singleCore");
    
    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const scatterPlotRef = useRef(null);
    
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        // Fetch component types when component mounts
        fetchComponentTypes();
    }, []);
    
    // Fetch brands when component type changes
    useEffect(() => {
        if (selectedType) {
            fetchBrandsByType(selectedType);
        } else {
            setBrands([]);
        }
    }, [selectedType]);
    
    // Fetch benchmarks when filters change
    useEffect(() => {
        if (selectedType) {
            fetchBenchmarks();
        }
    }, [selectedType, selectedBrand]);
    
    // Render charts when benchmarks data changes
    useEffect(() => {
        if (benchmarks.length > 0) {
            // Only render charts if the current metric exists in the data
            const hasMetricData = benchmarks.some(b => 
                b.scores && b.scores[chartMetric] !== undefined && !isNaN(b.scores[chartMetric])
            );
            
            // Always try to render the charts - our rendering functions now handle empty data gracefully
            renderBarChart();
            renderLineChart();
            renderScatterPlot();
            
            // Show a general message if there's no data for the selected metric
            if (!hasMetricData) {
                setError(`No data available for the "${chartMetric}" metric with the selected component type.`);
            } else {
                setError(null);
            }
        }
    }, [benchmarks, chartMetric, isDarkMode, compareMode, selectedBenchmarks]);
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };
    
    const fetchComponentTypes = async () => {
        try {
            setLoading(true);
            const response = await BenchmarkService.getComponentTypes();
            setComponentTypes(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load component types");
            setLoading(false);
        }
    };
    
    const fetchBrandsByType = async (type) => {
        try {
            setLoading(true);
            const response = await BenchmarkService.getBrandsByType(type);
            setBrands(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Failed to load brands for ${type}`);
            setLoading(false);
        }
    };
    
    const fetchBenchmarks = async () => {
        try {
            setLoading(true);
            const filters = {
                componentType: selectedType,
                brand: selectedBrand || undefined,
                limit: 15
            };
            
            const response = await BenchmarkService.getBenchmarks(filters);
            setBenchmarks(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load benchmarks");
            setLoading(false);
        }
    };
    
    const toggleBenchmarkSelection = (benchmark) => {
        if (selectedBenchmarks.find(b => b._id === benchmark._id)) {
            setSelectedBenchmarks(selectedBenchmarks.filter(b => b._id !== benchmark._id));
        } else {
            if (selectedBenchmarks.length < 5) {
                setSelectedBenchmarks([...selectedBenchmarks, benchmark]);
            } else {
                alert("You can only compare up to 5 components at a time");
            }
        }
    };
    
    const renderBarChart = () => {
        if (!barChartRef.current) return;
        
        // Filter data to only include items that have the current metric
        const allData = compareMode ? selectedBenchmarks : benchmarks;
        const data = allData.filter(d => 
            d.scores && 
            d.scores[chartMetric] !== undefined && 
            !isNaN(d.scores[chartMetric])
        );
        
        if (data.length === 0) {
            // Display a message if no data with this metric
            d3.select(barChartRef.current).selectAll("*").remove();
            d3.select(barChartRef.current)
                .append("div")
                .attr("class", "flex items-center justify-center h-[400px] text-[var(--text-secondary)]")
                .text(`No ${chartMetric} data available for ${selectedType}`);
            return;
        }
        
        const margin = { top: 30, right: 30, bottom: 70, left: 60 };
        const width = barChartRef.current.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Clear previous chart
        d3.select(barChartRef.current).selectAll("*").remove();
        
        // Create SVG
        const svg = d3.select(barChartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            
        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.name))
            .padding(0.2);
            
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "var(--text-secondary)" : "var(--text-secondary)");
            
        // Y axis
        const maxValue = d3.max(data, d => d.scores[chartMetric]) * 1.1;
        const y = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, 0]);
            
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "var(--text-secondary)" : "var(--text-secondary)");
            
        // Bars
        svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.scores[chartMetric]))
            .attr("width", x.bandwidth())
            .attr("height", d => {
                const value = d.scores[chartMetric];
                return !isNaN(value) ? height - y(value) : 0;
            })
            .attr("fill", (d, i) => {
                // Use accent color for first bar or create a gradient based on the accent
                if (compareMode) {
                    const accentColor = isDarkMode ? "#f87060" : "#e74c3c"; // Match theme accent
                    const colors = [
                        accentColor,
                        "#1abc9c",
                        "#3498db",
                        "#9b59b6",
                        "#f1c40f"
                    ];
                    return colors[i % colors.length];
                } else {
                    return "var(--accent)";
                }
            })
            .attr("rx", 4) // Rounded corners
            .attr("opacity", 0.9)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("opacity", 1)
                    .attr("stroke", isDarkMode ? "#fff" : "#000")
                    .attr("stroke-width", 1);
                
                // Show tooltip
                const tooltip = d3.select(".tooltip");
                tooltip
                    .style("display", "block")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 25}px`)
                    .html(`
                        <strong>${d.name}</strong><br/>
                        ${chartMetric}: ${d.scores[chartMetric]}<br/>
                        Brand: ${d.brand}<br/>
                        Price: $${d.price}
                    `);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("opacity", 0.9)
                    .attr("stroke", "none");
                d3.select(".tooltip").style("display", "none");
            });
            
        // Chart Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", isDarkMode ? "var(--text-primary)" : "var(--text-primary)")
            .text(`${selectedType} ${chartMetric.replace(/([A-Z])/g, ' $1').trim()} Performance`);
    };
    
    const renderLineChart = () => {
        if (!lineChartRef.current) return;
        
        // Filter data to only include items that have the current metric
        const allData = compareMode ? selectedBenchmarks : benchmarks;
        const data = allData.filter(d => 
            d.scores && 
            d.scores[chartMetric] !== undefined && 
            !isNaN(d.scores[chartMetric])
        );
        
        if (data.length === 0) {
            // Display a message if no data with this metric
            d3.select(lineChartRef.current).selectAll("*").remove();
            d3.select(lineChartRef.current)
                .append("div")
                .attr("class", "flex items-center justify-center h-[400px] text-[var(--text-secondary)]")
                .text(`No ${chartMetric} data available for ${selectedType}`);
            return;
        }
        
        // Group data by year
        const groupedData = d3.group(data, d => d.year);
        const yearlyData = Array.from(groupedData, ([year, components]) => {
            return {
                year,
                averageScore: d3.mean(components, d => d.scores[chartMetric])
            };
        }).sort((a, b) => a.year - b.year);
        
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = lineChartRef.current.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Clear previous chart
        d3.select(lineChartRef.current).selectAll("*").remove();
        
        // Create SVG
        const svg = d3.select(lineChartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            
        // X axis
        const x = d3.scaleLinear()
            .domain(d3.extent(yearlyData, d => d.year))
            .range([0, width]);
            
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333");
            
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text("Year");
            
        // Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(yearlyData, d => d.averageScore) * 1.1])
            .range([height, 0]);
            
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333");
            
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text("Average Score");
            
        // Line
        svg.append("path")
            .datum(yearlyData)
            .attr("fill", "none")
            .attr("stroke", "var(--accent)")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.averageScore))
                .curve(d3.curveMonotoneX)
            );
            
        // Points
        svg.selectAll("circles")
            .data(yearlyData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.averageScore))
            .attr("r", 5)
            .attr("fill", "var(--accent)")
            .attr("stroke", isDarkMode ? "#172a46" : "white")
            .attr("stroke-width", 1.5)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 7);
                
                // Show tooltip
                const tooltip = d3.select(".tooltip");
                tooltip
                    .style("display", "block")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 25}px`)
                    .html(`
                        <strong>Year: ${d.year}</strong><br/>
                        Avg ${chartMetric}: ${d.averageScore.toFixed(2)}
                    `);
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 5);
                d3.select(".tooltip").style("display", "none");
            });
            
        // Chart Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text(`${selectedType} Performance Trend by Year`);
    };
    
    const renderScatterPlot = () => {
        if (!scatterPlotRef.current) return;
        
        // Filter data to only include items that have the current metric
        const allData = compareMode ? selectedBenchmarks : benchmarks;
        const data = allData.filter(d => 
            d.scores && 
            d.scores[chartMetric] !== undefined && 
            !isNaN(d.scores[chartMetric])
        );
        
        if (data.length === 0) {
            // Display a message if no data with this metric
            d3.select(scatterPlotRef.current).selectAll("*").remove();
            d3.select(scatterPlotRef.current)
                .append("div")
                .attr("class", "flex items-center justify-center h-[400px] text-[var(--text-secondary)]")
                .text(`No ${chartMetric} data available for ${selectedType}`);
            return;
        }
        
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = scatterPlotRef.current.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Clear previous chart
        d3.select(scatterPlotRef.current).selectAll("*").remove();
        
        // Create SVG
        const svg = d3.select(scatterPlotRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            
        // X axis (Price)
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.price) * 1.05])
            .range([0, width]);
            
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333");
            
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text("Price ($)");
            
        // Y axis (Performance Score)
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.scores[chartMetric]) * 1.05])
            .range([height, 0]);
            
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333");
            
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text(`${chartMetric} Score`);
            
        // Add dots
        const accentColor = isDarkMode ? "#f87060" : "#e74c3c"; // Match theme accent
        const colors = [
            accentColor,
            "#1abc9c",
            "#3498db", 
            "#9b59b6",
            "#f1c40f"
        ];
        
        const brandColors = {};
        const brandsList = [...new Set(data.map(d => d.brand))];
        brandsList.forEach((brand, i) => {
            brandColors[brand] = colors[i % colors.length];
        });
        
        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.price))
            .attr("cy", d => y(d.scores[chartMetric]))
            .attr("r", 7)
            .attr("fill", d => brandColors[d.brand])
            .attr("stroke", isDarkMode ? "#172a46" : "white")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.8)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("r", 9)
                    .attr("opacity", 1);
                    
                // Show tooltip
                const tooltip = d3.select(".tooltip");
                tooltip
                    .style("display", "block")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 25}px`)
                    .html(`
                        <strong>${d.name}</strong><br/>
                        ${chartMetric}: ${d.scores[chartMetric]}<br/>
                        Price: $${d.price}<br/>
                        Value: ${(d.scores[chartMetric] / d.price).toFixed(2)} points/$
                    `);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("r", 7)
                    .attr("opacity", 0.8);
                d3.select(".tooltip").style("display", "none");
            });
            
        // Add trend line
        const trendData = data.map(d => ({
            x: d.price,
            y: d.scores[chartMetric]
        }));
        
        // Regression line (simple linear regression)
        if (trendData.length >= 2) {
            const xMean = d3.mean(trendData, d => d.x);
            const yMean = d3.mean(trendData, d => d.y);
            
            let numerator = 0;
            let denominator = 0;
            
            for (const point of trendData) {
                numerator += (point.x - xMean) * (point.y - yMean);
                denominator += Math.pow(point.x - xMean, 2);
            }
            
            const slope = denominator !== 0 ? numerator / denominator : 0;
            const intercept = yMean - slope * xMean;
            
            const minX = d3.min(trendData, d => d.x);
            const maxX = d3.max(trendData, d => d.x);
            
            const lineStart = {
                x: minX,
                y: minX * slope + intercept
            };
            
            const lineEnd = {
                x: maxX,
                y: maxX * slope + intercept
            };
            
            svg.append("line")
                .attr("x1", x(lineStart.x))
                .attr("y1", y(lineStart.y))
                .attr("x2", x(lineEnd.x))
                .attr("y2", y(lineEnd.y))
                .attr("stroke", "#ef4444")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")
                .attr("opacity", 0.7);
        }
        
        // Chart Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", isDarkMode ? "#e0e0e0" : "#333")
            .text(`${selectedType} Price-Performance Ratio`);
            
        // Legend
        const legendWidth = 15;
        const legendHeight = 15;
        const legendSpacing = 5;
        
        const legend = svg.selectAll(".legend")
            .data(brandsList)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * (legendHeight + legendSpacing)})`);
            
        legend.append("rect")
            .attr("x", width - legendWidth - 100)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("rx", 3)
            .attr("fill", d => brandColors[d]);
            
        legend.append("text")
            .attr("x", width - legendWidth - 80)
            .attr("y", legendHeight / 2)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", "var(--text-secondary)")
            .text(d => d);
    };
    
    const metricOptions = {
        CPU: [
            { value: "singleCore", label: "Single Core" },
            { value: "multiCore", label: "Multi Core" },
            { value: "gaming", label: "Gaming" },
            { value: "productivity", label: "Productivity" },
        ],
        GPU: [
            { value: "fps1080p", label: "FPS (1080p)" },
            { value: "fps1440p", label: "FPS (1440p)" },
            { value: "fps4k", label: "FPS (4K)" },
        ],
        Cooler: [
            { value: "thermals", label: "Thermal Performance" },
            { value: "noise", label: "Noise Level" },
        ],
        RAM: [
            { value: "latency", label: "Latency" },
            { value: "bandwidth", label: "Bandwidth" },
        ],
        SSD: [
            { value: "readSpeed", label: "Read Speed" },
            { value: "writeSpeed", label: "Write Speed" },
            { value: "randomRead", label: "Random Read" },
            { value: "randomWrite", label: "Random Write" },
        ],
        HDD: [
            { value: "readSpeed", label: "Read Speed" },
            { value: "writeSpeed", label: "Write Speed" },
        ]
    };
    
    const getMetricOptions = () => {
        return metricOptions[selectedType] || [];
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)] transition-colors duration-300">
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} />
            
            {/* Header section */}
            <section className="w-full flex items-center justify-center py-6 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                <h1 className="text-3xl font-bold text-white">Component Benchmark Analytics</h1>
            </section>
            
            {/* Filter controls */}
            <section className="w-full bg-[var(--card-background)] p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
                    <div className="flex-grow min-w-[200px]">
                        <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Component Type</label>
                        <div className="relative">
                            <select
                                className="border cursor-pointer border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 bg-[var(--background)] appearance-none pr-8"
                                value={selectedType}
                                onChange={(e) => {
                                    const newType = e.target.value;
                                    
                                    // Reset related states first
                                    setSelectedBrand("");
                                    setSelectedBenchmarks([]);
                                    setBenchmarks([]); // Clear benchmark data
                                    setError(null); // Clear any previous errors
                                    
                                    // Then set the new type
                                    setSelectedType(newType);
                                    
                                    // Update the metric to match the new component type
                                    // We need to use the new type value directly since state updates aren't immediate
                                    const newMetricOptions = metricOptions[newType] || [];
                                    const defaultMetric = newMetricOptions[0]?.value || "singleCore";
                                    setChartMetric(defaultMetric);
                                }}
                            >
                                <option value="">Select Type</option>
                                {componentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 fill-current text-[var(--text-secondary)]" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow min-w-[200px]">
                        <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Brand (Optional)</label>
                        <div className="relative">
                            <select
                                className="border cursor-pointer border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 bg-[var(--background)] appearance-none pr-8"
                                value={selectedBrand}
                                onChange={(e) => {
                                    // Reset related states first
                                    setSelectedBenchmarks([]);
                                    setError(null);
                                    
                                    // Then set the new brand
                                    setSelectedBrand(e.target.value);
                                }}
                                disabled={!selectedType}
                            >
                                <option value="">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 fill-current text-[var(--text-secondary)]" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow min-w-[200px]">
                        <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Metric</label>
                        <div className="relative">
                            <select
                                className="border cursor-pointer border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 bg-[var(--background)] appearance-none pr-8"
                                value={chartMetric}
                                onChange={(e) => {
                                    setError(null); // Clear any previous errors
                                    setChartMetric(e.target.value);
                                }}
                                disabled={!selectedType}
                            >
                                {getMetricOptions().map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 fill-current text-[var(--text-secondary)]" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow min-w-[200px] flex items-end btnCompare">
                        <button
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${compareMode 
                                ? "bg-gray-600 text-white" 
                                : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"}`}
                            onClick={() => setCompareMode(!compareMode)}
                        >
                            {compareMode ? "Exit Compare" : "Compare Mode"}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Loading and error states */}
            {loading && (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mx-4 my-2">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}
            
            {/* Compare mode info */}
            {compareMode && (
                <div className="bg-[var(--config-bg)] p-4 mx-4 my-2 rounded-md max-w-7xl mx-auto w-full">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-[var(--accent)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <p className="text-sm text-[var(--text-primary)]">
                            <span className="font-bold">Compare Mode:</span> Select up to 5 components to compare. 
                            Currently selected: <span className="text-[var(--accent)] font-medium">{selectedBenchmarks.length}</span> components
                        </p>
                    </div>
                </div>
            )}
            
            {/* Benchmark data visualization */}
            <section className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
                {/* Sidebar - Data table or selection */}
                <div className="w-full lg:w-1/4 bg-[var(--card-background)] rounded-xl shadow-md p-4 max-h-[800px] overflow-y-auto benchmark-list">
                    <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Components</h2>
                    
                    {benchmarks.length === 0 && !loading ? (
                        <p className="text-[var(--text-secondary)]">
                            {selectedType 
                                ? "No benchmark data available for the selected filters." 
                                : "Select a component type to view benchmarks."}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {benchmarks.map(benchmark => (
                                <div 
                                    key={benchmark._id}
                                    className={`p-3 rounded-md cursor-pointer transition-colors benchmark-card-hover ${
                                        compareMode && selectedBenchmarks.find(b => b._id === benchmark._id)
                                            ? "bg-[var(--accent)] bg-opacity-20 dark:bg-opacity-30"
                                            : "bg-[var(--config-bg)] hover:bg-opacity-80"
                                    }`}
                                    onClick={() => compareMode && toggleBenchmarkSelection(benchmark)}
                                >
                                    <div className="font-medium text-[var(--text-primary)]">{benchmark.name}</div>
                                    <div className="text-sm text-[var(--text-secondary)]">
                                        Brand: {benchmark.brand}
                                    </div>
                                    <div className="text-sm text-[var(--text-primary)]">
                                        {chartMetric}: <span className="font-bold text-[var(--accent)]">{benchmark.scores[chartMetric]}</span>
                                    </div>
                                    <div className="text-sm text-[var(--text-primary)]">
                                        Price: <span className="font-medium">${benchmark.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Main visualization area */}
                <div className="w-full lg:w-3/4 space-y-6">
                    {/* Bar chart - Performance comparison */}
                    <div className="bg-[var(--card-background)] rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Performance Comparison</h3>
                        <div ref={barChartRef} className="w-full h-[400px]"></div>
                    </div>
                    
                    {/* Performance/Price scatter plot */}
                    <div className="bg-[var(--card-background)] rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Price to Performance Ratio</h3>
                        <div ref={scatterPlotRef} className="w-full h-[400px]"></div>
                    </div>
                    
                    {/* Line chart - Historical trend */}
                    <div className="bg-[var(--card-background)] rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Historical Performance Trend</h3>
                        <div ref={lineChartRef} className="w-full h-[400px]"></div>
                    </div>
                </div>
            </section>
            
            {/* Tooltip */}
            <div className="tooltip"></div>
            
            {/* Footer */}
            <footer className="mt-auto py-8 px-4 md:px-8 lg:px-16 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <svg
                            className="w-6 h-6 text-[var(--accent)] mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            ></path>
                        </svg>
                        <span className="font-bold">AI-Powered-PC-Builder</span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
                            Terms
                        </a>
                        <a href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
                            Privacy
                        </a>
                        <a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
                            Contact
                        </a>
                    </div>

                    <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                        © 2025 AI-Powered-PC-Builder. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    )
}

export default Benchmarks;
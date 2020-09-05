import React, {Component} from 'react';
import * as d3 from 'd3';
import './treemap.css'

export default class Treemap extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: null
        };
    }
    componentDidMount() {
        fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
        .then(response => response.json())
        .then(json => this.setState(() => ({
            data: json,
        }), () => this.drawTreeMap(this.state.data)));
        
    }
    drawTreeMap(data){
        const w = 1200;
        const h = 700;
        const padding = 50;
        const color = d3.scaleOrdinal().range(d3.schemeCategory10);

        const treemap = d3.treemap().size([w-padding, h-padding]);
        
        const div = d3.select(this.refs.holder)
            .append("div")
            .attr("class", "holderdiv")
            .style("width", (w-padding) + "px")
            .style("height", (h-padding) + "px")

        const root = d3.hierarchy(data).sum((d) => d.value);

        const tree = treemap(root);

        const node = div.datum(root)
            .selectAll(".node")
            .data(tree.leaves())
            .enter()
                .append("div")
                .attr("class", "tooltip node")
                .style("left", (d) => d.x0 + "px")
                .style("top", (d) => d.y0 + "px")
                .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                .style("background", (d) => color(d.parent.data.name))
                .text((d) => d.data.name)
                .style("padding", "5px")
                .append("div")
                .attr("class", "tooltiptext")
                .text(d => d.data.value);
        
        // const tips = div.datum(root)
        //     .selectAll(".node")
        //     .data(tree.leaves())
        //     .enter()
                
        
        // Append a legend with the different content classes
        const legendHolder = d3.select(this.refs.legendHolder);
        const legendElements = legendHolder.selectAll("div")
                                            .data(data.children)
                                            .enter();
        legendElements
                .append("div")
                .attr("class", "legendElement")
                .text(d => d.name)
                //.insert("div")
                .style("width", 30 + "px")
                .style("height", 20 + "px")
                .style("padding", 15 + "px")
                .style("margin-left", 15 + "px")
                .style("margin-top", 30 + "px")
                .style("background", (d) => color(d.name))
    }
    render () {
        
        if(this.state.data == null){
            return <h1>Loading data.</h1>;
        } else {
            return <div className="titleHolder">
                    <h1>Video Game Sales</h1>
                    <p>Top 100 Most Sold Video Games Grouped by Platform</p>
                    <div ref="holder" className="holder"></div>
                    <div ref="legendHolder" className="legendHolder"></div>
            </div>;
        }
    }
}
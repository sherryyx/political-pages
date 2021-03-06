class groupedBarVis {
    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 580,
            containerHeight: _config.containerHeight || 500,
          }
          this.config.margin = _config.margin || { top: 0, bottom: 156, right: 12, left: 125 }
          this.perCategoryData = _config.perCategoryData;
  
          this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        const categories = ['left', 'mainstream', 'right'];
        const truthRankings = ["mostly true", "mixture of true and false", "mostly false", "no factual content"];
        const svg = d3.select('svg#groupedBarVis');
        let g = svg.append('g')
          .attr('transform', `translate(0, ${vis.config.margin.top})`);
        const chartHeight = 348;
        const titleOffset = 0;
        const titleG = g.append('g')
            .attr('class', 'vis-title')
            .style('fill', '#434244')
            .style('font-size', '24px')
            .attr('width', '200px')

        const chartG = g.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        const formatter = d3.format(".0%");

        vis.xScale = d3.scaleLinear()
            .domain([0,1])
            .range([0, vis.width - vis.config.margin.left]);

        vis.xAxis = chartG.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(vis.xScale).tickSizeInner(-chartHeight).tickFormat(formatter).ticks(4))
            .call(g => g.select(".domain").remove());

        vis.xAxis.append('text')
            .attr('class', 'axis-label')
            .attr('y', 48)
            .attr('x', vis.width / 2 - 40)
            .attr('text-anchor', 'middle')
            .text("Percentage of political category's total engagement");

        vis.yScale = d3.scaleBand()
            .domain(categories)
            .range([0, chartHeight])

        vis.yAxis = chartG.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(vis.yScale).tickSizeInner(0))
            .call(g => g.select(".domain").remove());

        vis.ySubScale = d3.scaleBand()
            .domain(truthRankings)
            .range([0, vis.yScale.bandwidth()])
            .paddingOuter(1.5)

        vis.colorScale = d3.scaleOrdinal()
            .domain(truthRankings)
            .range(['#634265', '#E05E5E', '#D3DCE7', '#67D99B']);
            
        // give axis labels some breathing space
        d3.selectAll('#groupedBarVis .x-axis text')
            .attr('transform', 'translate(0, 10)')

        d3.selectAll('#groupedBarVis .y-axis text')
            .attr('transform', 'translate(-10, 0)')

        const barsG = g.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top+titleOffset})`)
            .attr('class', 'all-bars');

        const leftBars = barsG.append('g')
            .selectAll('rect')
            .data(Object.entries(vis.perCategoryData.get('left')))
            .enter()
            .append('rect')
            .attr('transform', `translate(0, ${vis.yScale('left')})`)
            .attr('fill', key => vis.colorScale(key))
            .attr('height', vis.ySubScale.bandwidth())
            .attr('width', key => vis.xScale(key[1]))
            .attr('y', key => vis.ySubScale(key[0]))

        const mainstreamBars = barsG.append('g')
            .selectAll('rect')
            .data(Object.entries(vis.perCategoryData.get('mainstream')))
            .enter()
            .append('rect')
            .attr('transform', `translate(0, ${vis.yScale('mainstream')})`)
            .attr('fill', key => vis.colorScale(key))
            .attr('height', vis.ySubScale.bandwidth())
            .attr('width', key => vis.xScale(key[1]))
            .attr('y', key => vis.ySubScale(key[0]))

        const rightBars = barsG.append('g')
            .selectAll('rect')
            .data(Object.entries(vis.perCategoryData.get('right')))
            .enter()
            .append('rect')
            .attr('transform', `translate(0, ${vis.yScale('right')})`)
            .attr('fill', key => vis.colorScale(key))
            .attr('height', vis.ySubScale.bandwidth())
            .attr('width', key => vis.xScale(key[1]))
            .attr('y', key => vis.ySubScale(key[0]))
    }

    update() {
        let vis = this;
        vis.render();
    }

    render() {
        let vis = this;
    }
}
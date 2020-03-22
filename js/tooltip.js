class tooltip {

    constructor(_config) {
  
      this.width = _config.width;
      this.tooltip_id = _config.tooltip_id;
  
      this.initTooltip();

    }

    initTooltip() {
        let tooltip = this;

        tooltip.tt = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', tooltip.tooltip_id)
            .style('pointer-events', 'none')
            .style('position', 'absolute');
        
        if (tooltip.width) {
            tooltip.tt.style('width', tooltip.width);
        }

        tooltip.hideTooltip();
    }

    hideTooltip() {
        let tooltip = this;
        tooltip.tt.style('opacity', 0);
    }

    showTooltip(content, event, dynamicColor) {
        let tooltip = this;

        tooltip.tt.style('opacity', 1)
            .html(content)
            .style("display", "inline")
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY + 24) + "px");

        d3.selectAll(".tooltip .dynamic-color")
            .style("color", dynamicColor);
    }
  }
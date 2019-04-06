
const Tooltip = function(id) {
  
  this.tooltip = null;
  this.circles = null;

  this.mouseover = this.mouseover.bind(this);
  this.mousemove = this.mousemove.bind(this);
  this.mouseleave = this.mouseleave.bind(this);
  this.initialize = this.initialize.bind(this);
  this.updateInfo = this.updateInfo.bind(this);
};

Tooltip.prototype.mouseover = function (d) {
  this.updateInfo(d);
  this.tooltip.style('opacity', 1);
  
  d3.select(this.circles[d.index])
    .style('stroke', 'black');
};

Tooltip.prototype.mousemove = function (d) {

  let x = event.x;
  let y = event.y;
  // debugger;
  this.tooltip
    .style('left', x + 10 + 'px')
    .style('top', y + 10 + 'px');
};

Tooltip.prototype.mouseleave = function (d) {
  this.tooltip.style('opacity', 0)
    .style('left', '0px')
    .style('top', '0px');

  d3.select(this.circles[d.index])
    .style('stroke', 'none');
};

Tooltip.prototype.initialize = function() {
  this.circles = d3.selectAll('circle').nodes();
  var data = [
    [//iPhone
      { axis: "Battery Life", value: 0.22 },
      { axis: "Brand", value: 0.28 },
      { axis: "Contract Cost", value: 0.29 },
      { axis: "Design And Quality", value: 0.17 },
      { axis: "Have Internet Connectivity", value: 0.22 },
      { axis: "Large Screen", value: 0.02 },
      { axis: "Price Of Device", value: 0.21 },
      { axis: "To Be A Smartphone", value: 0.50 }
    ], [//Samsung
      { axis: "Battery Life", value: 0.27 },
      { axis: "Brand", value: 0.16 },
      { axis: "Contract Cost", value: 0.35 },
      { axis: "Design And Quality", value: 0.13 },
      { axis: "Have Internet Connectivity", value: 0.20 },
      { axis: "Large Screen", value: 0.13 },
      { axis: "Price Of Device", value: 0.35 },
      { axis: "To Be A Smartphone", value: 0.38 }
    ], [//Nokia Smartphone
      { axis: "Battery Life", value: 0.26 },
      { axis: "Brand", value: 0.10 },
      { axis: "Contract Cost", value: 0.30 },
      { axis: "Design And Quality", value: 0.14 },
      { axis: "Have Internet Connectivity", value: 0.22 },
      { axis: "Large Screen", value: 0.04 },
      { axis: "Price Of Device", value: 0.41 },
      { axis: "To Be A Smartphone", value: 0.30 }
    ]
  ];

  this.tooltip = d3.select('#tooltip')
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  this.tooltip.append('img')
    .attr('class', 'tooltip-image');
  this.tooltip.append("div")
    .attr('class', 'tooltip-title');
  this.tooltip.append('div')
    .attr('class', 'tooltip-type');
  
  //Call function to draw the Radar chart
  RadarChart('#tooltip', data);
};

Tooltip.prototype.updateInfo = function (d) {
  d3.select(".tooltip-image").attr('src', d.sprite);
};
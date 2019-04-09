
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
  let midX = window.innerWidth / 2;
  let midY = window.innerHeight / 2;
  let x = event.x;
  let y = event.y;
  let tooltipWidth = 254;
  let tooltipHeight = 387;

  //254x387
  if  (x > midX && y > midY) {//Quadrant 4
    x -= (tooltipWidth + 10);
    y -= (tooltipHeight + 10);
  }
  else if (x > midX && y < midY) { //Quadrant 2
    x -= (tooltipWidth + 10);
    y += 10;
  }
  else if (x < midX && y > midY) { //Quadrant 3
    x += 10;
    y -= (tooltipHeight + 10);
  }
  else {                   //Quadrant 1 and origin
    x += 10;
    y += 10;
  }
  // debugger;
  this.tooltip
    .style('left', x + 'px')
    .style('top', y + 'px');
};

Tooltip.prototype.mouseleave = function (d) {
  this.tooltip.style('opacity', 0)
    .style('left', '-279px')
    .style('top', '0px');

  d3.select('.tooltip-types').selectAll('div').remove();

  d3.select(this.circles[d.index])
    .style('stroke', 'white');
};

Tooltip.prototype.initialize = function() {
  this.circles = d3.selectAll('circle').nodes();
  var dummyData = [
      { axis: "HP", value: 0 },
      { axis: "Atk", value: 0 },
      { axis: "Def", value: 0 },
      { axis: "SpAtk", value: 0 },
      { axis: "SpDef", value: 0 },
      { axis: "Spd", value: 0 }
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
    .attr('class', 'tooltip-types');
};

Tooltip.prototype.updateInfo = function (d) {
  let types = Object.values(d.types);

  types.forEach((type, i) => {
    d3.select('.tooltip-types')
      .append('div')
      .html(type)
      .style('background', TYPE_COLORS[type])
      .style('margin-left', i === 0 ? 0 : '5px');
  });

  d3.select(".tooltip-image").attr('src', d.sprite);
  d3.select(".tooltip-title").html(d.name);
  // d3.select('.tooltip-types').append(y => {debugger; return d;})
  // d3.select(".tooltip-types").html(Object.values(d.types).join(', '));
  RadarChart('#tooltip', d);
};
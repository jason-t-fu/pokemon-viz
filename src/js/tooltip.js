
const Tooltip = function(id) {
  
  this.tooltip = d3.select(id)
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  this.circles = null;

  this.mouseover = this.mouseover.bind(this);
  this.mousemove = this.mousemove.bind(this);
  this.mouseleave = this.mouseleave.bind(this);
  this.initialize = this.initialize.bind(this);
};

Tooltip.prototype.mouseover = function (d) {
  this.tooltip.style('opacity', 1);
  
  d3.select(this.circles[d.index])
    .style('stroke', 'black');
};

Tooltip.prototype.mousemove = function (d) {

  let x = event.x;
  let y = event.y;
  // debugger;
  this.tooltip.html(d.name)
    .style('left', x + 'px')
    .style('top', y + 'px');
};

Tooltip.prototype.mouseleave = function (d) {
  this.tooltip.style('opacity', 0);

  d3.select(this.circles[d.index])
    .style('stroke', 'none');
};

Tooltip.prototype.initialize = function() {
  this.circles = d3.selectAll('circle').nodes();
};
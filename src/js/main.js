
document.addEventListener('DOMContentLoaded', () => {
  loadContent();
});

function loadContent() {
  let diameter = 960,
      radius = diameter / 2,
      innerRadius = radius - 120;

  let cluster = d3.cluster()
                  .size([360, innerRadius]);

  let line = d3.radialLine()   
               .curve(d3.curveBundle.beta(0.85))
               .radius((d) => d.y)
               .angle((d) => d.x / 180 * Math.PI);

  let svg = d3.select('body').append('svg')
              .attr('width', diameter)
              .attr('height', diameter)
              .append('g')
              .attr('transform', 'translate(' + radius + ',' + radius + ')');
}
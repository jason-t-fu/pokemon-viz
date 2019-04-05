
function loadContent(data) {
  const tooltip = new Tooltip('#tooltip');
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.name))
    .force('charge', d3.forceManyBody().strength(-20))
    .force('collide', d3.forceCollide().radius(d => d.radius * 1.2))
    .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2));

  const svg = d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  const node = svg.selectAll('g').data(nodes);
  const link = svg.selectAll('g').data(links);

  let linkEnter = link.enter().append('g');
  let line = linkEnter.append('line')
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr('stroke-width', 1);
  
  let nodeEnter = node.enter().append('g');
  let circle = nodeEnter.append('circle')
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr('r', d => d.radius)
    .attr('fill', d => TYPE_COLORS[d.group])
    .on('mouseover', tooltip.mouseover)
    .on('mousemove', tooltip.mousemove)
    .on('mouseleave', tooltip.mouseleave)
    .call(drag(simulation));

  tooltip.initialize();

  // nodeText = node.filter(d => {debugger; return POKEMON_TYPES.has(d.name)})
  //   .enter().append('text')
  //   .text(d => d.name)
  //   .attr('text-anchor', 'middle')
  //   .attr('font-size', '8px')
  //   .attr('class', 'unselectable')
  //   .style('fill', 'white')
  //   .style('text-transform', 'uppercase')
  //   .style('font-family', 'sans-serif')
  //   .style('user-select', 'none')
  //   .call(drag(simulation));

  nodeText = nodeEnter.append('text').text(d => POKEMON_TYPES.has(d.name) ? d.name : "")
    .attr('text-anchor', 'middle')
    .attr('font-size', '8px')
    .attr('class', 'unselectable')
    .style('fill', 'white')
    .style('text-transform', 'uppercase')
    .style('font-family', 'sans-serif')
    .style('user-select', 'none')
    .call(drag(simulation));

  simulation.on('tick', () => {

    circle.attr('cx', d => d.x = Math.max(d.radius, Math.min(WIDTH - d.radius, d.x)))
      .attr('cy', d => d.y = Math.max(d.radius, Math.min(HEIGHT - d.radius, d.y)));

    nodeText.attr('x', d => d.x = Math.max(d.radius, Math.min(WIDTH - d.radius, d.x)))
      .attr('y', d => d.y = Math.max(d.radius, Math.min(HEIGHT - d.radius, d.y)) + 2);

    line.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  });

  return svg.node();
}

function drag(simulation) {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

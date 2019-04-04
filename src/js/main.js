
const POKEMON_TYPES = new Set(['fire', 'water', 'grass', 'electric', 'flying', 'normal',
                       'fighting', 'ground', 'rock', 'bug', 'poison', 'ghost',
                       'ice', 'psychic', 'dragon']);

const POKEMON_DATA = "assets/pokemonData.json";

document.addEventListener('DOMContentLoaded', () => {
  window.d3 = d3;

  d3.json(POKEMON_DATA).then(data => {
    let root = createDataAndLinks(data);
    window.root = root;
    loadContent(root);
  });
});


function loadContent(data) {
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));
  debugger;

  const simulation = d3.forceSimulation(nodes)
                       .force('link', d3.forceLink(links).id(d => d.name))
                       .force('charge', d3.forceManyBody())
                       .force("center", d3.forceCenter(300, 300));

  const svg = d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height', 600);

  const link = svg.append('g')
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .attr('stroke-width', 1)
                .selectAll('line')
                .data(links)
                .join("line");

  const node = svg.append('g')
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .selectAll('circle')
                .data(nodes)
                .join('circle')
                .attr('r', 5)
                .call(drag(simulation));
                // .attr('fill', color);

  node.append('title').text(d => d.name);

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    node.attr('cx', d => d.x)
        .attr('cy', d => d.y);
  });

  return svg.node();
}

function createDataAndLinks(pokemonData) {
  let data = {
    nodes: [],
    links: []
  };

  //Nodes
  [...POKEMON_TYPES].forEach(type => {
    data.nodes.push({
      name: type,
      group: type
    });
  });

  //Links
  Object.keys(pokemonData).forEach(key => {
    let pokemon = pokemonData[key];
    pokemon.group = pokemon.types[1];
    data.nodes.push(pokemon);

    Object.values(pokemon.types).forEach(type => {
      if (POKEMON_TYPES.has(type)) {
        data.links.push({
          source: key,
          target: type
        });
      }
    });
  });

  debugger;
  return data;
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

// function loadContent(data) {
//   let diameter = 960;
//   let radius = diameter / 2;
//   let innerRadius = radius - 120;
  
//   let cluster = d3.cluster()
//                   .size([360, innerRadius]);
//   debugger;
//   cluster(data);

//   let line = d3.radialLine()   
//                .curve(d3.curveBundle.beta(0.85))
//                .radius((d) => d.y)
//                .angle((d) => d.x / 180 * Math.PI);

//   let svg = d3.select('body').append('svg')
//               .attr('width', diameter)
//               .attr('height', diameter)
//               .append('g')
//               .attr('transform', 'translate(' + radius + ',' + radius + ')');

//   let link = svg.append('g').selectAll('.link');
//   let node = svg.append('g').selectAll('.node');
  
//   debugger;

//   // link = link.data(createPaths(data.descendants()))
//   //            .enter().append("path")
//   //            .each(d => {
//   //              d.source = d[0];
//   //              d.target = d[d.length - 1];
//   //            })
//   //            .attr("class", "link")
//   //            .attr("d", line);

//   node = node.data(root.descendants())
//              .enter().append("text")
//              .attr("class", "node")
//              .attr("dy", "0.31em")
//              .attr("transform", d => {
//                let x = `rotate(${d.x - 90})translate(${d.y + 8},0)${d.x < 180 ? "" : "rotate(180)"}`;
//                return x;
//               })
//              .attr("text-anchor", d => d.x < 180 ? "start" : "end")
//              .text(d => d.data.name);
// }

function createPaths(nodes) {
  var map = {},
    paths = [];

  // Compute a map from name to node.
  nodes.forEach(function (d) {
    map[d.data.name] = d;
  });
  // For each import, construct a link from the source to target node.
  nodes.forEach(function (d) {
    if (d.data.parents) d.data.parents.forEach(function (i) {
      paths.push(map[d.data.name].path(map[i.name]));
    });
  });
  debugger;
  return paths;
}

function createHierarchy(pokemonList) {
  let root = {
    "": {
      name: "",
      children: []
    }
  };

  let types = { };
  POKEMON_TYPES.forEach(type => {
    types[type] = {
      name: type,
      parent: root[""],
      children: [],
    };
  });

  root[""].children = POKEMON_TYPES.map(type => {
    return types[type];
  });

  Object.keys(pokemonList).forEach(key => {
    let pokemon = pokemonList[key];
    pokemon.parents = [];
    pokemon.types.forEach(type => {
      if (types[type]) {
        pokemon.parents.push(types[type]);
        types[type].children.push(pokemon);
      }
    });
  });

  Object.assign(root, types, pokemonList);
  debugger;
  return d3.hierarchy(root[""]).count();
}

/*

{
  "": {
    name: "",
    children: [{"fire": ...}, {"water": ...}, ...]
  },
  "fire": {
    name: "fire",
    parent: {name: "", children: [{"fire": ...}, {"water": ...}, ...]},
    children: [{"charmander": ...}, ...]
  }
  "charmander": {
    name: "charmander",
    parent: {name: "fire", children: [...], parent: {name: "", ...}}
    types: ["fire"]
  }
}

*/
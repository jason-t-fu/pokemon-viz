
const POKEMON_TYPES = ['fire', 'water', 'grass', 'electric', 'flying', 'normal',
                       'fighting', 'ground', 'rock', 'bug', 'poison', 'ghost',
                       'ice', 'psychic', 'dragon'];

const POKEMON_DATA = "assets/pokemonData.json";

document.addEventListener('DOMContentLoaded', () => {
  window.d3 = d3;

  d3.json(POKEMON_DATA).then(data => {
    let root = createHierarchy(data);
    window.root = root;
    loadContent(root);
  });
});

function loadContent(data) {
  let diameter = 960;
  let radius = diameter / 2;
  let innerRadius = radius - 120;

  let cluster = d3.cluster(data)
                  .size([2 * Math.PI, innerRadius]);

  let line = d3.radialLine()   
               .curve(d3.curveBundle.beta(0.85))
               .radius((d) => {
                 debugger;
                 return d.y;
                })
               .angle((d) => d.x);

  let svg = d3.select('body').append('svg')
              .attr('width', diameter)
              .attr('height', diameter)
              .append('g')
              .attr('transform', 'translate(' + radius + ',' + radius + ')');

  let link = svg.append('g').selectAll('.link');
  let node = svg.append('g').selectAll('.node');
  
  link = link.data(createPaths(data.descendants()))
             .enter().append("path")
             .each(d => {
               d.source = d[0];
               d.target = d[d.length - 1];
             })
             .attr("class", "link")
             .attr("d", line);
}

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
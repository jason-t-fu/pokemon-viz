
const POKEMON_TYPES = new Set(['fire', 'water', 'grass', 'electric', 'flying', 'normal',
                       'fighting', 'ground', 'rock', 'bug', 'poison', 'ghost',
                       'ice', 'psychic', 'dragon']);

const TYPE_COLORS = {
  "normal": "rgb(170,167,124)",
  "fighting": "rgb(204,43,44)",
  "flying": "rgb(166,148,235)",
  "poison": "rgb(167,68,156)",
  "ground": "rgb(231,189,114)",
  "rock": "rgb(190,158,71)",
  "bug": "rgb(170,181,61)",
  "ghost": "rgb(112,91,149)",
  "fire": "rgb(253,125,61)",
  "water": "rgb(84,149,235)",
  "grass": "rgb(108,198,94)",
  "electric": "rgb(255,205,77)",
  "psychic": "rgb(255,87,135)",
  "ice": "rgb(138,216,215)",
  "dragon": "rgb(104,73,240)"
};

const POKEMON_DATA = "assets/pokemonData.json";

const WIDTH = 800;
const HEIGHT = 600;

document.addEventListener('DOMContentLoaded', () => {
  window.d3 = d3;

  d3.json(POKEMON_DATA).then(data => {
    let root = createDataAndLinks(data);
    window.root = root;
    loadContent(root);
  });

  document.getElementById('type-highlight')
          .addEventListener('mouseover', () => dimNodes('pokemon'));
  document.getElementById('type-highlight')
          .addEventListener('mouseleave', setDefault);
  document.getElementById('pokemon-highlight')
          .addEventListener('mouseover', () => dimNodes('type'));
  document.getElementById('pokemon-highlight')
          .addEventListener('mouseleave', setDefault);
});

function createDataAndLinks(pokemonData) {
  let data = {
    nodes: [],
    links: []
  };

  // Type Nodes
  [...POKEMON_TYPES].forEach(type => {
    data.nodes.push({
      name: type,
      group: type,
      radius: 22
    });
  });

  // Links and Pokemon nodes
  Object.keys(pokemonData).forEach(key => {
    let pokemon = pokemonData[key];
    pokemon.group = pokemon.types[1];
    pokemon.radius = 10;
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
  
  return data;
}

function dimNodes(nodeType) {
  d3.selectAll(`.node-${nodeType}`).attr('opacity', 0.2);
  d3.selectAll('line').attr('stroke-opacity', 0);
}

function setDefault(nodeType) {
  d3.selectAll('circle').attr('opacity', 1);
  d3.selectAll('line').attr('stroke-opacity', 0.6);
}

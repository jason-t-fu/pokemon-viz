
const POKEMON_TYPES = ['fire', 'water', 'grass', 'electric', 'flying', 'normal',
                       'fighting', 'ground', 'rock', 'bug', 'poison', 'ghost',
                       'ice', 'psychic', 'dragon'];

const POKEMON_DATA = "assets/pokemonData.json";

document.addEventListener('DOMContentLoaded', () => {
  loadContent();
});

function loadContent() {
  let diameter = 960;
  let radius = diameter / 2;
  let innerRadius = radius - 120;

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

  let link = svg.append('g').selectAll('.link');
  let node = svg.append('g').selectAll('.node');

  d3.json("assets/pokemonData.json").then(data => {
    let x = packageHierarchy(data);
    console.log(x);
  });

}

function packageHierarchy(pokemonList) {
  let types = { };
  POKEMON_TYPES.forEach(type => types[type] = []);

  Object.keys(pokemonList).forEach(key => {
    let pokemon = new Pokemon(pokemonList[key]);
    pokemon.types.forEach(type => {
      if (types[type]) types[type].push(pokemon);
    });
  });

  let map = {
    name: "",
    children: POKEMON_TYPES.map(type => ({name: type, imports: types[type]}))
  };

  return d3.hierarchy(map);
}
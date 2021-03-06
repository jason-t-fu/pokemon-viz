const https = require('https');
const fs = require('fs');

const LONG_TO_SHORT_TYPE = {
  'hp': 'HP',
  'attack': 'Atk',
  'defense': 'Def',
  'special-attack': 'SpAtk',
  'special-defense': 'SpDef',
  'speed': 'Spd'
};

async function writePokemon() {
  const totalPokemon = 151;
  let stringifiedData = {};

  for (let i = 1; i <= totalPokemon ; i++) {
    let pokemonInfo = await getPokemonInfo(i);

    let types = {};
    pokemonInfo.types.forEach(entry => {
      // Need specific case for fairy and steel types, nonexistent in Gen 1
      if (entry.type.name !== 'fairy' && entry.type.name !== 'steel') {
        types[entry.slot] = entry.type.name;
      }
    });
    // Then check for empty types (clefairy and clefable)
    if (!Object.keys(types).length) types[1] = "normal";
    let stats = pokemonInfo.stats.map(entry => {
      return {
        axis: LONG_TO_SHORT_TYPE[entry.stat.name],
        value: entry.base_stat
      };
    });

    let data = {
      id: i,
      name: pokemonInfo.name,
      types: types,
      stats: stats,
      sprite: pokemonInfo.sprites.front_default
    };
    console.log(data.name);
    
    stringifiedData[data.name] = data;
    // await delayNextQuery();
  }

  fs.writeFile('assets/pokemonData.json', JSON.stringify(stringifiedData), err => {
    if (err) throw err;
    console.log('File has been saved.');
  });
}


/* 
  600ms delay for API query limits? Site says 100 queries per min.
*/
function delayNextQuery() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('delayed');
      resolve();
    }, 600);
  });
}

function getPokemonInfo(pokemonId) {

  let promise = new Promise((resolve, reject) => {
    https.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', error => {
      reject(error.message);
    });
  });

  return promise;
}

writePokemon();
const https = require('https');
const fs = require('fs');

async function writePokemon() {
  const totalPokemon = 151;
  let stringifiedData = "";

  for (let i = 1; i <= totalPokemon ; i++) {
    let x = await getPokemonInfo(i);

    let data = {
      name: x.name,
      types: x.types,
      stats: x.stats
    };
    console.log(data);
    stringifiedData += JSON.stringify(data);

    // await delayNextQuery();
  }

  fs.writeFile('pokemonData.txt', stringifiedData, err => {
    if (err) throw err;
    console.log('File has been saved.');
  });
}


/* 
  600ms delay for API query limits?
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
const https = require('https');
const fs = require('fs');

async function writePokemon() {
  const totalPokemon = 6;

  for (let i = 1; i <= totalPokemon ; i++) {
    let x = await getPokemonInfo(i);
    console.log(x.name);
  }
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
      console.log(error.message);
    });
  });

  // let xhr = new XMLHttpRequest();
  // let promise = new Promise(function(resolve, reject) {
  //   xhr.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       resolve(JSON.parse(this.responseText));
  //     }
  //   };
  // });

  // xhr.open('GET', `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
  return promise;
}

// getPokemonInfo(1).then(res => {
//   console.log(res.name);
// });

writePokemon();
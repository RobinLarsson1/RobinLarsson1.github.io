import { displayMyTeam } from "./display.js"
import { displayPokemon } from './display.js'
import { displayMyReserves } from './display.js'
import { addPokemonToTeam } from './display.js'
import { addPokemonToReserves } from './display.js'








//Variabler
const myTeamSection = document.getElementById('my-team')
const findChampionButton = document.getElementById('find-champions')
const myTeamButton = document.getElementById('team-pokemons')
const findPokemonInput = document.getElementById('search-bar')
const pokemonContainer = document.getElementById('main-container');
const reservesContainer = document.getElementById('reserves-container')
const backToTop = document.getElementById('to-top')
const backToTopText = document.getElementById('back-to-top-text')

export { pokemonContainer }
export { reservesContainer }

backToTopText.style.opacity = "0"

backToTop.addEventListener('click', () => {
  backToTopText.style.opacity = "0";
})

backToTop.addEventListener('mouseenter', (event) => {
  backToTopText.style.opacity = "1";
  backToTopText.style.transition = "opacity 0.5s ease;"
})
backToTop.addEventListener('mouseleave', (event) => {
  backToTopText.style.transition = "opacity 0.5s ease;"
  backToTopText.style.opacity = "0";


})

//Gör så att det laddas in vid load
window.addEventListener('load', function () {
  displayPokemon();
});


//Olika "sidor"
myTeamButton.addEventListener('click', () => {
  findPokemonInput.style.visibility = "hidden"
  myTeamSection.style.visibility = "visible"
  reservesContainer.style.visibility = "visible"
  displayMyTeam();
  displayMyReserves();
})
findChampionButton.addEventListener('click', () => {
  findPokemonInput.style.visibility = "visible"
  reservesContainer.style.visibility = "hidden"
  // myTeamSection.style.visibility = "hidden"
  displayPokemon();
})

//hämtar info 
const fetchPokemon = () => {
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const pokemonList = [];

  for (let i = 1; i <= 386; i++) {
    const url = `${baseUrl}${i}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const pokemon = {
          name: data.name,
          image: data.sprites['front_default'],
          type: data.types.map(type => type.type.name).join(', '),
          abilities: data.abilities.map(ability => ability.ability.name).join(', ')

        };
        pokemonList.push(pokemon);

        // Sparar data till localStorage
        localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
      })
      .catch(error => console.error(error));
  }
};
fetchPokemon();



//sökfunktionen
let pokemonList = []

findPokemonInput.addEventListener('input', async (event) => {

  const searchString = findPokemonInput.value;
  pokemonList = JSON.parse(localStorage.getItem('pokemonList'));
  const myTeam = JSON.parse(localStorage.getItem('myTeam')) || [];
  const myReserves = JSON.parse(localStorage.getItem('myReserves')) || []

  const matchingPokemon = pokemonList.filter(pokemon => pokemon.name.includes(searchString));

  // Rensar diven som de ligger i
  pokemonContainer.innerHTML = '';

  // Skapar ny div och appendar resultatet av sökningen
  matchingPokemon.forEach(pokemon => {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('pokemoncard', 'standard-pokemon');

    const pokemonName = document.createElement('h2');
    pokemonName.textContent = pokemon.name;

    const pokemonTypeText = document.createElement('span');
    pokemonTypeText.innerHTML = '<b>Type: </b>' + pokemon.type;

    const pokemonImg = document.createElement('img');
    pokemonImg.src = pokemon.image;

    const abilitiesText = document.createElement('span');
    abilitiesText.innerHTML = '<b>Abilities:</b> ' + pokemon.abilities;

    const buttonDiv = document.createElement('div')

    const pokeAdd = document.createElement('button');
    pokeAdd.classList.add('addpokemon');
    pokeAdd.textContent = 'Add to team';

    const reserveAdd = document.createElement('button')
    reserveAdd.classList.add('pokereserve')
    reserveAdd.textContent = 'Add as reserve'

    pokemonDiv.append(pokemonImg, pokemonName, pokemonTypeText, abilitiesText, buttonDiv, pokeAdd)
    buttonDiv.append(pokeAdd, reserveAdd)
    pokemonContainer.append(pokemonDiv);

    //Lägger till i laget om det inte är fullt
    const addButton = pokemonDiv.querySelector('.addpokemon');
    addButton.addEventListener('click', () => {
      if (myTeam.length < 3) {
        addPokemonToTeam(pokemon);
        myTeam.push(pokemon);
        localStorage.setItem('myTeam', JSON.stringify(myTeam));
        let addedToTeam = document.createElement('p');
        addedToTeam.classList.add('added-text');
        addedToTeam.textContent = 'Added to team!';
        addedToTeam.style.color = 'Green'
        pokemonDiv.append(addedToTeam);
        setTimeout(() => {
          addedToTeam.remove();
        }, 1000);
      } else {
        let teamFull = document.createElement('p');
        teamFull.classList.add('added-text');
        teamFull.textContent = 'Your team is full!';
        teamFull.style.color = 'red'
        pokemonDiv.append(teamFull);
        setTimeout(() => {
          teamFull.remove();
        }, 1000);
      }
    })
    reserveAdd.addEventListener('click', () => {
      addPokemonToReserves(pokemon)
      myReserves.push(pokemon)
      localStorage.setItem('myReserves', JSON.stringify(myReserves))
      let addedToTeam = document.createElement('p');
      addedToTeam.classList.add('added-text');
      addedToTeam.textContent = 'Added as reserve!';
      addedToTeam.style.color = 'Green'
      pokemonDiv.append(addedToTeam);
      setTimeout(() => {
        addedToTeam.remove();
      }, 1000);

    });
  });
}
);


//ee
const pokeBall = document.getElementById('pokeball')
const easterEgg = document.getElementById('easteregg')



pokeBall.addEventListener('click', function () {
  pokeBall.style.visibility = "hidden";
  easterEgg.style.visibility = "visible";
});
easterEgg.addEventListener('click', function () {
  easterEgg.style.visibility = "hidden";
  pokeBall.style.visibility = "visible";
});
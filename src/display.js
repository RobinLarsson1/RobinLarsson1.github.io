import { pokemonContainer } from './dom.js'
import { reservesContainer } from './dom.js'



//Visar alla pokemons på startsidan
const displayPokemon = () => {
	const pokemonList = JSON.parse(localStorage.getItem('pokemonList'));
	const myTeam = JSON.parse(localStorage.getItem('myTeam')) || [];
	const myReserves = JSON.parse(localStorage.getItem('myReserves')) || []
	pokemonContainer.innerHTML = '';

	pokemonList.forEach((pokemon) => {
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

		//Om laget inte har 3 medlemmar ska den lägga till
		pokeAdd.addEventListener('click', () => {
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
		});

		//Lägger till i reserver LS
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

		pokemonDiv.append(pokemonImg, pokemonName, pokemonTypeText, abilitiesText, buttonDiv, pokeAdd)
		buttonDiv.append(pokeAdd, reserveAdd)
		pokemonContainer.append(pokemonDiv);
	});
};
export { displayPokemon }
export { addPokemonToTeam }



//////Visar infon från Local storage myTeam//////
const displayMyTeam = () => {
	// Hämta lagarrayen från
	const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];

	// Rensar content som ligger i diven innan
	pokemonContainer.innerHTML = "";

	const teamHeader = document.createElement('h1')
	teamHeader.classList.add('team-header')
	teamHeader.textContent = `My team (${myTeam.length}/3)`;

	pokemonContainer.append(teamHeader)

	// Loopar genom de pokemon i myteam och displayar dom
	myTeam.forEach((pokemon, index) => {

		const pokemonDiv = document.createElement("div");
		pokemonDiv.classList.add("pokemoncard");

		const pokemonName = document.createElement("h2");
		pokemonName.classList.add("pokemon-name");
		pokemonName.textContent = pokemon.name;

		const editIcon = document.createElement("i");
		editIcon.innerHTML = ('<i class="ri-pencil-fill"></i>')
		editIcon.setAttribute("title", "Edit name");


		//Gör så att man kan välja namn på lagmedlemmarna 
		editIcon.addEventListener("click", () => {
			const inputField = document.createElement("input");
			inputField.type = "text";
			inputField.value = pokemonName.textContent;
			inputField.maxLength = 12;
			inputField.addEventListener("keydown", (event) => {
				if (event.key === 'Enter') {
					pokemon.name = inputField.value;
					pokemonName.textContent = inputField.value;
					localStorage.setItem("myTeam", JSON.stringify(myTeam));
					inputField.replaceWith(pokemonName);
				}
			});
			pokemonName.replaceWith(inputField);
			inputField.focus();
		});

		const pokemonTypeText = document.createElement('span')
		pokemonTypeText.innerHTML = "<b>Type: </b>" + pokemon.type;

		const pokemonImg = document.createElement('img')
		pokemonImg.src = pokemon.image;


		const abilitiesText = document.createElement('span');
		abilitiesText.innerHTML = "<b>Abilities:</b> " + pokemon.abilities;

		const removeFromTeam = document.createElement("button");
		removeFromTeam.classList.add('removepokemon')
		removeFromTeam.textContent = "Remove from team";

		removeFromTeam.addEventListener("click", () => {
			for (let i = myTeam.length - 1; i >= 0; i--) {
				if (myTeam[i].name === pokemon.name) {
					myTeam.splice(i, 1);
					break;
				}
			}
			pokemonContainer.removeChild(pokemonDiv);
			localStorage.setItem("myTeam", JSON.stringify(myTeam));
			teamHeader.textContent = `My team (${myTeam.length}/3)`;
			// Kontrollera om vi nu har ett tomt lag och lägg till meddelandet om det är fallet
			if (myTeam.length === 0) {
				displayEmptyTeamText();
			}
		});




		let orderButtonDiv = document.createElement('div')
		orderButtonDiv.classList.add('order-buttons')

		//Knappar för att flytta i ordningen i laget
		let upButton = document.createElement("button");
		upButton.setAttribute('class', 'upButton')
		upButton.setAttribute("title", "Move up the order");
		upButton.innerHTML = ('<i class="ri-arrow-left-line"></i>');
		upButton.addEventListener("click", function () {
			let prevSibling = pokemonDiv.previousElementSibling;
			if (prevSibling !== null) {
				pokemonContainer.insertBefore(pokemonDiv, prevSibling);
			}
		});


		//Knappar för att flytta i ordningen i laget
		let downButton = document.createElement("button");
		downButton.setAttribute('class', 'downButton')
		downButton.setAttribute("title", "Move down the order");
		downButton.innerHTML = ('<i class="ri-arrow-right-line"></i>');
		downButton.addEventListener("click", function () {
			let nextSibling = pokemonDiv.nextElementSibling;
			if (nextSibling !== null) {
				pokemonContainer.insertBefore(nextSibling, pokemonDiv);
			}
		});

		pokemonDiv.append(pokemonImg, editIcon, pokemonName, pokemonTypeText, abilitiesText, removeFromTeam, orderButtonDiv);
		orderButtonDiv.append(downButton)
		orderButtonDiv.append(upButton)

		pokemonContainer.append(pokemonDiv);
	});

	// Kontrollera om vi har mindre än tre pokemon i laget och lägg till meddelandet om det är fallet

	// Kontrollera om laget är tomt och lägg till meddelandet om det är fallet
	if (myTeam.length === 0) {
		displayEmptyTeamText();

	}


};


export { displayMyTeam }



//Reserver
const displayMyReserves = () => {
	// Hämta lagarrayen från
	const myReserves = JSON.parse(localStorage.getItem("myReserves")) || [];
	const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];
	reservesContainer.innerHTML = "";
	// Rensar content som ligger i diven innan

	let divider = document.createElement('hr')
	divider.classList.add('reserve-line')

	const reserveHeader = document.createElement('h1')
	reserveHeader.classList.add('reserves-header')
	reserveHeader.textContent = 'My reserves'


	reservesContainer.append(divider)


	reservesContainer.append(reserveHeader)



	// Loopar genom de pokemon i myteam och displayar dom
	myReserves.forEach((pokemon, index) => {

		const pokemonDiv = document.createElement("div");
		pokemonDiv.classList.add("pokemoncard");

		const pokemonName = document.createElement("h2");
		pokemonName.textContent = pokemon.name;

		const pokemonTypeText = document.createElement('span')
		pokemonTypeText.innerHTML = "<b>Type: </b>" + pokemon.type;

		const pokemonImg = document.createElement('img')
		pokemonImg.src = pokemon.image;


		const abilitiesText = document.createElement('span');
		abilitiesText.innerHTML = "<b>Abilities:</b> " + pokemon.abilities;

		const removeFromTeam = document.createElement("button");
		removeFromTeam.classList.add('removepokemon')
		removeFromTeam.textContent = "Remove from Reserves";

		removeFromTeam.addEventListener("click", () => {

			for (let i = myReserves.length - 1; i >= 0; i--) {
				if (myReserves[i].name === pokemon.name) {
					myReserves.splice(i, 1);
					break;
				}
			}
			reservesContainer.removeChild(pokemonDiv);
			localStorage.setItem("myReserves", JSON.stringify(myReserves));
			// Kontrollera om vi nu har ett tomt lag och lägg till meddelandet om det är fallet
		});
		pokemonDiv.append(pokemonImg, pokemonName, pokemonTypeText, abilitiesText, removeFromTeam);
		reservesContainer.append(pokemonDiv);
	});

};
export { displayMyReserves }
export { addPokemonToReserves }



//Displayar text oim laget är tomt
const displayEmptyTeamText = () => {
	let emptyTeamText = document.createElement('h2')
	emptyTeamText.innerHTML = 'Your team is empty! Go to <span style="color: #FFCB05">Find Champions</span> to choose your Pokémons';
	emptyTeamText.classList.add('empty-team-text')
	pokemonContainer.append(emptyTeamText)
}



//lägger till pokemons i separat LS
const addPokemonToTeam = (pokemon) => {
	const myTeam = JSON.parse(localStorage.getItem('myTeam')) || [];
	myTeam.push(pokemon);
	localStorage.setItem('myTeam', JSON.stringify(myTeam));
};



//lägger till i reserver
const addPokemonToReserves = (pokemon) => {
	const myReserves = JSON.parse(localStorage.getItem('myReserves')) || [];
	myReserves.push(pokemon);
	localStorage.setItem('myReserves', JSON.stringify(myReserves));
};


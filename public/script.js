// public/script.js
document.addEventListener('DOMContentLoaded', async () => {
  const pokemonList = document.getElementById('pokemon-list');
  const teamList = document.getElementById('team-list');
  let team = [];

  try {
    const response = await fetch('/api/pokemon');
    const pokemonData = await response.json();
    
    pokemonData.forEach(pokemon => {
      const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
      const pokemonDiv = document.createElement('div');
      pokemonDiv.className = 'pokemon';
      pokemonDiv.innerHTML = `
        <img src="images/${pokemonId}.png" alt="${pokemon.name}">
        ${pokemon.name}
      `;
      pokemonDiv.addEventListener('click', () => selectPokemon(pokemonId, pokemon.name));
      pokemonList.appendChild(pokemonDiv);
    });
  } catch (err) {
    console.error('Error fetching Pokemon data:', err);
  }

  function selectPokemon(id, name) {
    if (team.length < 6) {
      team.push({ id, name, nickname: name });
      updateTeamList();
    } else {
      alert('You have already selected 6 Pokémon. Please swap one out.');
    }
  }

  function updateTeamList() {
    teamList.innerHTML = '';
    team.forEach((pokemon, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="images/${pokemon.id}.png" alt="${pokemon.name}">
        <input type="text" value="${pokemon.nickname}" data-id="${pokemon.id}">
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      listItem.querySelector('input').addEventListener('input', (event) => {
        const newNickname = event.target.value;
        const poke = team.find(p => p.id === pokemon.id);
        if (poke) poke.nickname = newNickname;
      });
      listItem.querySelector('.remove-btn').addEventListener('click', handleRemove);
      teamList.appendChild(listItem);
    });

    if (team.length === 6) {
      alert(`Final selection: ${team.map(pokemon => pokemon.nickname).join(', ')}`);
    }
  }

  function handleRemove(event) {
    const index = event.target.dataset.index;
    const confirmed = confirm('Are you sure you want to remove this Pokémon from your team?');
    if (confirmed) {
      team.splice(index, 1);
      updateTeamList();
    }
  }

  // Add 'remove-btn' styles in styles.css for better button appearance (Optional)
});
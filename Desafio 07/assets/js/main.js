const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 9
let offset = 0;
let currentTypeFilter = null;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    if (currentTypeFilter) {
        // Se estiver filtrando, carrega todos e filtra e ordena
        pokeApi.getAllPokemons().then((pokemons = []) => {
            const filtered = pokemons
                .filter(pokemon =>
                    pokemon.types.some(t => t.toLowerCase() === currentTypeFilter.toLowerCase())
                )
                .sort((a, b) => a.number - b.number);
            const paginated = filtered.slice(offset, offset + limit);
            const newHtml = paginated.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
        });
    } else {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('')
            pokemonList.innerHTML += newHtml
        })
    }
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    let totalRecords = maxRecords;
    if (currentTypeFilter) {
        // Se filtrando, recalcula total
        pokeApi.getAllPokemons().then((pokemons = []) => {
            const filtered = pokemons.filter(pokemon =>
                pokemon.types.some(t => t.toLowerCase() === currentTypeFilter.toLowerCase())
            );
            totalRecords = filtered.length;
            if (offset + limit >= totalRecords) {
                const newLimit = totalRecords - offset;
                loadPokemonItens(offset, newLimit);
                loadMoreButton.parentElement.removeChild(loadMoreButton);
            } else {
                loadPokemonItens(offset, limit);
            }
        });
    } else {
        if (qtdRecordsWithNexPage >= maxRecords) {
            const newLimit = maxRecords - offset;
            loadPokemonItens(offset, newLimit);
            loadMoreButton.parentElement.removeChild(loadMoreButton);
        } else {
            loadPokemonItens(offset, limit);
        }
    }
})

// --- Filtro por tipo ---
function filterPokemonsByType(type) {
    currentTypeFilter = type;
    offset = 0;
    pokemonList.innerHTML = '';
    pokeApi.getAllPokemons().then(pokemons => {
        const filtered = pokemons
            .filter(pokemon =>
                pokemon.types.some(t => t.toLowerCase() === type.toLowerCase())
            )
            .sort((a, b) => a.number - b.number);
        const paginated = filtered.slice(offset, offset + limit);
        const newHtml = paginated.map(convertPokemonToLi).join('');
        pokemonList.innerHTML = newHtml;
        // Exibe ou oculta botão Load More
        if (filtered.length > limit) {
            if (!loadMoreButton.parentElement)
                document.querySelector('.pagination').appendChild(loadMoreButton);
            loadMoreButton.style.display = '';
        } else {
            loadMoreButton.style.display = 'none';
        }
    });
}

document.getElementById('typeSearchButton').addEventListener('click', function() {
    const type = document.getElementById('typeInput').value.trim();
    if (type) {
        filterPokemonsByType(type);
    }
});

document.getElementById('typeInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('typeSearchButton').click();
    }
});

// Botão para limpar filtro
document.getElementById('clearTypeButton').addEventListener('click', function() {
    currentTypeFilter = null;
    offset = 0;
    document.getElementById('typeInput').value = '';
    pokemonList.innerHTML = '';
    loadMoreButton.style.display = '';
    document.querySelector('.pagination').appendChild(loadMoreButton);
    loadPokemonItens(offset, limit);
});
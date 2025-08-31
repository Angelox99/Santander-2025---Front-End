
// Dados das cartas (exemplo)
const cards = [
	{
		name: 'Dark Magician',
		attribute: 'Rock',
		img: 'src/assets/icons/magician.png'
	},
	{
		name: 'Blue-Eyes White Dragon',
		attribute: 'Dragon',
		img: 'src/assets/icons/dragon.png'
	},
	{
		name: 'Exodia',
		attribute: 'Legend',
		img: 'src/assets/icons/exodia.png'
	}
];

let win = 0;
let lose = 0;

const scoreEl = document.getElementById('score');
const cardImgEl = document.getElementById('card-img');
const cardNameEl = document.getElementById('card-name');
const cardAttrEl = document.getElementById('card-attribute');

const resetBtn = document.getElementById('reset-btn');
const winAudio = document.getElementById('win-audio');
const loseAudio = document.getElementById('lose-audio');
const bgmAudio = document.getElementById('bgm');
const versusScreen = document.getElementById('versus-screen');

// Cartas clicáveis (5 de baixo)
const bottomCards = document.querySelectorAll('.bottom-row .board-card');

// Espaços centrais para duelo
function showDuel(playerCard, enemyCard, result) {
	// Animação de transição
	versusScreen.innerHTML = `
		<div id='duel-cards' class='duel-cards-row'>
			<div class='duel-card-bg'>
				<img src='${playerCard.img}' class='duel-card-img' style='opacity:0; transform:translateY(40px); transition:all 0.5s;'>
			</div>
			<div class='duel-card-bg'>
				<img src='${enemyCard.img}' class='duel-card-img' style='opacity:0; transform:translateY(40px); transition:all 0.5s;'>
			</div>
		</div>
		<div class='duel-result-row'>
			<button class='duel-result-btn'>${result}</button>
		</div>
	`;
	versusScreen.style.display = 'flex';

	setTimeout(() => {
		// Anima as cartas para aparecerem
		const imgs = versusScreen.querySelectorAll('.duel-card-img');
		imgs.forEach((img, i) => {
			setTimeout(() => {
				img.style.opacity = '1';
				img.style.transform = 'translateY(0)';
			}, i * 200);
		});
	}, 100);
	setTimeout(() => {
		versusScreen.style.display = 'none';
	}, 2200);
}

function duel(playerCard) {
	const enemyCard = cards[Math.floor(Math.random() * cards.length)];
	showCard(playerCard);
	let result = '';
	if (playerCard.name === enemyCard.name) {
		result = 'Empate';
	} else if (playerCard.name === 'Exodia' || (playerCard.name === 'Blue-Eyes White Dragon' && enemyCard.name === 'Dark Magician')) {
		result = 'Ganhou';
		win++;
		winAudio.play();
	} else {
		result = 'Perdeu';
		lose++;
		loseAudio.play();
	}
	updateScore();
	showDuel(playerCard, enemyCard, result);
}

bottomCards.forEach((cardEl, idx) => {
	cardEl.addEventListener('click', () => {
		duel(cards[idx % cards.length]);
	});
});

function updateScore() {
	scoreEl.textContent = `Win: ${win} | Lose: ${lose}`;
}

function showCard(card) {
	cardImgEl.src = card.img;
	cardNameEl.textContent = card.name;
	cardAttrEl.textContent = `Attribute : ${card.attribute}`;
}

function duel() {
	// Simula duelo aleatório
	const playerCard = cards[Math.floor(Math.random() * cards.length)];
	const enemyCard = cards[Math.floor(Math.random() * cards.length)];
	showCard(playerCard);
	versusScreen.style.display = 'flex';
	setTimeout(() => {
		versusScreen.style.display = 'none';
		if (playerCard.name === enemyCard.name) {
			win++;
			winAudio.play();
		} else {
			lose++;
			loseAudio.play();
		}
		updateScore();
	}, 2000);
}


resetBtn.addEventListener('click', () => {
	win = 0;
	lose = 0;
	updateScore();
});

// Inicia placar
updateScore();

// Música de fundo
window.addEventListener('DOMContentLoaded', () => {
	bgmAudio.volume = 0.3;
	bgmAudio.play();
	bgmAudio.addEventListener('canplaythrough', () => {
		bgmAudio.play();
	});
});

const pares = ['🦄', '🌈', '🍭', '☁️', '⭐', '🧚', '🍦', '☀️'];

let cartas = [];
let cartaVirada = null;
let bloqueado = false;
let paresEncontrados = 0;
let tentativas = 0;
let pontos = 0;

const elementos = {
    grid: document.getElementById('memory-grid'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    tentativas: document.getElementById('tentativas'),
    btnRestart: document.getElementById('btn-restart')
};

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function criarCartas() {
    cartas = [];
    pares.forEach(par => {
        cartas.push({ id: cartas.length, conteudo: par, virada: false, encontrada: false });
        cartas.push({ id: cartas.length, conteudo: par, virada: false, encontrada: false });
    });
    cartas = embaralhar(cartas);
}

function renderizarGrid() {
    elementos.grid.innerHTML = '';
    cartas.forEach((carta, indice) => {
        const card = document.createElement('div');
        card.className = `memory-card ${carta.virada || carta.encontrada ? 'flipped' : ''} ${carta.encontrada ? 'matched' : ''}`;
        card.dataset.indice = indice;

        const inner = document.createElement('div');
        inner.className = 'memory-card-inner';

        const front = document.createElement('div');
        front.className = 'memory-card-front';
        front.textContent = '?';

        const back = document.createElement('div');
        back.className = 'memory-card-back';
        back.textContent = carta.conteudo;

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => virarCarta(indice));
        elementos.grid.appendChild(card);
    });
}

function virarCarta(indice) {
    if (bloqueado) return;
    const carta = cartas[indice];
    if (carta.virada || carta.encontrada) return;

    carta.virada = true;
    renderizarGrid();

    if (!cartaVirada) {
        cartaVirada = carta;
        return;
    }

    bloqueado = true;
    tentativas++;
    elementos.tentativas.textContent = tentativas;

    if (cartaVirada.conteudo === carta.conteudo) {
        cartaVirada.encontrada = true;
        carta.encontrada = true;
        cartaVirada = null;
        bloqueado = false;
        paresEncontrados++;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = 'Par encontrado! 🎉';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Par encontrado');

        if (paresEncontrados === pares.length) {
            elementos.feedback.textContent = `🎉 Você venceu! Encontrou todos os pares em ${tentativas} tentativas!`;
            playSuccess();
            falar('Parabéns, você venceu!');
        }
    } else {
        elementos.feedback.textContent = 'Não é igual. Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
        setTimeout(() => {
            cartaVirada.virada = false;
            carta.virada = false;
            cartaVirada = null;
            bloqueado = false;
            renderizarGrid();
        }, 1200);
    }
}

function reiniciarJogo() {
    cartaVirada = null;
    bloqueado = false;
    paresEncontrados = 0;
    tentativas = 0;
    pontos = 0;
    elementos.pontos.textContent = pontos;
    elementos.tentativas.textContent = tentativas;
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    criarCartas();
    renderizarGrid();
}

elementos.btnRestart.addEventListener('click', reiniciarJogo);

reiniciarJogo();


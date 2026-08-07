const ICONS = ['🦄', '🌈', '🍭', '☁️', '⭐', '🧚', '🍦', '☀️'];

const FASES = [
    { pares: 2, tentativas: 4, cols: 2, largura: 360, fonte: 4.5 },
    { pares: 3, tentativas: 6, cols: 3, largura: 420, fonte: 4 },
    { pares: 4, tentativas: 8, cols: 4, largura: 500, fonte: 3.5 },
    { pares: 6, tentativas: 12, cols: 4, largura: 560, fonte: 3.5 },
    { pares: 8, tentativas: 16, cols: 4, largura: 600, fonte: 3 }
];

let faseAtual = 0;
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
    fase: document.getElementById('fase-atual'),
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
    const fase = FASES[faseAtual];
    const emojis = ICONS.slice(0, fase.pares);
    emojis.forEach(par => {
        cartas.push({ id: cartas.length, conteudo: par, virada: false, encontrada: false });
        cartas.push({ id: cartas.length, conteudo: par, virada: false, encontrada: false });
    });
    cartas = embaralhar(cartas);
}

function renderizarGrid() {
    const fase = FASES[faseAtual];
    elementos.grid.innerHTML = '';
    elementos.grid.style.setProperty('--grid-cols', fase.cols);
    elementos.grid.style.setProperty('--grid-width', fase.largura + 'px');
    elementos.grid.style.setProperty('--card-font', fase.fonte + 'rem');
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
    const fase = FASES[faseAtual];

    carta.virada = true;
    renderizarGrid();

    if (!cartaVirada) {
        cartaVirada = carta;
        return;
    }

    bloqueado = true;
    tentativas++;
    elementos.tentativas.textContent = tentativas + ' / ' + fase.tentativas;

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

        if (paresEncontrados === fase.pares) {
            if (faseAtual < FASES.length - 1) {
                faseAtual++;
                elementos.feedback.textContent = 'Fase completa! 🎉';
                setTimeout(prepararFase, 1500);
            } else {
                elementos.feedback.textContent = '🎉 Você completou todas as fases!';
                playSuccess();
                falar('Parabéns, você completou todas as fases!');
            }
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

            if (tentativas >= fase.tentativas && paresEncontrados < fase.pares) {
                bloqueado = true;
                elementos.feedback.textContent = 'Tentativas acabaram! Vamos tentar de novo! 🔄';
                elementos.feedback.className = 'feedback error';
                falar('Tentativas acabadas. Vamos tentar esta fase de novo.');
                setTimeout(prepararFase, 2000);
            }
        }, 1200);
    }
}

function prepararFase() {
    const fase = FASES[faseAtual];
    cartaVirada = null;
    bloqueado = false;
    paresEncontrados = 0;
    tentativas = 0;
    elementos.fase.textContent = (faseAtual + 1);
    elementos.pontos.textContent = pontos;
    elementos.tentativas.textContent = '0 / ' + fase.tentativas;
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    criarCartas();
    renderizarGrid();
    falar('Fase ' + (faseAtual + 1) + '! Encontre ' + fase.pares + ' pares!');
}

function reiniciarJogo() {
    faseAtual = 0;
    pontos = 0;
    prepararFase();
}

elementos.btnRestart.addEventListener('click', reiniciarJogo);

reiniciarJogo();


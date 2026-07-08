const palavras = [
    { palavra: 'mamãe', silabas: ['ma', 'mãe'], emoji: '👩' },
    { palavra: 'papai', silabas: ['pa', 'pai'], emoji: '👨' },
    { palavra: 'bola', silabas: ['bo', 'la'], emoji: '⚽' },
    { palavra: 'casa', silabas: ['ca', 'sa'], emoji: '🏠' },
    { palavra: 'gato', silabas: ['ga', 'to'], emoji: '🐱' },
    { palavra: 'mesa', silabas: ['me', 'sa'], emoji: '🪑' },
    { palavra: 'lua', silabas: ['lu', 'a'], emoji: '🌙' },
    { palavra: 'sol', silabas: ['so', 'l'], emoji: '☀️' },
    { palavra: 'bolo', silabas: ['bo', 'lo'], emoji: '🎂' },
    { palavra: 'maçã', silabas: ['ma', 'çã'], emoji: '🍎' },
    { palavra: 'cão', silabas: ['cão'], emoji: '🐶' },
    { palavra: 'pé', silabas: ['pé'], emoji: '🦶' }
];

let palavraAtual = null;
let silabasSelecionadas = [];
let pontos = 0;
let concluido = false;

const elementos = {
    emoji: document.getElementById('emoji'),
    targetSlots: document.getElementById('target-slots'),
    syllables: document.getElementById('syllables'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

function embaralhar(array) {
    const novo = [...array];
    for (let i = novo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novo[i], novo[j]] = [novo[j], novo[i]];
    }
    return novo;
}

function escolherPalavra() {
    const indice = Math.floor(Math.random() * palavras.length);
    return palavras[indice];
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

function carregarPalavra() {
    palavraAtual = escolherPalavra();
    silabasSelecionadas = [];
    concluido = false;

    elementos.emoji.textContent = palavraAtual.emoji;
    elementos.emoji.classList.remove('celebration');
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    // Criar slots de destino
    elementos.targetSlots.innerHTML = '';
    for (let i = 0; i < palavraAtual.silabas.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.indice = i;
        slot.textContent = '?';
        elementos.targetSlots.appendChild(slot);
    }

    // Criar botões de sílabas embaralhadas
    elementos.syllables.innerHTML = '';
    const silabasEmbaralhadas = embaralhar(palavraAtual.silabas);
    silabasEmbaralhadas.forEach((silaba, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable color-${(indice % 6) + 1}`;
        botao.textContent = silaba;
        botao.dataset.silaba = silaba;
        botao.addEventListener('click', () => selecionarSyllable(botao));
        elementos.syllables.appendChild(botao);
    });
}

function selecionarSyllable(botao) {
    if (concluido) return;

    const silaba = botao.dataset.silaba;
    const indiceEsperado = silabasSelecionadas.length;

    if (silaba === palavraAtual.silabas[indiceEsperado]) {
        silabasSelecionadas.push(silaba);
        botao.classList.add('used');

        const slots = elementos.targetSlots.querySelectorAll('.slot');
        slots[indiceEsperado].textContent = silaba;
        slots[indiceEsperado].classList.add('filled');

        if (silabasSelecionadas.length === palavraAtual.silabas.length) {
            concluido = true;
            pontos += 10;
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = `🎉 Parabéns! A palavra é ${palavraAtual.palavra}!`;
            elementos.feedback.className = 'feedback success';
            elementos.emoji.classList.add('celebration');
            elementos.btnNext.disabled = false;
            falar(`Parabéns! A palavra é ${palavraAtual.palavra}`);
        } else {
            falar(silaba);
        }
    } else {
        botao.classList.add('celebration');
        setTimeout(() => botao.classList.remove('celebration'), 500);
        elementos.feedback.textContent = 'Tente outra sílaba! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outra sílaba');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    if (palavraAtual) {
        falar(palavraAtual.palavra);
    }
});

elementos.btnNext.addEventListener('click', () => {
    carregarPalavra();
});

// Iniciar o jogo
carregarPalavra();

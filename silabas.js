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
    { palavra: 'pé', silabas: ['pé'], emoji: '🦶' },
    { palavra: 'u-ni-cór-nio', silabas: ['u', 'ni', 'cór', 'nio'], emoji: '🦄' },
    { palavra: 'arco-íris', silabas: ['ar', 'co', 'í', 'ris'], emoji: '🌈' },
    { palavra: 'marshmallow', silabas: ['marsh', 'mal', 'low'], emoji: '🍬' },
    { palavra: 'nuvem', silabas: ['nu', 'vem'], emoji: '☁️' },
    { palavra: 'estrela', silabas: ['es', 'tre', 'la'], emoji: '⭐' },
    { palavra: 'fada', silabas: ['fa', 'da'], emoji: '🧚' }
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

    return novo;
}

function escolherPalavra() {
    const indice = Math.floor(Math.random() * palavras.length);
    return palavras[indice];
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

    elementos.targetSlots.innerHTML = '';
    for (let i = 0; i < palavraAtual.silabas.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.indice = i;
        slot.textContent = '?';
        elementos.targetSlots.appendChild(slot);
    }

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
            playSuccess();
            falar(`Parabéns! A palavra é ${palavraAtual.palavra}`);
        } else {
            playClick();
            falar(silaba);
        }
    } else {
        botao.classList.add('celebration');
        setTimeout(() => botao.classList.remove('celebration'), 500);
        elementos.feedback.textContent = 'Tente outra sílaba! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
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

carregarPalavra();

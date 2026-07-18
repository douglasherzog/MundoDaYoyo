const palavrasLista = [
    { palavra: 'BOLA', emoji: '⚽' },
    { palavra: 'CASA', emoji: '🏠' },
    { palavra: 'GATO', emoji: '🐱' },
    { palavra: 'LUA', emoji: '🌙' },
    { palavra: 'SOL', emoji: '☀️' },
    { palavra: 'MÃE', emoji: '👩' },
    { palavra: 'PAI', emoji: '👨' },
    { palavra: 'PÃO', emoji: '🍞' },
    { palavra: 'MÃO', emoji: '✋' },
    { palavra: 'PÉ', emoji: '🦶' },
    { palavra: 'BOLO', emoji: '🎂' },
    { palavra: 'ROSA', emoji: '🌹' },
    { palavra: 'SAPO', emoji: '🐸' },
    { palavra: 'RATO', emoji: '🐭' },
    { palavra: 'FOCA', emoji: '🦭' }
];

let palavraAtual = null;
let letrasDigitadas = [];
let pontos = 0;
let concluido = false;

const elementos = {
    image: document.getElementById('word-image'),
    slots: document.getElementById('word-slots'),
    tip: document.getElementById('word-tip'),
    keyboard: document.getElementById('keyboard'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnClear: document.getElementById('btn-clear'),
    btnNext: document.getElementById('btn-next')
};

    return novo;
}

}

function escolherPalavra() {
    return palavrasLista[Math.floor(Math.random() * palavrasLista.length)];
}

function atualizarSlots() {
    elementos.slots.innerHTML = '';
    for (let i = 0; i < palavraAtual.palavra.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.textContent = letrasDigitadas[i] || '';
        if (letrasDigitadas[i]) {
            slot.classList.add('filled');
        }
        elementos.slots.appendChild(slot);
    }
}

function criarTeclado() {
    elementos.keyboard.innerHTML = '';
    const letras = palavraAtual.palavra.split('');
    const letrasExtras = embaralhar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')).slice(0, 10);
    const todasLetras = embaralhar([...letras, ...letrasExtras]);

    todasLetras.forEach((letra, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable color-${(indice % 6) + 1}`;
        botao.textContent = letra;
        botao.addEventListener('click', () => adicionarLetra(letra));
        elementos.keyboard.appendChild(botao);
    });
}

function adicionarLetra(letra) {
    if (concluido) return;

    if (letrasDigitadas.length < palavraAtual.palavra.length) {
        const indiceEsperado = letrasDigitadas.length;

        if (letra === palavraAtual.palavra[indiceEsperado]) {
            letrasDigitadas.push(letra);
            atualizarSlots();
            playClick();
            falar(letra.toLowerCase());

            if (letrasDigitadas.length === palavraAtual.palavra.length) {
                concluido = true;
                pontos += 10;
                elementos.pontos.textContent = pontos;
                elementos.feedback.textContent = `🎉 Parabéns! Você escreveu ${palavraAtual.palavra}!`;
                elementos.feedback.className = 'feedback success';
                elementos.btnNext.disabled = false;
                elementos.image.classList.add('celebration');
                playSuccess();
                falar(`Parabéns! Você escreveu ${palavraAtual.palavra}`);
            }
        } else {
            const botoes = elementos.keyboard.querySelectorAll('.syllable');
            botoes.forEach(botao => {
                if (botao.textContent === letra) {
                    botao.classList.add('shake');
                    setTimeout(() => botao.classList.remove('shake'), 500);
                }
            });
            elementos.feedback.textContent = 'Letra errada! Tente outra. 💪';
            elementos.feedback.className = 'feedback error';
            playError();
            falar('Tente outra letra');
        }
    }
}

function limpar() {
    letrasDigitadas = [];
    concluido = false;
    atualizarSlots();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.image.classList.remove('celebration');
    falar('Limpo. Tente de novo');
}

function carregarRodada() {
    palavraAtual = escolherPalavra();
    letrasDigitadas = [];
    concluido = false;

    elementos.image.textContent = palavraAtual.emoji;
    elementos.image.classList.remove('celebration');
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.tip.textContent = 'Clique nas letras na ordem certa';

    atualizarSlots();
    criarTeclado();

    falar(`Escreva a palavra ${palavraAtual.palavra}`);
}

elementos.btnSpeak.addEventListener('click', () => {
    if (palavraAtual) {
        falar(`Escreva a palavra ${palavraAtual.palavra}`);
    }
});

elementos.btnClear.addEventListener('click', limpar);
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();

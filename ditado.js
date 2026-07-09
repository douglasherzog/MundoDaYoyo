const palavras = [
    { palavra: 'gato', emoji: '🐱' },
    { palavra: 'bola', emoji: '⚽' },
    { palavra: 'casa', emoji: '🏠' },
    { palavra: 'sol', emoji: '☀️' },
    { palavra: 'lua', emoji: '🌙' },
    { palavra: 'maçã', emoji: '🍎' },
    { palavra: 'peixe', emoji: '🐟' },
    { palavra: 'aviao', emoji: '✈️' },
    { palavra: 'livro', emoji: '📚' },
    { palavra: 'sapo', emoji: '🐸' },
    { palavra: 'uva', emoji: '🍇' },
    { palavra: 'pato', emoji: '🦆' }
];

let palavraAtual = null;
let respostaAtual = '';
let concluido = false;
let pontos = 0;

const elementos = {
    emoji: document.getElementById('spelling-emoji'),
    btnHear: document.getElementById('btn-hear'),
    word: document.getElementById('spelling-word'),
    keyboard: document.getElementById('keyboard-area'),
    feedback: document.getElementById('feedback'),
    btnClear: document.getElementById('btn-clear'),
    btnCheck: document.getElementById('btn-check'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count')
};

function atualizarEstrelas() {
    const estrelas = carregarEstrelas();
    elementos.starsCount.textContent = estrelas;
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.8;
        window.speechSynthesis.speak(msg);
    }
}

function embaralhar(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function gerarDesafio() {
    concluido = false;
    respostaAtual = '';
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];

    elementos.emoji.textContent = palavraAtual.emoji;
    elementos.word.innerHTML = '';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.btnCheck.disabled = false;

    const letrasUnicas = [...new Set(normalizar(palavraAtual.palavra).split(''))];
    const letrasExtras = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !letrasUnicas.includes(l));
    const extras = embaralhar(letrasExtras).slice(0, Math.max(6 - letrasUnicas.length, 0));
    const teclas = embaralhar([...letrasUnicas, ...extras]);

    elementos.keyboard.innerHTML = '';
    teclas.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra.toUpperCase();
        btn.className = 'spelling-key';
        btn.dataset.letra = letra;
        btn.addEventListener('click', () => adicionarLetra(letra));
        elementos.keyboard.appendChild(btn);
    });

    falar(`Digite a palavra: ${palavraAtual.palavra}`);
}

function adicionarLetra(letra) {
    if (concluido) return;
    if (respostaAtual.length >= palavraAtual.palavra.length) return;

    respostaAtual += letra;
    atualizarWordDisplay();
    falar(letra);
}

function atualizarWordDisplay() {
    elementos.word.innerHTML = '';
    for (let i = 0; i < palavraAtual.palavra.length; i++) {
        const slot = document.createElement('span');
        slot.className = 'spelling-slot';
        slot.textContent = respostaAtual[i] ? respostaAtual[i].toUpperCase() : '';
        if (respostaAtual[i]) slot.classList.add('filled');
        elementos.word.appendChild(slot);
    }
}

function limpar() {
    if (concluido) return;
    respostaAtual = '';
    atualizarWordDisplay();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function verificar() {
    if (concluido) return;
    if (respostaAtual.length < palavraAtual.palavra.length) {
        elementos.feedback.textContent = 'Complete a palavra! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Complete a palavra');
        return;
    }

    if (normalizar(respostaAtual) === normalizar(palavraAtual.palavra)) {
        concluido = true;
        pontos += 10;
        elementos.feedback.textContent = `🎉 Muito bem! ${palavraAtual.palavra}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        elementos.btnCheck.disabled = true;
        falar(`Muito bem! ${palavraAtual.palavra}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        elementos.feedback.textContent = 'Quase lá! Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Quase lá. Tente de novo');
        playError();
    }
}

elementos.btnHear.addEventListener('click', () => {
    if (palavraAtual) falar(`Digite a palavra: ${palavraAtual.palavra}`);
});

elementos.btnClear.addEventListener('click', limpar);
elementos.btnCheck.addEventListener('click', verificar);
elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

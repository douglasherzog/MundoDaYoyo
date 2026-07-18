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

const elementos = {
    emoji: document.getElementById('emoji'),
    targetSlots: document.getElementById('target-slots'),
    syllables: document.getElementById('syllables'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, palavraAtual = null, silabasSelecionadas = [], concluido = false, wrongCount = 0;

function carregarPalavra() {
    if (round >= 10) { vitoria(); return; }
    round++;
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];
    silabasSelecionadas = [];
    concluido = false;
    wrongCount = 0;

    elementos.emoji.textContent = palavraAtual.emoji;
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    elementos.targetSlots.innerHTML = '';
    for (var i = 0; i < palavraAtual.silabas.length; i++) {
        var slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.indice = i;
        slot.textContent = '?';
        elementos.targetSlots.appendChild(slot);
    }

    var silabas = embaralhar(palavraAtual.silabas.slice());
    elementos.syllables.innerHTML = '';
    silabas.forEach(function(silaba, indice) {
        var btn = document.createElement('button');
        btn.className = 'game-option syllable color-' + ((indice % 6) + 1);
        btn.textContent = silaba;
        btn.dataset.silaba = silaba;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.syllables.appendChild(btn);
    });

    setTimeout(function() { falar(palavraAtual.palavra); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    var silaba = btn.dataset.silaba;
    var indiceEsperado = silabasSelecionadas.length;

    if (silaba === palavraAtual.silabas[indiceEsperado]) {
        silabasSelecionadas.push(silaba);
        btn.classList.add('used');
        btn.disabled = true;
        var slots = elementos.targetSlots.querySelectorAll('.slot');
        slots[indiceEsperado].textContent = silaba;
        slots[indiceEsperado].classList.add('filled');

        if (silabasSelecionadas.length === palavraAtual.silabas.length) {
            concluido = true;
            pontos += Math.max(10 - wrongCount * 2, 3);
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = ' Parabéns! A palavra é ' + palavraAtual.palavra + '!';
            elementos.feedback.className = 'feedback success';
            playSuccess();
            falar('Parabéns! A palavra é ' + palavraAtual.palavra);
            setTimeout(carregarPalavra, 2000);
        } else {
            playClick();
            falar(silaba);
        }
    } else {
        wrongCount++;
        btn.classList.add('shake');
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outra sílaba! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra sílaba');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.syllables.innerHTML = '';
    elementos.targetSlots.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; elementos.pontos.textContent = 0; carregarPalavra(); });
    elementos.syllables.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() {
    if (palavraAtual) falar(palavraAtual.palavra);
});
carregarPalavra();
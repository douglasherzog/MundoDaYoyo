const palavras = [
    { palavra: 'gato', emoji: '🐱' },
    { palavra: 'bola', emoji: '⚽' },
    { palavra: 'casa', emoji: '🏠' },
    { palavra: 'sol', emoji: '☀️' },
    { palavra: 'lua', emoji: '🌙' },
    { palavra: 'maçã', emoji: '🍎' },
    { palavra: 'peixe', emoji: '🐟' },
    { palavra: 'avião', emoji: '✈️' },
    { palavra: 'livro', emoji: '📖' },
    { palavra: 'flor', emoji: '🌸' },
    { palavra: 'cachorro', emoji: '🐶' },
    { palavra: 'pássaro', emoji: '🐦' },
    { palavra: ' sapo', emoji: '🐸' },
    { palavra: 'pato', emoji: '🦆' },
    { palavra: 'coelho', emoji: '🐰' }
];

const elementos = {
    emoji: document.getElementById('spelling-emoji'),
    display: document.getElementById('spelling-word'),
    keyboard: document.getElementById('spelling-keyboard'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnHear: document.getElementById('btn-hear'),
    btnCheck: document.getElementById('btn-check'),
    btnClear: document.getElementById('btn-clear')
};

let rodada = 0, pontos = 0, palavraAtual = null, tentativa = '', concluido = false, wrongCount = 0;

const alfabeto = 'aáâãbcçdeéêfghiíjklmnoóôõpqrstuúvwxyz'.split('');

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];
    tentativa = '';
    concluido = false;
    wrongCount = 0;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    if (elementos.emoji) elementos.emoji.textContent = palavraAtual.emoji;
    elementos.display.innerHTML = '';
    atualizarSlots();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    criarTeclado();
    setTimeout(function() { falar('Escreve a palavra: ' + palavraAtual.palavra); }, 500);
}

function atualizarSlots() {
    elementos.display.innerHTML = '';
    for (var i = 0; i < palavraAtual.palavra.length; i++) {
        var slot = document.createElement('div');
        slot.className = 'spelling-slot' + (i < tentativa.length ? ' filled' : '');
        slot.textContent = i < tentativa.length ? tentativa[i] : '';
        elementos.display.appendChild(slot);
    }
}

function criarTeclado() {
    elementos.keyboard.innerHTML = '';
    alfabeto.forEach(function(letra) {
        var btn = document.createElement('button');
        btn.className = 'spelling-key';
        btn.textContent = letra;
        btn.addEventListener('click', function() { digitar(letra); });
        elementos.keyboard.appendChild(btn);
    });
}

function digitar(letra) {
    if (concluido) return;
    if (tentativa.length < palavraAtual.palavra.length) {
        tentativa += letra;
        falar(letra);
        atualizarSlots();
    }
}

function verificar() {
    if (concluido) return;
    if (tentativa === palavraAtual.palavra) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = ' Parabéns! A palavra é ' + palavraAtual.palavra + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Parabéns! A palavra é ' + palavraAtual.palavra);
        setTimeout(iniciarRodada, 2000);
    } else {
        wrongCount++;
        elementos.feedback.textContent = 'Tente outra vez! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra vez');
    }
}

function limpar() {
    tentativa = '';
    atualizarSlots();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.keyboard.innerHTML = '';
    elementos.display.innerHTML = '';
    if (elementos.emoji) elementos.emoji.textContent = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem">Parabéns! Você completou o ditado!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o ditado!');
}

elementos.btnHear.addEventListener('click', function() {
    if (palavraAtual) falar(palavraAtual.palavra);
});

elementos.btnCheck.addEventListener('click', verificar);

elementos.btnClear.addEventListener('click', limpar);

iniciarRodada();
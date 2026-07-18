const palavras = [
    { palavra: 'bola', emoji: '⚽', letra: 'B' },
    { palavra: 'casa', emoji: '🏠', letra: 'C' },
    { palavra: 'gato', emoji: '🐱', letra: 'G' },
    { palavra: 'maçã', emoji: '🍎', letra: 'M' },
    { palavra: 'peixe', emoji: '🐟', letra: 'P' },
    { palavra: 'sol', emoji: '☀️', letra: 'S' },
    { palavra: 'vaca', emoji: '🐄', letra: 'V' },
    { palavra: 'foca', emoji: '🦭', letra: 'F' },
    { palavra: 'dado', emoji: '🎲', letra: 'D' },
    { palavra: 'lua', emoji: '🌙', letra: 'L' },
    { palavra: 'avião', emoji: '✈️', letra: 'A' },
    { palavra: 'helicóptero', emoji: '🚁', letra: 'H' }
];

const elementos = {
    emoji: document.getElementById('word-emoji'),
    nome: document.getElementById('word-name'),
    options: document.getElementById('letters'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos')
};

let rodada = 0, pontos = 0, palavraAtual = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.emoji.textContent = palavraAtual.emoji;
    elementos.nome.textContent = palavraAtual.palavra;
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    var opcoes = embaralhar([palavraAtual.letra].concat(gerarErradas(palavraAtual.letra)));
    elementos.options.innerHTML = '';
    opcoes.forEach(function(letra) {
        var btn = document.createElement('button');
        btn.className = 'letter-button';
        btn.textContent = letra;
        btn.addEventListener('click', function() { verificar(letra); });
        elementos.options.appendChild(btn);
    });

    setTimeout(function() { falar('A palavra ' + palavraAtual.palavra + ' começa com qual letra?'); }, 500);
}

function gerarErradas(correta) {
    var alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(function(l) { return l !== correta; });
    return embaralhar(alfabeto).slice(0, 3);
}

function verificar(letra) {
    if (letra === palavraAtual.letra) {
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = ' Isso! Começa com ' + letra + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Isso! ' + palavraAtual.palavra + ' começa com ' + letra);
        setTimeout(iniciarRodada, 1800);
    } else {
        pontos = Math.max(0, pontos - 2);
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = 'Tente outra letra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra letra');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
    elementos.emoji.textContent = '';
    elementos.nome.textContent = 'Parabéns!';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
}

iniciarRodada();
const palavras = [
    { palavra: 'bola', emoji: '', letra: 'B' },
    { palavra: 'casa', emoji: '', letra: 'C' },
    { palavra: 'gato', emoji: '', letra: 'G' },
    { palavra: 'maçã', emoji: '', letra: 'M' },
    { palavra: 'peixe', emoji: '', letra: 'P' },
    { palavra: 'sol', emoji: '', letra: 'S' },
    { palavra: 'vaca', emoji: '', letra: 'V' },
    { palavra: 'foca', emoji: '', letra: 'F' },
    { palavra: 'dado', emoji: '', letra: 'D' },
    { palavra: 'lua', emoji: '', letra: 'L' }
];

const elementos = {
    word: document.getElementById('letter-word'),
    name: document.getElementById('letter-name'),
    question: document.getElementById('letter-question'),
    letters: document.getElementById('letters'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

function pronunciarLetra(letra) {
    var pronuncias = {
        'A': 'á', 'B': 'bê', 'C': 'cê', 'D': 'dê', 'E': 'é', 'F': 'êfe',
        'G': 'gê', 'H': 'agá', 'I': 'i', 'J': 'jota', 'K': 'cá', 'L': 'êle',
        'M': 'ême', 'N': 'êne', 'O': 'ó', 'P': 'pê', 'Q': 'quê', 'R': 'êrre',
        'S': 'êsse', 'T': 'tê', 'U': 'u', 'V': 'vê', 'W': 'dáblio', 'X': 'xis',
        'Y': 'ípsilon', 'Z': 'zê'
    };
    return pronuncias[letra] || letra.toLowerCase();
}

let round = 0, pontos = 0, atual = null, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    atual = palavras[Math.floor(Math.random() * palavras.length)];
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.word.textContent = atual.emoji;
    elementos.name.textContent = atual.palavra;
    elementos.question.textContent = 'Começa com qual letra?';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var letras = [atual.letra];
    var alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    while (letras.length < 3) {
        var candidato = alfabeto[Math.floor(Math.random() * alfabeto.length)];
        if (!letras.includes(candidato)) letras.push(candidato);
    }
    letras = embaralhar(letras);
    elementos.letters.innerHTML = '';
    letras.forEach(function(letra) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.style.fontSize = '2.5rem';
        btn.textContent = letra;
        btn.dataset.letra = letra;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.letters.appendChild(btn);
    });

    setTimeout(function() { falar(atual.palavra + '. Começa com qual letra?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.letra === atual.letra) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Muito bem! ' + atual.palavra + ' começa com ' + atual.letra + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! ' + atual.palavra + ' começa com ' + pronunciarLetra(atual.letra));
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outra letra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra letra');
        if (wrongCount === 2) {
            elementos.letters.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.letra === atual.letra) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.letters.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; elementos.pontos.textContent = 0; carregarRodada(); });
    elementos.letters.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() {
    if (atual) falar(atual.palavra + '. Começa com qual letra?');
});
carregarRodada();
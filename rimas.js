const rimas = [
    { palavra: 'bola', emoji: '', correta: 'cola', opcoes: ['cola', 'gato', 'mesa'] },
    { palavra: 'gato', emoji: '', correta: 'pato', opcoes: ['pato', 'bola', 'peixe'] },
    { palavra: 'pé', emoji: '', correta: 'você', opcoes: ['você', 'mão', 'boca'] },
    { palavra: 'pão', emoji: '', correta: 'mão', opcoes: ['mão', 'pé', 'olho'] },
    { palavra: 'chá', emoji: '', correta: 'pá', opcoes: ['pá', 'colher', 'prato'] },
    { palavra: 'tia', emoji: '', correta: 'cecília', opcoes: ['cecília', 'mãe', 'bebê'] },
    { palavra: 'sol', emoji: '', correta: 'viol', opcoes: ['viol', 'pente', 'lápis'] },
    { palavra: 'cão', emoji: '', correta: 'mão', opcoes: ['mão', 'pé', 'boca'] }
];

const elementos = {
    target: document.getElementById('rhyme-target'),
    word: document.getElementById('rhyme-word'),
    question: document.getElementById('rhyme-question'),
    rhymes: document.getElementById('rhymes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, atual = null, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    atual = rimas[Math.floor(Math.random() * rimas.length)];
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.target.textContent = atual.emoji;
    elementos.word.textContent = atual.palavra;
    elementos.question.textContent = 'Rima com qual palavra?';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var opcoes = embaralhar(atual.opcoes.slice());
    elementos.rhymes.innerHTML = '';
    opcoes.forEach(function(opcao, indice) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.textContent = opcao;
        btn.dataset.opcao = opcao;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.rhymes.appendChild(btn);
    });

    setTimeout(function() { falar(atual.palavra + '. Rima com qual palavra?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.opcao === atual.correta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Rima perfeita! ' + atual.palavra + ' rima com ' + atual.correta + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! ' + atual.palavra + ' rima com ' + atual.correta);
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outra palavra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra palavra');
        if (wrongCount === 2) {
            elementos.rhymes.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.opcao === atual.correta) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.rhymes.innerHTML = '';
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
    elementos.rhymes.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() {
    if (atual) falar(atual.palavra + '. Rima com qual palavra?');
});
carregarRodada();
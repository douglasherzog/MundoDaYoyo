const pares = [
    { palavra: 'grande', oposto: 'pequeno', emoji: '' },
    { palavra: 'quente', oposto: 'frio', emoji: '' },
    { palavra: 'alto', oposto: 'baixo', emoji: '' },
    { palavra: 'rápido', oposto: 'devagar', emoji: '' },
    { palavra: 'feliz', oposto: 'triste', emoji: '' },
    { palavra: 'cheio', oposto: 'vazio', emoji: '' },
    { palavra: 'limpo', oposto: 'sujo', emoji: '' },
    { palavra: 'dia', oposto: 'noite', emoji: '' },
    { palavra: 'acordado', oposto: 'dormindo', emoji: '' },
    { palavra: 'forte', oposto: 'fraco', emoji: '' },
    { palavra: 'longe', oposto: 'perto', emoji: '' },
    { palavra: 'novo', oposto: 'velho', emoji: '' }
];

const elementos = {
    target: document.getElementById('target-word'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, atual = null, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    atual = pares[Math.floor(Math.random() * pares.length)];
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.target.innerHTML = '<span class="opposite-emoji">' + atual.emoji + '</span><span class="opposite-word">' + atual.palavra + '</span>';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var opcoes = [atual.oposto];
    while (opcoes.length < 4) {
        var oposto = pares[Math.floor(Math.random() * pares.length)].oposto;
        if (!opcoes.includes(oposto)) opcoes.push(oposto);
    }
    opcoes = embaralhar(opcoes);
    elementos.options.innerHTML = '';
    opcoes.forEach(function(oposto) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.textContent = oposto;
        btn.dataset.oposto = oposto;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.options.appendChild(btn);
    });

    setTimeout(function() { falar('Qual é o oposto de ' + atual.palavra + '?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.oposto === atual.oposto) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Muito bem! ' + atual.palavra + ' e ' + atual.oposto + ' são opostos!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! ' + atual.palavra + ' e ' + atual.oposto + ' são opostos');
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
            elementos.options.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.oposto === atual.oposto) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
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
    elementos.options.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() {
    if (atual) falar('Qual é o oposto de ' + atual.palavra + '?');
});
carregarRodada();
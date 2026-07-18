const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const elementos = {
    target: document.getElementById('target-letter'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, letraAtual = '', modoAtual = 'maiuscula', concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    letraAtual = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    modoAtual = Math.random() > 0.5 ? 'maiuscula' : 'minuscula';
    concluido = false;
    wrongCount = 0;

    if (modoAtual === 'maiuscula') {
        elementos.target.innerHTML = '<span class="big-letter">' + letraAtual + '</span><span class="letter-label">Qual é a minúscula?</span>';
    } else {
        elementos.target.innerHTML = '<span class="big-letter">' + letraAtual.toLowerCase() + '</span><span class="letter-label">Qual é a maiúscula?</span>';
    }

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var opcoes = [letraAtual];
    while (opcoes.length < 4) {
        var letra = alfabeto[Math.floor(Math.random() * alfabeto.length)];
        if (!opcoes.includes(letra)) opcoes.push(letra);
    }
    opcoes = embaralhar(opcoes);
    elementos.options.innerHTML = '';
    opcoes.forEach(function(letra) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.style.fontSize = '2.5rem';
        btn.textContent = modoAtual === 'maiuscula' ? letra.toLowerCase() : letra;
        btn.dataset.letra = letra;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    setTimeout(function() {
        falar('A letra ' + letraAtual.toLowerCase() + '. ' + (modoAtual === 'maiuscula' ? 'Qual é a minúscula?' : 'Qual é a maiúscula?'));
    }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.letra === letraAtual) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        var correspondente = modoAtual === 'maiuscula' ? letraAtual.toLowerCase() : letraAtual;
        var tipo = modoAtual === 'maiuscula' ? 'minúscula' : 'maiúscula';
        elementos.feedback.textContent = ' Muito bem! A ' + tipo + ' é ' + correspondente + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! A ' + tipo + ' é ' + correspondente);
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
            elementos.options.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.letra === letraAtual) b.classList.add('hint-pulse');
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
    falar('A letra ' + letraAtual.toLowerCase() + '. ' + (modoAtual === 'maiuscula' ? 'Qual é a minúscula?' : 'Qual é a maiúscula?'));
});
carregarRodada();
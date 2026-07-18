const grupos = [
    { categoria: 'fruta',     itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'animal',    itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'brinquedo', itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'transporte',itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'natureza',  itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'comida',    itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'roupa',     itens: ['','','','','','','',''], intrusos: ['','','',''] },
    { categoria: 'cor',       itens: ['','','','','','','',''], intrusos: ['','','',''] }
];

const elementos = {
    dica: document.getElementById('dica'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, atual = null, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    var grupo = grupos[Math.floor(Math.random() * grupos.length)];
    var tresIguais = embaralhar(grupo.itens).slice(0, 3);
    var intruso = grupo.intrusos[Math.floor(Math.random() * grupo.intrusos.length)];
    atual = { intruso: intruso, corretos: tresIguais };
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.dica.textContent = 'Qual não encaixa?';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var todos = embaralhar(tresIguais.concat([intruso]));
    elementos.opcoes.innerHTML = '';
    todos.forEach(function(emoji) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.style.fontSize = '3rem';
        btn.textContent = emoji;
        btn.dataset.valor = emoji;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.opcoes.appendChild(btn);
    });

    setTimeout(function() { falar('Qual não encaixa com os outros?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === atual.intruso) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Isso! O ' + atual.intruso + ' não encaixa!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! O ' + atual.intruso + ' não encaixa com os outros!');
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Quase! Tenta de novo! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
        if (wrongCount === 2) {
            elementos.opcoes.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.valor === atual.intruso) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.opcoes.innerHTML = '';
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
    elementos.opcoes.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() { falar('Qual não encaixa com os outros?'); });
carregarRodada();
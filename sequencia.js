const tiposSequencia = [
    { nome: 'formas geométricas', itens: ['', '', '', '', '', ''] },
    { nome: 'animais', itens: ['', '', '', '', '', ''] },
    { nome: 'frutas', itens: ['', '', '', '', '', ''] },
    { nome: 'números', itens: ['1', '2', '3', '4', '5', '6'] }
];

const elementos = {
    display: document.getElementById('sequence-display'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, respostaCorreta = '', concluido = false, wrongCount = 0, tipoAtual = null;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    concluido = false;
    wrongCount = 0;

    var tipo = tiposSequencia[Math.floor(Math.random() * tiposSequencia.length)];
    tipoAtual = tipo;
    var padraoTamanho = Math.floor(Math.random() * 2) + 2;
    var padrao = [];
    for (var i = 0; i < padraoTamanho; i++) {
        padrao.push(tipo.itens[Math.floor(Math.random() * tipo.itens.length)]);
    }

    var sequencia = [];
    for (var j = 0; j < 4; j++) {
        sequencia.push(padrao[j % padraoTamanho]);
    }
    respostaCorreta = sequencia[3];
    sequencia[3] = '?';

    elementos.display.innerHTML = '';
    sequencia.forEach(function(item, indice) {
        var span = document.createElement('span');
        span.textContent = item;
        span.className = 'sequence-item' + (item === '?' ? ' missing' : '');
        if (indice === 3) span.id = 'missing-slot';
        elementos.display.appendChild(span);
    });

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var opcoes = [respostaCorreta];
    while (opcoes.length < 4) {
        var item = tipo.itens[Math.floor(Math.random() * tipo.itens.length)];
        if (!opcoes.includes(item)) opcoes.push(item);
    }
    opcoes = embaralhar(opcoes);
    elementos.options.innerHTML = '';
    opcoes.forEach(function(item) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.style.fontSize = '2.5rem';
        btn.textContent = item;
        btn.dataset.item = item;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    setTimeout(function() { falar('Complete a sequência de ' + tipo.nome); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.item === respostaCorreta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        var slot = document.getElementById('missing-slot');
        if (slot) { slot.textContent = respostaCorreta; slot.classList.remove('missing'); slot.classList.add('filled'); }
        elementos.feedback.textContent = ' Muito bem! Você completou a sequência!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! Você completou a sequência');
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outro item! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outro item');
        if (wrongCount === 2) {
            elementos.options.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.item === respostaCorreta) b.classList.add('hint-pulse');
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
    if (tipoAtual) falar('Complete a sequência de ' + tipoAtual.nome);
});
carregarRodada();
const emojis = ['','','','','','','','','','','','','','','','','','','',''];

const elementos = {
    par: document.getElementById('par-imagens'),
    pergunta: document.getElementById('pergunta'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, atual = null, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    var saoIguais = Math.random() > 0.5;
    var emoji1, emoji2;
    if (saoIguais) {
        emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
        emoji2 = emoji1;
    } else {
        var par = embaralhar(emojis).slice(0, 2);
        emoji1 = par[0]; emoji2 = par[1];
    }
    atual = { emoji1: emoji1, emoji2: emoji2, resposta: saoIguais ? 'igual' : 'diferente' };
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.par.innerHTML = '<span>' + emoji1 + '</span><span style="font-size:1.5rem"></span><span>' + emoji2 + '</span>';
    elementos.pergunta.textContent = 'São iguais ou diferentes?';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    elementos.opcoes.innerHTML = '';
    var opcoes = [
        { texto: ' Iguais', valor: 'igual' },
        { texto: ' Diferentes', valor: 'diferente' }
    ];
    opcoes.forEach(function(op) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.innerHTML = op.texto;
        btn.dataset.valor = op.valor;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.opcoes.appendChild(btn);
    });

    setTimeout(function() { falar('Olhe os desenhos. São iguais ou diferentes?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === atual.resposta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        var txt = atual.resposta === 'igual' ? 'iguais' : 'diferentes';
        elementos.feedback.textContent = ' Isso mesmo! São ' + txt + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! São ' + txt + '!');
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
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.opcoes.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    elementos.par.innerHTML = '';
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

elementos.btnSpeak.addEventListener('click', function() { falar('Olhe os desenhos. São iguais ou diferentes?'); });
carregarRodada();
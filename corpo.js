const partesCorpo = [
    { nome: 'cabeça', emoji: '', dica: 'cabeça' },
    { nome: 'peito', emoji: '', dica: 'peito' },
    { nome: 'braço', emoji: '', dica: 'braço' },
    { nome: 'perna', emoji: '', dica: 'perna' }
];

const elementos = {
    target: document.getElementById('target-body-part'),
    feedback: document.getElementById('feedback'),
    starsCount: document.getElementById('stars-count'),
    bodyParts: document.querySelectorAll('.body-figure [data-part]')
};

let round = 0, pontos = 0, parteAtual = null, concluido = false, wrongCount = 0;

function atualizarEstrelas() {
    if (typeof carregarEstrelas === 'function' && elementos.starsCount) {
        elementos.starsCount.textContent = carregarEstrelas();
    }
}

function limparDestaques() {
    elementos.bodyParts.forEach(function(part) { part.classList.remove('selected', 'correct-part', 'wrong-part'); });
}

function gerarDesafio() {
    if (round >= 10) { vitoria(); return; }
    round++;
    concluido = false;
    wrongCount = 0;
    limparDestaques();
    parteAtual = partesCorpo[Math.floor(Math.random() * partesCorpo.length)];

    elementos.target.innerHTML = '<span class="body-emoji">' + parteAtual.emoji + '</span><span class="body-part-name">' + parteAtual.nome + '</span>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    setTimeout(function() { falar('Clique na ' + parteAtual.dica); }, 300);
}

function verificarParte(botao) {
    if (concluido) return;
    var parteEscolhida = botao.dataset.part;

    if (parteEscolhida === parteAtual.nome) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        botao.classList.add('correct-part');
        elementos.feedback.textContent = ' Muito bem! Você achou a ' + parteAtual.nome + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! Você achou a ' + parteAtual.nome);
        if (typeof adicionarEstrelas === 'function') adicionarEstrelas(1);
        atualizarEstrelas();
        setTimeout(gerarDesafio, 1800);
    } else {
        wrongCount++;
        botao.classList.add('wrong-part');
        setTimeout(function() { botao.classList.remove('wrong-part'); }, 500);
        elementos.feedback.textContent = 'Tente outra parte! ';
        elementos.feedback.className = 'feedback error';
        falar('Tente outra parte do corpo');
        playError();
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
}

elementos.bodyParts.forEach(function(part) {
    part.addEventListener('click', function() { verificarParte(part); });
});

atualizarEstrelas();
gerarDesafio();
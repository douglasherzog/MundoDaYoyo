const formas = [
    { nome: 'círculo', emoji: '⭕', cor: '#4D96FF' },
    { nome: 'quadrado', emoji: '🟦', cor: '#FF6B6B' },
    { nome: 'triângulo', emoji: '🔺', cor: '#FFD93D' },
    { nome: 'estrela', emoji: '⭐', cor: '#FF9F45' },
    { nome: 'coração', emoji: '❤️', cor: '#FF85A2' }
];

const elementos = {
    display: document.getElementById('shape-display'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback')
};

let rodada = 0, pontos = 0, formaAtual = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    formaAtual = formas[Math.floor(Math.random() * formas.length)];

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.display.innerHTML = '<div style="font-size:4rem">' + formaAtual.emoji + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    falar('Qual é a forma?');

    var opcoes = embaralhar([formaAtual].concat(formas.filter(f => f.nome !== formaAtual.nome).slice(0, 3)));
    elementos.options.innerHTML = '';
    opcoes.forEach(function(op) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.innerHTML = '<span style="font-size:1.4em">' + op.emoji + '</span> ' + op.nome;
        btn.addEventListener('click', function() { verificar(op); });
        elementos.options.appendChild(btn);
    });
}

function verificar(opcao) {
    if (opcao.nome === formaAtual.nome) {
        pontos += 10;
        elementos.feedback.textContent = ' Isso! É ' + formaAtual.nome + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Isso! É ' + formaAtual.nome);
        setTimeout(iniciarRodada, 1800);
    } else {
        pontos = Math.max(0, pontos - 2);
        elementos.feedback.textContent = 'Tente outra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
    elementos.display.innerHTML = '<div style="font-size:4rem"> Parabéns! Você completou!</div>';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
}

iniciarRodada();
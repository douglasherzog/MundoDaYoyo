const emocoes = [
    { nome: 'feliz', emoji: '😊', dica: 'Está sorrindo bastante' },
    { nome: 'triste', emoji: '😢', dica: 'Está chorando' },
    { nome: 'com raiva', emoji: '😠', dica: 'Está brava e com a testa franzida' },
    { nome: 'com medo', emoji: '😨', dica: 'Está assustada' },
    { nome: 'surpresa', emoji: '😲', dica: 'Ficou de boca aberta de surpresa' },
    { nome: 'sonolenta', emoji: '😴', dica: 'Está com sono e quer dormir' },
    { nome: 'apaixonada', emoji: '😍', dica: 'Está com coraçõezinhos nos olhos' },
    { nome: 'envergonhada', emoji: '😳', dica: 'Está com vergonha e corada' },
    { nome: 'doente', emoji: '🤒', dica: 'Está com febre e um termômetro' },
    { nome: 'animada', emoji: '🤩', dica: 'Tem estrelinha nos olhos de tão animada' }
];

const elementos = {
    display: document.getElementById('emotion-display'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback')
};

let rodada = 0, pontos = 0, emocaoAtual = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    emocaoAtual = emocoes[Math.floor(Math.random() * emocoes.length)];

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.display.innerHTML = '<div style="font-size:4rem">' + emocaoAtual.emoji + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    falar(emocaoAtual.dica);

    var opcoes = embaralhar([emocaoAtual].concat(emocoes.filter(e => e.nome !== emocaoAtual.nome).slice(0, 3)));
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
    if (opcao.nome === emocaoAtual.nome) {
        pontos += 10;
        elementos.feedback.textContent = ' Isso! Está ' + emocaoAtual.nome + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Isso! Está ' + emocaoAtual.nome);
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
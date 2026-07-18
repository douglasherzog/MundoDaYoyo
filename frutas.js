const itens = [
    { nome: 'maçã', emoji: '🍎', dica: 'É vermelha e crocante' },
    { nome: 'banana', emoji: '🍌', dica: 'É amarela e curva' },
    { nome: 'uva', emoji: '🍇', dica: 'São bolinhas roxas' },
    { nome: 'morango', emoji: '🍓', dica: 'É vermelha e tem pontinhos' },
    { nome: 'laranja', emoji: '🍊', dica: 'É redonda e laranja' },
    { nome: 'melancia', emoji: '🍉', dica: 'É verde por fora e vermelha por dentro' },
    { nome: 'abacaxi', emoji: '🍍', dica: 'Tem espinhos e é amarelo por dentro' },
    { nome: 'pera', emoji: '🍐', dica: 'É verde e doce' },
    { nome: 'cereja', emoji: '🍒', dica: 'São duas bolinhas vermelhas' },
    { nome: 'limão', emoji: '🍋', dica: 'É amarelo e azedo' },
    { nome: 'cenoura', emoji: '🥕', dica: 'É laranja e os coelhos adoram' },
    { nome: 'brócolis', emoji: '🥦', dica: 'É verde e parece uma arvorezinha' },
    { nome: 'milho', emoji: '🌽', dica: 'É amarelo e tem grãozinhos' },
    { nome: 'tomate', emoji: '🍅', dica: 'É redondo e vermelho' },
    { nome: 'batata', emoji: '🥔', dica: 'É marrom e virou batata frita' }
];

const elementos = {
    display: document.getElementById('item-display'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback')
};

let rodada = 0, pontos = 0, itemAtual = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    itemAtual = itens[Math.floor(Math.random() * itens.length)];

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.display.innerHTML = '<div style="font-size:4rem">' + itemAtual.emoji + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    falar(itemAtual.dica);

    var opcoes = embaralhar([itemAtual].concat(itens.filter(i => i.nome !== itemAtual.nome).slice(0, 3)));
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
    if (opcao.nome === itemAtual.nome) {
        pontos += 10;
        elementos.feedback.textContent = ' Parabéns! É ' + itemAtual.nome + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Parabéns! É ' + itemAtual.nome);
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
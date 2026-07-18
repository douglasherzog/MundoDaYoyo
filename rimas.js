const rimas = [
    { palavra: 'bola', emoji: '⚽', correta: 'cola', opcoes: ['cola', 'gato', 'mesa'] },
    { palavra: 'gato', emoji: '🐱', correta: 'pato', opcoes: ['pato', 'bola', 'peixe'] },
    { palavra: 'pé', emoji: '🦶', correta: 'você', opcoes: ['você', 'mão', 'boca'] },
    { palavra: 'pão', emoji: '🍞', correta: 'mão', opcoes: ['mão', 'pé', 'olho'] },
    { palavra: 'chá', emoji: '🍵', correta: 'pá', opcoes: ['pá', 'colher', 'prato'] },
    { palavra: 'tia', emoji: '👩', correta: 'cecília', opcoes: ['cecília', 'mãe', 'bebê'] },
    { palavra: 'sol', emoji: '☀️', correta: 'viol', opcoes: ['viol', 'pente', 'lápis'] },
    { palavra: 'cão', emoji: '🐶', correta: 'mão', opcoes: ['mão', 'pé', 'boca'] }
];

const elementos = {
    display: document.getElementById('rhyme-target'),
    options: document.getElementById('rhymes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos')
};

let rodada = 0, pontos = 0, rimaAtual = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    rimaAtual = rimas[Math.floor(Math.random() * rimas.length)];

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.display.innerHTML = '<div style="font-size:4rem">' + rimaAtual.emoji + '</div><div class="rhyme-word">' + rimaAtual.palavra + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    var opcoes = embaralhar(rimaAtual.opcoes.slice());
    elementos.options.innerHTML = '';
    opcoes.forEach(function(op) {
        var btn = document.createElement('button');
        btn.className = 'rhyme-button';
        btn.textContent = op;
        btn.addEventListener('click', function() { verificar(op); });
        elementos.options.appendChild(btn);
    });

    setTimeout(function() { falar('Qual palavra rima com ' + rimaAtual.palavra + '?'); }, 500);
}

function verificar(opcao) {
    if (opcao === rimaAtual.correta) {
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = ' Isso! ' + rimaAtual.palavra + ' rima com ' + opcao + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Isso! ' + rimaAtual.palavra + ' rima com ' + opcao);
        setTimeout(iniciarRodada, 1800);
    } else {
        pontos = Math.max(0, pontos - 2);
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = 'Tente outra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
    elementos.display.innerHTML = '<div style="font-size:4rem"> Parabéns!</div>';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
}

iniciarRodada();
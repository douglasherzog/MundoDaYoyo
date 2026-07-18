const emojis = ['🍎','🍌','🐶','🐱','🚗','🚌','🌳','🌻','⭐','🌙','🍦','🍪','🎈','🎁','🐟','🐦','🍇','🍉','🚲','⛵'];

const elementos = {
    par: document.getElementById('par-imagens'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos')
};

let rodada = 0, pontos = 0, respostaCorreta = null;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    var iguais = Math.random() > 0.5;
    var emojisEscolhidos = embaralhar(emojis.slice()).slice(0, 2);
    var emoji1 = emojisEscolhidos[0];
    var emoji2 = iguais ? emoji1 : emojisEscolhidos[1];
    respostaCorreta = iguais ? 'igual' : 'diferente';

    elementos.par.innerHTML = '<div style="font-size:4rem;">' + emoji1 + '</div><div style="font-size:4rem;">' + emoji2 + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    elementos.options.innerHTML = '';
    var btnIgual = document.createElement('button');
    btnIgual.className = 'game-option';
    btnIgual.innerHTML = ' Iguais';
    btnIgual.addEventListener('click', function() { verificar('igual'); });
    elementos.options.appendChild(btnIgual);

    var btnDiferente = document.createElement('button');
    btnDiferente.className = 'game-option';
    btnDiferente.innerHTML = ' Diferentes';
    btnDiferente.addEventListener('click', function() { verificar('diferente'); });
    elementos.options.appendChild(btnDiferente);

    falar('Essas figuras são iguais ou diferentes?');
}

function verificar(resposta) {
    if (resposta === respostaCorreta) {
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = ' Isso! São ' + respostaCorreta + 's!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Isso! São ' + respostaCorreta + 's');
        setTimeout(iniciarRodada, 1800);
    } else {
        pontos = Math.max(0, pontos - 2);
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = 'Tente outra vez! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra vez');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
    elementos.par.innerHTML = '<div style="font-size:4rem"> Parabéns!</div>';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
}

iniciarRodada();
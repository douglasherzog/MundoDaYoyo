const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const elementos = {
    pool: document.getElementById('letters-pool'),
    slots: document.getElementById('answer-slots'),
    feedback: document.getElementById('feedback'),
    btnClear: document.getElementById('btn-clear'),
    btnCheck: document.getElementById('btn-check')
};

let round = 0, pontos = 0, letrasDesafio = [], letrasSelecionadas = [], concluido = false, wrongCount = 0;

function gerarDesafio() {
    if (round >= 10) { vitoria(); return; }
    round++;
    concluido = false;
    letrasSelecionadas = [];
    wrongCount = 0;

    var inicio = Math.floor(Math.random() * (alfabeto.length - 4));
    letrasDesafio = alfabeto.slice(inicio, inicio + 4);

    elementos.pool.innerHTML = '';
    embaralhar(letrasDesafio.slice()).forEach(function(letra) {
        var btn = document.createElement('button');
        btn.textContent = letra;
        btn.className = 'order-letter game-option';
        btn.style.fontSize = '2.5rem';
        btn.dataset.letra = letra;
        btn.addEventListener('click', function() { selecionarLetra(btn); });
        elementos.pool.appendChild(btn);
    });

    elementos.slots.innerHTML = '';
    letrasDesafio.forEach(function() {
        var slot = document.createElement('div');
        slot.className = 'order-slot';
        elementos.slots.appendChild(slot);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnCheck.disabled = false;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    setTimeout(function() { falar('Coloque as letras em ordem alfabética'); }, 300);
}

function selecionarLetra(botao) {
    if (concluido) return;
    if (botao.classList.contains('used')) return;
    if (letrasSelecionadas.length >= letrasDesafio.length) return;

    var letra = botao.dataset.letra;
    letrasSelecionadas.push(letra);
    botao.classList.add('used');
    botao.style.opacity = '0.3';

    var slots = elementos.slots.querySelectorAll('.order-slot');
    slots[letrasSelecionadas.length - 1].textContent = letra;
    slots[letrasSelecionadas.length - 1].classList.add('filled');

    falar(letra);
}

function verificar() {
    if (concluido) return;
    if (letrasSelecionadas.length < letrasDesafio.length) {
        elementos.feedback.textContent = 'Complete todas as letras! ';
        elementos.feedback.className = 'feedback error';
        falar('Complete todas as letras');
        return;
    }

    var ordemCorreta = letrasDesafio.join('');
    var ordemEscolhida = letrasSelecionadas.join('');

    if (ordemEscolhida === ordemCorreta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.feedback.textContent = ' Muito bem! ' + ordemCorreta + '!';
        elementos.feedback.className = 'feedback success';
        elementos.btnCheck.disabled = true;
        falar('Muito bem! ' + ordemCorreta);
        playSuccess();
        setTimeout(gerarDesafio, 2000);
    } else {
        wrongCount++;
        elementos.feedback.textContent = 'Ordem incorreta! Tente de novo! ';
        elementos.feedback.className = 'feedback error';
        falar('Ordem incorreta. Tente de novo');
        playError();
    }
}

function limpar() {
    if (concluido) return;
    letrasSelecionadas = [];
    var botoes = elementos.pool.querySelectorAll('.order-letter');
    botoes.forEach(function(btn) { btn.classList.remove('used'); btn.style.opacity = '1'; });
    var slots = elementos.slots.querySelectorAll('.order-slot');
    slots.forEach(function(slot) { slot.textContent = ''; slot.classList.remove('filled'); });
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.pool.innerHTML = '';
    elementos.slots.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; gerarDesafio(); });
    elementos.pool.appendChild(btn);
}

elementos.btnCheck.addEventListener('click', verificar);
elementos.btnClear.addEventListener('click', limpar);
gerarDesafio();
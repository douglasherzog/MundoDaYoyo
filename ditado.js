const palavras = [
    { palavra: 'gato', emoji: '' },
    { palavra: 'bola', emoji: '' },
    { palavra: 'casa', emoji: '' },
    { palavra: 'sol', emoji: '' },
    { palavra: 'lua', emoji: '' },
    { palavra: 'maçã', emoji: '' },
    { palavra: 'peixe', emoji: '' },
    { palavra: 'avião', emoji: '' },
    { palavra: 'livro', emoji: '' },
    { palavra: 'sapo', emoji: '' },
    { palavra: 'uva', emoji: '' },
    { palavra: 'pato', emoji: '' }
];

const elementos = {
    emoji: document.getElementById('spelling-emoji'),
    btnHear: document.getElementById('btn-hear'),
    word: document.getElementById('spelling-word'),
    keyboard: document.getElementById('keyboard-area'),
    feedback: document.getElementById('feedback'),
    btnClear: document.getElementById('btn-clear'),
    btnCheck: document.getElementById('btn-check')
};

let round = 0, pontos = 0, palavraAtual = null, respostaAtual = '', concluido = false, wrongCount = 0;

function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function gerarDesafio() {
    if (round >= 10) { vitoria(); return; }
    round++;
    concluido = false;
    respostaAtual = '';
    wrongCount = 0;
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];

    elementos.emoji.textContent = palavraAtual.emoji;
    elementos.word.innerHTML = '';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnCheck.disabled = false;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var letrasUnicas = [...new Set(normalizar(palavraAtual.palavra).split(''))];
    var letrasExtras = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(function(l) { return !letrasUnicas.includes(l); });
    var extras = embaralhar(letrasExtras).slice(0, Math.max(6 - letrasUnicas.length, 0));
    var teclas = embaralhar([...letrasUnicas, ...extras]);

    elementos.keyboard.innerHTML = '';
    teclas.forEach(function(letra) {
        var btn = document.createElement('button');
        btn.textContent = letra.toUpperCase();
        btn.className = 'spelling-key game-option';
        btn.dataset.letra = letra;
        btn.addEventListener('click', function() { adicionarLetra(letra); });
        elementos.keyboard.appendChild(btn);
    });

    atualizarWordDisplay();
    setTimeout(function() { falar('Digite a palavra: ' + palavraAtual.palavra); }, 300);
}

function adicionarLetra(letra) {
    if (concluido) return;
    if (respostaAtual.length >= palavraAtual.palavra.length) return;
    respostaAtual += letra;
    atualizarWordDisplay();
    falar(letra);
}

function atualizarWordDisplay() {
    elementos.word.innerHTML = '';
    for (var i = 0; i < palavraAtual.palavra.length; i++) {
        var slot = document.createElement('span');
        slot.className = 'spelling-slot';
        slot.textContent = respostaAtual[i] ? respostaAtual[i].toUpperCase() : '';
        if (respostaAtual[i]) slot.classList.add('filled');
        elementos.word.appendChild(slot);
    }
}

function limpar() {
    if (concluido) return;
    respostaAtual = '';
    atualizarWordDisplay();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function verificar() {
    if (concluido) return;
    if (respostaAtual.length < palavraAtual.palavra.length) {
        elementos.feedback.textContent = 'Complete a palavra! ';
        elementos.feedback.className = 'feedback error';
        falar('Complete a palavra');
        return;
    }

    if (normalizar(respostaAtual) === normalizar(palavraAtual.palavra)) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.feedback.textContent = ' Muito bem! ' + palavraAtual.palavra + '!';
        elementos.feedback.className = 'feedback success';
        elementos.btnCheck.disabled = true;
        falar('Muito bem! ' + palavraAtual.palavra);
        playSuccess();
        setTimeout(gerarDesafio, 2000);
    } else {
        wrongCount++;
        elementos.feedback.textContent = 'Quase lá! Tente de novo! ';
        elementos.feedback.className = 'feedback error';
        falar('Quase lá. Tente de novo');
        playError();
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.keyboard.innerHTML = '';
    elementos.word.innerHTML = '';
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
    elementos.keyboard.appendChild(btn);
}

elementos.btnHear.addEventListener('click', function() {
    if (palavraAtual) falar('Digite a palavra: ' + palavraAtual.palavra);
});
elementos.btnClear.addEventListener('click', limpar);
elementos.btnCheck.addEventListener('click', verificar);
gerarDesafio();
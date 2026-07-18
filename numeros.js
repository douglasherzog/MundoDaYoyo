const objetosDisponiveis = ['', '', '', '', '', '', '', ''];

const elementos = {
    objects: document.getElementById('objects'),
    numbers: document.getElementById('numbers'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

function numeroPorExtenso(numero) {
    var nomes = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    return nomes[numero] || numero.toString();
}

let round = 0, pontos = 0, numeroAtual = 0, concluido = false, wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    numeroAtual = Math.floor(Math.random() * 9) + 1;
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var objeto = objetosDisponiveis[Math.floor(Math.random() * objetosDisponiveis.length)];
    elementos.objects.innerHTML = '';
    for (var i = 0; i < numeroAtual; i++) {
        var span = document.createElement('span');
        span.textContent = objeto;
        span.className = 'object-item';
        span.style.animationDelay = (i * 0.1) + 's';
        elementos.objects.appendChild(span);
    }

    var opcoes = [numeroAtual];
    while (opcoes.length < 4) {
        var candidato = Math.floor(Math.random() * 9) + 1;
        if (!opcoes.includes(candidato)) opcoes.push(candidato);
    }
    opcoes = embaralhar(opcoes);
    elementos.numbers.innerHTML = '';
    opcoes.forEach(function(numero, indice) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.style.fontSize = '2.5rem';
        btn.textContent = numero;
        btn.dataset.numero = numero;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.numbers.appendChild(btn);
    });

    setTimeout(function() { falar('Quantos objetos você vê?'); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    var numeroEscolhido = parseInt(btn.dataset.numero);
    if (numeroEscolhido === numeroAtual) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Muito bem! São ' + numeroPorExtenso(numeroAtual) + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! São ' + numeroPorExtenso(numeroAtual));
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outro número! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outro número');
        if (wrongCount === 2) {
            elementos.numbers.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (parseInt(b.dataset.numero) === numeroAtual) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.numbers.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    elementos.objects.innerHTML = '';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; elementos.pontos.textContent = 0; carregarRodada(); });
    elementos.numbers.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() { falar('Quantos objetos você vê?'); });
carregarRodada();
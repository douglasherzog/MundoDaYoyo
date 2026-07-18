const elementos = {
    hourHand: document.getElementById('hour-hand'),
    minuteHand: document.getElementById('minute-hand'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback')
};

let round = 0, pontos = 0, horaAtual = 0, minutoAtual = 0, concluido = false, wrongCount = 0;

function formatarHora(hora, minuto) {
    var horaStr = hora.toString().padStart(2, '0');
    var minStr = minuto.toString().padStart(2, '0');
    return horaStr + ':' + minStr;
}

function falarHora(hora, minuto) {
    if (minuto === 0) return hora + ' horas';
    if (minuto === 15) return hora + ' e quinze';
    if (minuto === 30) return hora + ' e meia';
    if (minuto === 45) return (hora === 1 ? 'uma' : hora) + ' menos quinze';
    return hora + ' horas e ' + minuto + ' minutos';
}

function gerarDesafio() {
    if (round >= 10) { vitoria(); return; }
    round++;
    concluido = false;
    wrongCount = 0;
    horaAtual = Math.floor(Math.random() * 12) + 1;
    var minutosPossiveis = [0, 15, 30, 45];
    minutoAtual = minutosPossiveis[Math.floor(Math.random() * minutosPossiveis.length)];

    var horaAngle = (horaAtual % 12) * 30 + (minutoAtual / 2);
    var minutoAngle = minutoAtual * 6;
    elementos.hourHand.style.transform = 'translateX(-50%) rotate(' + horaAngle + 'deg)';
    elementos.minuteHand.style.transform = 'translateX(-50%) rotate(' + minutoAngle + 'deg)';

    var respostaCorreta = formatarHora(horaAtual, minutoAtual);
    var opcoes = [respostaCorreta];
    while (opcoes.length < 4) {
        var h = Math.floor(Math.random() * 12) + 1;
        var m = minutosPossiveis[Math.floor(Math.random() * minutosPossiveis.length)];
        var opcao = formatarHora(h, m);
        if (!opcoes.includes(opcao)) opcoes.push(opcao);
    }

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    opcoes = embaralhar(opcoes);
    elementos.options.innerHTML = '';
    opcoes.forEach(function(opcao) {
        var btn = document.createElement('button');
        btn.textContent = opcao;
        btn.className = 'game-option clock-option';
        btn.style.fontSize = '2rem';
        btn.dataset.hora = opcao;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    setTimeout(function() { falar('Que horas são? ' + falarHora(horaAtual, minutoAtual)); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    var respostaCorreta = formatarHora(horaAtual, minutoAtual);
    if (btn.dataset.hora === respostaCorreta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        btn.classList.add('correct');
        elementos.feedback.textContent = ' Muito bem! São ' + falarHora(horaAtual, minutoAtual) + '!';
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! São ' + falarHora(horaAtual, minutoAtual));
        setTimeout(gerarDesafio, 2000);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outro horário! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outro horário');
        if (wrongCount === 2) {
            elementos.options.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.hora === respostaCorreta) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.options.innerHTML = '';
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
    elementos.options.appendChild(btn);
}

gerarDesafio();
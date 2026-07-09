let horaAtual = 0;
let minutoAtual = 0;
let concluido = false;
let pontos = 0;

const elementos = {
    hourHand: document.getElementById('hour-hand'),
    minuteHand: document.getElementById('minute-hand'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count')
};

function atualizarEstrelas() {
    const estrelas = carregarEstrelas();
    elementos.starsCount.textContent = estrelas;
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

function embaralhar(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

function formatarHora(hora, minuto) {
    const horaStr = hora.toString().padStart(2, '0');
    const minStr = minuto.toString().padStart(2, '0');
    return `${horaStr}:${minStr}`;
}

function falarHora(hora, minuto) {
    if (minuto === 0) {
        return `${hora} horas`;
    } else if (minuto === 15) {
        return `${hora} e quinze`;
    } else if (minuto === 30) {
        return `${hora} e meia`;
    } else if (minuto === 45) {
        return `${hora === 1 ? 'uma' : hora} menos quinze`;
    }
    return `${hora} horas e ${minuto} minutos`;
}

function gerarDesafio() {
    concluido = false;
    horaAtual = Math.floor(Math.random() * 12) + 1;
    const minutosPossiveis = [0, 15, 30, 45];
    minutoAtual = minutosPossiveis[Math.floor(Math.random() * minutosPossiveis.length)];

    const horaAngle = (horaAtual % 12) * 30 + (minutoAtual / 2);
    const minutoAngle = minutoAtual * 6;

    elementos.hourHand.style.transform = `translateX(-50%) rotate(${horaAngle}deg)`;
    elementos.minuteHand.style.transform = `translateX(-50%) rotate(${minutoAngle}deg)`;

    const respostaCorreta = formatarHora(horaAtual, minutoAtual);
    const opcoes = [respostaCorreta];

    while (opcoes.length < 4) {
        let h = Math.floor(Math.random() * 12) + 1;
        let m = minutosPossiveis[Math.floor(Math.random() * minutosPossiveis.length)];
        const opcao = formatarHora(h, m);
        if (!opcoes.includes(opcao)) {
            opcoes.push(opcao);
        }
    }

    elementos.options.innerHTML = '';
    embaralhar(opcoes).forEach(opcao => {
        const btn = document.createElement('button');
        btn.textContent = opcao;
        btn.className = 'clock-option';
        btn.dataset.hora = opcao;
        btn.addEventListener('click', () => selecionarHora(btn));
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    falar(`Que horas são? ${falarHora(horaAtual, minutoAtual)}`);
}

function selecionarHora(botao) {
    if (concluido) return;

    const horaEscolhida = botao.dataset.hora;
    const respostaCorreta = formatarHora(horaAtual, minutoAtual);

    if (horaEscolhida === respostaCorreta) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct');
        elementos.feedback.textContent = `🎉 Muito bem! São ${falarHora(horaAtual, minutoAtual)}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar(`Muito bem! São ${falarHora(horaAtual, minutoAtual)}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong');
        setTimeout(() => botao.classList.remove('wrong'), 500);
        elementos.feedback.textContent = 'Tente outro horário! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outro horário');
        playError();
    }
}

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

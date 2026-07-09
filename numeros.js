const objetosDisponiveis = ['🍎', '⭐', '🐱', '🌸', '🚗', '🎈', '🐶', '🍪'];

let numeroAtual = 0;
let pontos = 0;
let concluido = false;

const elementos = {
    objects: document.getElementById('objects'),
    numbers: document.getElementById('numbers'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

function embaralhar(array) {
    const novo = [...array];
    for (let i = novo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novo[i], novo[j]] = [novo[j], novo[i]];
    }
    return novo;
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

function numeroPorExtenso(numero) {
    const numeros = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    return numeros[numero] || numero.toString();
}

function carregarRodada() {
    numeroAtual = Math.floor(Math.random() * 9) + 1;
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    const objeto = objetosDisponiveis[Math.floor(Math.random() * objetosDisponiveis.length)];
    elementos.objects.innerHTML = '';
    for (let i = 0; i < numeroAtual; i++) {
        const span = document.createElement('span');
        span.textContent = objeto;
        span.className = 'object-item';
        elementos.objects.appendChild(span);
    }

    const opcoes = [];
    opcoes.push(numeroAtual);
    while (opcoes.length < 4) {
        const candidato = Math.floor(Math.random() * 9) + 1;
        if (!opcoes.includes(candidato)) {
            opcoes.push(candidato);
        }
    }

    const opcoesEmbaralhadas = embaralhar(opcoes);
    elementos.numbers.innerHTML = '';
    opcoesEmbaralhadas.forEach((numero, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable color-${(indice % 6) + 1}`;
        botao.textContent = numero;
        botao.dataset.numero = numero;
        botao.addEventListener('click', () => selecionarNumero(botao));
        elementos.numbers.appendChild(botao);
    });
}

function selecionarNumero(botao) {
    if (concluido) return;

    const numeroEscolhido = parseInt(botao.dataset.numero);

    if (numeroEscolhido === numeroAtual) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Muito bem! São ${numeroAtual} ${numeroAtual === 1 ? 'objeto' : 'objetos'}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! São ${numeroPorExtenso(numeroAtual)}`);
    } else {
        botao.classList.add('celebration');
        setTimeout(() => botao.classList.remove('celebration'), 500);
        elementos.feedback.textContent = 'Tente outro número! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outro número');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    falar(`Quantos objetos? ${numeroPorExtenso(numeroAtual)}`);
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();

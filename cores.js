const cores = [
    { nome: 'vermelho', hex: '#FF6B6B', emoji: '❤️' },
    { nome: 'azul', hex: '#4D96FF', emoji: '💙' },
    { nome: 'amarelo', hex: '#FFD93D', emoji: '💛' },
    { nome: 'verde', hex: '#6BCB77', emoji: '💚' },
    { nome: 'laranja', hex: '#FF9F45', emoji: '🧡' },
    { nome: 'roxo', hex: '#9B59B6', emoji: '💜' },
    { nome: 'rosa', hex: '#FF85A2', emoji: '🩷' }
];

const formas = ['●', '■', '★', '▲', '♥'];

let corAtual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    shape: document.getElementById('color-shape'),
    question: document.getElementById('color-question'),
    colors: document.getElementById('colors'),
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

function escolherCor() {
    return cores[Math.floor(Math.random() * cores.length)];
}

function carregarRodada() {
    corAtual = escolherCor();
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    const forma = formas[Math.floor(Math.random() * formas.length)];
    elementos.shape.textContent = forma;
    elementos.shape.style.color = corAtual.hex;
    elementos.shape.classList.remove('celebration');

    elementos.question.textContent = `Qual é a cor? ${corAtual.emoji}`;

    const opcoes = [corAtual];
    while (opcoes.length < 3) {
        const candidato = escolherCor();
        if (!opcoes.includes(candidato)) {
            opcoes.push(candidato);
        }
    }

    const opcoesEmbaralhadas = embaralhar(opcoes);
    elementos.colors.innerHTML = '';
    opcoesEmbaralhadas.forEach((cor, indice) => {
        const botao = document.createElement('button');
        botao.className = 'color-button';
        botao.style.backgroundColor = cor.hex;
        botao.textContent = cor.nome;
        botao.dataset.cor = cor.nome;
        botao.addEventListener('click', () => selecionarCor(botao));
        elementos.colors.appendChild(botao);
    });

    falar(`Qual é a cor?`);
}

function selecionarCor(botao) {
    if (concluido) return;

    const corEscolhida = botao.dataset.cor;

    if (corEscolhida === corAtual.nome) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Muito bem! É ${corAtual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.shape.classList.add('celebration');
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! A cor é ${corAtual.nome}`);
    } else {
        botao.classList.add('shake');
        setTimeout(() => botao.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente outra cor! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra cor');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    falar(`Qual é a cor?`);
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();

const formas = [
    { nome: 'círculo', emoji: '🔵', cor: '#4D96FF' },
    { nome: 'quadrado', emoji: '🟦', cor: '#FF6B6B' },
    { nome: 'triângulo', emoji: '🔺', cor: '#FFD93D' },
    { nome: 'estrela', emoji: '⭐', cor: '#FF9F45' },
    { nome: 'coração', emoji: '❤️', cor: '#FF85A2' }
];

let formaAtual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    display: document.getElementById('shape-display'),
    question: document.getElementById('shape-question'),
    shapes: document.getElementById('shapes'),
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

function escolherForma() {
    return formas[Math.floor(Math.random() * formas.length)];
}

function carregarRodada() {
    formaAtual = escolherForma();
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    elementos.display.textContent = formaAtual.emoji;
    elementos.display.style.color = formaAtual.cor;
    elementos.display.classList.remove('celebration');

    elementos.question.textContent = 'Qual é a forma?';

    const opcoes = [formaAtual];
    while (opcoes.length < 3) {
        const candidato = escolherForma();
        if (!opcoes.includes(candidato)) {
            opcoes.push(candidato);
        }
    }

    const opcoesEmbaralhadas = embaralhar(opcoes);
    elementos.shapes.innerHTML = '';
    opcoesEmbaralhadas.forEach((forma, indice) => {
        const botao = document.createElement('button');
        botao.className = 'shape-button';
        botao.style.backgroundColor = forma.cor;
        botao.textContent = forma.nome;
        botao.dataset.forma = forma.nome;
        botao.addEventListener('click', () => selecionarForma(botao));
        elementos.shapes.appendChild(botao);
    });

    falar('Qual é a forma?');
}

function selecionarForma(botao) {
    if (concluido) return;

    const formaEscolhida = botao.dataset.forma;

    if (formaEscolhida === formaAtual.nome) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Muito bem! É um ${formaAtual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.display.classList.add('celebration');
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! É um ${formaAtual.nome}`);
    } else {
        botao.classList.add('shake');
        setTimeout(() => botao.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente outra forma! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra forma');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    falar('Qual é a forma?');
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();

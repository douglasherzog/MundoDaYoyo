const cores = [
    { nome: 'vermelho', hex: '#FF6B6B', emoji: '' },
    { nome: 'azul', hex: '#4D96FF', emoji: '' },
    { nome: 'amarelo', hex: '#FFD93D', emoji: '' },
    { nome: 'verde', hex: '#6BCB77', emoji: '' },
    { nome: 'laranja', hex: '#FF9F45', emoji: '' },
    { nome: 'roxo', hex: '#9B59B6', emoji: '' },
    { nome: 'rosa', hex: '#FF85A2', emoji: '' }
];

const formas = ['', '', '', '', ''];

const elementos = {
    shape: document.getElementById('color-shape'),
    question: document.getElementById('color-question'),
    colors: document.getElementById('colors'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

const game = GameEngine.create({
    id: 'cores',
    data: cores,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#colors',
    feedbackSelector: '#feedback',
    displaySelector: '#color-shape',
    progressSelector: '#progress-bar',
    optionKey: function (c) { return c.nome; },

    onRound: function (cor) {
        var forma = formas[Math.floor(Math.random() * formas.length)];
        elementos.shape.textContent = forma;
        elementos.shape.style.color = cor.hex;
        elementos.question.textContent = 'Qual é a cor? ' + cor.emoji;
    },

    renderOption: function (btn, cor) {
        btn.className = 'game-option color-button';
        btn.style.backgroundColor = cor.hex;
        btn.style.color = '#fff';
        btn.style.fontSize = '1.6rem';
        btn.textContent = cor.nome;
    },

    speakQuestion: function (cor) { falar('Qual é a cor?'); },
    speakCorrect: function (cor) { falar('Muito bem! A cor é ' + cor.nome); },
    speakWrong: function (cor) { falar('Tente outra cor'); },

    onCorrect: function (cor) {
        elementos.pontos.textContent = game.state.score;
    },

    onVictory: function () {
        elementos.pontos.textContent = game.state.score;
    }
});

elementos.btnSpeak.addEventListener('click', function () {
    falar('Qual é a cor?');
});

game.start();
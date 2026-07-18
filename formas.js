const formas = [
    { nome: 'círculo', emoji: '', cor: '#4D96FF' },
    { nome: 'quadrado', emoji: '', cor: '#FF6B6B' },
    { nome: 'triângulo', emoji: '', cor: '#FFD93D' },
    { nome: 'estrela', emoji: '', cor: '#FF9F45' },
    { nome: 'coração', emoji: '', cor: '#FF85A2' }
];

const elementos = {
    display: document.getElementById('shape-display'),
    question: document.getElementById('shape-question'),
    shapes: document.getElementById('shapes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

const game = GameEngine.create({
    id: 'formas',
    data: formas,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#shapes',
    feedbackSelector: '#feedback',
    displaySelector: '#shape-display',
    progressSelector: '#progress-bar',
    optionKey: function (f) { return f.nome; },

    onRound: function (forma) {
        elementos.display.textContent = forma.emoji;
        elementos.display.style.color = forma.cor;
        elementos.question.textContent = 'Qual é a forma?';
    },

    renderOption: function (btn, forma) {
        btn.className = 'game-option shape-button';
        btn.style.backgroundColor = forma.cor;
        btn.style.color = '#fff';
        btn.style.fontSize = '1.6rem';
        btn.textContent = forma.nome;
    },

    speakQuestion: function (forma) { falar('Qual é a forma?'); },
    speakCorrect: function (forma) { falar('Muito bem! E um ' + forma.nome); },
    speakWrong: function (forma) { falar('Tente outra forma'); },

    onCorrect: function (forma) {
        elementos.pontos.textContent = game.state.score;
    },

    onVictory: function () {
        elementos.pontos.textContent = game.state.score;
    }
});

elementos.btnSpeak.addEventListener('click', function () {
    falar('Qual é a forma?');
});

game.start();
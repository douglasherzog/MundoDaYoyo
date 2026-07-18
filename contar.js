const objetos = [
    { emoji: '', nome: 'maçãs' },
    { emoji: '', nome: 'bananas' },
    { emoji: '', nome: 'carrinhos' },
    { emoji: '', nome: 'estrelas' },
    { emoji: '', nome: 'cachorrinhos' },
    { emoji: '', nome: 'flores' },
    { emoji: '', nome: 'balões' },
    { emoji: '', nome: 'ursos' },
    { emoji: '', nome: 'biscoitos' },
    { emoji: '', nome: 'gatinhos' }
];

const elementos = {
    display: document.getElementById('objects-display'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    starsCount: document.getElementById('stars-count')
};

const game = GameEngine.create({
    id: 'contar',
    data: objetos,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#options-area',
    feedbackSelector: '#feedback',
    displaySelector: '#objects-display',
    progressSelector: '#progress-bar',

    getData: function () {
        var obj = objetos[Math.floor(Math.random() * objetos.length)];
        var qty = Math.floor(Math.random() * 9) + 1;
        return { emoji: obj.emoji, nome: obj.nome, quantidade: qty, id: obj.nome + '_' + qty };
    },

    optionKey: function (item) { return item.quantidade; },
    matchFn: function (a, b) { return a === b; },

    onRound: function (item) {
        elementos.display.innerHTML = '';
        for (var i = 0; i < item.quantidade; i++) {
            var span = document.createElement('span');
            span.textContent = item.emoji;
            span.className = 'object-item';
            span.style.animationDelay = (i * 0.1) + 's';
            elementos.display.appendChild(span);
        }
    },

    renderOption: function (btn, item) {
        btn.className = 'game-option count-option';
        btn.textContent = item.quantidade;
        btn.style.fontSize = '2rem';
    },

    speakQuestion: function (item) { falar('Quantos ' + item.nome + ' você vê?'); },
    speakCorrect: function (item) { falar('Muito bem! São ' + item.quantidade + ' ' + item.nome); },
    speakWrong: function (item) { falar('Tente outro número'); },

    onCorrect: function (item) {
        elementos.pontos.textContent = game.state.score;
    },

    onVictory: function () {
        elementos.pontos.textContent = game.state.score;
    }
});

elementos.btnSpeak.addEventListener('click', function () {
    if (game.state.current) falar('Quantos ' + game.state.current.nome + ' você vê?');
});

game.start();
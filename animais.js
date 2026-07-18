const animais = [
    { nome: 'cachorro', emoji: '', som: 'au au', dica: 'Faz au au' },
    { nome: 'gato', emoji: '', som: 'miau', dica: 'Faz miau' },
    { nome: 'passarinho', emoji: '', som: 'piu piu', dica: 'Faz piu piu' },
    { nome: 'vaca', emoji: '', som: 'muuu', dica: 'Faz muuu' },
    { nome: 'leão', emoji: '', som: 'roar', dica: 'Ruge forte' },
    { nome: 'peixe', emoji: '', som: 'glub glub', dica: 'Faz glub glub' },
    { nome: 'coelho', emoji: '', som: 'snif', dica: 'Pula muito' },
    { nome: 'elefante', emoji: '', som: 'fuuu', dica: 'Tem tromba grande' },
    { nome: 'pato', emoji: '', som: 'quack', dica: 'Faz quack' },
    { nome: 'cavalo', emoji: '', som: 'relinchar', dica: 'Relincha' }
];

const elementos = {
    word: document.getElementById('animal-word'),
    hint: document.getElementById('animal-hint'),
    animals: document.getElementById('animals'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

const game = GameEngine.create({
    id: 'animais',
    data: animais,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#animals',
    feedbackSelector: '#feedback',
    displaySelector: '#animal-word',
    progressSelector: '#progress-bar',
    optionKey: function (a) { return a.nome; },

    onRound: function (animal) {
        elementos.word.textContent = animal.emoji;
        elementos.hint.textContent = 'Qual é esse animal?';
    },

    renderOption: function (btn, animal) {
        btn.className = 'game-option animal-button';
        btn.textContent = animal.nome;
        btn.title = animal.nome;
    },

    speakQuestion: function (animal) { falar('Qual animal faz ' + animal.som + '?'); },
    speakCorrect: function (animal) { falar('Muito bem! E o ' + animal.nome + '. ' + animal.som + '!'); },
    speakWrong: function (animal) { falar('Tente outro animal'); },

    onCorrect: function (animal) {
        elementos.word.textContent = animal.emoji + ' ' + animal.nome;
        elementos.pontos.textContent = game.state.score;
    },

    onVictory: function () {
        elementos.pontos.textContent = game.state.score;
    }
});

elementos.btnSpeak.addEventListener('click', function () {
    if (game.state.current) falar('Qual animal faz ' + game.state.current.som + '?');
});

game.start();
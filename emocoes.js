const emocoes = [
    { nome: 'feliz', emoji: '', dica: 'Está sorrindo bastante' },
    { nome: 'triste', emoji: '', dica: 'Está chorando' },
    { nome: 'com raiva', emoji: '', dica: 'Está brava e com a testa franzida' },
    { nome: 'com medo', emoji: '', dica: 'Está assustada' },
    { nome: 'surpresa', emoji: '', dica: 'Ficou de boca aberta de surpresa' },
    { nome: 'sonolenta', emoji: '', dica: 'Está com sono e quer dormir' },
    { nome: 'apaixonada', emoji: '', dica: 'Está com coraçõezinhos nos olhos' },
    { nome: 'envergonhada', emoji: '', dica: 'Está com vergonha e corada' },
    { nome: 'doente', emoji: '', dica: 'Está com febre e um termômetro' },
    { nome: 'animada', emoji: '', dica: 'Tem estrelinha nos olhos de tão animada' }
];

const elementos = {
    emoji: document.getElementById('emocao-emoji'),
    hint: document.getElementById('emocao-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

const game = GameEngine.create({
    id: 'emocoes',
    data: emocoes,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#opcoes',
    feedbackSelector: '#feedback',
    displaySelector: '#emocao-emoji',
    progressSelector: '#progress-bar',
    optionKey: function (e) { return e.nome; },

    onRound: function (item) {
        elementos.emoji.textContent = item.emoji;
        elementos.hint.textContent = 'Como essa criança está se sentindo?';
    },

    renderOption: function (btn, item) {
        btn.className = 'game-option';
        btn.textContent = item.nome;
    },

    speakQuestion: function (item) { falar('Como essa criança está se sentindo? ' + item.dica); },
    speakCorrect: function (item) { falar('Muito bem! Ela está ' + item.nome + '. ' + item.dica + '!'); },
    speakWrong: function (item) { falar('Tente de novo'); },

    onCorrect: function (item) { elementos.pontos.textContent = game.state.score; },
    onVictory: function () { elementos.pontos.textContent = game.state.score; }
});

elementos.btnSpeak.addEventListener('click', function () {
    if (game.state.current) falar('Como essa criança está se sentindo? ' + game.state.current.dica);
});

game.start();
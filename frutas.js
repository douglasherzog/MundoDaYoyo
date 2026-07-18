const itens = [
    { nome: 'maçã', emoji: '', dica: 'É vermelha e crocante' },
    { nome: 'banana', emoji: '', dica: 'É amarela e curva' },
    { nome: 'uva', emoji: '', dica: 'São bolinhas roxas' },
    { nome: 'morango', emoji: '', dica: 'É vermelha e tem pontinhos' },
    { nome: 'laranja', emoji: '', dica: 'É redonda e laranja' },
    { nome: 'melancia', emoji: '', dica: 'É verde por fora e vermelha por dentro' },
    { nome: 'abacaxi', emoji: '', dica: 'Tem espinhos e é amarelo por dentro' },
    { nome: 'pera', emoji: '', dica: 'É verde e doce' },
    { nome: 'cereja', emoji: '', dica: 'São duas bolinhas vermelhas' },
    { nome: 'limão', emoji: '', dica: 'É amarelo e azedo' },
    { nome: 'cenoura', emoji: '', dica: 'É laranja e os coelhos adoram' },
    { nome: 'brócolis', emoji: '', dica: 'É verde e parece uma arvorezinha' },
    { nome: 'milho', emoji: '', dica: 'É amarelo e tem grãozinhos' },
    { nome: 'tomate', emoji: '', dica: 'É redondo e vermelho' },
    { nome: 'batata', emoji: '', dica: 'É marrom e virou batata frita' }
];

const elementos = {
    emoji: document.getElementById('fruta-emoji'),
    hint: document.getElementById('fruta-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

const game = GameEngine.create({
    id: 'frutas',
    data: itens,
    totalRounds: 10,
    minOptions: 2,
    maxOptions: 4,
    containerSelector: '#opcoes',
    feedbackSelector: '#feedback',
    displaySelector: '#fruta-emoji',
    progressSelector: '#progress-bar',
    optionKey: function (i) { return i.nome; },

    onRound: function (item) {
        elementos.emoji.textContent = item.emoji;
        elementos.hint.textContent = 'O que é isso?';
    },

    renderOption: function (btn, item) {
        btn.className = 'game-option';
        btn.textContent = item.nome;
    },

    speakQuestion: function (item) { falar('O que é isso? ' + item.dica); },
    speakCorrect: function (item) { falar('Muito bem! É ' + item.nome + '. ' + item.dica + '!'); },
    speakWrong: function (item) { falar('Tente de novo'); },

    onCorrect: function (item) { elementos.pontos.textContent = game.state.score; },
    onVictory: function () { elementos.pontos.textContent = game.state.score; }
});

elementos.btnSpeak.addEventListener('click', function () {
    if (game.state.current) falar('O que é isso? ' + game.state.current.dica);
});

game.start();
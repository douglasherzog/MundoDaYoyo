const rimas = [
    { palavra: 'bola', emoji: '🏐', correta: 'cola', opcoes: ['cola', 'gato', 'mesa'] },
    { palavra: 'gato', emoji: '🐱', correta: 'pato', opcoes: ['pato', 'bola', 'peixe'] },
    { palavra: 'pé', emoji: '🦶', correta: 'você', opcoes: ['você', 'mão', 'boca'] },
    { palavra: 'pão', emoji: '🍞', correta: 'mão', opcoes: ['mão', 'pé', 'olho'] },
    { palavra: 'chá', emoji: '🍵', correta: 'pá', opcoes: ['pá', 'colher', 'prato'] },
    { palavra: 'tia', emoji: '👩', correta: 'cecília', opcoes: ['cecília', 'mãe', 'bebê'] },
    { palavra: 'sol', emoji: '☀️', correta: 'viol', opcoes: ['viol', 'pente', 'lápis'] },
    { palavra: 'cão', emoji: '🐶', correta: 'mão', opcoes: ['mão', 'pé', 'boca'] }
];

let rimaAtual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    target: document.getElementById('rhyme-target'),
    word: document.getElementById('rhyme-word'),
    question: document.getElementById('rhyme-question'),
    rhymes: document.getElementById('rhymes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};
}

function escolherRima() {
    return rimas[Math.floor(Math.random() * rimas.length)];
}

function carregarRodada() {
    rimaAtual = escolherRima();
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    elementos.target.textContent = rimaAtual.emoji;
    elementos.target.classList.remove('celebration');
    elementos.word.textContent = rimaAtual.palavra;
    elementos.question.textContent = 'Rima com qual palavra?';

    const opcoesEmbaralhadas = embaralhar([...rimaAtual.opcoes]);
    elementos.rhymes.innerHTML = '';
    opcoesEmbaralhadas.forEach((opcao, indice) => {
        const botao = document.createElement('button');
        botao.className = 'rhyme-button';
        botao.textContent = opcao;
        botao.dataset.opcao = opcao;
        botao.style.background = `linear-gradient(135deg, ${['#FF6B9D', '#4D96FF', '#FFD93D'][indice % 3]} 0%, ${['#FF8E53', '#6BCB77', '#FF9F45'][indice % 3]} 100%)`;
        botao.addEventListener('click', () => selecionarRima(botao));
        elementos.rhymes.appendChild(botao);
    });

    falar(`${rimaAtual.palavra}. Rima com qual palavra?`);
}

function selecionarRima(botao) {
    if (concluido) return;

    const opcaoEscolhida = botao.dataset.opcao;

    if (opcaoEscolhida === rimaAtual.correta) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Rima perfeita! ${rimaAtual.palavra} rima com ${rimaAtual.correta}!`;
        elementos.feedback.className = 'feedback success';
        elementos.target.classList.add('celebration');
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! ${rimaAtual.palavra} rima com ${rimaAtual.correta}`);
    } else {
        botao.classList.add('shake');
        setTimeout(() => botao.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente outra palavra! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra palavra');
}\nelementos.btnSpeak.addEventListener('click', () => {
    falar(`${rimaAtual.palavra}. Rima com qual palavra?`);
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();

const palavras = [
    { palavra: 'bola', emoji: '⚽', letra: 'B' },
    { palavra: 'casa', emoji: '🏠', letra: 'C' },
    { palavra: 'gato', emoji: '🐱', letra: 'G' },
    { palavra: 'maçã', emoji: '🍎', letra: 'M' },
    { palavra: 'peixe', emoji: '🐟', letra: 'P' },
    { palavra: 'sol', emoji: '☀️', letra: 'S' },
    { palavra: 'vaca', emoji: '🐮', letra: 'V' },
    { palavra: 'foca', emoji: '🦭', letra: 'F' },
    { palavra: 'dado', emoji: '🎲', letra: 'D' },
    { palavra: 'lua', emoji: '🌙', letra: 'L' }
];

let palavraAtual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    word: document.getElementById('letter-word'),
    name: document.getElementById('letter-name'),
    question: document.getElementById('letter-question'),
    letters: document.getElementById('letters'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

    return novo;
}

}

function escolherPalavra() {
    return palavras[Math.floor(Math.random() * palavras.length)];
}

function pronunciarLetra(letra) {
    const pronuncias = {
        'A': 'á', 'B': 'bê', 'C': 'cê', 'D': 'dê', 'E': 'é', 'F': 'êfe',
        'G': 'gê', 'H': 'agá', 'I': 'i', 'J': 'jota', 'K': 'cá', 'L': 'êle',
        'M': 'ême', 'N': 'êne', 'O': 'ó', 'P': 'pê', 'Q': 'quê', 'R': 'êrre',
        'S': 'êsse', 'T': 'tê', 'U': 'u', 'V': 'vê', 'W': 'dáblio', 'X': 'xis',
        'Y': 'ípsilon', 'Z': 'zê'
    };
    return pronuncias[letra] || letra.toLowerCase();
}

function carregarRodada() {
    palavraAtual = escolherPalavra();
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    elementos.word.textContent = palavraAtual.emoji;
    elementos.word.classList.remove('celebration');
    elementos.name.textContent = palavraAtual.palavra;
    elementos.question.textContent = 'Começa com qual letra?';

    const letras = [palavraAtual.letra];
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    while (letras.length < 3) {
        const candidato = alfabeto[Math.floor(Math.random() * alfabeto.length)];
        if (!letras.includes(candidato)) {
            letras.push(candidato);
        }
    }

    const letrasEmbaralhadas = embaralhar(letras);
    elementos.letters.innerHTML = '';
    letrasEmbaralhadas.forEach((letra) => {
        const botao = document.createElement('button');
        botao.className = 'letter-button';
        botao.textContent = letra;
        botao.dataset.letra = letra;
        botao.addEventListener('click', () => selecionarLetra(botao));
        elementos.letters.appendChild(botao);
    });

    falar(`${palavraAtual.palavra}. Começa com qual letra?`);
}

function selecionarLetra(botao) {
    if (concluido) return;

    const letraEscolhida = botao.dataset.letra;

    if (letraEscolhida === palavraAtual.letra) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Muito bem! ${palavraAtual.palavra} começa com ${palavraAtual.letra}!`;
        elementos.feedback.className = 'feedback success';
        elementos.word.classList.add('celebration');
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! ${palavraAtual.palavra} começa com ${pronunciarLetra(palavraAtual.letra)}`);
    } else {
        botao.classList.add('shake');
        setTimeout(() => botao.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente outra letra! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra letra');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    falar(`${palavraAtual.palavra}. Começa com qual letra?`);
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();

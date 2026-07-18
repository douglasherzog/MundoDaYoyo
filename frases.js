const frases = [
    { frase: 'O gato come peixe', palavras: ['O', 'gato', 'come', 'peixe'], emoji: '🐱🐟' },
    { frase: 'A bola é azul', palavras: ['A', 'bola', 'é', 'azul'], emoji: '⚽🔵' },
    { frase: 'O sol brilha', palavras: ['O', 'sol', 'brilha'], emoji: '☀️✨' },
    { frase: 'A maçã é doce', palavras: ['A', 'maçã', 'é', 'doce'], emoji: '🍎😋' },
    { frase: 'O cão corre', palavras: ['O', 'cão', 'corre'], emoji: '🐶🏃' },
    { frase: 'A lua brilha', palavras: ['A', 'lua', 'brilha'], emoji: '🌙✨' },
    { frase: 'O bolo é bom', palavras: ['O', 'bolo', 'é', 'bom'], emoji: '🎂😊' },
    { frase: 'A casa é grande', palavras: ['A', 'casa', 'é', 'grande'], emoji: '🏠🏰' },
    { frase: 'A mãe lê livro', palavras: ['A', 'mãe', 'lê', 'livro'], emoji: '👩📖' },
    { frase: 'O pai faz carinho', palavras: ['O', 'pai', 'faz', 'carinho'], emoji: '👨❤️' },
    { frase: 'A flor é bonita', palavras: ['A', 'flor', 'é', 'bonita'], emoji: '🌸😍' },
    { frase: 'O avô dorme', palavras: ['O', 'avô', 'dorme'], emoji: '👴😴' },
    { frase: 'A vovó cozinha', palavras: ['A', 'vovó', 'cozinha'], emoji: '👵🍳' },
    { frase: 'O bebê ri', palavras: ['O', 'bebê', 'ri'], emoji: '👶😄' },
    { frase: 'A menina canta', palavras: ['A', 'menina', 'canta'], emoji: '👧🎵' },
    { frase: 'O menino pula', palavras: ['O', 'menino', 'pula'], emoji: '👦🤸' }
];

let fraseAtual = null;
let palavrasSelecionadas = [];
let pontos = 0;
let concluido = false;

const elementos = {
    emoji: document.getElementById('emoji'),
    sentenceSlots: document.getElementById('sentence-slots'),
    words: document.getElementById('words'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

    return novo;
}

function escolherFrase() {
    const indice = Math.floor(Math.random() * frases.length);
    return frases[indice];
}

}

function carregarFrase() {
    fraseAtual = escolherFrase();
    palavrasSelecionadas = [];
    concluido = false;

    elementos.emoji.textContent = fraseAtual.emoji;
    elementos.emoji.classList.remove('celebration');
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    elementos.sentenceSlots.innerHTML = '';
    for (let i = 0; i < fraseAtual.palavras.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot word-slot';
        slot.dataset.indice = i;
        slot.textContent = '?';
        elementos.sentenceSlots.appendChild(slot);
    }

    const palavrasEmbaralhadas = embaralhar(fraseAtual.palavras);
    elementos.words.innerHTML = '';
    palavrasEmbaralhadas.forEach((palavra, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable word-button color-${(indice % 6) + 1}`;
        botao.textContent = palavra;
        botao.dataset.palavra = palavra;
        botao.addEventListener('click', () => selecionarPalavra(botao));
        elementos.words.appendChild(botao);
    });
}

function selecionarPalavra(botao) {
    if (concluido) return;

    const palavra = botao.dataset.palavra;
    const indiceEsperado = palavrasSelecionadas.length;

    if (palavra === fraseAtual.palavras[indiceEsperado]) {
        palavrasSelecionadas.push(palavra);
        botao.classList.add('used');

        const slots = elementos.sentenceSlots.querySelectorAll('.slot');
        slots[indiceEsperado].textContent = palavra;
        slots[indiceEsperado].classList.add('filled');

        if (palavrasSelecionadas.length === fraseAtual.palavras.length) {
            concluido = true;
            pontos += 10;
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = `🎉 Ótimo! "${fraseAtual.frase}"`;
            elementos.feedback.className = 'feedback success';
            elementos.emoji.classList.add('celebration');
            elementos.btnNext.disabled = false;
            playSuccess();
            falar(`Muito bem! ${fraseAtual.frase}`);
        } else {
            playClick();
            falar(palavra);
        }
    } else {
        botao.classList.add('celebration');
        setTimeout(() => botao.classList.remove('celebration'), 500);
        elementos.feedback.textContent = 'Tente outra palavra! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra palavra');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    if (fraseAtual) {
        falar(fraseAtual.frase);
    }
});

elementos.btnNext.addEventListener('click', () => {
    carregarFrase();
});

carregarFrase();

const letras = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const pronunciaLetras = {
    'A': 'á', 'B': 'bê', 'C': 'cê', 'D': 'dê', 'E': 'é', 'F': 'êfe',
    'G': 'gê', 'H': 'agá', 'I': 'i', 'J': 'jota', 'K': 'cá', 'L': 'êle',
    'M': 'ême', 'N': 'êne', 'O': 'ó', 'P': 'pê', 'Q': 'quê', 'R': 'êrre',
    'S': 'êsse', 'T': 'tê', 'U': 'u', 'V': 'vê', 'W': 'dáblio', 'X': 'xis',
    'Y': 'ípsilon', 'Z': 'zê'
};

const palavrasMagicas = [
    'UNICORNIO', 'ARCOIRIS', 'MARSHMALLOW', 'NUVEM', 'ESTRELA',
    'FADA', 'BOLA', 'GATO', 'CASA', 'LUA', 'SOL', 'MAE', 'PAI', 'YOYO'
];

let palavraAtual = '';

const elementos = {
    display: document.getElementById('letter-display'),
    slots: document.getElementById('word-slots'),
    keyboard: document.getElementById('letter-keyboard'),
    feedback: document.getElementById('feedback'),
    btnSpeak: document.getElementById('btn-speak'),
    btnClear: document.getElementById('btn-clear'),
    btnNext: document.getElementById('btn-next')
};

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.85;
        window.speechSynthesis.speak(msg);
    }
}

function pronunciarLetra(letra) {
    return pronunciaLetras[letra] || letra.toLowerCase();
}

function atualizarTela() {
    elementos.display.textContent = palavraAtual || '?';
    elementos.slots.innerHTML = '';

    for (let i = 0; i < palavraAtual.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot filled';
        slot.textContent = palavraAtual[i];
        elementos.slots.appendChild(slot);
    }
}

function adicionarLetra(letra) {
    if (palavraAtual.length < 12) {
        palavraAtual += letra;
        atualizarTela();
        falar(pronunciarLetra(letra));
    }
}

function limpar() {
    palavraAtual = '';
    atualizarTela();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function palavraMagica() {
    const indice = Math.floor(Math.random() * palavrasMagicas.length);
    palavraAtual = palavrasMagicas[indice];
    atualizarTela();
    falar(palavraAtual);
    elementos.feedback.textContent = '✨ Palavra mágica formada!';
    elementos.feedback.className = 'feedback success';
}

function criarTeclado() {
    letras.forEach((letra, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable color-${(indice % 6) + 1}`;
        botao.textContent = letra;
        botao.addEventListener('click', () => adicionarLetra(letra));
        elementos.keyboard.appendChild(botao);
    });
}

elementos.btnSpeak.addEventListener('click', () => {
    if (palavraAtual) {
        const letrasPronuncia = palavraAtual.split('').map(pronunciarLetra).join(' ');
        falar(palavraAtual + '. ' + letrasPronuncia);
    } else {
        falar('Forme uma palavra');
    }
});

elementos.btnClear.addEventListener('click', limpar);
elementos.btnNext.addEventListener('click', palavraMagica);

criarTeclado();

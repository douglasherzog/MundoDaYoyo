const frases = [
    { frase: 'O gato come peixe', palavras: ['O', 'gato', 'come', 'peixe'], emoji: '🐱' },
    { frase: 'A bola é azul', palavras: ['A', 'bola', 'é', 'azul'], emoji: '⚽' },
    { frase: 'O sol brilha', palavras: ['O', 'sol', 'brilha'], emoji: '☀️' },
    { frase: 'A maçã é doce', palavras: ['A', 'maçã', 'é', 'doce'], emoji: '🍎' },
    { frase: 'O cão corre', palavras: ['O', 'cão', 'corre'], emoji: '🐶' },
    { frase: 'A lua brilha', palavras: ['A', 'lua', 'brilha'], emoji: '🌙' },
    { frase: 'O bolo é bom', palavras: ['O', 'bolo', 'é', 'bom'], emoji: '🎂' },
    { frase: 'A casa é grande', palavras: ['A', 'casa', 'é', 'grande'], emoji: '🏠' },
    { frase: 'A mãe lê livro', palavras: ['A', 'mãe', 'lê', 'livro'], emoji: '👩' },
    { frase: 'O pai faz carinho', palavras: ['O', 'pai', 'faz', 'carinho'], emoji: '👨' },
    { frase: 'A flor é bonita', palavras: ['A', 'flor', 'é', 'bonita'], emoji: '🌸' },
    { frase: 'O bebê ri', palavras: ['O', 'bebê', 'ri'], emoji: '👶' },
    { frase: 'A vovó cozinha', palavras: ['A', 'vovó', 'cozinha'], emoji: '👵' },
    { frase: 'A menina canta', palavras: ['A', 'menina', 'canta'], emoji: '👧' },
    { frase: 'O menino pula', palavras: ['O', 'menino', 'pula'], emoji: '👦' }
];

const elementos = {
    display: document.getElementById('sentence-display'),
    slots: document.getElementById('sentence-slots'),
    words: document.getElementById('words'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos')
};

let rodada = 0, pontos = 0, fraseAtual = null, palavrasSelecionadas = [], concluido = false, wrongCount = 0;

function iniciarRodada() {
    if (rodada >= 10) { vitoria(); return; }
    rodada++;
    fraseAtual = frases[Math.floor(Math.random() * frases.length)];
    palavrasSelecionadas = [];
    concluido = false;
    wrongCount = 0;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (rodada / 10 * 100) + '%'; bar.textContent = rodada + ' / 10'; }

    elementos.display.innerHTML = '<div style="font-size:4rem">' + fraseAtual.emoji + '</div>';
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';

    elementos.slots.innerHTML = '';
    fraseAtual.palavras.forEach(function() {
        var slot = document.createElement('div');
        slot.className = 'word-slot slot';
        slot.textContent = '?';
        elementos.slots.appendChild(slot);
    });

    var palavrasEmbaralhadas = embaralhar(fraseAtual.palavras.slice());
    elementos.words.innerHTML = '';
    palavrasEmbaralhadas.forEach(function(palavra) {
        var btn = document.createElement('button');
        btn.className = 'game-option word-button';
        btn.textContent = palavra;
        btn.dataset.palavra = palavra;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.words.appendChild(btn);
    });

    setTimeout(function() { falar('Monte a frase: ' + fraseAtual.frase); }, 500);
}

function selecionar(btn) {
    if (concluido) return;
    var palavra = btn.dataset.palavra;
    var indiceEsperado = palavrasSelecionadas.length;

    if (palavra === fraseAtual.palavras[indiceEsperado]) {
        palavrasSelecionadas.push(palavra);
        btn.classList.add('used');
        btn.disabled = true;
        var slots = elementos.slots.querySelectorAll('.word-slot');
        slots[indiceEsperado].textContent = palavra;
        slots[indiceEsperado].classList.add('filled');

        if (palavrasSelecionadas.length === fraseAtual.palavras.length) {
            concluido = true;
            pontos += Math.max(10 - wrongCount * 2, 3);
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = ' Parabéns! Frase correta!';
            elementos.feedback.className = 'feedback success';
            playSuccess();
            falar('Parabéns! A frase é: ' + fraseAtual.frase);
            setTimeout(iniciarRodada, 2000);
        } else {
            playClick();
            falar(palavra);
        }
    } else {
        wrongCount++;
        btn.classList.add('shake');
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Tente outra palavra! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outra palavra');
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.words.innerHTML = '';
    elementos.slots.innerHTML = '';
    elementos.display.innerHTML = '<div style="font-size:4rem"> Parabéns! Você completou!</div>';
    elementos.feedback.innerHTML = '<div style="font-size:2rem">Você montou todas as frases!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo de frases!');
}

iniciarRodada();
const emocoes = [
    { nome: 'feliz', emoji: '😄', dica: 'Está sorrindo bastante' },
    { nome: 'triste', emoji: '😢', dica: 'Está chorando' },
    { nome: 'com raiva', emoji: '😠', dica: 'Está brava e com a testa franzida' },
    { nome: 'com medo', emoji: '😨', dica: 'Está assustada' },
    { nome: 'surpresa', emoji: '😲', dica: 'Ficou de boca aberta de surpresa' },
    { nome: 'sonolenta', emoji: '😴', dica: 'Está com sono e quer dormir' },
    { nome: 'apaixonada', emoji: '🥰', dica: 'Está com coraçõezinhos nos olhos' },
    { nome: 'envergonhada', emoji: '😊', dica: 'Está com vergonha e corada' },
    { nome: 'doente', emoji: '🤒', dica: 'Está com febre e um termômetro' },
    { nome: 'animada', emoji: '🤩', dica: 'Tem estrelinha nos olhos de tão animada' },
];

let atual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    emoji: document.getElementById('emocao-emoji'),
    hint: document.getElementById('emocao-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

function embaralhar(array) {
    const novo = [...array];
    for (let i = novo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novo[i], novo[j]] = [novo[j], novo[i]];
    }
    return novo;
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

function carregarRodada() {
    atual = emocoes[Math.floor(Math.random() * emocoes.length)];
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.emoji.textContent = atual.emoji;
    elementos.emoji.classList.remove('celebration');
    elementos.hint.textContent = 'Como essa criança está se sentindo?';

    const opcoes = [atual];
    const pool = emocoes.filter(e => e !== atual);
    const embaralhado = embaralhar(pool);
    while (opcoes.length < 4) opcoes.push(embaralhado[opcoes.length - 1]);

    elementos.opcoes.innerHTML = '';
    embaralhar(opcoes).forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'animal-button';
        btn.textContent = item.nome;
        btn.dataset.nome = item.nome;
        btn.addEventListener('click', () => selecionar(btn));
        elementos.opcoes.appendChild(btn);
    });

    falar(`Como essa criança está se sentindo? ${atual.dica}`);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.nome === atual.nome) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.emoji.classList.add('celebration');
        elementos.feedback.textContent = `🎉 Isso! Ela está ${atual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! Ela está ${atual.nome}. ${atual.dica}!`);
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
    }
}

elementos.btnSpeak.addEventListener('click', () => falar(`Como essa criança está se sentindo? ${atual.dica}`));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();

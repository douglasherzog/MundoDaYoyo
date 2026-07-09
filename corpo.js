const partesCorpo = [
    { nome: 'cabeça', emoji: '😊', dica: 'cabeça' },
    { nome: 'peito', emoji: '❤️', dica: 'peito' },
    { nome: 'braço', emoji: '💪', dica: 'braço' },
    { nome: 'perna', emoji: '🦵', dica: 'perna' }
];

let parteAtual = null;
let concluido = false;
let pontos = 0;

const elementos = {
    target: document.getElementById('target-body-part'),
    feedback: document.getElementById('feedback'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count'),
    bodyParts: document.querySelectorAll('.body-figure [data-part]')
};

function atualizarEstrelas() {
    const estrelas = carregarEstrelas();
    elementos.starsCount.textContent = estrelas;
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

function limparDestaques() {
    elementos.bodyParts.forEach(part => part.classList.remove('selected', 'correct-part', 'wrong-part'));
}

function gerarDesafio() {
    concluido = false;
    limparDestaques();
    parteAtual = partesCorpo[Math.floor(Math.random() * partesCorpo.length)];

    elementos.target.innerHTML = `
        <span class="body-emoji">${parteAtual.emoji}</span>
        <span class="body-part-name">${parteAtual.nome}</span>
    `;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    falar(`Clique na ${parteAtual.dica}`);
}

function verificarParte(botao) {
    if (concluido) return;

    const parteEscolhida = botao.dataset.part;

    if (parteEscolhida === parteAtual.nome) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct-part');
        elementos.feedback.textContent = `🎉 Muito bem! Você achou a ${parteAtual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar(`Muito bem! Você achou a ${parteAtual.nome}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong-part');
        setTimeout(() => botao.classList.remove('wrong-part'), 500);
        elementos.feedback.textContent = 'Tente outra parte! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outra parte do corpo');
        playError();
    }
}

elementos.bodyParts.forEach(part => {
    part.addEventListener('click', () => verificarParte(part));
});

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

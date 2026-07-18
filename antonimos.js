const pares = [
    { palavra: 'grande', oposto: 'pequeno', emoji: '🐘' },
    { palavra: 'quente', oposto: 'frio', emoji: '☀️' },
    { palavra: 'alto', oposto: 'baixo', emoji: '🏔️' },
    { palavra: 'rápido', oposto: 'devagar', emoji: '🐆' },
    { palavra: 'feliz', oposto: 'triste', emoji: '😄' },
    { palavra: 'cheio', oposto: 'vazio', emoji: '🥤' },
    { palavra: 'limpo', oposto: 'sujo', emoji: '✨' },
    { palavra: 'dia', oposto: 'noite', emoji: '☀️' },
    { palavra: 'acordado', oposto: 'dormindo', emoji: '👀' },
    { palavra: 'forte', oposto: 'fraco', emoji: '💪' },
    { palavra: 'longe', oposto: 'perto', emoji: '↔️' },
    { palavra: 'novo', oposto: 'velho', emoji: '🆕' }
];

let parAtual = null;
let concluido = false;
let pontos = 0;

const elementos = {
    target: document.getElementById('target-word'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count')
};

function atualizarEstrelas() {
    const estrelas = carregarEstrelas();
    elementos.starsCount.textContent = estrelas;
}

function gerarDesafio() {
    concluido = false;
    parAtual = pares[Math.floor(Math.random() * pares.length)];

    elementos.target.innerHTML = `
        <span class="opposite-emoji">${parAtual.emoji}</span>
        <span class="opposite-word">${parAtual.palavra}</span>
    `;

    const opcoes = [parAtual.oposto];
    while (opcoes.length < 4) {
        const oposto = pares[Math.floor(Math.random() * pares.length)].oposto;
        if (!opcoes.includes(oposto)) {
            opcoes.push(oposto);
        }
    }

    elementos.options.innerHTML = '';
    embaralhar(opcoes).forEach(oposto => {
        const btn = document.createElement('button');
        btn.textContent = oposto;
        btn.className = 'opposite-option';
        btn.dataset.oposto = oposto;
        btn.addEventListener('click', () => selecionarOposto(btn));
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    falar(`Qual é o oposto de ${parAtual.palavra}?`);
}

function selecionarOposto(botao) {
    if (concluido) return;

    const opostoEscolhido = botao.dataset.oposto;

    if (opostoEscolhido === parAtual.oposto) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct');
        elementos.feedback.textContent = `🎉 Muito bem! ${parAtual.palavra} e ${parAtual.oposto} são opostos!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar(`Muito bem! ${parAtual.palavra} e ${parAtual.oposto} são opostos`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong');
        setTimeout(() => botao.classList.remove('wrong'), 500);
        elementos.feedback.textContent = 'Tente outra palavra! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outra palavra');
        playError();
    }
}

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

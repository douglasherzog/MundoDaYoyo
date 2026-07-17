const NIVEIS = [
    {
        nome: 'Animais',
        tipo: 'emoji',
        valores: ['🐶', '🐱', '🐰'],
        numPecas: 4,
        instrucao: 'Encaixa a peça com o mesmo animal!',
        sucessoMsg: 'Muito bem! O animal encaixou!'
    },
    {
        nome: 'Frutas',
        tipo: 'emoji',
        valores: ['🍎', '🍌', '🍇', '🍓'],
        numPecas: 5,
        instrucao: 'Encaixa a peça com a mesma fruta!',
        sucessoMsg: 'Muito bem! A fruta encaixou!'
    },
    {
        nome: 'Pontinhos',
        tipo: 'dots',
        maxNum: 3,
        numPecas: 5,
        instrucao: 'Conta os pontinhos e encaixa onde tem o mesmo número!',
        sucessoMsg: 'Muito bem! Os pontinhos encaixaram!'
    },
    {
        nome: 'Dominó Clássico',
        tipo: 'dots',
        maxNum: 6,
        numPecas: 6,
        instrucao: 'Conta os pontinhos e encaixa!',
        sucessoMsg: 'Muito bem! A peça encaixou!'
    },
];

const DOT_POSITIONS = {
    0: [],
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

let nivelIdx = 0;
let tabuleiro = [];
let mao = [];
let pecaIdCounter = 0;
let jogando = false;
let bloquearClick = false;

const el = {
    telaInicio: document.getElementById('tela-inicio'),
    telaJogo: document.getElementById('tela-jogo'),
    nivelBar: document.getElementById('nivel-bar'),
    chain: document.getElementById('domino-chain'),
    mao: document.getElementById('domino-mao'),
    feedback: document.getElementById('domino-feedback'),
    btnDica: document.getElementById('btn-dica'),
    btnProximo: document.getElementById('btn-proximo'),
    btnJogar: document.getElementById('btn-jogar'),
    celebracao: document.getElementById('celebracao'),
    celebracaoTitulo: document.getElementById('celebracao-titulo'),
    celebracaoTexto: document.getElementById('celebracao-texto'),
    btnContinuar: document.getElementById('btn-continuar'),
    starsCount: document.getElementById('stars-count'),
};

function atualizarEstrelas() {
    if (typeof carregarEstrelas === 'function') {
        el.starsCount.textContent = carregarEstrelas();
    }
}

function embaralhar(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}

function getValores(nivel) {
    if (nivel.tipo === 'emoji') return nivel.valores.slice();
    const v = [];
    for (let i = 0; i <= nivel.maxNum; i++) v.push(i);
    return v;
}

function gerarCadeia(nivel) {
    const valores = getValores(nivel);
    const cadeia = [];
    let prevRight = valores[Math.floor(Math.random() * valores.length)];
    for (let i = 0; i < nivel.numPecas; i++) {
        const left = prevRight;
        const outros = valores.filter(v => v !== left);
        let right;
        if (outros.length > 0 && Math.random() < 0.75) {
            right = outros[Math.floor(Math.random() * outros.length)];
        } else {
            right = valores[Math.floor(Math.random() * valores.length)];
        }
        cadeia.push({ left, right, id: ++pecaIdCounter });
        prevRight = right;
    }
    return cadeia;
}

function renderDots(num) {
    const pos = DOT_POSITIONS[num] || [];
    const dots = pos.map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="9" fill="#1a1a1a"/>`
    ).join('');
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">${dots}</svg>`;
}

function renderMetade(valor, tipo) {
    if (tipo === 'emoji') {
        return `<div class="domino-metade">${valor}</div>`;
    } else {
        return `<div class="domino-metade">${renderDots(valor)}</div>`;
    }
}

function renderPeca(peca, tipo, classes, onClickFn) {
    const div = document.createElement('div');
    div.className = 'domino-peca ' + classes;
    div.dataset.id = peca.id;
    div.innerHTML =
        renderMetade(peca.left, tipo) +
        '<div class="domino-divisor"></div>' +
        renderMetade(peca.right, tipo);
    if (onClickFn) div.addEventListener('click', () => onClickFn(peca, div));
    return div;
}

function getNivel() {
    return NIVEIS[nivelIdx];
}

function getOpenEnds() {
    return {
        left: tabuleiro[0].left,
        right: tabuleiro[tabuleiro.length - 1].right,
    };
}

function podeEncaixar(peca) {
    const ends = getOpenEnds();
    return peca.left === ends.left || peca.right === ends.left ||
           peca.left === ends.right || peca.right === ends.right;
}

function encaixarPeca(peca) {
    const ends = getOpenEnds();
    if (peca.left === ends.right) {
        tabuleiro.push({ left: peca.left, right: peca.right, id: peca.id });
        return true;
    }
    if (peca.right === ends.right) {
        tabuleiro.push({ left: peca.right, right: peca.left, id: peca.id });
        return true;
    }
    if (peca.right === ends.left) {
        tabuleiro.unshift({ left: peca.left, right: peca.right, id: peca.id });
        return true;
    }
    if (peca.left === ends.left) {
        tabuleiro.unshift({ left: peca.right, right: peca.left, id: peca.id });
        return true;
    }
    return false;
}

function renderizarTabuleiro() {
    const nivel = getNivel();
    el.chain.innerHTML = '';
    tabuleiro.forEach((peca, idx) => {
        let classes = 'tabuleiro-peca colocada';
        if (idx === 0) classes += ' domino-end-glow-left';
        if (idx === tabuleiro.length - 1) classes += ' domino-end-glow-right';
        const div = renderPeca(peca, nivel.tipo, classes);
        if (idx === 0 && idx === tabuleiro.length - 1) {
            div.classList.add('domino-end-glow-left', 'domino-end-glow-right');
        }
        el.chain.appendChild(div);
    });
}

function renderizarMao() {
    const nivel = getNivel();
    el.mao.innerHTML = '';
    mao.forEach(peca => {
        const valida = jogando && podeEncaixar(peca);
        const classes = 'mao-peca' + (valida ? ' valida' : '');
        const div = renderPeca(peca, nivel.tipo, classes, clicarPeca);
        el.mao.appendChild(div);
    });
}

function renderizarTudo() {
    renderizarTabuleiro();
    renderizarMao();
}

function mostrarFeedback(texto, tipo) {
    el.feedback.textContent = texto;
    el.feedback.className = 'domino-feedback' + (tipo ? ' ' + tipo : '');
}

function garantirPecaValida() {
    if (mao.length === 0) return;
    if (mao.some(p => podeEncaixar(p))) return;
    darNovaPeca();
    renderizarMao();
}

function darNovaPeca() {
    const ends = getOpenEnds();
    const nivel = getNivel();
    const valores = getValores(nivel);
    const outros = valores.filter(v => v !== ends.right);
    const otherVal = outros.length > 0
        ? outros[Math.floor(Math.random() * outros.length)]
        : ends.right;
    const novaPeca = { left: ends.right, right: otherVal, id: ++pecaIdCounter };
    mao.push(novaPeca);
}

function clicarPeca(peca, divEl) {
    if (!jogando || bloquearClick) return;

    if (podeEncaixar(peca)) {
        bloquearClick = true;
        encaixarPeca(peca);
        mao = mao.filter(p => p.id !== peca.id);

        const nivel = getNivel();
        mostrarFeedback('🎉 ' + nivel.sucessoMsg, 'success');
        falar(nivel.sucessoMsg);
        if (typeof playSuccess === 'function') playSuccess();
        criarSparkle();

        renderizarTudo();

        if (mao.length === 0) {
            finalizarRodada();
            bloquearClick = false;
        } else {
            garantirPecaValida();
            setTimeout(() => {
                bloquearClick = false;
                if (jogando && mao.some(p => podeEncaixar(p))) {
                    falar('Encaixa a peça que está brilhando!');
                }
            }, 600);
        }
    } else {
        divEl.classList.add('invalida-tentativa');
        setTimeout(() => divEl.classList.remove('invalida-tentativa'), 400);
        mostrarFeedback('🤔 Essa peça não encaixa. Tenta a que está brilhando!', 'error');
        falar('Essa peça não encaixa. Tenta a que está brilhando!');
        if (typeof playError === 'function') playError();
    }
}

function finalizarRodada() {
    jogando = false;
    mostrarFeedback('🎉 Você encaixou todas as peças! 🎉', 'success');
    falar('Parabéns! Você encaixou todas as peças!');
    criarConfete();

    setTimeout(() => {
        if (nivelIdx < NIVEIS.length - 1) {
            el.celebracaoTitulo.textContent = '🎉 Parabéns! 🎉';
            el.celebracaoTexto.textContent = 'Você completou o nível ' + getNivel().nome + '!';
            el.btnContinuar.textContent = 'Próximo Nível 🚀';
            el.celebracao.classList.add('show');
        } else {
            el.celebracaoTitulo.textContent = '🏆 Você é a campeã! 🏆';
            el.celebracaoTexto.textContent = 'Você completou todos os níveis do dominó!';
            el.btnContinuar.textContent = 'Jogar de novo 🔄';
            el.celebracao.classList.add('show');
        }
    }, 1500);
}

function iniciarRodada() {
    const nivel = getNivel();
    const cadeia = gerarCadeia(nivel);

    tabuleiro = [cadeia[0]];
    mao = embaralhar(cadeia.slice(1));

    el.nivelBar.innerHTML =
        '<span class="nivel-num">' + (nivelIdx + 1) + '</span>' +
        '<span>🁢 ' + nivel.nome + '</span>';

    jogando = true;
    bloquearClick = false;
    el.btnProximo.style.display = 'none';
    mostrarFeedback('', '');

    renderizarTudo();
    garantirPecaValida();

    setTimeout(() => {
        falar(nivel.instrucao);
    }, 500);
}

function criarSparkle() {
    for (let i = 0; i < 8; i++) {
        const s = document.createElement('div');
        s.className = 'confetti-piece';
        s.textContent = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
        s.style.left = (40 + Math.random() * 20) + '%';
        s.style.top = (30 + Math.random() * 20) + '%';
        s.style.animation = 'confettiFall 1.5s linear forwards';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1600);
    }
}

function criarConfete() {
    const emojis = ['🎉', '🎊', '⭐', '🌟', '✨', '🎈', '🏆', '💖'];
    for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        c.style.left = Math.random() * 100 + '%';
        c.style.animationDelay = Math.random() * 1.5 + 's';
        c.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4500);
    }
}

el.btnJogar.addEventListener('click', () => {
    el.telaInicio.style.display = 'none';
    el.telaJogo.style.display = 'flex';
    nivelIdx = 0;
    iniciarRodada();
});

el.btnDica.addEventListener('click', () => {
    if (!jogando) return;
    const nivel = getNivel();
    const temValida = mao.some(p => podeEncaixar(p));
    if (temValida) {
        falar('Olha as peças que estão brilhando! ' + nivel.instrucao);
    } else {
        falar('Vamos pegar uma peça que encaixa!');
        darNovaPeca();
        renderizarMao();
    }
    document.querySelectorAll('.domino-peca.valida').forEach(p => {
        p.style.transform = 'scale(1.15)';
        setTimeout(() => p.style.transform = '', 600);
    });
});

el.btnContinuar.addEventListener('click', () => {
    el.celebracao.classList.remove('show');
    if (nivelIdx < NIVEIS.length - 1) {
        nivelIdx++;
        iniciarRodada();
    } else {
        nivelIdx = 0;
        iniciarRodada();
    }
});

atualizarEstrelas();

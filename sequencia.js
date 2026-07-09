const tiposSequencia = [
    {
        nome: 'formas geometricas',
        itens: ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠']
    },
    {
        nome: 'animais',
        itens: ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻']
    },
    {
        nome: 'frutas',
        itens: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉']
    },
    {
        nome: 'numeros',
        itens: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']
    }
];

let sequenciaCorreta = [];
let respostaCorreta = '';
let concluido = false;
let pontos = 0;

const elementos = {
    display: document.getElementById('sequence-display'),
    options: document.getElementById('options-area'),
    feedback: document.getElementById('feedback'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count')
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

function embaralhar(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

function gerarDesafio() {
    concluido = false;

    const tipo = tiposSequencia[Math.floor(Math.random() * tiposSequencia.length)];
    const padraoTamanho = Math.floor(Math.random() * 2) + 2; // 2 ou 3 elementos no padrão
    const padrao = [];

    for (let i = 0; i < padraoTamanho; i++) {
        const item = tipo.itens[Math.floor(Math.random() * tipo.itens.length)];
        padrao.push(item);
    }

    // Cria sequência de 4 elementos com um faltando no final
    sequenciaCorreta = [];
    for (let i = 0; i < 4; i++) {
        sequenciaCorreta.push(padrao[i % padraoTamanho]);
    }

    respostaCorreta = sequenciaCorreta[3];
    sequenciaCorreta[3] = '?';

    elementos.display.innerHTML = '';
    sequenciaCorreta.forEach((item, indice) => {
        const span = document.createElement('span');
        span.textContent = item;
        span.className = `sequence-item ${item === '?' ? 'missing' : ''}`;
        if (indice === 3) span.id = 'missing-slot';
        elementos.display.appendChild(span);
    });

    const opcoes = [respostaCorreta];
    while (opcoes.length < 4) {
        const item = tipo.itens[Math.floor(Math.random() * tipo.itens.length)];
        if (!opcoes.includes(item)) {
            opcoes.push(item);
        }
    }

    elementos.options.innerHTML = '';
    embaralhar(opcoes).forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = item;
        btn.className = 'sequence-option';
        btn.dataset.item = item;
        btn.addEventListener('click', () => selecionarItem(btn));
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    falar(`Complete a sequência de ${tipo.nome}`);
}

function selecionarItem(botao) {
    if (concluido) return;

    const itemEscolhido = botao.dataset.item;

    if (itemEscolhido === respostaCorreta) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct');

        const slot = document.getElementById('missing-slot');
        if (slot) {
            slot.textContent = respostaCorreta;
            slot.classList.remove('missing');
            slot.classList.add('filled');
        }

        elementos.feedback.textContent = '🎉 Muito bem! Você completou a sequência!';
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar('Muito bem! Você completou a sequência');
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong');
        setTimeout(() => botao.classList.remove('wrong'), 500);
        elementos.feedback.textContent = 'Tente outro item! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outro item');
        playError();
    }
}

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

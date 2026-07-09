const objetos = [
    { emoji: '🍎', nome: 'maçãs' },
    { emoji: '🍌', nome: 'bananas' },
    { emoji: '🚗', nome: 'carrinhos' },
    { emoji: '⭐', nome: 'estrelas' },
    { emoji: '🐶', nome: 'cachorrinhos' },
    { emoji: '🌸', nome: 'flores' },
    { emoji: '🎈', nome: 'balões' },
    { emoji: '🧸', nome: 'ursos' },
    { emoji: '🍪', nome: 'biscoitos' },
    { emoji: '🐱', nome: 'gatinhos' }
];

let objetoAtual = null;
let quantidadeAtual = 0;
let concluido = false;
let pontos = 0;

const elementos = {
    display: document.getElementById('objects-display'),
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
    objetoAtual = objetos[Math.floor(Math.random() * objetos.length)];
    quantidadeAtual = Math.floor(Math.random() * 9) + 1;

    elementos.display.innerHTML = '';
    for (let i = 0; i < quantidadeAtual; i++) {
        const span = document.createElement('span');
        span.textContent = objetoAtual.emoji;
        span.className = 'object-item';
        elementos.display.appendChild(span);
    }

    const opcoes = [quantidadeAtual];
    while (opcoes.length < 4) {
        const num = Math.floor(Math.random() * 10) + 1;
        if (!opcoes.includes(num)) {
            opcoes.push(num);
        }
    }

    elementos.options.innerHTML = '';
    embaralhar(opcoes).forEach(num => {
        const btn = document.createElement('button');
        btn.textContent = num;
        btn.className = 'count-option';
        btn.dataset.numero = num;
        btn.addEventListener('click', () => selecionarNumero(btn));
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    falar(`Quantos ${objetoAtual.nome} você vê?`);
}

function selecionarNumero(botao) {
    if (concluido) return;

    const numeroEscolhido = parseInt(botao.dataset.numero, 10);

    if (numeroEscolhido === quantidadeAtual) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct');
        elementos.feedback.textContent = `🎉 Muito bem! São ${quantidadeAtual} ${objetoAtual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar(`Muito bem! São ${quantidadeAtual} ${objetoAtual.nome}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong');
        setTimeout(() => botao.classList.remove('wrong'), 500);
        elementos.feedback.textContent = 'Tente outro número! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outro número');
        playError();
    }
}

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

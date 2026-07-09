const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let letraAtual = '';
let modoAtual = 'maiuscula'; // 'maiuscula' ou 'minuscula'
let concluido = false;
let pontos = 0;

const elementos = {
    target: document.getElementById('target-letter'),
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
    letraAtual = letras[Math.floor(Math.random() * letras.length)];
    modoAtual = Math.random() > 0.5 ? 'maiuscula' : 'minuscula';

    if (modoAtual === 'maiuscula') {
        elementos.target.innerHTML = `<span class="big-letter">${letraAtual}</span><span class="letter-label">Qual é a minúscula?</span>`;
        falar(`A letra ${letraAtual.toLowerCase()}. Qual é a minúscula?`);
    } else {
        elementos.target.innerHTML = `<span class="big-letter">${letraAtual.toLowerCase()}</span><span class="letter-label">Qual é a maiúscula?</span>`;
        falar(`A letra ${letraAtual.toLowerCase()}. Qual é a maiúscula?`);
    }

    const opcoes = [letraAtual];
    while (opcoes.length < 4) {
        const letra = letras[Math.floor(Math.random() * letras.length)];
        if (!opcoes.includes(letra)) {
            opcoes.push(letra);
        }
    }

    elementos.options.innerHTML = '';
    embaralhar(opcoes).forEach(letra => {
        const btn = document.createElement('button');
        btn.className = 'case-option';
        btn.textContent = modoAtual === 'maiuscula' ? letra.toLowerCase() : letra;
        btn.dataset.letra = letra;
        btn.addEventListener('click', () => selecionarLetra(btn));
        elementos.options.appendChild(btn);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
}

function selecionarLetra(botao) {
    if (concluido) return;

    const letraEscolhida = botao.dataset.letra;

    if (letraEscolhida === letraAtual) {
        concluido = true;
        pontos += 10;
        botao.classList.add('correct');
        const correspondente = modoAtual === 'maiuscula' ? letraAtual.toLowerCase() : letraAtual;
        const tipo = modoAtual === 'maiuscula' ? 'minúscula' : 'maiúscula';
        elementos.feedback.textContent = `🎉 Muito bem! ${letraAtual}${letraAtual.toLowerCase()} — ${tipo} é ${correspondente}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        falar(`Muito bem! A ${tipo} é ${correspondente}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        botao.classList.add('wrong');
        setTimeout(() => botao.classList.remove('wrong'), 500);
        elementos.feedback.textContent = 'Tente outra letra! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Tente outra letra');
        playError();
    }
}

elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

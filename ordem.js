const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let letrasDesafio = [];
let letrasSelecionadas = [];
let concluido = false;
let pontos = 0;

const elementos = {
    pool: document.getElementById('letters-pool'),
    slots: document.getElementById('answer-slots'),
    feedback: document.getElementById('feedback'),
    btnClear: document.getElementById('btn-clear'),
    btnCheck: document.getElementById('btn-check'),
    btnNext: document.getElementById('btn-next'),
    starsCount: document.getElementById('stars-count')
};

function atualizarEstrelas() {
    const estrelas = carregarEstrelas();
    elementos.starsCount.textContent = estrelas;
}

}

function gerarDesafio() {
    concluido = false;
    letrasSelecionadas = [];

    const inicio = Math.floor(Math.random() * (alfabeto.length - 4));
    letrasDesafio = alfabeto.slice(inicio, inicio + 4);

    elementos.pool.innerHTML = '';
    embaralhar(letrasDesafio).forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.className = 'order-letter';
        btn.dataset.letra = letra;
        btn.addEventListener('click', () => selecionarLetra(btn));
        elementos.pool.appendChild(btn);
    });

    elementos.slots.innerHTML = '';
    letrasDesafio.forEach(() => {
        const slot = document.createElement('div');
        slot.className = 'order-slot';
        elementos.slots.appendChild(slot);
    });

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.btnCheck.disabled = false;

    falar('Coloque as letras em ordem alfabética');
}

function selecionarLetra(botao) {
    if (concluido) return;
    if (botao.classList.contains('used')) return;
    if (letrasSelecionadas.length >= letrasDesafio.length) return;

    const letra = botao.dataset.letra;
    letrasSelecionadas.push(letra);
    botao.classList.add('used');

    const slots = elementos.slots.querySelectorAll('.order-slot');
    slots[letrasSelecionadas.length - 1].textContent = letra;
    slots[letrasSelecionadas.length - 1].classList.add('filled');

    falar(letra);
}

function verificar() {
    if (concluido) return;
    if (letrasSelecionadas.length < letrasDesafio.length) {
        elementos.feedback.textContent = 'Complete todas as letras! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Complete todas as letras');
        return;
    }

    const ordemCorreta = letrasDesafio.join('');
    const ordemEscolhida = letrasSelecionadas.join('');

    if (ordemEscolhida === ordemCorreta) {
        concluido = true;
        pontos += 10;
        elementos.feedback.textContent = `🎉 Muito bem! ${ordemCorreta}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        elementos.btnCheck.disabled = true;
        falar(`Muito bem! ${ordemCorreta}`);
        playSuccess();
        adicionarEstrelas(1);
        atualizarEstrelas();
    } else {
        elementos.feedback.textContent = 'Ordem incorreta! Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        falar('Ordem incorreta. Tente de novo');
        playError();
    }
}

function limpar() {
    if (concluido) return;
    letrasSelecionadas = [];
    const botoes = elementos.pool.querySelectorAll('.order-letter');
    botoes.forEach(btn => btn.classList.remove('used'));
    const slots = elementos.slots.querySelectorAll('.order-slot');
    slots.forEach(slot => {
        slot.textContent = '';
        slot.classList.remove('filled');
    });
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

elementos.btnCheck.addEventListener('click', verificar);
elementos.btnClear.addEventListener('click', limpar);
elementos.btnNext.addEventListener('click', gerarDesafio);

atualizarEstrelas();
gerarDesafio();

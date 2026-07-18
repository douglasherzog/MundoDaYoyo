const sequencias = [
    { nome: 'árvore crescendo', ordem: ['','',''], explicacao: 'A semente vira árvore e dá frutos!' },
    { nome: 'borboleta',        ordem: ['','',''], explicacao: 'O ovo vira lagarta e depois borboleta!' },
    { nome: 'dia e noite',      ordem: ['','',''], explicacao: 'Amanhece, faz sol e depois anoitece!' },
    { nome: 'tempo',            ordem: ['','',''], explicacao: 'Bebê vira criança e depois adulta!' },
    { nome: 'chuva',            ordem: ['','',''], explicacao: 'Nuvem chove e depois aparece o arco-íris!' },
    { nome: 'comida',           ordem: ['','',''], explicacao: 'Milho vira pipoca e a Yoyo come!' },
    { nome: 'casa',             ordem: ['','',''], explicacao: 'Tijolos viram casa e depois lar doce lar!' },
    { nome: 'neve',             ordem: ['','',''], explicacao: 'Nuvem traz neve e depois faz boneco!' },
    { nome: 'pão',              ordem: ['','',''], explicacao: 'Trigo vira pão e depois sanduíche!' },
    { nome: 'flor',             ordem: ['','',''], explicacao: 'Broto vira flor e depois murcha!' }
];

const elementos = {
    dica: document.getElementById('dica'),
    slots: document.getElementById('slots'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0, pontos = 0, atual = null, concluido = false, slotAtual = 0, opcoesRestantes = [];

function carregarRodada() {
    if (round >= 10) { vitoria(); return; }
    round++;
    atual = sequencias[Math.floor(Math.random() * sequencias.length)];
    concluido = false;
    slotAtual = 0;
    opcoesRestantes = embaralhar(atual.ordem.slice());

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.dica.textContent = 'Clique na figura que vem primeiro!';

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    elementos.slots.innerHTML = '';
    for (var i = 0; i < atual.ordem.length; i++) {
        var slot = document.createElement('div');
        slot.className = 'seq-slot';
        if (i === 0) slot.classList.add('destacado');
        slot.dataset.index = i;
        elementos.slots.appendChild(slot);
    }

    elementos.opcoes.innerHTML = '';
    opcoesRestantes.forEach(function(emoji, idx) {
        var btn = document.createElement('div');
        btn.className = 'seq-opcao game-option';
        btn.style.fontSize = '3rem';
        btn.textContent = emoji;
        btn.dataset.emoji = emoji;
        btn.dataset.idx = idx;
        btn.addEventListener('click', function() { escolher(btn, emoji); });
        elementos.opcoes.appendChild(btn);
    });

    setTimeout(function() { falar('Clique na figura que vem primeiro!'); }, 300);
}

function escolher(btn, emoji) {
    if (concluido) return;

    var slots = elementos.slots.querySelectorAll('.seq-slot');
    var slot = slots[slotAtual];
    slot.textContent = emoji;
    slot.classList.add('preenchido');
    slot.classList.remove('destacado');
    btn.classList.add('used');
    btn.style.opacity = '0.3';
    btn.style.pointerEvents = 'none';

    if (emoji === atual.ordem[slotAtual]) {
        slot.style.borderColor = '#5BB870';
        playSuccess();
    } else {
        slot.style.borderColor = '#FF4444';
        playError();
        elementos.feedback.textContent = 'Ops! Tente a próxima! ';
        elementos.feedback.className = 'feedback error';
    }

    slotAtual++;

    if (slotAtual < atual.ordem.length) {
        slots[slotAtual].classList.add('destacado');
        falar('Agora o que vem depois!');
    } else {
        var todosCorretos = atual.ordem.every(function(emoji, i) { return slots[i].textContent === emoji; });
        if (todosCorretos) {
            concluido = true;
            pontos += 10;
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = ' ' + atual.explicacao;
            elementos.feedback.className = 'feedback success';
            falar('Muito bem! ' + atual.explicacao);
            setTimeout(carregarRodada, 2000);
        } else {
            elementos.feedback.textContent = 'Quase! Vamos tentar de novo!';
            elementos.feedback.className = 'feedback error';
            setTimeout(carregarRodada, 2000);
        }
    }
}

function vitoria() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.opcoes.innerHTML = '';
    elementos.slots.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; elementos.pontos.textContent = 0; carregarRodada(); });
    elementos.opcoes.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() { falar('Clique na figura que vem primeiro!'); });
carregarRodada();
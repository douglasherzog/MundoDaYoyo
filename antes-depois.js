const sequencias = [
    { nome: 'árvore crescendo', ordem: ['🌱','🌳','🍎'], explicacao: 'A semente vira árvore e dá frutos!' },
    { nome: 'borboleta',        ordem: ['🥚','🐛','🦋'], explicacao: 'O ovo vira lagarta e depois borboleta!' },
    { nome: 'dia e noite',      ordem: ['🌅','☀️','🌙'], explicacao: 'Amanhece, faz sol e depois anoitece!' },
    { nome: 'tempo',            ordem: ['👶','👧','👩'], explicacao: 'Bebê vira criança e depois adulta!' },
    { nome: 'chuva',            ordem: ['☁️','🌧️','🌈'], explicacao: 'Nuvem chove e depois aparece o arco-íris!' },
    { nome: 'comida',           ordem: ['🌽','🍿','😋'], explicacao: 'Milho vira pipoca e a Yoyo come!' },
    { nome: 'casa',             ordem: ['🧱','🏠','🏡'], explicacao: 'Tijolos viram casa e depois lar doce lar!' },
    { nome: 'neve',             ordem: ['☁️','❄️','⛄'], explicacao: 'Nuvem traz neve e depois faz boneco!' },
    { nome: 'pão',              ordem: ['🌾','🍞','🥪'], explicacao: 'Trigo vira pão e depois sanduíche!' },
    { nome: 'flor',             ordem: ['🌱','🌷',' wilt'], explicacao: 'Broto vira flor e depois murcha!' },
];

let atual = null;
let pontos = 0;
let concluido = false;
let slotAtual = 0;
let opcoesRestantes = [];

const elementos = {
    dica: document.getElementById('dica'),
    slots: document.getElementById('slots'),
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
        msg.rate = 0.85;
        window.speechSynthesis.speak(msg);
    }
}

function carregarRodada() {
    atual = sequencias[Math.floor(Math.random() * sequencias.length)];
    concluido = false;
    slotAtual = 0;
    opcoesRestantes = embaralhar([...atual.ordem]);

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.dica.textContent = 'Clique na figura que vem primeiro!';

    // Cria slots vazios
    elementos.slots.innerHTML = '';
    for (let i = 0; i < atual.ordem.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'seq-slot';
        if (i === 0) slot.classList.add('destacado');
        slot.dataset.index = i;
        elementos.slots.appendChild(slot);
    }

    // Cria opções embaralhadas
    elementos.opcoes.innerHTML = '';
    opcoesRestantes.forEach((emoji, idx) => {
        const btn = document.createElement('div');
        btn.className = 'seq-opcao';
        btn.textContent = emoji;
        btn.dataset.emoji = emoji;
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => escolher(btn, emoji));
        elementos.opcoes.appendChild(btn);
    });

    falar('Clique na figura que vem primeiro!');
}

function escolher(btn, emoji) {
    if (concluido) return;

    // Preenche o slot atual
    const slots = elementos.slots.querySelectorAll('.seq-slot');
    const slot = slots[slotAtual];
    slot.textContent = emoji;
    slot.classList.add('preenchido');
    slot.classList.remove('destacado');

    // Marca opção como usada
    btn.classList.add('usada');

    // Verifica se está correta
    if (emoji === atual.ordem[slotAtual]) {
        slot.style.borderColor = '#5BB870';
        playSuccess();
    } else {
        slot.style.borderColor = '#FF4444';
        playError();
        elementos.feedback.textContent = 'Ops! Tente a próxima! 💪';
        elementos.feedback.className = 'feedback error';
    }

    slotAtual++;

    if (slotAtual < atual.ordem.length) {
        slots[slotAtual].classList.add('destacado');
        falar(`Agora o que vem depois!`);
    } else {
        // Verifica se todos estão corretos
        const todosCorretos = atual.ordem.every((emoji, i) => slots[i].textContent === emoji);
        if (todosCorretos) {
            concluido = true;
            pontos += 10;
            elementos.pontos.textContent = pontos;
            elementos.feedback.textContent = `🎉 ${atual.explicacao}`;
            elementos.feedback.className = 'feedback success';
            elementos.btnNext.disabled = false;
            falar(`Muito bem! ${atual.explicacao}`);
        } else {
            // Reset para tentar de novo
            elementos.feedback.textContent = 'Quase! Vamos tentar de novo!';
            elementos.feedback.className = 'feedback error';
            setTimeout(() => carregarRodada(), 2000);
        }
    }
}

elementos.btnSpeak.addEventListener('click', () => falar('Clique na figura que vem primeiro!'));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();

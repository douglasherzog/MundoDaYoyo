// MEU AMIGO JESUS - Jornada interativa do evangelho

const FASES = [
    {
        id: 'nascimento',
        numero: 1,
        emoji: '⭐',
        titulo: 'JESUS NASCE',
        fala: 'Yoyo, eu nasci em Belém! Uma estrela brilhante me mostrou para os Reis Magos! ✨',
        instrucao: 'Toque na estrela para guiar os Reis Magos!',
        cenario: 'nascimento',
        acao: 'clicar-estrela',
        medalha: 'amigo_jesus',
        som: 'Brilha brilha estrelinha!'
    },
    {
        id: 'batismo',
        numero: 2,
        emoji: '💧',
        titulo: 'JESUS E BATIZADO',
        fala: 'João me batizou no rio! O Espírito Santo desceu como uma pomba! 🕊️',
        instrucao: 'Toque em Jesus para mergulhar no rio!',
        cenario: 'batismo',
        acao: 'clicar-jesus',
        medalha: 'batismo',
        som: 'Glória a Deus!'
    },
    {
        id: 'deserto',
        numero: 3,
        emoji: '🪨',
        titulo: 'JESUS NO DESERTO',
        fala: 'No deserto, o mal me ofereceu comida, mas eu escolhi obedecer a Deus! 📖',
        instrucao: 'Escolha: comida ou Bíblia?',
        cenario: 'deserto',
        acao: 'escolha',
        medalha: 'obediente',
        som: 'Eu escolho Deus!'
    },
    {
        id: 'pescadores',
        numero: 4,
        emoji: '🎣',
        titulo: 'PESCADORES DE HOMENS',
        fala: 'Eu chamei meus amigos pescadores: Pedro, André, Tiago e João! Venham comigo! 🎣',
        instrucao: 'Toque nos pescadores para eles seguirem Jesus!',
        cenario: 'pescadores',
        acao: 'clicar-pescadores',
        medalha: 'discipulo',
        som: 'Vamos seguir Jesus!'
    }
];

const MEDALHAS = [
    { id: 'amigo_jesus', nome: 'AMIGO JESUS', emoji: '✝️' },
    { id: 'batismo', nome: 'BATIZADO', emoji: '💧' },
    { id: 'obediente', nome: 'OBEDIENTE', emoji: '📖' },
    { id: 'discipulo', nome: 'DISCIPULO', emoji: '🎣' },
    { id: 'milagre', nome: 'MILAGRE', emoji: '✨' },
    { id: 'compaixao', nome: 'AMOR', emoji: '💖' },
    { id: 'fe', nome: 'FE', emoji: '🌊' },
    { id: 'ressurreicao', nome: 'RESSURREICAO', emoji: '🌅' },
];

let estado = {
    faseIndex: 0,
    estrelas: 0,
    medalhas: []
};

function carregarEstado() {
    try {
        const salvo = localStorage.getItem('mundodayoyo-jesus');
        if (salvo) return JSON.parse(salvo);
    } catch (e) { console.log('Erro ao carregar', e); }
    return estado;
}

function salvarEstado() {
    localStorage.setItem('mundodayoyo-jesus', JSON.stringify(estado));
}

function atualizarTela() {
    const fase = FASES[estado.faseIndex];
    if (!fase) return;

    document.getElementById('phase-badge').textContent = 'FASE ' + fase.numero;
    document.getElementById('stars-count').textContent = estado.estrelas;

    document.getElementById('phase-emoji').textContent = fase.emoji;
    document.getElementById('phase-title').textContent = fase.titulo;
    document.getElementById('phase-instruction').textContent = fase.instrucao;

    document.getElementById('speech-bubble').textContent = fase.fala;
    falar(fase.fala);

    renderizarCenario(fase);
    atualizarBotoes(fase);
    atualizarProgresso();
    atualizarMedalhas();
}

function renderizarCenario(fase) {
    const bg = document.getElementById('scene-background');
    const content = document.getElementById('scene-content');
    bg.className = 'scene-background ' + fase.cenario;
    content.innerHTML = '';

    switch (fase.cenario) {
        case 'nascimento':
            content.innerHTML = `
                <div class="angel">👼</div>
                <div class="stable">⛺</div>
                <div class="star-of-bethlehem interactive-element" id="star-bethlehem">⭐</div>
                <div class="jesus-figure" style="position:absolute; bottom:5%; font-size:3rem;">👶</div>
            `;
            setTimeout(() => {
                const star = document.getElementById('star-bethlehem');
                if (star) star.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'batismo':
            content.innerHTML = `
                <div class="river"></div>
                <div class="dove" id="dove">🕊️</div>
                <div class="jesus-in-river interactive-element" id="jesus-river">🙏</div>
                <div style="position:absolute; top:10px; right:20px; font-size:2.5rem;">👨</div>
            `;
            setTimeout(() => {
                const jesus = document.getElementById('jesus-river');
                if (jesus) jesus.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'deserto':
            content.innerHTML = `
                <div class="desert-rock"></div>
                <div class="jesus-in-desert">🙏</div>
                <div class="temptation-choice" id="desert-choice">
                    <div class="food-temptation">🍞</div>
                    <div class="bible-choice interactive-element" id="bible">📖</div>
                </div>
            `;
            setTimeout(() => {
                const bible = document.getElementById('bible');
                if (bible) bible.addEventListener('click', () => executarAcaoFase(fase));
            }, 100);
            break;

        case 'pescadores':
            content.innerHTML = `
                <div class="river" style="height:45%;"></div>
                <div class="boat interactive-element" id="boat">🛶</div>
                <div class="fisherman" style="left:25%;" id="p1">🧑‍🦱</div>
                <div class="fisherman" style="right:25%;" id="p2">🧑</div>
                <div class="fisherman" style="left:40%; bottom:50%;" id="p3">👨</div>
                <div class="fisherman" style="right:40%; bottom:50%;" id="p4">👦</div>
                <div class="fish" style="left:20%;">🐟</div>
                <div class="fish" style="right:20%; animation-delay:1s;">🐠</div>
            `;
            setTimeout(() => {
                ['p1', 'p2', 'p3', 'p4', 'boat'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('click', () => executarAcaoFase(fase));
                });
            }, 100);
            break;
    }
}

function executarAcaoFase(fase) {
    if (fase.acao === 'clicar-jesus') {
        const dove = document.getElementById('dove');
        if (dove) dove.classList.add('show');
    }

    if (fase.acao === 'clicar-pescadores') {
        document.querySelectorAll('.fisherman').forEach((p, i) => {
            setTimeout(() => {
                p.style.transform = 'scale(1.3) translateY(-20px)';
                p.textContent = '🙋';
            }, i * 200);
        });
    }

    ganharEstrela();
    desbloquearMedalha(fase.medalha);
    animarCoracoes();

    // Fala especial da ação
    if (fase.som) {
        setTimeout(() => falar(fase.som), 500);
    }

    // Mudar botão para próximo
    atualizarBotoes(fase, true);
}

function atualizarBotoes(fase, acaoFeita = false) {
    const container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    if (fase.acao === 'escolha' && !acaoFeita) {
        const btn = document.createElement('button');
        btn.className = 'big-action-btn choice-btn yes';
        btn.innerHTML = '<span class="btn-emoji">📖</span><span class="btn-text">BIBLIA</span>';
        btn.addEventListener('click', () => {
            falar('Bíblia');
            executarAcaoFase(fase);
        });
        container.appendChild(btn);

        const btnNo = document.createElement('button');
        btnNo.className = 'big-action-btn choice-btn no';
        btnNo.innerHTML = '<span class="btn-emoji">🍞</span><span class="btn-text">COMIDA</span>';
        btnNo.addEventListener('click', () => {
            falar('Comida');
            document.getElementById('speech-bubble').textContent = 'Yoyo, Jesus escolheu obedecer a Deus, não a comida! Tente de novo! 📖';
            falar('Tente de novo! Escolha a Bíblia!');
        });
        container.appendChild(btnNo);
        return;
    }

    const btn = document.createElement('button');
    btn.className = 'big-action-btn';
    btn.id = 'btn-next';
    btn.dataset.speak = 'Próximo';
    btn.innerHTML = `
        <span class="btn-emoji">${acaoFeita ? '▶️' : '✨'}</span>
        <span class="btn-text">${acaoFeita ? 'PRÓXIMO' : 'FAZER AÇÃO'}</span>
    `;

    if (acaoFeita) {
        btn.addEventListener('click', avancarFase);
    } else {
        btn.addEventListener('click', () => {
            falar('Toque na tela!');
            document.getElementById('phase-instruction').textContent = 'Toque no elemento brilhante!';
        });
    }
    container.appendChild(btn);
}

function avancarFase() {
    falar('Próximo');
    if (estado.faseIndex < FASES.length - 1) {
        estado.faseIndex++;
        salvarEstado();
        atualizarTela();
    } else {
        falar('Parabéns Yoyo! Você aprendeu muito com Jesus!');
        document.getElementById('speech-bubble').textContent = 'Parabéns, Yoyo! Você é amiga de Jesus! Em breve teremos mais fases! ✨';
        document.getElementById('phase-buttons').innerHTML = `
            <button class="big-action-btn" onclick="location.reload()">
                <span class="btn-emoji">🔄</span>
                <span class="btn-text">JOGAR DE NOVO</span>
            </button>
        `;
    }
}

function ganharEstrela() {
    estado.estrelas++;
    salvarEstado();
}

function desbloquearMedalha(id) {
    if (!estado.medalhas.includes(id)) {
        estado.medalhas.push(id);
        const medalha = MEDALHAS.find(m => m.id === id);
        if (medalha) {
            setTimeout(() => falar('Nova medalha: ' + medalha.nome), 1000);
        }
        salvarEstado();
        atualizarMedalhas();
    }
}

function atualizarMedalhas() {
    const grid = document.getElementById('medals-grid');
    grid.innerHTML = '';

    MEDALHAS.forEach(m => {
        const desbloqueada = estado.medalhas.includes(m.id);
        const div = document.createElement('div');
        div.className = 'medal' + (desbloqueada ? ' unlocked' : '');
        div.innerHTML = `
            <span class="medal-emoji">${m.emoji}</span>
            <span class="medal-name">${m.nome}</span>
        `;
        div.addEventListener('click', () => {
            if (desbloqueada) {
                falar(m.nome + '! Você ganhou!');
            } else {
                falar(m.nome);
            }
        });
        grid.appendChild(div);
    });
}

function atualizarProgresso() {
    const fase = FASES[estado.faseIndex];
    document.querySelectorAll('.story-dot').forEach((dot, idx) => {
        dot.classList.remove('active', 'completed');
        if (idx === estado.faseIndex) dot.classList.add('active');
        if (idx < estado.faseIndex) dot.classList.add('completed');
    });
}

function animarCoracoes() {
    const container = document.getElementById('scene-card');
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-pop';
        heart.textContent = ['💖', '💛', '✨'][i];
        heart.style.left = (25 + i * 25) + '%';
        heart.style.top = (20 + Math.random() * 20) + '%';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
}

// Inicialização
estado = carregarEstado();

setTimeout(() => {
    document.querySelectorAll('.story-dot').forEach(dot => {
        dot.addEventListener('click', () => falar(dot.dataset.speak));
    });
}, 100);

atualizarTela();

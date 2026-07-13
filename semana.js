// A SEMANA DA YOYO - Rotina familiar e obediência

// Personagens da família (genéricos, serão personalizados depois)
const PERSONAGENS = {
    papai: { nome: 'PAPAI DOUGLAS', emoji: '👨', cor: '#42A5F5' },
    mamae: { nome: 'MAMÃE TAMARA', emoji: '👩', cor: '#EC407A' },
    yoyo: { nome: 'YOYO', emoji: '👧', cor: '#FFD54F' },
    elyah: { nome: 'MANINHO ELYAH', emoji: '👶', cor: '#66BB6A' },
    vovoMaria: { nome: 'VOVÓ MARIA', emoji: '👵', cor: '#FF8A65' },
    vovoUrsi: { nome: 'VOVÓ URSI', emoji: '👵', cor: '#AB47BC' },
    tiaAline: { nome: 'TIA ALINE', emoji: '👩', cor: '#EF5350' },
    primoHumberto: { nome: 'PRIMO HUMBERTO', emoji: '👦', cor: '#FFA726' },
    tiaTati: { nome: 'TIA TATI', emoji: '👩', cor: '#26C6DA' },
    tioElton: { nome: 'TIO ELTON', emoji: '👨', cor: '#5C6BC0' },
    primaEsther: { nome: 'PRIMA ESTHER', emoji: '👧', cor: '#F48FB1' },
    primoIsaias: { nome: 'PRIMO ISAIAS', emoji: '👦', cor: '#8D6E63' },
    frida: { nome: 'GATA FRIDA', emoji: '🐈‍⬛', cor: '#333' },
};

// Medalhas especiais
const MEDALHAS = [
    { id: 'obediente', nome: 'OBEDIENTE', emoji: '💜' },
    { id: 'nao_atrassei', nome: 'NAO ATRASEI', emoji: '⏰' },
    { id: 'irma_carinho', nome: 'IRMA CARINHOSA', emoji: '🥰' },
    { id: 'dente_brilhante', nome: 'DENTES LIMPOS', emoji: '🦷' },
    { id: 'escolinha', nome: 'ESCOLINHA', emoji: '🎒' },
    { id: 'fim_de_semana', nome: 'FIM DE SEMANA', emoji: '🎉' },
    { id: 'familia', nome: 'MINHA FAMILIA', emoji: '👨‍👩‍👧‍👦' },
    { id: 'lavanderia', nome: 'LAVANDERIA', emoji: '🫧' },
];

// Fases da segunda-feira
const ROTINA_SEGUNDA = [
    {
        id: 'acordar',
        emoji: '🌅',
        titulo: 'ACORDAR',
        hora: '07:30',
        personagem: 'mamae',
        fala: 'Bom dia, Yoyo! Hoje é segunda-feira. Vamos acordar! ☀️',
        instrucao: 'Aperta PRÓXIMO para levantar da cama.',
        proximo: 'xixi'
    },
    {
        id: 'xixi',
        emoji: '🚽',
        titulo: 'FAZER XIXI',
        hora: '07:45',
        personagem: 'yoyo',
        fala: 'Yoyo, vamos fazer xixi no banheiro! 🚽',
        instrucao: 'Aperta PRÓXIMO quando fizer xixi.',
        proximo: 'dentes'
    },
    {
        id: 'dentes',
        emoji: '🪥',
        titulo: 'ESCOLVER DENTES',
        hora: '08:00',
        personagem: 'mamae',
        fala: 'Escova os dentes, Yoyo! Ficam branquinhos! ✨',
        instrucao: 'Aperta PRÓXIMO depois de escovar.',
        proximo: 'cafe'
    },
    {
        id: 'cafe',
        emoji: '🥐',
        titulo: 'CAFE DA MANHA',
        hora: '08:15',
        personagem: 'papai',
        fala: 'Hora do café da manhã! Comida boa! 🥐',
        instrucao: 'Aperta PRÓXIMO depois do café.',
        proximo: 'brincar'
    },
    {
        id: 'brincar',
        emoji: '🧸',
        titulo: 'BRINCAR',
        hora: '09:00',
        personagem: 'elyah',
        fala: 'Yoyo, brinca com o Maninho Elyah! Ele te ama! 🥰',
        instrucao: 'Aperta PRÓXIMO quando brincar com o Elyah.',
        proximo: 'almoco'
    },
    {
        id: 'almoco',
        emoji: '🍚',
        titulo: 'ALMOCO',
        hora: '12:00',
        personagem: 'mamae',
        fala: 'Almoço na mesa! Depois tem escolinha! 🍚',
        instrucao: 'Aperta PRÓXIMO depois de almoçar.',
        proximo: 'escolha_almoco'
    },
    {
        id: 'escolha_almoco',
        emoji: '⏰',
        titulo: 'CUIDADO!',
        hora: '12:30',
        personagem: 'mamae',
        fala: 'Yoyo, a escolinha começa às 13h. Depois das 13:30 não pode entrar! Vamos nos arrumar? ⏰',
        instrucao: 'Escolha:',
        tipo: 'escolha',
        escolhas: [
            { texto: 'ARRUMAR MOCHILA', emoji: '🎒', proximo: 'mochila', correta: true },
            { texto: 'BRINCAR MAIS', emoji: '🧸', proximo: 'atraso', correta: false }
        ]
    },
    {
        id: 'mochila',
        emoji: '🎒',
        titulo: 'MOCHILA',
        hora: '12:45',
        personagem: 'yoyo',
        fala: 'Mochila arrumada! Yoyo é obediente! 🎒',
        instrucao: 'Aperta PRÓXIMO para ir pra escolinha.',
        proximo: 'escola',
        estrelaExtra: true
    },
    {
        id: 'atraso',
        emoji: '😰',
        titulo: 'AI NAO!',
        hora: '13:20',
        personagem: 'mamae',
        fala: 'Yoyo, você brincou demais! Agora a gente precisa correr! 🏃‍♀️',
        instrucao: 'Aperta PRÓXIMO e não se atrase mais!',
        proximo: 'escola'
    },
    {
        id: 'escola',
        emoji: '🏫',
        titulo: 'ESCOLINHA',
        hora: '13:30',
        personagem: 'papai',
        fala: 'Chegamos na escolinha! Divirta-se, Yoyo! 🏫',
        instrucao: 'Aperta PRÓXIMO quando terminar a escolinha.',
        proximo: 'buscar'
    },
    {
        id: 'buscar',
        emoji: '🚗',
        titulo: 'PAPAI BUSCA',
        hora: '17:30',
        personagem: 'papai',
        fala: 'Papai Douglas veio buscar Yoyo! 🚗',
        instrucao: 'Aperta PRÓXIMO para ir pra casa.',
        proximo: 'lanche'
    },
    {
        id: 'lanche',
        emoji: '🍎',
        titulo: 'LANCHE',
        hora: '18:00',
        personagem: 'elyah',
        fala: 'Lanche em casa! Yoyo é carinhosa com Elyah? 🥰',
        instrucao: 'Aperta PRÓXIMO depois do lanche.',
        proximo: 'banho'
    },
    {
        id: 'banho',
        emoji: '🛁',
        titulo: 'BANHO',
        hora: '18:30',
        personagem: 'mamae',
        fala: 'Hora do banho! Fica cheirosa! 🛁',
        instrucao: 'Aperta PRÓXIMO depois do banho.',
        proximo: 'janta'
    },
    {
        id: 'janta',
        emoji: '🌙',
        titulo: 'JANTA',
        hora: '19:30',
        personagem: 'mamae',
        fala: 'Janta gostosa! 🌙',
        instrucao: 'Aperta PRÓXIMO depois de jantar.',
        proximo: 'dentes_noite'
    },
    {
        id: 'dentes_noite',
        emoji: '🪥',
        titulo: 'DENTES DE NOITE',
        hora: '20:30',
        personagem: 'yoyo',
        fala: 'De novo escovar os dentes! Dentes brilhando! ✨',
        instrucao: 'Aperta PRÓXIMO depois de escovar.',
        proximo: 'dormir'
    },
    {
        id: 'dormir',
        emoji: '😴',
        titulo: 'DORMIR',
        hora: '21:00',
        personagem: 'mamae',
        fala: 'Boa noite, Yoyo! Mamãe te ama! Obedeça papai e mamãe, eles sabem o que é melhor! 😴💜',
        instrucao: 'Aperta PRÓXIMO para dormir. Segunda-feira acabou!',
        proximo: 'fim_dia'
    }
];

// Estado do jogo
let estado = {
    dia: 'seg',
    faseIndex: 0,
    estrelas: 0,
    medalhas: []
};

// Carregar estado do localStorage
function carregarEstado() {
    try {
        const salvo = localStorage.getItem('mundodayoyo-semana');
        if (salvo) return JSON.parse(salvo);
    } catch (e) { console.log('Erro ao carregar estado', e); }
    return estado;
}

function salvarEstado() {
    localStorage.setItem('mundodayoyo-semana', JSON.stringify(estado));
}

// Atualizar tela
function atualizarTela() {
    const fase = ROTINA_SEGUNDA[estado.faseIndex];
    if (!fase) return;

    // Badge do dia
    document.getElementById('day-badge').textContent = 'SEGUNDA-FEIRA';
    document.getElementById('day-badge').dataset.speak = 'Segunda-feira';

    // Hora
    document.getElementById('time-display').textContent = fase.hora;
    document.getElementById('time-display').dataset.speak = fase.hora;

    // Estrelas
    document.getElementById('stars-count').textContent = estado.estrelas;

    // Fase
    document.getElementById('phase-emoji').textContent = fase.emoji;
    document.getElementById('phase-title').textContent = fase.titulo;
    document.getElementById('phase-instruction').textContent = fase.instrucao;

    // Fala
    const falaEl = document.getElementById('speech-bubble');
    falaEl.textContent = fase.fala;
    falar(fase.fala);

    // Personagens
    mostrarPersonagens(fase.personagem);

    // Botões
    atualizarBotoes(fase);

    // Atualizar medalhas
    atualizarMedalhas();

    // Marcar dia ativo
    document.querySelectorAll('.day-dot').forEach(d => {
        d.classList.remove('active');
        if (d.dataset.day === estado.dia) d.classList.add('active');
    });
}

function mostrarPersonagens(personagemPrincipal) {
    const row = document.getElementById('characters-row');
    row.innerHTML = '';

    const personagensDoDia = ['papai', 'mamae', 'yoyo', 'elyah', 'vovoMaria', 'frida'];
    personagensDoDia.forEach(id => {
        const p = PERSONAGENS[id];
        const div = document.createElement('div');
        div.className = 'character' + (id === personagemPrincipal ? ' bounce' : '');
        div.innerHTML = `
            <span class="character-emoji">${p.emoji}</span>
            <span class="character-name">${p.nome}</span>
        `;
        div.addEventListener('click', () => falar(p.nome));
        row.appendChild(div);
    });
}

function atualizarBotoes(fase) {
    const container = document.getElementById('phase-buttons');
    container.innerHTML = '';

    if (fase.tipo === 'escolha') {
        fase.escolhas.forEach(escolha => {
            const btn = document.createElement('button');
            btn.className = 'big-action-btn choice-btn' + (escolha.correta ? ' yes' : ' no');
            btn.innerHTML = `
                <span class="btn-emoji">${escolha.emoji}</span>
                <span class="btn-text">${escolha.texto}</span>
            `;
            btn.addEventListener('click', () => {
                falar(escolha.texto);
                if (escolha.correta) {
                    ganharEstrela();
                    desbloquearMedalha('obediente');
                    animarCoracoes();
                }
                estado.faseIndex = ROTINA_SEGUNDA.findIndex(f => f.id === escolha.proximo);
                salvarEstado();
                atualizarTela();
            });
            container.appendChild(btn);
        });
    } else if (fase.id === 'fim_dia') {
        const btn = document.createElement('button');
        btn.className = 'big-action-btn';
        btn.innerHTML = `
            <span class="btn-emoji">🌟</span>
            <span class="btn-text">ACABOU!</span>
        `;
        btn.addEventListener('click', () => {
            falar('Segunda-feira acabou! Você foi muito boa!');
            desbloquearMedalha('escolinha');
            // Aqui futuramente avança para terça
            alert('🌟 Segunda-feira terminada! Em breve teremos terça-feira!');
        });
        container.appendChild(btn);
    } else {
        const btn = document.createElement('button');
        btn.className = 'big-action-btn';
        btn.id = 'btn-next';
        btn.dataset.speak = 'Próximo';
        btn.innerHTML = `
            <span class="btn-emoji">▶️</span>
            <span class="btn-text">PRÓXIMO</span>
        `;
        btn.addEventListener('click', avancarFase);
        container.appendChild(btn);
    }
}

function avancarFase() {
    const fase = ROTINA_SEGUNDA[estado.faseIndex];

    falar('Próximo');

    // Verifica se fase ganha estrela
    if (fase.id === 'mochila') {
        desbloquearMedalha('nao_atrassei');
    }
    if (fase.id === 'lanche') {
        desbloquearMedalha('irma_carinho');
    }
    if (fase.id === 'dentes' || fase.id === 'dentes_noite') {
        desbloquearMedalha('dente_brilhante');
    }
    if (fase.id === 'escola') {
        desbloquearMedalha('escolinha');
    }
    if (fase.id === 'laundry' || fase.id === 'cafe') {
        desbloquearMedalha('lavanderia');
    }
    if (fase.id === 'brincar' || fase.id === 'lanche') {
        desbloquearMedalha('familia');
    }

    if (fase.estrelaExtra) {
        ganharEstrela();
    }
    ganharEstrela();

    if (fase.proximo === 'fim_dia') {
        estado.faseIndex = ROTINA_SEGUNDA.findIndex(f => f.id === 'fim_dia');
    } else {
        const nextIndex = ROTINA_SEGUNDA.findIndex(f => f.id === fase.proximo);
        estado.faseIndex = nextIndex !== -1 ? nextIndex : estado.faseIndex + 1;
    }

    salvarEstado();
    atualizarTela();
}

function ganharEstrela() {
    estado.estrelas++;
    animarCoracoes();
    salvarEstado();
}

function desbloquearMedalha(id) {
    if (!estado.medalhas.includes(id)) {
        estado.medalhas.push(id);
        const medalha = MEDALHAS.find(m => m.id === id);
        if (medalha) {
            setTimeout(() => {
                falar(`Nova medalha: ${medalha.nome}!`);
            }, 1000);
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

function animarCoracoes() {
    const container = document.getElementById('scene-card');
    const heart = document.createElement('span');
    heart.className = 'heart-pop';
    heart.textContent = '💖';
    heart.style.left = (30 + Math.random() * 40) + '%';
    heart.style.top = '20%';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}

// Inicialização
estado = carregarEstado();

// Eventos nos dias da semana
setTimeout(() => {
    document.querySelectorAll('.day-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            falar(dot.dataset.speak);
        });
    });
}, 100);

atualizarTela();

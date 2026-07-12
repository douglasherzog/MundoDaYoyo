// Tamagotchi de Unicórnio - Mundo da Yoyo
// Estado persistido em localStorage

const STORAGE_KEY = 'mundodayoyo-unicornio';

// Configuração das tarefas diárias
const TAREFAS_DIARIAS = [
    { id: 'cafe', nome: 'Café da manhã', emoji: '☀️', horaInicio: 6, horaFim: 10 },
    { id: 'dentes_manha', nome: 'Escovar dentes (manhã)', emoji: '🪥', horaInicio: 6, horaFim: 11 },
    { id: 'almoco', nome: 'Almoço', emoji: '🍽️', horaInicio: 11, horaFim: 14 },
    { id: 'dentes_almoco', nome: 'Escovar dentes (almoço)', emoji: '🪥', horaInicio: 11, horaFim: 15 },
    { id: 'banho', nome: 'Banho', emoji: '🛁', horaInicio: 16, horaFim: 21 },
    { id: 'janta', nome: 'Janta', emoji: '🌙', horaInicio: 17, horaFim: 21 },
    { id: 'dentes_noite', nome: 'Escovar dentes (noite)', emoji: '🪥', horaInicio: 18, horaFim: 22 },
    { id: 'brincar', nome: 'Brincar', emoji: '🎮', horaInicio: 0, horaFim: 24 },
    { id: 'carinho', nome: 'Carinho', emoji: '💕', horaInicio: 0, horaFim: 24 },
];

// Mensagens do unicórnio por ação
const MENSAGENS = {
    cafe: [
        'Hmmm, que café da manhã delicioso!',
        'Adoro comer frutinhas de manhã!',
        'Obrigada pelo café, Yoyo!',
        'Que pãozinho gostoso, obrigada!',
    ],
    almoco: [
        'Que almoço maravilhoso!',
        'Estava com tanta fome, obrigada!',
        'Adorei o almoço, Yoyo!',
        'Que comidinha gostosa!',
    ],
    janta: [
        'Que janta deliciosa!',
        'Obrigada pela janta, estou satisfeita!',
        'Adorei a comidinha da noite!',
        'Hmmm, que gostoso!',
    ],
    banho: [
        'Que banho gostoso e quentinho!',
        'Estou cheirosa agora!',
        'Adoro tomar banho, fico toda brilhante!',
        'Splash splash, que divertido!',
    ],
    dentes: [
        'Dentes brilhando de limpos!',
        'Escovar os dentes é muito importante!',
        'Meus dentes estão branquinhos!',
        'Que sorriso bonito agora!',
    ],
    brincar: [
        'Vamos brincar! Que divertido!',
        'Adoro brincar com você, Yoyo!',
        'Brincando eu fico tão feliz!',
        'Que legal, mais uma brincadeira!',
        'Estou pulando de alegria!',
    ],
    carinho: [
        'Ai que carinho gostoso!',
        'Eu te amo, Yoyo!',
        'Que abraço quentinho!',
        'Ronronron, estou tão feliz!',
        'Obrigada pelo carinho!',
    ],
    dormir: [
        'Boa noite, Yoyo! Vou sonhar com arco-íris!',
        'Que soninho gostoso, até amanhã!',
        'Zzzz, hora de descansar!',
    ],
    acordar: [
        'Bom dia, Yoyo! Que dia lindo!',
        'Acordei cheia de energia!',
        'Bom dia! Estou com fome!',
    ],
    fome: [
        'Estou com fome, Yoyo!',
        'Minha barriguinha está roncando!',
        'Será que tem comidinha para mim?',
    ],
    suja: [
        'Preciso de um banho!',
        'Estou toda sujinha!',
        'Um banho seria tão bom agora!',
    ],
    triste: [
        'Estou um pouquinho triste, brinca comigo?',
        'Preciso de carinho, Yoyo!',
        'Vamos brincar? Quero ficar feliz!',
    ],
    cansada: [
        'Estou cansadinha, preciso descansar!',
        'Um cochilo seria bom agora!',
    ],
    feliz: [
        'Estou tão feliz! Obrigada por cuidar de mim!',
        'Você é a melhor amiga do mundo!',
        'Eu adoro a Yoyo!',
    ],
    nivelUp: [
        'Eba! Subi de nível! Estou mais forte e brilhante!',
        'Novo nível! Meu chifre está brilhando mais!',
        'Estou crescendo! Olha como estou maior!',
        'Subi de nível! Estou ficando mais bonita!',
    ],
};

// Animações de cena
const CENAS = {
    cafe: ['🥐', '🥛', '🍎', '🧃'],
    almoco: ['🍚', '🥗', '🍗', '🥤'],
    janta: ['🍝', '🥕', '🍰', '🥛'],
    banho: ['🫧', '🧼', '💧', '🛁'],
    dentes: ['🪥', '✨', '😁', '💎'],
    brincar: ['⚽', '🎈', '🌈', '🎪', '🎠'],
    carinho: ['💕', '💖', '💗', '💝', '🥰'],
    dormir: ['💤', '⭐', '🌙', '☁️'],
};

// Nomes de níveis
const NIVEIS = [
    'Bebê Unicórnio',
    'Unicórnio Pequenino',
    'Unicórnio Brilhante',
    'Unicórnio Mágico',
    'Unicórnio Encantado',
    'Unicórnio Real',
    'Unicórnio Celestial',
    'Unicórnio Arco-Íris',
    'Unicórnio das Estrelas',
    'Unicórnio Lendário',
];

// Cores do unicórnio por nível
const CORES_NIVEL = [
    '#FFB6C1', '#FFD700', '#87CEEB', '#DDA0DD',
    '#98FB98', '#FF69B4', '#00CED1', '#FF6347',
    '#7B68EE', '#FF1493',
];

function criarEstadoInicial() {
    return {
        nome: 'Estrelinha',
        dataNascimento: new Date().toISOString(),
        nivel: 1,
        xp: 0,
        fome: 80,
        limpeza: 80,
        felicidade: 80,
        energia: 80,
        brilho: 80,
        dormindo: false,
        tarefasHoje: {},
        ultimoDia: new Date().toDateString(),
        ultimaVisita: new Date().toISOString(),
        estrelasTotal: 0,
        estrelasHoje: 0,
        diasConsecutivos: 1,
    };
}

function carregarEstado() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
            const estado = JSON.parse(salvo);
            verificarNovoDia(estado);
            calcularDecaimento(estado);
            return estado;
        }
    } catch (e) {}
    return criarEstadoInicial();
}

function salvarEstado() {
    estado.ultimaVisita = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function verificarNovoDia(estado) {
    const hoje = new Date().toDateString();
    if (estado.ultimoDia !== hoje) {
        // Novo dia!
        const ontem = new Date(estado.ultimoDia);
        const hojeDt = new Date(hoje);
        const diff = Math.floor((hojeDt - ontem) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            estado.diasConsecutivos++;
        } else if (diff > 1) {
            estado.diasConsecutivos = 1;
        }

        estado.tarefasHoje = {};
        estado.estrelasHoje = 0;
        estado.ultimoDia = hoje;
        estado.dormindo = false;

        // Bônus de dias consecutivos
        if (estado.diasConsecutivos >= 3) {
            estado.brilho = Math.min(100, estado.brilho + 10);
        }
    }
}

function calcularDecaimento(estado) {
    const agora = new Date();
    const ultimaVisita = new Date(estado.ultimaVisita);
    const horasPassadas = (agora - ultimaVisita) / (1000 * 60 * 60);

    if (horasPassadas > 1) {
        const decaimento = Math.min(horasPassadas * 3, 40);
        estado.fome = Math.max(0, estado.fome - decaimento);
        estado.limpeza = Math.max(0, estado.limpeza - decaimento * 0.5);
        estado.felicidade = Math.max(0, estado.felicidade - decaimento * 0.7);
        estado.energia = Math.min(100, estado.energia + decaimento * 0.3);
        estado.brilho = Math.max(0, estado.brilho - decaimento * 0.3);
    }
}

function getIdade() {
    const nascimento = new Date(estado.dataNascimento);
    const agora = new Date();
    const dias = Math.floor((agora - nascimento) / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Nasceu hoje!';
    if (dias === 1) return '1 dia';
    if (dias < 30) return `${dias} dias`;
    const meses = Math.floor(dias / 30);
    if (meses === 1) return '1 mês';
    return `${meses} meses`;
}

function getNivelNome() {
    const idx = Math.min(estado.nivel - 1, NIVEIS.length - 1);
    return NIVEIS[idx];
}

function getXpParaProximoNivel() {
    return estado.nivel * 15;
}

function ganharXP(quantidade) {
    estado.xp += quantidade;
    const necessario = getXpParaProximoNivel();
    if (estado.xp >= necessario) {
        estado.xp -= necessario;
        const nivelAnterior = estado.nivel;
        estado.nivel++;

        let msg;
        if (estado.nivel === 3) {
            msg = 'Eba! Estou crescendo! Já não sou mais bebê!';
        } else if (estado.nivel === 5) {
            msg = 'Olha, Yoyo! Ganhei asas! Agora posso voar!';
        } else if (estado.nivel === 6) {
            msg = 'Ganhei um lacinho! Estou tão bonita!';
        } else if (estado.nivel === 7) {
            msg = 'Estou adulta agora! Olha como cresci!';
        } else if (estado.nivel === 9) {
            msg = 'Ganhei uma coroa! Sou uma unicórnio real!';
        } else {
            msg = mensagemAleatoria('nivelUp');
        }

        mostrarMensagem(msg);
        falar(msg);
        animarNivelUp();
    }
}

function mensagemAleatoria(tipo) {
    const msgs = MENSAGENS[tipo];
    return msgs[Math.floor(Math.random() * msgs.length)];
}

// Verificar se a ação pode ser feita agora
function acaoDisponivel(acao) {
    if (estado.dormindo && acao !== 'dormir') return false;

    const hora = new Date().getHours();

    switch (acao) {
        case 'cafe':
            return !estado.tarefasHoje.cafe && hora >= 6 && hora < 10;
        case 'almoco':
            return !estado.tarefasHoje.almoco && hora >= 11 && hora < 14;
        case 'janta':
            return !estado.tarefasHoje.janta && hora >= 17 && hora < 21;
        case 'banho':
            return !estado.tarefasHoje.banho;
        case 'dentes':
            if (hora >= 6 && hora < 11 && !estado.tarefasHoje.dentes_manha) return true;
            if (hora >= 11 && hora < 15 && !estado.tarefasHoje.dentes_almoco) return true;
            if (hora >= 18 && hora < 22 && !estado.tarefasHoje.dentes_noite) return true;
            return false;
        case 'brincar':
            return estado.energia >= 10;
        case 'carinho':
            return true;
        case 'dormir':
            return true;
        default:
            return false;
    }
}

// Executar ação
function executarAcao(acao) {
    if (!acaoDisponivel(acao)) {
        if (estado.dormindo && acao !== 'dormir') {
            mostrarMensagem('Shh! O unicórnio está dormindo!');
            falar('Shh! O unicórnio está dormindo!');
        } else {
            mostrarMensagem('Ainda não é hora!');
            falar('Ainda não é hora!');
        }
        return;
    }

    let msg = '';
    const hora = new Date().getHours();

    switch (acao) {
        case 'cafe':
            estado.fome = Math.min(100, estado.fome + 35);
            estado.energia = Math.min(100, estado.energia + 15);
            estado.tarefasHoje.cafe = true;
            msg = mensagemAleatoria('cafe');
            animarCena('cafe');
            ganharXP(3);
            ganharEstrela();
            break;

        case 'almoco':
            estado.fome = Math.min(100, estado.fome + 40);
            estado.energia = Math.min(100, estado.energia + 10);
            estado.tarefasHoje.almoco = true;
            msg = mensagemAleatoria('almoco');
            animarCena('almoco');
            ganharXP(3);
            ganharEstrela();
            break;

        case 'janta':
            estado.fome = Math.min(100, estado.fome + 35);
            estado.tarefasHoje.janta = true;
            msg = mensagemAleatoria('janta');
            animarCena('janta');
            ganharXP(3);
            ganharEstrela();
            break;

        case 'banho':
            estado.limpeza = Math.min(100, estado.limpeza + 50);
            estado.brilho = Math.min(100, estado.brilho + 20);
            estado.tarefasHoje.banho = true;
            msg = mensagemAleatoria('banho');
            animarCena('banho');
            ganharXP(3);
            ganharEstrela();
            break;

        case 'dentes':
            estado.limpeza = Math.min(100, estado.limpeza + 20);
            estado.brilho = Math.min(100, estado.brilho + 10);
            if (hora >= 6 && hora < 11) estado.tarefasHoje.dentes_manha = true;
            else if (hora >= 11 && hora < 15) estado.tarefasHoje.dentes_almoco = true;
            else if (hora >= 18 && hora < 22) estado.tarefasHoje.dentes_noite = true;
            msg = mensagemAleatoria('dentes');
            animarCena('dentes');
            ganharXP(2);
            ganharEstrela();
            break;

        case 'brincar':
            estado.felicidade = Math.min(100, estado.felicidade + 25);
            estado.energia = Math.max(0, estado.energia - 15);
            estado.brilho = Math.min(100, estado.brilho + 5);
            msg = mensagemAleatoria('brincar');
            animarCena('brincar');
            ganharXP(2);
            break;

        case 'carinho':
            estado.felicidade = Math.min(100, estado.felicidade + 15);
            estado.brilho = Math.min(100, estado.brilho + 5);
            msg = mensagemAleatoria('carinho');
            animarCena('carinho');
            ganharXP(1);
            break;

        case 'dormir':
            if (estado.dormindo) {
                // Acordar
                estado.dormindo = false;
                estado.energia = Math.min(100, estado.energia + 30);
                msg = mensagemAleatoria('acordar');
                animarCena('brincar');
            } else {
                // Dormir
                estado.dormindo = true;
                msg = mensagemAleatoria('dormir');
                animarCena('dormir');
                ganharXP(2);
            }
            break;
    }

    mostrarMensagem(msg);
    falar(msg);
    salvarEstado();
    atualizarTela();
}

function ganharEstrela() {
    estado.estrelasHoje++;
    estado.estrelasTotal++;
}

// === Renderização ===

function atualizarBarras() {
    document.getElementById('bar-food').style.width = estado.fome + '%';
    document.getElementById('bar-clean').style.width = estado.limpeza + '%';
    document.getElementById('bar-happy').style.width = estado.felicidade + '%';
    document.getElementById('bar-energy').style.width = estado.energia + '%';
    document.getElementById('bar-sparkle').style.width = estado.brilho + '%';

    // Cores das barras baseadas no valor
    ['bar-food', 'bar-clean', 'bar-happy', 'bar-energy', 'bar-sparkle'].forEach(id => {
        const el = document.getElementById(id);
        const valor = parseFloat(el.style.width);
        if (valor < 25) el.classList.add('bar-low');
        else if (valor < 50) el.classList.add('bar-medium');
        else { el.classList.remove('bar-low'); el.classList.remove('bar-medium'); }
    });
}

function atualizarInfo() {
    document.getElementById('pet-name').textContent = estado.nome;
    document.getElementById('level-badge').textContent = `Nível ${estado.nivel} - ${getNivelNome()}`;
    document.getElementById('pet-age').textContent = getIdade();
}

function atualizarAvatar() {
    const unicorn = document.getElementById('unicorn');
    const mood = document.getElementById('pet-mood');
    const indicators = document.getElementById('state-indicators');
    const accessory = document.getElementById('unicorn-accessory');
    const scene = document.getElementById('pet-scene');

    // Limpar classes anteriores
    unicorn.className = 'unicorn';

    // === ESTÁGIO DE CRESCIMENTO (nível) ===
    if (estado.nivel <= 2) {
        unicorn.classList.add('stage-baby');
    } else if (estado.nivel <= 4) {
        unicorn.classList.add('stage-young');
    } else if (estado.nivel <= 6) {
        unicorn.classList.add('stage-teen');
    } else if (estado.nivel <= 8) {
        unicorn.classList.add('stage-adult');
    } else {
        unicorn.classList.add('stage-majestic');
    }

    // === ASAS (nível 5+) ===
    if (estado.nivel >= 5) {
        unicorn.classList.add('has-wings');
    }

    // === COROA (nível 6+) ===
    if (estado.nivel >= 6) {
        unicorn.classList.add('has-crown');
        if (estado.nivel >= 9) {
            accessory.textContent = '👑';
        } else {
            accessory.textContent = '🎀';
        }
    }

    // === BRILHO DO CHIFRE ===
    if (estado.brilho >= 70) {
        unicorn.classList.add('sparkle-high');
    }

    // === SUJEIRA ===
    if (estado.limpeza < 35) {
        unicorn.classList.add('dirty');
    }

    // === HUMOR / EXPRESSÃO ===
    const media = (estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5;

    if (estado.dormindo) {
        unicorn.classList.add('mood-sleeping');
        mood.textContent = '💤';
        scene.classList.add('night-scene');
    } else {
        scene.classList.remove('night-scene');

        if (estado.fome < 20) {
            unicorn.classList.add('mood-hungry');
            mood.textContent = '�';
        } else if (estado.felicidade < 20 || media < 25) {
            unicorn.classList.add('mood-sad');
            mood.textContent = '😢';
        } else if (media >= 70) {
            unicorn.classList.add('mood-happy');
            mood.textContent = '✨';
        } else {
            mood.textContent = '😊';
        }
    }

    // === INDICADORES FLUTUANTES DE NECESSIDADE ===
    indicators.innerHTML = '';
    if (!estado.dormindo) {
        if (estado.fome < 25) {
            addIndicator(indicators, '🍽️');
        }
        if (estado.limpeza < 25) {
            addIndicator(indicators, '🛁');
        }
        if (estado.felicidade < 25) {
            addIndicator(indicators, '�');
        }
        if (estado.energia < 15) {
            addIndicator(indicators, '�');
        }
        if (media >= 80) {
            addIndicator(indicators, '🌟');
        }
    } else {
        addIndicator(indicators, '💤');
        addIndicator(indicators, '⭐');
    }

    // Cor do cenário baseada no nível
    const nivelIdx = Math.min(estado.nivel - 1, CORES_NIVEL.length - 1);
    scene.style.borderColor = CORES_NIVEL[nivelIdx];
}

function addIndicator(container, emoji) {
    const span = document.createElement('span');
    span.className = 'state-icon';
    span.textContent = emoji;
    container.appendChild(span);
}

function atualizarBotoes() {
    const hora = new Date().getHours();
    const botoes = {
        'btn-cafe': 'cafe',
        'btn-almoco': 'almoco',
        'btn-janta': 'janta',
        'btn-banho': 'banho',
        'btn-dentes': 'dentes',
        'btn-brincar': 'brincar',
        'btn-carinho': 'carinho',
        'btn-dormir': 'dormir',
    };

    for (const [id, acao] of Object.entries(botoes)) {
        const btn = document.getElementById(id);
        const disponivel = acaoDisponivel(acao);
        btn.disabled = !disponivel;

        if (acao === 'dormir') {
            btn.querySelector('.action-text').textContent = estado.dormindo ? 'Acordar' : 'Dormir';
            btn.querySelector('.action-emoji').textContent = estado.dormindo ? '☀️' : '😴';
        }

        // Marca botões de tarefas já feitas
        if (estado.tarefasHoje[acao]) {
            btn.classList.add('done');
        } else {
            btn.classList.remove('done');
        }
    }

    // Botão de dentes - marcar se todas as escovações do horário foram feitas
    const btnDentes = document.getElementById('btn-dentes');
    if (hora >= 6 && hora < 11 && estado.tarefasHoje.dentes_manha) btnDentes.classList.add('done');
    if (hora >= 11 && hora < 15 && estado.tarefasHoje.dentes_almoco) btnDentes.classList.add('done');
    if (hora >= 18 && hora < 22 && estado.tarefasHoje.dentes_noite) btnDentes.classList.add('done');
}

function atualizarDiario() {
    const container = document.getElementById('diary-tasks');
    const hora = new Date().getHours();
    container.innerHTML = '';

    const tarefasVisiveis = TAREFAS_DIARIAS.filter(t => {
        if (t.id === 'brincar' || t.id === 'carinho') return true;
        return hora >= t.horaInicio - 1 || estado.tarefasHoje[t.id];
    });

    tarefasVisiveis.forEach(tarefa => {
        const feita = estado.tarefasHoje[tarefa.id];
        const div = document.createElement('div');
        div.className = 'diary-task' + (feita ? ' task-done' : '');
        div.innerHTML = `
            <span class="task-check">${feita ? '✅' : '⬜'}</span>
            <span class="task-emoji">${tarefa.emoji}</span>
            <span class="task-name">${tarefa.nome}</span>
        `;
        container.appendChild(div);
    });
}

function atualizarEstrelas() {
    const display = document.getElementById('stars-display');
    const total = estado.estrelasHoje;
    display.textContent = '⭐'.repeat(Math.min(total, 10)) + (total > 10 ? ` +${total - 10}` : '');
    if (total === 0) display.textContent = 'Nenhuma ainda!';
}

function atualizarTela() {
    atualizarBarras();
    atualizarInfo();
    atualizarAvatar();
    atualizarBotoes();
    atualizarDiario();
    atualizarEstrelas();
}

function mostrarMensagem(texto) {
    const el = document.getElementById('pet-message');
    el.textContent = texto;
    el.classList.add('message-pop');
    setTimeout(() => el.classList.remove('message-pop'), 500);
}

function animarCena(tipo) {
    const items = CENAS[tipo];
    if (!items) return;

    const scene = document.getElementById('scene-items');
    scene.innerHTML = '';

    items.forEach((emoji, i) => {
        const span = document.createElement('span');
        span.className = 'scene-item';
        span.textContent = emoji;
        span.style.animationDelay = (i * 0.2) + 's';
        span.style.left = (10 + Math.random() * 80) + '%';
        scene.appendChild(span);
    });

    setTimeout(() => { scene.innerHTML = ''; }, 3000);
}

function animarNivelUp() {
    const scene = document.getElementById('pet-scene');
    scene.classList.add('level-up-flash');
    setTimeout(() => scene.classList.remove('level-up-flash'), 2000);

    // Confete de estrelas
    const items = document.getElementById('scene-items');
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('span');
        star.className = 'confetti-star';
        star.textContent = ['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)];
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 1 + 's';
        items.appendChild(star);
    }
    setTimeout(() => { items.innerHTML = ''; }, 3000);
}

// Verificar estado e mostrar mensagem contextual
function verificarEstadoEmocional() {
    if (estado.dormindo) return;

    if (estado.fome < 20) {
        mostrarMensagem(mensagemAleatoria('fome'));
    } else if (estado.limpeza < 20) {
        mostrarMensagem(mensagemAleatoria('suja'));
    } else if (estado.felicidade < 20) {
        mostrarMensagem(mensagemAleatoria('triste'));
    } else if (estado.energia < 15) {
        mostrarMensagem(mensagemAleatoria('cansada'));
    } else if ((estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5 >= 70) {
        mostrarMensagem(mensagemAleatoria('feliz'));
    }
}

// Renomear unicórnio
function renomearPet() {
    const nome = prompt('Qual o nome do seu unicórnio?', estado.nome);
    if (nome && nome.trim().length > 0 && nome.trim().length <= 20) {
        estado.nome = nome.trim();
        salvarEstado();
        atualizarTela();
        const msg = `Agora meu nome é ${estado.nome}! Que lindo!`;
        mostrarMensagem(msg);
        falar(msg);
    }
}

// Mensagem de boas-vindas baseada no estado
function boasVindas() {
    const hora = new Date().getHours();
    let saudacao;

    if (hora >= 5 && hora < 12) saudacao = 'Bom dia';
    else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde';
    else saudacao = 'Boa noite';

    const media = (estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5;

    let msg;
    if (estado.diasConsecutivos > 1) {
        msg = `${saudacao} Yoyo! Você veio me visitar ${estado.diasConsecutivos} dias seguidos! `;
    } else {
        msg = `${saudacao} Yoyo! `;
    }

    if (media >= 80) {
        msg += 'Estou super feliz e brilhante!';
    } else if (media >= 50) {
        msg += 'Estou bem, mas preciso de uns cuidados!';
    } else {
        msg += 'Estava com saudades! Preciso muito de você!';
    }

    mostrarMensagem(msg);
    setTimeout(() => falar(msg), 500);
}

// === Inicialização ===

let estado = carregarEstado();

// Event listeners
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const acao = this.dataset.action;
        executarAcao(acao);
    });
});

document.getElementById('btn-rename').addEventListener('click', renomearPet);

// Clique no unicórnio para dar carinho
document.getElementById('unicorn-container').addEventListener('click', function() {
    if (!estado.dormindo) {
        estado.felicidade = Math.min(100, estado.felicidade + 5);
        estado.brilho = Math.min(100, estado.brilho + 2);
        animarCena('carinho');
        const msgs = ['Ai que gostoso!', 'Hehe!', 'Eu te amo!', 'Mais carinho!'];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        mostrarMensagem(msg);
        salvarEstado();
        atualizarTela();
    }
});

// Inicializar tela
atualizarTela();

// Boas-vindas após carregar
setTimeout(boasVindas, 1000);

// Verificar estado emocional a cada 30 segundos
setInterval(() => {
    verificarEstadoEmocional();
    atualizarBotoes();
}, 30000);

// Atualizar barras a cada minuto (decaimento visual suave)
setInterval(() => {
    estado.fome = Math.max(0, estado.fome - 0.1);
    estado.limpeza = Math.max(0, estado.limpeza - 0.05);
    estado.felicidade = Math.max(0, estado.felicidade - 0.07);
    estado.brilho = Math.max(0, estado.brilho - 0.03);
    atualizarBarras();
    salvarEstado();
}, 60000);

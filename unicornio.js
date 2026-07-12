// Tamagotchi de Unicórnio - Mundo da Yoyo
// Estado persistido em localStorage

const STORAGE_KEY = 'mundodayoyo-unicornio';

// Configuração das tarefas diárias
const TAREFAS_DIARIAS = [
    { id: 'cafe', nome: 'CAFÉ', emoji: '☀️', horaInicio: 6, horaFim: 10 },
    { id: 'dentes_manha', nome: 'DENTES', emoji: '🪥', horaInicio: 6, horaFim: 11 },
    { id: 'almoco', nome: 'ALMOÇO', emoji: '�', horaInicio: 11, horaFim: 14 },
    { id: 'dentes_almoco', nome: 'DENTES', emoji: '🪥', horaInicio: 11, horaFim: 15 },
    { id: 'banho', nome: 'BANHO', emoji: '🛁', horaInicio: 16, horaFim: 21 },
    { id: 'janta', nome: 'JANTA', emoji: '🌙', horaInicio: 17, horaFim: 21 },
    { id: 'dentes_noite', nome: 'DENTES', emoji: '🪥', horaInicio: 18, horaFim: 22 },
    { id: 'brincar', nome: 'BRINCAR', emoji: '⚽', horaInicio: 0, horaFim: 24 },
    { id: 'carinho', nome: 'CARINHO', emoji: '�', horaInicio: 0, horaFim: 24 },
];

// Mensagens do unicórnio por ação
const MENSAGENS = {
    cafe: [
        'Hmm, café! 🥐 Gostoso!',
        'Que frutinha boa! 🍎',
        'Obrigada, Yoyo! ☀️',
    ],
    almoco: [
        'Que comidinha boa! 🍚',
        'Hmmm, almoço! 😋',
        'Obrigada, Yoyo! 🍽️',
    ],
    janta: [
        'Janta gostosa! 🌙',
        'Hmmm, que bom! 😋',
        'Obrigada, Yoyo! 💜',
    ],
    banho: [
        'Banho quentinho! 🛁',
        'Estou cheirosa! 🫧',
        'Splash splash! 💧',
    ],
    dentes: [
        'Dentes brilhando! ✨',
        'Que sorriso bonito! 😁',
        'Dentes limpos! 🪥',
    ],
    brincar: [
        'Oba! Brincar! ⚽',
        'Que divertido! 🎈',
        'Vamos brincar! 🌈',
    ],
    carinho: [
        'Que carinho bom! 💖',
        'Te amo, Yoyo! 🥰',
        'Abraço quentinho! 💕',
    ],
    dormir: [
        'Boa noite, Yoyo! 🌙',
        'Hora de dormir! 💤',
        'Até amanhã! ⭐',
    ],
    acordar: [
        'Bom dia, Yoyo! ☀️',
        'Acordei! Bom dia! 🌅',
    ],
    fome: [
        'Estou com fome! 🍔',
        'Minha barriga ronca! 😋',
        'Comida, Yoyo! 🍽️',
    ],
    suja: [
        'Preciso de banho! 🛁',
        'Estou sujinha! 🧼',
    ],
    triste: [
        'Estou triste! 😢',
        'Brinca comigo? 🥺',
        'Carinho, Yoyo! 💜',
    ],
    cansada: [
        'Estou com sono! 😴',
        'Que soninho! 💤',
    ],
    feliz: [
        'Estou feliz! 😄',
        'Oba! Te amo! 💖',
        'Estou brilhando! ✨',
    ],
    nivelUp: [
        'Eba! Cresci! 🌟',
        'Olha! Estou maior! ⭐',
        'Subi de nível! 👑',
    ],
    doente: [
        'Estou doentinha! 🤒',
        'Atchim! 🤧',
        'Preciso de remédio! 💊',
    ],
    remedio: [
        'O remédio ajudou! 💊',
        'Estou melhorando! 💪',
        'Obrigada, Yoyo! ❤️',
    ],
    aniversario: [
        'Meu aniversário! 🎂🎉',
        'Parabéns pra mim! 🎁',
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
    remedio: ['💊', '🌡️', '🩹', '❤️‍🩹'],
};

// Definição de conquistas
const CONQUISTAS = [
    { id: 'primeiro_cafe', nome: 'CAFÉ', emoji: '☕', desc: 'Primeiro café!' },
    { id: 'primeiro_banho', nome: 'BANHO', emoji: '🛁', desc: 'Primeiro banho!' },
    { id: 'primeiro_carinho', nome: 'CARINHO', emoji: '🥰', desc: 'Primeiro carinho!' },
    { id: 'dias_3', nome: '3 DIAS', emoji: '🔥', desc: '3 dias seguidos!' },
    { id: 'dias_7', nome: 'SEMANA', emoji: '🌟', desc: '7 dias seguidos!' },
    { id: 'dias_30', nome: 'MÊS', emoji: '🏅', desc: '30 dias seguidos!' },
    { id: 'nivel_3', nome: 'CRESCEU', emoji: '🌱', desc: 'Nível 3!' },
    { id: 'nivel_5', nome: 'ASAS', emoji: '🪶', desc: 'Ganhou asas!' },
    { id: 'nivel_7', nome: 'GRANDE', emoji: '🦄', desc: 'Ficou grande!' },
    { id: 'nivel_10', nome: 'RAINHA', emoji: '👑', desc: 'Nível 10!' },
    { id: 'curou_doenca', nome: 'DOUTORA', emoji: '💉', desc: 'Curou a doença!' },
    { id: 'estrelas_50', nome: '50 ⭐', emoji: '⭐', desc: '50 estrelas!' },
    { id: 'estrelas_100', nome: '100 ⭐', emoji: '🌠', desc: '100 estrelas!' },
    { id: 'felicidade_max', nome: 'FELIZ', emoji: '😍', desc: 'Super feliz!' },
    { id: 'tudo_100', nome: 'PERFEITO', emoji: '🌈', desc: 'Tudo perfeito!' },
    { id: 'aniversario', nome: 'PARABÉNS', emoji: '🎂', desc: 'Aniversário!' },
    { id: 'dentes_3x', nome: 'DENTES', emoji: '🦷', desc: 'Dentes 3 vezes!' },
    { id: 'dia_perfeito', nome: 'DIA TOP', emoji: '🌞', desc: 'Dia perfeito!' },
];

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
        saude: 100,
        doente: false,
        dormindo: false,
        tarefasHoje: {},
        ultimoDia: new Date().toDateString(),
        ultimaVisita: new Date().toISOString(),
        estrelasTotal: 0,
        estrelasHoje: 0,
        diasConsecutivos: 1,
        conquistas: [],
        climaHoje: null,
    };
}

function carregarEstado() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
            const estado = JSON.parse(salvo);
            // Migração de estado antigo
            if (estado.saude === undefined) estado.saude = 100;
            if (estado.doente === undefined) estado.doente = false;
            if (estado.conquistas === undefined) estado.conquistas = [];
            if (estado.climaHoje === undefined) estado.climaHoje = null;
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

        // Gerar clima do dia
        estado.climaHoje = gerarClima();

        // Chance de doença se saúde baixa
        if (estado.saude < 30 && Math.random() < 0.4) {
            estado.doente = true;
        }
    }
}

// Gerar clima aleatório para o dia
function gerarClima() {
    const climas = ['sol', 'sol', 'sol', 'nublado', 'nublado', 'chuva', 'arcoiris'];
    return climas[Math.floor(Math.random() * climas.length)];
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

        // Saúde diminui se fome ou limpeza muito baixas
        if (estado.fome < 15 || estado.limpeza < 15) {
            estado.saude = Math.max(0, estado.saude - decaimento * 0.4);
        }

        // Chance de ficar doente se descuidado
        if (estado.saude < 25 && !estado.doente && Math.random() < 0.3) {
            estado.doente = true;
        }
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
        case 'remedio':
            return estado.doente;
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

        case 'remedio':
            if (estado.doente) {
                estado.doente = false;
                estado.saude = Math.min(100, estado.saude + 40);
                estado.felicidade = Math.min(100, estado.felicidade + 10);
                msg = mensagemAleatoria('remedio');
                animarCena('remedio');
                ganharXP(3);
                ganharEstrela();
                desbloquearConquista('curou_doenca');
            }
            break;
    }

    mostrarMensagem(msg);
    falar(msg);
    verificarConquistas(acao);
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
    document.getElementById('bar-health').style.width = estado.saude + '%';

    // Cores das barras baseadas no valor
    ['bar-food', 'bar-clean', 'bar-happy', 'bar-energy', 'bar-sparkle', 'bar-health'].forEach(id => {
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

    // === DOENÇA ===
    if (estado.doente) {
        unicorn.classList.add('sick');
    }

    // === HUMOR / EXPRESSÃO ===
    const media = (estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5;

    if (estado.dormindo) {
        unicorn.classList.add('mood-sleeping');
        mood.textContent = '💤';
        scene.classList.add('night-scene');
    } else {
        scene.classList.remove('night-scene');

        if (estado.doente) {
            unicorn.classList.add('mood-sad');
            mood.textContent = '🤒';
        } else if (estado.fome < 20) {
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
        if (estado.doente) {
            addIndicator(indicators, '🤒');
            addIndicator(indicators, '💊');
        }
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

    // Botão de remédio - mostrar só quando doente
    const btnRemedio = document.getElementById('btn-remedio');
    if (estado.doente) {
        btnRemedio.style.display = '';
        btnRemedio.disabled = false;
    } else {
        btnRemedio.style.display = 'none';
    }
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
    atualizarCenario();
    atualizarConquistas();
    atualizarTermometro();
}

function mostrarMensagem(texto) {
    const el = document.getElementById('pet-message');
    el.textContent = texto;
    el.classList.add('message-pop');
    setTimeout(() => el.classList.remove('message-pop'), 500);
    // Sempre falar para a criança ouvir e associar palavra-som
    falar(texto);
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

// === ANIMAÇÕES EXPRESSIVAS ===

// Piscada de olho periódica
function animarPiscada() {
    if (estado.dormindo) return;
    const unicorn = document.getElementById('unicorn');
    unicorn.classList.add('blinking');
    setTimeout(() => unicorn.classList.remove('blinking'), 200);
}

// Espirro quando doente
function animarEspirro() {
    if (!estado.doente) return;
    const unicorn = document.getElementById('unicorn');
    const container = document.getElementById('unicorn-container');

    unicorn.classList.add('sneezing');

    // Partículas de espirro
    const particulas = ['💦', '✨', '💫'];
    for (let i = 0; i < 4; i++) {
        const p = document.createElement('span');
        p.className = 'sneeze-particle';
        p.textContent = particulas[Math.floor(Math.random() * particulas.length)];
        p.style.top = '30%';
        p.style.left = '60%';
        p.style.setProperty('--sx', (20 + Math.random() * 50) + 'px');
        p.style.setProperty('--sy', (-10 - Math.random() * 40) + 'px');
        p.style.animationDelay = (i * 0.1) + 's';
        container.appendChild(p);
    }

    mostrarMensagem('Atchim! 🤧');

    setTimeout(() => {
        unicorn.classList.remove('sneezing');
        container.querySelectorAll('.sneeze-particle').forEach(el => el.remove());
    }, 1200);
}

// Bocejo quando cansado ou perto da hora de dormir
function animarBocejo() {
    if (estado.dormindo) return;
    const unicorn = document.getElementById('unicorn');
    unicorn.classList.add('yawning');

    const hora = new Date().getHours();
    if (hora >= 20 || hora < 5) {
        mostrarMensagem('*Ahhh* 🥱 Estou com sono, Yoyo... Hora de dormir!');
    } else if (estado.energia < 20) {
        mostrarMensagem('*Ahhh* 🥱 Que soninho...');
    }

    setTimeout(() => unicorn.classList.remove('yawning'), 2500);
}

// Ronronar quando feliz e recebe carinho
function animarRonronar() {
    const unicorn = document.getElementById('unicorn');
    unicorn.classList.add('purring');
    setTimeout(() => unicorn.classList.remove('purring'), 3000);
}

// Corações flutuantes ao dar carinho
function animarCoracoes() {
    const container = document.getElementById('unicorn-container');
    const coracoes = ['💕', '💖', '💗', '💝', '❤️'];
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'love-burst';
        heart.textContent = coracoes[Math.floor(Math.random() * coracoes.length)];
        heart.style.left = (30 + Math.random() * 40) + '%';
        heart.style.top = (20 + Math.random() * 30) + '%';
        heart.style.animationDelay = (i * 0.3) + 's';
        container.appendChild(heart);
    }
    setTimeout(() => container.querySelectorAll('.love-burst').forEach(el => el.remove()), 2000);
}

// Zzz flutuante quando dormindo
function animarZzz() {
    if (!estado.dormindo) return;
    const container = document.getElementById('unicorn-container');
    const zzz = document.createElement('span');
    zzz.className = 'zzz-float';
    zzz.textContent = 'Z';
    zzz.style.left = (50 + Math.random() * 20) + '%';
    zzz.style.top = '20%';
    zzz.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
    container.appendChild(zzz);
    setTimeout(() => zzz.remove(), 3500);
}

// Balão de pensamento (o unicórnio pensa em algo)
function animarPensamento(emoji) {
    const container = document.getElementById('unicorn-container');
    // Remover pensamento anterior se existir
    container.querySelectorAll('.thought-bubble').forEach(el => el.remove());
    const thought = document.createElement('span');
    thought.className = 'thought-bubble';
    thought.textContent = emoji;
    container.appendChild(thought);
    setTimeout(() => thought.remove(), 3500);
}

// Termômetro flutuante quando doente
function atualizarTermometro() {
    const container = document.getElementById('unicorn-container');
    const existente = container.querySelector('.thermometer-float');

    if (estado.doente && !existente) {
        const thermo = document.createElement('span');
        thermo.className = 'thermometer-float';
        thermo.textContent = '🌡️';
        container.appendChild(thermo);
    } else if (!estado.doente && existente) {
        existente.remove();
    }
}

// === PERCEPÇÃO DE TEMPO ===

function verificarEstadoEmocional() {
    if (estado.dormindo) {
        animarZzz();
        return;
    }

    const hora = new Date().getHours();
    const minuto = new Date().getMinutes();

    // Alerta contextual por horário
    if (hora >= 20 && estado.energia > 20) {
        if (Math.random() < 0.3) {
            animarBocejo();
            return;
        }
    }

    if (hora >= 6 && hora < 9 && !estado.tarefasHoje.cafe) {
        if (Math.random() < 0.4) {
            animarPensamento('🥐');
            mostrarMensagem('Hora do café! ☀️');
            return;
        }
    }

    if (hora >= 11 && hora < 13 && !estado.tarefasHoje.almoco && estado.fome < 60) {
        if (Math.random() < 0.4) {
            animarPensamento('🍚');
            mostrarMensagem('Hora do almoço! 🍽️');
            return;
        }
    }

    if (hora >= 18 && hora < 20 && !estado.tarefasHoje.janta) {
        if (Math.random() < 0.4) {
            animarPensamento('🌙');
            mostrarMensagem('Hora da janta! 🌙');
            return;
        }
    }

    if (hora >= 17 && hora < 20 && !estado.tarefasHoje.banho) {
        if (Math.random() < 0.3) {
            animarPensamento('🛁');
            mostrarMensagem('Hora do banho! 🛁');
            return;
        }
    }

    // Estado emocional
    if (estado.doente) {
        if (Math.random() < 0.5) {
            animarEspirro();
        } else {
            mostrarMensagem(mensagemAleatoria('doente'));
        }
    } else if (estado.energia < 15) {
        animarBocejo();
    } else if (estado.fome < 20) {
        animarPensamento('🍔');
        mostrarMensagem(mensagemAleatoria('fome'));
    } else if (estado.limpeza < 20) {
        animarPensamento('🧼');
        mostrarMensagem(mensagemAleatoria('suja'));
    } else if (estado.felicidade < 20) {
        mostrarMensagem(mensagemAleatoria('triste'));
    } else if ((estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5 >= 70) {
        if (Math.random() < 0.5) {
            animarRonronar();
        }
        mostrarMensagem(mensagemAleatoria('feliz'));
    } else {
        // Micro-expressões aleatórias em estados neutros
        const rand = Math.random();
        if (rand < 0.15) {
            animarPiscada();
        } else if (rand < 0.25) {
            const pensamentos = ['🌸', '🌈', '⭐', '🎵', '🦋'];
            animarPensamento(pensamentos[Math.floor(Math.random() * pensamentos.length)]);
        }
    }
}

// === CENÁRIO DINÂMICO ===

function atualizarCenario() {
    const hora = new Date().getHours();
    const scene = document.getElementById('pet-scene');
    const skyObj = document.getElementById('sky-objects');
    const weather = document.getElementById('weather-effects');
    const ground = document.getElementById('ground-decor');

    // Fundo baseado na hora
    if (estado.dormindo || hora >= 20 || hora < 5) {
        scene.style.background = 'linear-gradient(180deg, #0d1b2a 0%, #1b2838 40%, #2c3e50 100%)';
        skyObj.innerHTML = '🌙 ⭐ ✨ ⭐ ✨ ⭐';
    } else if (hora >= 5 && hora < 8) {
        scene.style.background = 'linear-gradient(180deg, #FFD194 0%, #D1913C 30%, #C8E6C9 100%)';
        skyObj.innerHTML = '🌅';
    } else if (hora >= 8 && hora < 17) {
        scene.style.background = 'linear-gradient(180deg, #87CEEB 0%, #B2EBF2 40%, #C8E6C9 70%, #A5D6A7 100%)';
        skyObj.innerHTML = '☀️';
    } else if (hora >= 17 && hora < 20) {
        scene.style.background = 'linear-gradient(180deg, #FF6B6B 0%, #FFB347 30%, #C8E6C9 100%)';
        skyObj.innerHTML = '🌇';
    }

    // Clima do dia
    const clima = estado.climaHoje || 'sol';
    weather.innerHTML = '';

    if (clima === 'chuva' && !estado.dormindo && hora >= 5 && hora < 20) {
        for (let i = 0; i < 15; i++) {
            const drop = document.createElement('span');
            drop.className = 'raindrop';
            drop.textContent = '💧';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (1 + Math.random()) + 's';
            weather.appendChild(drop);
        }
        skyObj.innerHTML = '☁️ ☁️ ☁️';
    } else if (clima === 'nublado' && !estado.dormindo && hora >= 5 && hora < 20) {
        skyObj.innerHTML = '⛅ ☁️';
    } else if (clima === 'arcoiris' && !estado.dormindo && hora >= 5 && hora < 20) {
        skyObj.innerHTML = '☀️ 🌈';
    }

    // Decoração do chão baseada no humor
    const media = (estado.fome + estado.limpeza + estado.felicidade + estado.energia + estado.brilho) / 5;
    ground.innerHTML = '';

    if (!estado.dormindo && media >= 70) {
        const decor = ['🌸', '🌺', '🌼', '🦋', '🐝'];
        for (let i = 0; i < 4; i++) {
            const item = document.createElement('span');
            item.className = 'ground-item';
            item.textContent = decor[Math.floor(Math.random() * decor.length)];
            item.style.left = (10 + i * 22) + '%';
            ground.appendChild(item);
        }
    } else if (!estado.dormindo && media < 30) {
        ground.innerHTML = '<span class="ground-item" style="left:30%">🥀</span><span class="ground-item" style="left:60%">🍂</span>';
    }
}

// === CONQUISTAS ===

function desbloquearConquista(id) {
    if (!estado.conquistas.includes(id)) {
        estado.conquistas.push(id);
        const conquista = CONQUISTAS.find(c => c.id === id);
        if (conquista) {
            const msg = `🏆 Nova conquista: ${conquista.emoji} ${conquista.nome}!`;
            setTimeout(() => {
                mostrarMensagem(msg);
                falar(msg);
            }, 1500);
        }
        salvarEstado();
    }
}

function verificarConquistas(acaoRealizada) {
    // Primeiras ações
    if (acaoRealizada === 'cafe' && !estado.conquistas.includes('primeiro_cafe')) {
        desbloquearConquista('primeiro_cafe');
    }
    if (acaoRealizada === 'banho' && !estado.conquistas.includes('primeiro_banho')) {
        desbloquearConquista('primeiro_banho');
    }
    if (acaoRealizada === 'carinho' && !estado.conquistas.includes('primeiro_carinho')) {
        desbloquearConquista('primeiro_carinho');
    }

    // Dias consecutivos
    if (estado.diasConsecutivos >= 3) desbloquearConquista('dias_3');
    if (estado.diasConsecutivos >= 7) desbloquearConquista('dias_7');
    if (estado.diasConsecutivos >= 30) desbloquearConquista('dias_30');

    // Níveis
    if (estado.nivel >= 3) desbloquearConquista('nivel_3');
    if (estado.nivel >= 5) desbloquearConquista('nivel_5');
    if (estado.nivel >= 7) desbloquearConquista('nivel_7');
    if (estado.nivel >= 10) desbloquearConquista('nivel_10');

    // Estrelas
    if (estado.estrelasTotal >= 50) desbloquearConquista('estrelas_50');
    if (estado.estrelasTotal >= 100) desbloquearConquista('estrelas_100');

    // Felicidade máxima
    if (estado.felicidade >= 100) desbloquearConquista('felicidade_max');

    // Tudo 100%
    if (estado.fome >= 100 && estado.limpeza >= 100 && estado.felicidade >= 100 &&
        estado.energia >= 100 && estado.brilho >= 100 && estado.saude >= 100) {
        desbloquearConquista('tudo_100');
    }

    // Dentes 3x
    if (estado.tarefasHoje.dentes_manha && estado.tarefasHoje.dentes_almoco && estado.tarefasHoje.dentes_noite) {
        desbloquearConquista('dentes_3x');
    }

    // Dia perfeito (todas tarefas obrigatórias feitas)
    if (estado.tarefasHoje.cafe && estado.tarefasHoje.almoco && estado.tarefasHoje.janta &&
        estado.tarefasHoje.banho && (estado.tarefasHoje.dentes_manha || estado.tarefasHoje.dentes_almoco || estado.tarefasHoje.dentes_noite)) {
        desbloquearConquista('dia_perfeito');
    }
}

function atualizarConquistas() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    CONQUISTAS.forEach(c => {
        const desbloqueada = estado.conquistas.includes(c.id);
        const div = document.createElement('div');
        div.className = 'achievement' + (desbloqueada ? ' unlocked' : ' locked');
        div.innerHTML = `
            <span class="achievement-emoji">${c.emoji}</span>
            <span class="achievement-name">${c.nome}</span>
        `;
        div.title = c.desc;
        // Falar o nome da conquista ao tocar
        div.addEventListener('click', () => {
            if (desbloqueada) {
                falar(c.nome + '! ' + c.desc);
            } else {
                falar(c.nome);
            }
        });
        grid.appendChild(div);
    });
}

// === ANIVERSÁRIO ===

function verificarAniversario() {
    const nascimento = new Date(estado.dataNascimento);
    const hoje = new Date();
    if (nascimento.getMonth() === hoje.getMonth() && nascimento.getDate() === hoje.getDate()) {
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        if (idade > 0) {
            setTimeout(() => {
                const msg = mensagemAleatoria('aniversario');
                mostrarMensagem(msg);
                falar(msg);
                animarCena('brincar');
                desbloquearConquista('aniversario');
                // Bônus de aniversário
                estado.felicidade = 100;
                estado.brilho = 100;
                estado.saude = 100;
                salvarEstado();
                atualizarTela();
            }, 3000);
        }
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
    let msg;

    if (hora >= 5 && hora < 12) {
        msg = 'Bom dia, Yoyo! ☀️';
    } else if (hora >= 12 && hora < 18) {
        msg = 'Boa tarde, Yoyo! 🌤️';
    } else {
        msg = 'Boa noite, Yoyo! 🌙';
    }

    if (estado.doente) {
        msg += ' Estou doentinha! 🤒';
    } else if (hora >= 20) {
        msg += ' Hora de dormir! 😴';
    } else if (estado.fome < 30) {
        msg += ' Estou com fome! 🍔';
    } else {
        msg += ' Te amo! 💖';
    }

    mostrarMensagem(msg);

    // Animação contextual
    if (hora >= 20) {
        setTimeout(animarBocejo, 2000);
    } else if (estado.doente) {
        setTimeout(animarEspirro, 2000);
    }
}

// === Inicialização ===

let estado = carregarEstado();

// Event listeners
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const acao = this.dataset.action;
        // Falar o nome do botão para a criança aprender a palavra
        const texto = this.querySelector('.action-text').textContent;
        falar(texto);
        executarAcao(acao);
    });
});

document.getElementById('btn-rename').addEventListener('click', renomearPet);

// Barras de status falam ao tocar
document.querySelectorAll('.status-bar').forEach(bar => {
    bar.addEventListener('click', function() {
        const palavra = this.dataset.speak;
        if (palavra) falar(palavra);
    });
});

// Clique no unicórnio para dar carinho
document.getElementById('unicorn-container').addEventListener('click', function() {
    if (!estado.dormindo) {
        estado.felicidade = Math.min(100, estado.felicidade + 5);
        estado.brilho = Math.min(100, estado.brilho + 2);
        animarCoracoes();
        animarRonronar();
        animarCena('carinho');
        const msgs = ['Hehe! 💖', 'Te amo! 🥰', 'Gostoso! 💕', 'Mais! 💗'];
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

// Verificar aniversário
setTimeout(verificarAniversario, 2000);

// Verificar estado emocional a cada 30 segundos
setInterval(() => {
    verificarEstadoEmocional();
    atualizarBotoes();
}, 30000);

// Piscada de olho aleatória a cada 4-8 segundos
setInterval(() => {
    if (!estado.dormindo && !estado.doente) {
        animarPiscada();
    }
}, 4000 + Math.random() * 4000);

// Zzz flutuante quando dormindo
setInterval(() => {
    if (estado.dormindo) {
        animarZzz();
    }
}, 4000);

// Espirro periódico quando doente
setInterval(() => {
    if (estado.doente && !estado.dormindo && Math.random() < 0.3) {
        animarEspirro();
    }
}, 12000);

// Atualizar barras a cada minuto (decaimento visual suave)
setInterval(() => {
    estado.fome = Math.max(0, estado.fome - 0.1);
    estado.limpeza = Math.max(0, estado.limpeza - 0.05);
    estado.felicidade = Math.max(0, estado.felicidade - 0.07);
    estado.brilho = Math.max(0, estado.brilho - 0.03);
    if (estado.doente) {
        estado.saude = Math.max(0, estado.saude - 0.1);
    }
    atualizarBarras();
    atualizarTermometro();
    salvarEstado();
}, 60000);

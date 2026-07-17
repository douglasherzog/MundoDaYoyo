const selectScreen = document.getElementById('select-screen');
const occasionScreen = document.getElementById('occasion-screen');
const dressScreen = document.getElementById('dress-screen');
const dollSvg = document.getElementById('doll');
const dollWrapper = document.getElementById('doll-wrapper');
const leftOptions = document.getElementById('left-options');
const rightOptions = document.getElementById('right-options');
const stepIndicator = document.getElementById('step-indicator');
const stepTitle = document.getElementById('step-title');
const stepHint = document.getElementById('step-hint');
const btnFinish = null;
const celebration = document.getElementById('celebration');
const celebTitle = document.getElementById('celeb-title');
const finalDoll = document.getElementById('final-doll');
const btnRestart = document.getElementById('btn-restart');
const starsEl = document.getElementById('stars-count');
const bgSelector = document.getElementById('bg-selector');
const progressDots = document.getElementById('progress-dots');

let genero = null;
let ocasiaoAtual = null;
let etapaAtual = 0;
let estado = {};
let acertosEtapa = 0;

const CORES_CABELO = [
    { id: 'preto', cor: '#3e2723', nome: 'preto' },
    { id: 'castanho', cor: '#6d4c41', nome: 'castanho' },
    { id: 'loiro', cor: '#f9a825', nome: 'loiro' },
    { id: 'ruivo', cor: '#bf360c', nome: 'ruivo' },
    { id: 'branco', cor: '#eceff1', nome: 'branco' },
    { id: 'azul', cor: '#42a5f5', nome: 'azul' },
    { id: 'rosa', cor: '#ec407a', nome: 'rosa' },
    { id: 'roxo', cor: '#7b1fa2', nome: 'roxo' },
];

const ESTILOS_CABELO = [
    { id: 'longo_liso', nome: 'longo e liso' },
    { id: 'longo_ondas', nome: 'longo com ondas' },
    { id: 'curto', nome: 'curto' },
    { id: 'rabo_cavalo', nome: 'rabo de cavalo' },
    { id: 'tranca', nome: 'trança' },
    { id: 'cocar', nome: 'cocar' },
    { id: 'moicano', nome: 'moicano' },
    { id: 'lateral', nome: 'lateral' },
    { id: 'cacheado', nome: 'cacheado' },
    { id: 'careca', nome: 'careca' },
];

const CABECA_OPCOES = [
    { id: 'bone',      emoji: '🧢', nome: 'boné' },
    { id: 'boina',     emoji: '🎩', nome: 'boina' },
    { id: 'flores',    emoji: '🌸', nome: 'flores' },
    { id: 'coroa',     emoji: '👑', nome: 'coroa' },
    { id: 'cowboy',    emoji: '🤠', nome: 'chapéu de cowboy' },
    { id: 'pirata',    emoji: '🏴', nome: 'chapéu de pirata' },
    { id: 'laco',      emoji: '🎀', nome: 'laço' },
    { id: 'gorro',     emoji: '🧶', nome: 'gorro' },
    { id: 'orelhas',   emoji: '🐱', nome: 'orelhas de gato' },
    { id: 'nenhum',    emoji: '🚫', nome: 'sem chapéu' },
];

const TRONCO_OPCOES = [
    { id: 'rosa',      cor: '#f48fb1', nome: 'blusa rosa' },
    { id: 'verde',     cor: '#66bb6a', nome: 'blusa verde' },
    { id: 'azul',      cor: '#42a5f5', nome: 'blusa azul' },
    { id: 'amarela',   cor: '#ffeb3b', nome: 'blusa amarela' },
    { id: 'roxo',      cor: '#ab47bc', nome: 'blusa roxa' },
    { id: 'vestido',   cor: '#ef5350', nome: 'vestido vermelho' },
    { id: 'casaco',    cor: '#5c6bc0', nome: 'casaco' },
    { id: 'moletom',   cor: '#78909c', nome: 'moletom' },
    { id: 'jaqueta',   cor: '#37474f', nome: 'jaqueta' },
    { id: 'regata',    cor: '#26c6da', nome: 'regata' },
];

const PERNAS_OPCOES = [
    { id: 'jeans',       cor: '#5c6bc0', nome: 'calça jeans' },
    { id: 'preto',       cor: '#424242', nome: 'calça preta' },
    { id: 'bege',        cor: '#a1887f', nome: 'calça bege' },
    { id: 'verde',       cor: '#66bb6a', nome: 'calça verde' },
    { id: 'vermelha',    cor: '#ef5350', nome: 'calça vermelha' },
    { id: 'short',       cor: '#ff7043', nome: 'short' },
    { id: 'calca_grossa',cor: '#6d4c41', nome: 'calça grossa' },
    { id: 'legging',     cor: '#26a69a', nome: 'legging' },
    { id: 'saia_longa',  cor: '#ec407a', nome: 'saia longa' },
    { id: 'bermuda',     cor: '#8d6e63', nome: 'bermuda' },
];

const PES_OPCOES = [
    { id: 'sapatilha',   cor: '#f48fb1', nome: 'sapatilha' },
    { id: 'tenis_branco',cor: '#f5f5f5', nome: 'tênis branco' },
    { id: 'bota_marrom', cor: '#8d6e63', nome: 'bota marrom' },
    { id: 'sandalia',    cor: '#ab47bc', nome: 'sandália' },
    { id: 'salto',       cor: '#e91e63', nome: 'salto' },
    { id: 'galocha',     cor: '#ff7043', nome: 'galocha' },
    { id: 'chinelo',     cor: '#26c6da', nome: 'chinelo' },
    { id: 'tenis_fechado',cor:'#42a5f5', nome: 'tênis fechado' },
    { id: 'papete',      cor: '#558b2f', nome: 'papete' },
    { id: 'crocs',       cor: '#ff7043', nome: 'crocs' },
];

const ACESSORIOS_OPCOES = [
    { id: 'relogio',   emoji: '⌚', nome: 'relógio' },
    { id: 'pulseira',  emoji: '💍', nome: 'pulseira' },
    { id: 'cachecol',  emoji: '🧣', nome: 'cachecol' },
    { id: 'luvas',     emoji: '🧤', nome: 'luvas' },
    { id: 'touca',     emoji: '🧶', nome: 'touca' },
    { id: 'oculos',    emoji: '🕶️', nome: 'óculos' },
    { id: 'mochila',   emoji: '🎒', nome: 'mochila' },
    { id: 'cinto',     emoji: '👔', nome: 'cinto' },
    { id: 'cola',      emoji: '🦗', nome: 'cola' },
    { id: 'nada',      emoji: '🚫', nome: 'sem acessório' },
];

const ETAPAS = [
    { id: 'cabeca',      nome: 'Cabeça',  emoji: '🧢', hint: 'Escolha o que colocar na cabeça!' },
    { id: 'tronco',      nome: 'Tronco',  emoji: '👕', hint: 'Agora vamos vestir o tronco!' },
    { id: 'pernas',      nome: 'Pernas',  emoji: '👖', hint: 'Vamos vestir as pernas!' },
    { id: 'pes',         nome: 'Pés',     emoji: '👟', hint: 'Escolha os calçados!' },
    { id: 'acessorios',  nome: 'Acessórios', emoji: '⌚', hint: 'Escolha um acessório!' },
];

const OCASIOES = [
    {
        id: 'parque_inverno',
        nome: 'Parque no Inverno',
        emoji: '🧣',
        bg: 'quarto',
        descricao: 'Está frio! Vamos brincar no parque!',
        corretas: {
            cabeca:     ['gorro', 'boina', 'flores'],
            tronco:     ['casaco', 'moletom', 'jaqueta'],
            pernas:     ['jeans', 'calca_grossa', 'preto'],
            pes:        ['bota_marrom', 'tenis_fechado', 'galocha'],
            acessorios: ['cachecol', 'luvas', 'touca'],
        }
    },
    {
        id: 'escola',
        nome: 'Ir para a Escola',
        emoji: '🏫',
        bg: 'jardim',
        descricao: 'Vamos arrumar a roupa da escola!',
        corretas: {
            cabeca:     ['nenhum', 'bone', 'laco'],
            tronco:     ['verde', 'azul', 'amarela'],
            pernas:     ['jeans', 'preto', 'bege'],
            pes:        ['tenis_branco', 'tenis_fechado', 'sapatilha'],
            acessorios: ['mochila', 'relogio', 'cinto'],
        }
    },
    {
        id: 'praia',
        nome: 'Praia de Mar',
        emoji: '🏖️',
        bg: 'praia',
        descricao: 'Vamos à praia! Sol e mar!',
        corretas: {
            cabeca:     ['coroa', 'flores', 'nenhum'],
            tronco:     ['regata', 'vestido', 'amarela'],
            pernas:     ['short', 'bermuda', 'saia_longa'],
            pes:        ['chinelo', 'sandalia', 'crocs'],
            acessorios: ['oculos', 'nada', 'pulseira'],
        }
    },
    {
        id: 'piscina',
        nome: 'Piscina no Clube',
        emoji: '🏊',
        bg: 'praia',
        descricao: 'Vamos nadar na piscina!',
        corretas: {
            cabeca:     ['gorro', 'nenhum', 'coroa'],
            tronco:     ['regata', 'rosa', 'azul'],
            pernas:     ['short', 'bermuda', 'legging'],
            pes:        ['chinelo', 'crocs', 'sandalia'],
            acessorios: ['oculos', 'nada', 'pulseira'],
        }
    },
    {
        id: 'academia',
        nome: 'Academia com a Mamãe',
        emoji: '💪',
        bg: 'palco',
        descricao: 'Vamos fazer exercício!',
        corretas: {
            cabeca:     ['nenhum', 'bone', 'laco'],
            tronco:     ['regata', 'rosa', 'verde'],
            pernas:     ['legging', 'short', 'bermuda'],
            pes:        ['tenis_branco', 'tenis_fechado', 'papete'],
            acessorios: ['relogio', 'nada', 'pulseira'],
        }
    },
    {
        id: 'shopping',
        nome: 'Passeio no Shopping',
        emoji: '🛍️',
        bg: 'quarto',
        descricao: 'Vamos passear no shopping!',
        corretas: {
            cabeca:     ['laco', 'flores', 'bone'],
            tronco:     ['roxo', 'vestido', 'azul'],
            pernas:     ['jeans', 'saia_longa', 'legging'],
            pes:        ['sapatilha', 'tenis_branco', 'salto'],
            acessorios: ['pulseira', 'relogio', 'oculos'],
        }
    },
    {
        id: 'vovo',
        nome: 'Casa da Vovó',
        emoji: '👵',
        bg: 'jardim',
        descricao: 'Vamos visitar a vovó!',
        corretas: {
            cabeca:     ['flores', 'laco', 'nenhum'],
            tronco:     ['verde', 'rosa', 'amarela'],
            pernas:     ['jeans', 'saia_longa', 'bege'],
            pes:        ['sapatilha', 'tenis_branco', 'sandalia'],
            acessorios: ['pulseira', 'relogio', 'nada'],
        }
    },
    {
        id: 'festa',
        nome: 'Festa de Aniversário',
        emoji: '🎂',
        bg: 'palco',
        descricao: 'Vamos caprichar para a festa!',
        corretas: {
            cabeca:     ['coroa', 'laco', 'flores'],
            tronco:     ['vestido', 'roxo', 'rosa'],
            pernas:     ['saia_longa', 'legging', 'jeans'],
            pes:        ['salto', 'sapatilha', 'sandalia'],
            acessorios: ['pulseira', 'relogio', 'cola'],
        }
    },
];

const BG_CLASSES = { quarto: 'bg-quarto', jardim: 'bg-jardim', praia: 'bg-praia', palco: 'bg-palco' };

function atualizarEstrelas() {
    if (typeof obterEstrelas === 'function') starsEl.textContent = obterEstrelas();
}

function getOpcoes(etapaId) {
    if (etapaId === 'cabeca') return CABECA_OPCOES;
    if (etapaId === 'tronco') return TRONCO_OPCOES;
    if (etapaId === 'pernas') return PERNAS_OPCOES;
    if (etapaId === 'pes') return PES_OPCOES;
    if (etapaId === 'acessorios') return ACESSORIOS_OPCOES;
    return [];
}

function selecionarPersonagem(g) {
    genero = g;
    selectScreen.style.display = 'none';
    occasionScreen.style.display = 'block';
    renderizarOcasioes();
    setTimeout(() => {
        falar(g === 'menina' ? 'Que linda menina! Escolha a ocasião!' : 'Que legal menino! Escolha a ocasião!');
    }, 300);
}

function renderizarOcasioes() {
    const grid = document.getElementById('occasion-grid');
    grid.innerHTML = '';
    OCASIOES.forEach(oc => {
        const card = document.createElement('button');
        card.className = 'occasion-card';
        card.innerHTML = '<span class="occ-emoji">' + oc.emoji + '</span><span class="occ-name">' + oc.nome + '</span>';
        card.onclick = () => selecionarOcasiao(oc);
        grid.appendChild(card);
    });
}

function selecionarOcasiao(oc) {
    ocasiaoAtual = oc;
    occasionScreen.style.display = 'none';
    dressScreen.style.display = 'flex';
    etapaAtual = 0;
    acertosEtapa = 0;
    estado = {
        cabeca: null,
        tronco: null,
        pernas: null,
        pes: null,
        acessorios: null,
        cabelo_cor: 'castanho',
        cabelo_estilo: genero === 'menina' ? 'longo_liso' : 'curto',
    };
    dollWrapper.className = 'doll-wrapper ' + (BG_CLASSES[oc.bg] || '');
    bgSelector.querySelectorAll('.bg-btn').forEach(b => b.classList.toggle('active', b.dataset.bg === oc.bg));
    renderizarEtapa();
    renderizarBoneco();
    atualizarEstrelas();
    setTimeout(() => {
        falar(oc.descricao);
    }, 300);
}

function renderizarEtapa() {
    const etapa = ETAPAS[etapaAtual];
    stepTitle.textContent = etapa.nome + ' ' + etapa.emoji;
    stepHint.textContent = etapa.hint;
    progressDots.innerHTML = '';
    ETAPAS.forEach((e, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i < etapaAtual ? ' done' : '') + (i === etapaAtual ? ' active' : '');
        dot.textContent = i < etapaAtual ? '✓' : (i + 1);
        progressDots.appendChild(dot);
    });

    const opcoes = getOpcoes(etapa.id);
    const corretas = ocasiaoAtual.corretas[etapa.id] || [];
    const metade = Math.ceil(opcoes.length / 2);
    const leftList = opcoes.slice(0, metade);
    const rightList = opcoes.slice(metade);

    function buildOptions(list, container) {
        container.innerHTML = '';
        list.forEach(o => {
            const btn = document.createElement('button');
            const isCorrect = corretas.includes(o.id);
            btn.className = 'opt-btn' + (isCorrect ? ' hint-pulse' : '');
            let display = o.emoji || '';
            if (o.cor && !o.emoji) {
                display = '<div style="width:36px;height:36px;border-radius:8px;background:' + o.cor + ';border:2px solid #ddd;"></div>';
            }
            btn.innerHTML = display + '<span class="opt-check">✓</span>';
            btn.title = o.nome;
            btn.onclick = (e) => escolherOpcao(etapa.id, o, isCorrect, e.currentTarget);
            container.appendChild(btn);
        });
    }
    buildOptions(leftList, leftOptions);
    buildOptions(rightList, rightOptions);
}

function escolherOpcao(etapaId, opcao, isCorrect, btnEl) {
    estado[etapaId] = opcao.id;
    renderizarBoneco();

    document.querySelectorAll('.opt-btn').forEach(b => { b.classList.remove('active'); b.style.pointerEvents = 'none'; });
    if (btnEl) btnEl.classList.add('active');
    document.querySelectorAll('.hint-pulse').forEach(b => b.classList.remove('hint-pulse'));

    if (isCorrect) {
        acertosEtapa++;
        criarSparkle();
        falar('Muito bem! ' + opcao.nome + '!');
        if (typeof playSuccess === 'function') playSuccess();
    } else {
        falar('Hmm, ' + opcao.nome + ' não é o melhor para ' + ocasiaoAtual.nome + '. Tente os que estão piscando!');
        if (typeof playError === 'function') playError();
        setTimeout(() => {
            document.querySelectorAll('.opt-btn').forEach(b => { b.classList.remove('active'); b.style.pointerEvents = ''; });
            const opcoes = getOpcoes(etapaId);
            const corretas = ocasiaoAtual.corretas[etapaId] || [];
            opcoes.forEach(o => {
                if (corretas.includes(o.id)) {
                    const btns = document.querySelectorAll('.opt-btn');
                    btns.forEach(b => { if (b.title === o.nome) b.classList.add('hint-pulse'); });
                }
            });
            estado[etapaId] = null;
            renderizarBoneco();
        }, 2000);
        return;
    }

    setTimeout(() => {
        etapaAtual++;
        if (etapaAtual >= ETAPAS.length) {
            finalizarFase();
        } else {
            renderizarEtapa();
            const etapa = ETAPAS[etapaAtual];
            setTimeout(() => falar(etapa.hint), 300);
        }
    }, 1500);
}

function corCabelo() {
    const c = CORES_CABELO.find(x => x.id === estado.cabelo_cor);
    return c ? c.cor : '#6d4c41';
}

function renderizarBoneco() {
    const cc = corCabelo();
    const skin = '#ffccbc';
    const skinDark = '#e0a999';
    let svg = '';
    const estilo = estado.cabelo_estilo;
    const isGirl = genero === 'menina';
    const cx = 110;

    svg += '<defs>';
    svg += '<linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe0d0"/><stop offset="100%" stop-color="#ffccbc"/></linearGradient>';
    svg += '<linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff3e0"/><stop offset="100%" stop-color="#ffe0b2"/></linearGradient>';
    svg += '</defs>';

    if (estado.tronco) {
        const t = TRONCO_OPCOES.find(x => x.id === estado.tronco);
        const tc = t ? t.cor : '#f48fb1';
        if (estado.tronco === 'vestido') {
            svg += '<path d="M' + (cx-50) + ' 210 L' + (cx-50) + ' 290 L' + (cx-70) + ' 400 L' + (cx+70) + ' 400 L' + (cx+50) + ' 290 L' + (cx+50) + ' 210 Z" fill="' + tc + '" stroke="#c62828" stroke-width="2"/>';
            svg += '<rect x="' + (cx-50) + '" y="200" width="100" height="22" rx="10" fill="' + tc + '" stroke="#c62828" stroke-width="2"/>';
        } else {
            svg += '<path d="M' + (cx-55) + ' 205 Q' + (cx-50) + ' 195 ' + (cx-35) + ' 195 L' + (cx+35) + ' 195 Q' + (cx+50) + ' 195 ' + (cx+55) + ' 205 L' + (cx+60) + ' 270 L' + (cx-60) + ' 270 Z" fill="' + tc + '" stroke="#333" stroke-width="2" opacity="0.9"/>';
            if (['casaco','moletom','jaqueta'].includes(estado.tronco)) {
                svg += '<path d="M' + (cx-55) + ' 205 L' + (cx-60) + ' 270 L' + (cx-45) + ' 270 L' + (cx-40) + ' 205 Z" fill="' + tc + '" stroke="#333" stroke-width="1" opacity="0.7"/>';
                svg += '<path d="M' + cx + ' 195 L' + cx + ' 270" stroke="#333" stroke-width="1.5" opacity="0.5"/>';
            }
        }
    }

    if (estado.pernas && estado.tronco !== 'vestido') {
        const p = PERNAS_OPCOES.find(x => x.id === estado.pernas);
        if (p) {
            if (['short','bermuda'].includes(p.id)) {
                svg += '<rect x="' + (cx-35) + '" y="265" width="34" height="65" rx="8" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
                svg += '<rect x="' + (cx+1) + '" y="265" width="34" height="65" rx="8" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
            } else if (p.id === 'saia_longa') {
                svg += '<path d="M' + (cx-55) + ' 265 L' + (cx+55) + ' 265 L' + (cx+70) + ' 390 L' + (cx-70) + ' 390 Z" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
            } else if (p.id === 'legging') {
                svg += '<rect x="' + (cx-30) + '" y="265" width="28" height="130" rx="6" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
                svg += '<rect x="' + (cx+2) + '" y="265" width="28" height="130" rx="6" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
            } else {
                svg += '<rect x="' + (cx-35) + '" y="265" width="34" height="130" rx="8" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
                svg += '<rect x="' + (cx+1) + '" y="265" width="34" height="130" rx="8" fill="' + p.cor + '" stroke="#333" stroke-width="2"/>';
            }
        }
    }

    svg += '<rect x="' + (cx-17) + '" y="180" width="34" height="30" rx="12" fill="url(#skinG)" stroke="' + skinDark + '" stroke-width="1.5"/>';
    svg += '<rect x="' + (cx-30) + '" y="200" width="60" height="15" rx="7" fill="' + skin + '" opacity="0.4"/>';

    if (estado.pes) {
        const sp = PES_OPCOES.find(x => x.id === estado.pes);
        if (sp) {
            if (sp.id === 'salto') {
                svg += '<ellipse cx="' + (cx-30) + '" cy="405" rx="18" ry="8" fill="' + sp.cor + '" stroke="#880e4f" stroke-width="2"/>';
                svg += '<rect x="' + (cx-34) + '" y="393" width="8" height="18" fill="' + sp.cor + '"/>';
                svg += '<ellipse cx="' + (cx+10) + '" cy="405" rx="18" ry="8" fill="' + sp.cor + '" stroke="#880e4f" stroke-width="2"/>';
                svg += '<rect x="' + (cx+6) + '" y="393" width="8" height="18" fill="' + sp.cor + '"/>';
            } else if (sp.id === 'galocha') {
                svg += '<path d="M' + (cx-48) + ' 380 L' + (cx-12) + ' 380 L' + (cx-12) + ' 415 L' + (cx-48) + ' 415 Z" fill="' + sp.cor + '" stroke="#e64a19" stroke-width="2" rx="6"/>';
                svg += '<path d="M' + (cx+8) + ' 380 L' + (cx+44) + ' 380 L' + (cx+44) + ' 415 L' + (cx+8) + ' 415 Z" fill="' + sp.cor + '" stroke="#e64a19" stroke-width="2" rx="6"/>';
            } else {
                svg += '<ellipse cx="' + (cx-30) + '" cy="405" rx="18" ry="10" fill="' + sp.cor + '" stroke="#333" stroke-width="2"/>';
                svg += '<ellipse cx="' + (cx+10) + '" cy="405" rx="18" ry="10" fill="' + sp.cor + '" stroke="#333" stroke-width="2"/>';
            }
        }
    }

    svg += '<circle cx="' + cx + '" cy="105" r="45" fill="url(#skinG)" stroke="' + skinDark + '" stroke-width="2"/>';
    svg += '<ellipse cx="' + (cx-26) + '" cy="105" rx="7" ry="9" fill="#fff" stroke="#333" stroke-width="1.5"/>';
    svg += '<ellipse cx="' + (cx+26) + '" cy="105" rx="7" ry="9" fill="#fff" stroke="#333" stroke-width="1.5"/>';
    svg += '<circle cx="' + (cx-25) + '" cy="107" r="4" fill="#1a237e"/>';
    svg += '<circle cx="' + (cx+27) + '" cy="107" r="4" fill="#1a237e"/>';
    svg += '<circle cx="' + (cx-24) + '" cy="106" r="1.5" fill="#fff"/>';
    svg += '<circle cx="' + (cx+28) + '" cy="106" r="1.5" fill="#fff"/>';
    svg += '<path d="M' + (cx-20) + ' 125 Q' + cx + ' 134 ' + (cx+20) + ' 125" fill="none" stroke="#d84315" stroke-width="2.5" stroke-linecap="round"/>';
    svg += '<circle cx="' + (cx-34) + '" cy="118" r="7" fill="#f48fb1" opacity="0.4"/>';
    svg += '<circle cx="' + (cx+34) + '" cy="118" r="7" fill="#f48fb1" opacity="0.4"/>';
    svg += '<path d="M' + (cx-15) + ' 88 Q' + (cx-12) + ' 85 ' + (cx-8) + ' 88" fill="none" stroke="' + cc + '" stroke-width="2" opacity="0.5"/>';
    svg += '<path d="M' + (cx+8) + ' 88 Q' + (cx+12) + ' 85 ' + (cx+15) + ' 88" fill="none" stroke="' + cc + '" stroke-width="2" opacity="0.5"/>';

    if (estilo !== 'careca') {
        if (estilo === 'longo_liso') {
            svg += '<path d="M' + (cx-52) + ' 95 Q' + (cx-55) + ' 65 ' + cx + ' 55 Q' + (cx+55) + ' 65 ' + (cx+52) + ' 95 L' + (cx+52) + ' 190 Q' + (cx+50) + ' 195 ' + (cx+40) + ' 192 L' + (cx+40) + ' 125 L' + (cx-40) + ' 125 L' + (cx-40) + ' 192 Q' + (cx-50) + ' 195 ' + (cx-52) + ' 190 Z" fill="' + cc + '"/>';
        } else if (estilo === 'longo_ondas') {
            svg += '<path d="M' + (cx-52) + ' 95 Q' + (cx-60) + ' 65 ' + cx + ' 53 Q' + (cx+60) + ' 65 ' + (cx+52) + ' 95 Q' + (cx+58) + ' 115 ' + (cx+52) + ' 135 Q' + (cx+58) + ' 155 ' + (cx+52) + ' 175 Q' + (cx+50) + ' 185 ' + (cx+40) + ' 183 L' + (cx+40) + ' 125 L' + (cx-40) + ' 125 L' + (cx-40) + ' 183 Q' + (cx-50) + ' 185 ' + (cx-52) + ' 175 Q' + (cx-58) + ' 155 ' + (cx-52) + ' 135 Q' + (cx-58) + ' 115 ' + (cx-52) + ' 95 Z" fill="' + cc + '"/>';
        } else if (estilo === 'curto') {
            if (isGirl) {
                svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 63 ' + cx + ' 55 Q' + (cx+52) + ' 63 ' + (cx+48) + ' 93 L' + (cx+48) + ' 110 Q' + (cx+40) + ' 105 ' + (cx+35) + ' 110 L' + (cx-35) + ' 110 Q' + (cx-40) + ' 105 ' + (cx-48) + ' 110 Z" fill="' + cc + '"/>';
            } else {
                svg += '<path d="M' + (cx-50) + ' 90 Q' + (cx-52) + ' 60 ' + cx + ' 53 Q' + (cx+52) + ' 60 ' + (cx+50) + ' 90 L' + (cx+50) + ' 100 Q' + (cx+40) + ' 95 ' + (cx+30) + ' 97 L' + (cx-30) + ' 97 Q' + (cx-40) + ' 95 ' + (cx-50) + ' 100 Z" fill="' + cc + '"/>';
            }
        } else if (estilo === 'rabo_cavalo') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 63 ' + cx + ' 55 Q' + (cx+52) + ' 63 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx+45) + ' 85 Q' + (cx+70) + ' 105 ' + (cx+65) + ' 165 Q' + (cx+60) + ' 175 ' + (cx+50) + ' 170 Q' + (cx+55) + ' 125 ' + (cx+40) + ' 100 Z" fill="' + cc + '"/>';
        } else if (estilo === 'tranca') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 63 ' + cx + ' 55 Q' + (cx+52) + ' 63 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx-20) + ' 105 L' + (cx+20) + ' 105 L' + (cx+18) + ' 135 L' + (cx+22) + ' 145 L' + (cx+18) + ' 155 L' + (cx+22) + ' 165 L' + (cx+18) + ' 175 L' + (cx+22) + ' 185" fill="none" stroke="' + cc + '" stroke-width="7" stroke-linecap="round"/>';
        } else if (estilo === 'cocar') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 63 ' + cx + ' 55 Q' + (cx+52) + ' 63 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="' + cc + '"/>';
            svg += '<circle cx="' + cx + '" cy="65" r="22" fill="' + cc + '" opacity="0.85"/>';
        } else if (estilo === 'moicano') {
            svg += '<path d="M' + (cx-50) + ' 90 Q' + (cx-52) + ' 60 ' + cx + ' 53 Q' + (cx+52) + ' 60 ' + (cx+50) + ' 90 L' + (cx+50) + ' 100 Q' + (cx+40) + ' 95 ' + (cx+30) + ' 97 L' + (cx-30) + ' 97 Q' + (cx-40) + ' 95 ' + (cx-50) + ' 100 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx-25) + ' 55 L' + (cx+25) + ' 55 L' + (cx+20) + ' 38 L' + (cx-20) + ' 38 Z" fill="' + cc + '"/>';
        } else if (estilo === 'lateral') {
            svg += '<path d="M' + (cx-55) + ' 90 Q' + (cx-55) + ' 60 ' + cx + ' 53 Q' + (cx+55) + ' 60 ' + (cx+55) + ' 90 L' + (cx+55) + ' 100 Q' + (cx+45) + ' 95 ' + (cx+35) + ' 97 L' + (cx-35) + ' 97 Q' + (cx-45) + ' 95 ' + (cx-55) + ' 100 Z" fill="' + cc + '"/>';
        } else if (estilo === 'cacheado') {
            for (let px = (cx-48); px <= (cx+48); px += 13) {
                svg += '<circle cx="' + px + '" cy="75" r="13" fill="' + cc + '"/>';
                svg += '<circle cx="' + px + '" cy="90" r="11" fill="' + cc + '"/>';
            }
            svg += '<circle cx="' + cx + '" cy="60" r="15" fill="' + cc + '"/>';
        }
    }

    if (estado.cabeca && estado.cabeca !== 'nenhum') {
        if (estado.cabeca === 'coroa') {
            svg += '<path d="M' + (cx-35) + ' 60 L' + (cx-30) + ' 38 L' + (cx-22) + ' 55 L' + cx + ' 33 L' + (cx+22) + ' 55 L' + (cx+30) + ' 38 L' + (cx+35) + ' 60 Z" fill="#ffd700" stroke="#f57f17" stroke-width="2"/>';
            svg += '<rect x="' + (cx-35) + '" y="58" width="70" height="7" rx="3" fill="#ffd700" stroke="#f57f17" stroke-width="1.5"/>';
            svg += '<circle cx="' + cx + '" cy="42" r="3.5" fill="#e91e63"/>';
        } else if (estado.cabeca === 'laco') {
            svg += '<path d="M' + (cx-25) + ' 60 Q' + (cx-35) + ' 50 ' + (cx-30) + ' 43 Q' + (cx-20) + ' 40 ' + (cx-15) + ' 53 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx+25) + ' 60 Q' + (cx+35) + ' 50 ' + (cx+30) + ' 43 Q' + (cx+20) + ' 40 ' + (cx+15) + ' 53 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<circle cx="' + cx + '" cy="55" r="7" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
        } else if (estado.cabeca === 'flores') {
            svg += '<circle cx="' + (cx-35) + '" cy="63" r="8" fill="#f48fb1"/><circle cx="' + (cx-35) + '" cy="63" r="3.5" fill="#fff176"/>';
            svg += '<circle cx="' + cx + '" cy="57" r="8" fill="#ce93d8"/><circle cx="' + cx + '" cy="57" r="3.5" fill="#fff176"/>';
            svg += '<circle cx="' + (cx+35) + '" cy="63" r="8" fill="#81c784"/><circle cx="' + (cx+35) + '" cy="63" r="3.5" fill="#fff176"/>';
        } else if (estado.cabeca === 'boina') {
            svg += '<ellipse cx="' + cx + '" cy="60" rx="38" ry="16" fill="#5c6bc0" stroke="#283593" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="52" r="6" fill="#3f51b5"/>';
        } else if (estado.cabeca === 'bone') {
            svg += '<path d="M' + (cx-45) + ' 65 Q' + (cx-45) + ' 48 ' + cx + ' 45 Q' + (cx+45) + ' 48 ' + (cx+45) + ' 65 L' + (cx+45) + ' 70 L' + (cx-45) + ' 70 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<path d="M' + (cx+45) + ' 65 Q' + (cx+60) + ' 67 ' + (cx+60) + ' 73 L' + (cx+45) + ' 73 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
        } else if (estado.cabeca === 'cowboy') {
            svg += '<ellipse cx="' + cx + '" cy="63" rx="55" ry="9" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<path d="M' + (cx-25) + ' 63 Q' + (cx-25) + ' 38 ' + cx + ' 36 Q' + (cx+25) + ' 38 ' + (cx+25) + ' 63 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
        } else if (estado.cabeca === 'pirata') {
            svg += '<path d="M' + (cx-45) + ' 65 Q' + (cx-45) + ' 43 ' + cx + ' 41 Q' + (cx+45) + ' 43 ' + (cx+45) + ' 65 L' + (cx+45) + ' 70 L' + (cx-45) + ' 70 Z" fill="#212121" stroke="#000" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="54" r="9" fill="#fff"/>';
        } else if (estado.cabeca === 'gorro') {
            svg += '<path d="M' + (cx-40) + ' 65 Q' + (cx-40) + ' 35 ' + cx + ' 33 Q' + (cx+40) + ' 35 ' + (cx+40) + ' 65 Z" fill="#e53935" stroke="#c62828" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="35" r="6" fill="#fff"/>';
            svg += '<rect x="' + (cx-42) + '" y="62" width="84" height="8" rx="4" fill="#fff" opacity="0.8"/>';
        } else if (estado.cabeca === 'orelhas') {
            svg += '<path d="M' + (cx-40) + ' 70 L' + (cx-45) + ' 45 L' + (cx-30) + ' 55 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx+40) + ' 70 L' + (cx+45) + ' 45 L' + (cx+30) + ' 55 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx-38) + ' 65 L' + (cx-40) + ' 52 L' + (cx-33) + ' 58 Z" fill="#f48fb1"/>';
            svg += '<path d="M' + (cx+38) + ' 65 L' + (cx+40) + ' 52 L' + (cx+33) + ' 58 Z" fill="#f48fb1"/>';
        }
    }

    if (estado.acessorios && estado.acessorios !== 'nada') {
        if (estado.acessorios === 'relogio') {
            svg += '<circle cx="' + (cx-55) + '" cy="230" r="8" fill="#333" stroke="#ffd700" stroke-width="2"/>';
            svg += '<circle cx="' + (cx-55) + '" cy="230" r="4" fill="#fff"/>';
        } else if (estado.acessorios === 'pulseira') {
            svg += '<rect x="' + (cx+48) + '" y="225" width="14" height="6" rx="3" fill="#ffd700" stroke="#f57f17" stroke-width="1"/>';
        } else if (estado.acessorios === 'cachecol') {
            svg += '<path d="M' + (cx-50) + ' 195 Q' + cx + ' 205 ' + (cx+50) + ' 195 L' + (cx+50) + ' 215 Q' + cx + ' 225 ' + (cx-50) + ' 215 Z" fill="#e53935" stroke="#c62828" stroke-width="2"/>';
            svg += '<path d="M' + (cx+40) + ' 210 L' + (cx+50) + ' 240 L' + (cx+35) + ' 235 Z" fill="#e53935" stroke="#c62828" stroke-width="1.5"/>';
        } else if (estado.acessorios === 'luvas') {
            svg += '<rect x="' + (cx-65) + '" y="240" width="18" height="25" rx="6" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<rect x="' + (cx+47) + '" y="240" width="18" height="25" rx="6" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
        } else if (estado.acessorios === 'touca') {
            svg += '<ellipse cx="' + cx + '" cy="58" rx="40" ry="18" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="48" r="6" fill="#fff"/>';
        } else if (estado.acessorios === 'oculos') {
            svg += '<circle cx="' + (cx-18) + '" cy="105" r="12" fill="none" stroke="#333" stroke-width="3"/>';
            svg += '<circle cx="' + (cx+18) + '" cy="105" r="12" fill="none" stroke="#333" stroke-width="3"/>';
            svg += '<path d="M' + (cx-6) + ' 105 L' + (cx+6) + ' 105" stroke="#333" stroke-width="3"/>';
        } else if (estado.acessorios === 'mochila') {
            svg += '<rect x="' + (cx-70) + '" y="210" width="25" height="40" rx="8" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>';
            svg += '<rect x="' + (cx-68) + '" y="220" width="21" height="12" rx="4" fill="#fff" opacity="0.4"/>';
        } else if (estado.acessorios === 'cinto') {
            svg += '<rect x="' + (cx-40) + '" y="262" width="80" height="8" fill="#5d4037" stroke="#3e2723" stroke-width="1"/>';
            svg += '<rect x="' + (cx-6) + '" y="262" width="12" height="8" fill="#ffd700"/>';
        } else if (estado.acessorios === 'cola') {
            svg += '<circle cx="' + (cx+55) + '" cy="230" r="5" fill="#4caf50"/>';
            svg += '<path d="M' + (cx+55) + ' 235 L' + (cx+55) + ' 255" stroke="#4caf50" stroke-width="2"/>';
        }
    }

    dollSvg.innerHTML = svg;
}

function criarSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    s.style.left = (30 + Math.random() * 40) + '%';
    s.style.top = (20 + Math.random() * 60) + '%';
    dollWrapper.appendChild(s);
    setTimeout(() => s.remove(), 800);
}

function finalizarFase() {
    const svgClone = dollSvg.cloneNode(true);
    svgClone.setAttribute('viewBox', '0 0 220 440');
    finalDoll.innerHTML = '';
    finalDoll.appendChild(svgClone);

    celebTitle.textContent = 'Você vestiu para ' + ocasiaoAtual.nome + '! ' + ocasiaoAtual.emoji;
    celebration.style.display = 'flex';

    falar('Parabéns! Você vestiu a boneca para ' + ocasiaoAtual.nome + '!');
    if (typeof playSuccess === 'function') playSuccess();
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    atualizarEstrelas();

    for (let i = 0; i < 40; i++) {
        setTimeout(() => criarConfetti(), i * 50);
    }
}

function criarConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = ['#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#ffeb3b', '#ff9800', '#f44336'][Math.floor(Math.random() * 8)];
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
}

function reiniciar() {
    celebration.style.display = 'none';
    dressScreen.style.display = 'none';
    occasionScreen.style.display = 'block';
    genero = null;
    ocasiaoAtual = null;
    etapaAtual = 0;
    estado = {};
    leftOptions.innerHTML = '';
    rightOptions.innerHTML = '';
    dollWrapper.className = 'doll-wrapper';
}

document.querySelectorAll('.char-btn').forEach(btn => {
    btn.onclick = () => selecionarPersonagem(btn.dataset.genero);
});

btnRestart.onclick = reiniciar;

bgSelector.querySelectorAll('.bg-btn').forEach(btn => {
    btn.onclick = () => {
        dollWrapper.className = 'doll-wrapper ' + (BG_CLASSES[btn.dataset.bg] || '');
        bgSelector.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});

atualizarEstrelas();

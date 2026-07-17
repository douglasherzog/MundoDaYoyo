const selectScreen = document.getElementById('select-screen');
const occasionScreen = document.getElementById('occasion-screen');
const dressScreen = document.getElementById('dress-screen');
const dollSvg = document.getElementById('doll');
const dollWrapper = document.getElementById('doll-wrapper');
const leftOptions = document.getElementById('left-options');
const rightOptions = document.getElementById('right-options');
const stepTitle = document.getElementById('step-title');
const stepHint = document.getElementById('step-hint');
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
let bloquearClick = false;
let timeoutPendente = null;
let expressao = 'neutral';

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

const CABECA_OPCOES = [
    { id: 'bone', nome: 'boné' }, { id: 'boina', nome: 'boina' },
    { id: 'flores', nome: 'flores', g: 'f' }, { id: 'coroa', nome: 'coroa' },
    { id: 'cowboy', nome: 'chapéu de cowboy' }, { id: 'pirata', nome: 'chapéu de pirata' },
    { id: 'laco', nome: 'laço', g: 'f' }, { id: 'gorro', nome: 'gorro' },
    { id: 'orelhas', nome: 'orelhas de gato', g: 'f' }, { id: 'nenhum', nome: 'sem chapéu' },
];

const TRONCO_OPCOES = [
    { id: 'rosa', nome: 'blusa rosa' }, { id: 'verde', nome: 'blusa verde' },
    { id: 'azul', nome: 'blusa azul' }, { id: 'amarela', nome: 'blusa amarela' },
    { id: 'roxo', nome: 'blusa roxa' }, { id: 'vestido', nome: 'vestido vermelho', g: 'f' },
    { id: 'casaco', nome: 'casaco' }, { id: 'moletom', nome: 'moletom' },
    { id: 'jaqueta', nome: 'jaqueta' }, { id: 'regata', nome: 'regata' },
];

const PERNAS_OPCOES = [
    { id: 'jeans', nome: 'calça jeans' }, { id: 'preto', nome: 'calça preta' },
    { id: 'bege', nome: 'calça bege' }, { id: 'verde', nome: 'calça verde' },
    { id: 'vermelha', nome: 'calça vermelha' }, { id: 'short', nome: 'short' },
    { id: 'calca_grossa', nome: 'calça grossa' }, { id: 'legging', nome: 'legging', g: 'f' },
    { id: 'saia_longa', nome: 'saia longa', g: 'f' }, { id: 'bermuda', nome: 'bermuda' },
];

const PES_OPCOES = [
    { id: 'sapatilha', nome: 'sapatilha', g: 'f' }, { id: 'tenis_branco', nome: 'tênis branco' },
    { id: 'bota_marrom', nome: 'bota marrom' }, { id: 'sandalia', nome: 'sandália' },
    { id: 'salto', nome: 'salto', g: 'f' }, { id: 'galocha', nome: 'galocha' },
    { id: 'chinelo', nome: 'chinelo' }, { id: 'tenis_fechado', nome: 'tênis fechado' },
    { id: 'papete', nome: 'papete' }, { id: 'crocs', nome: 'crocs' },
];

const ACESSORIOS_OPCOES = [
    { id: 'relogio', nome: 'relógio' }, { id: 'pulseira', nome: 'pulseira', g: 'f' },
    { id: 'cachecol', nome: 'cachecol' }, { id: 'luvas', nome: 'luvas' },
    { id: 'touca', nome: 'touca' }, { id: 'oculos', nome: 'óculos' },
    { id: 'mochila', nome: 'mochila' }, { id: 'cinto', nome: 'cinto' },
    { id: 'cola', nome: 'cola', g: 'f' }, { id: 'nada', nome: 'sem acessório' },
];

const ETAPAS = [
    { id: 'cabeca', nome: 'Cabeça', emoji: '🧢', hint: 'Escolha o que colocar na cabeça!' },
    { id: 'tronco', nome: 'Tronco', emoji: '👕', hint: 'Agora vamos vestir o tronco!' },
    { id: 'pernas', nome: 'Pernas', emoji: '👖', hint: 'Vamos vestir as pernas!' },
    { id: 'pes', nome: 'Pés', emoji: '👟', hint: 'Escolha os calçados!' },
    { id: 'acessorios', nome: 'Acessórios', emoji: '⌚', hint: 'Escolha um acessório!' },
];

const OCASIOES = [
    { id: 'parque_inverno', nome: 'Parque no Inverno', emoji: '🧣', bg: 'quarto', descricao: 'Está frio! Vamos brincar no parque!',
      corretas: {
        menina: { cabeca: ['gorro','boina','cowboy'], tronco: ['casaco','moletom','jaqueta'], pernas: ['jeans','calca_grossa','preto'], pes: ['bota_marrom','tenis_fechado','galocha'], acessorios: ['cachecol','luvas','touca'] },
        menino: { cabeca: ['gorro','boina','cowboy'], tronco: ['casaco','moletom','jaqueta'], pernas: ['jeans','calca_grossa','preto'], pes: ['bota_marrom','tenis_fechado','galocha'], acessorios: ['cachecol','luvas','touca'] }
      } },
    { id: 'escola', nome: 'Ir para a Escola', emoji: '🏫', bg: 'jardim', descricao: 'Vamos arrumar a roupa da escola!',
      corretas: {
        menina: { cabeca: ['nenhum','bone','laco'], tronco: ['verde','azul','amarela'], pernas: ['jeans','preto','bege'], pes: ['tenis_branco','tenis_fechado','sapatilha'], acessorios: ['mochila','relogio','cinto'] },
        menino: { cabeca: ['nenhum','bone','boina'], tronco: ['verde','azul','amarela'], pernas: ['jeans','preto','bege'], pes: ['tenis_branco','tenis_fechado','papete'], acessorios: ['mochila','relogio','cinto'] }
      } },
    { id: 'praia', nome: 'Praia de Mar', emoji: '🏖️', bg: 'praia', descricao: 'Vamos à praia! Sol e mar!',
      corretas: {
        menina: { cabeca: ['coroa','flores','nenhum'], tronco: ['regata','vestido','amarela'], pernas: ['short','bermuda','saia_longa'], pes: ['chinelo','sandalia','crocs'], acessorios: ['oculos','nada','pulseira'] },
        menino: { cabeca: ['coroa','nenhum','bone'], tronco: ['regata','amarela','azul'], pernas: ['short','bermuda','jeans'], pes: ['chinelo','crocs','papete'], acessorios: ['oculos','nada','relogio'] }
      } },
    { id: 'piscina', nome: 'Piscina no Clube', emoji: '🏊', bg: 'praia', descricao: 'Vamos nadar na piscina!',
      corretas: {
        menina: { cabeca: ['nenhum','bone','laco'], tronco: ['regata','rosa','azul'], pernas: ['short','bermuda','legging'], pes: ['chinelo','crocs','sandalia'], acessorios: ['oculos','nada','pulseira'] },
        menino: { cabeca: ['nenhum','bone','boina'], tronco: ['regata','rosa','azul'], pernas: ['short','bermuda','jeans'], pes: ['chinelo','crocs','sandalia'], acessorios: ['oculos','nada','relogio'] }
      } },
    { id: 'academia', nome: 'Academia com a Mamãe', emoji: '💪', bg: 'palco', descricao: 'Vamos fazer exercício!',
      corretas: {
        menina: { cabeca: ['nenhum','bone','laco'], tronco: ['regata','rosa','verde'], pernas: ['legging','short','bermuda'], pes: ['tenis_branco','tenis_fechado','papete'], acessorios: ['relogio','nada','pulseira'] },
        menino: { cabeca: ['nenhum','bone','boina'], tronco: ['regata','rosa','verde'], pernas: ['short','bermuda','jeans'], pes: ['tenis_branco','tenis_fechado','papete'], acessorios: ['relogio','nada','cinto'] }
      } },
    { id: 'shopping', nome: 'Passeio no Shopping', emoji: '🛍️', bg: 'quarto', descricao: 'Vamos passear no shopping!',
      corretas: {
        menina: { cabeca: ['laco','flores','bone'], tronco: ['roxo','vestido','azul'], pernas: ['jeans','saia_longa','legging'], pes: ['sapatilha','tenis_branco','salto'], acessorios: ['pulseira','relogio','oculos'] },
        menino: { cabeca: ['bone','boina','nenhum'], tronco: ['roxo','azul','verde'], pernas: ['jeans','preto','bege'], pes: ['tenis_branco','papete','crocs'], acessorios: ['relogio','oculos','cinto'] }
      } },
    { id: 'vovo', nome: 'Casa da Vovó', emoji: '👵', bg: 'jardim', descricao: 'Vamos visitar a vovó!',
      corretas: {
        menina: { cabeca: ['flores','laco','nenhum'], tronco: ['verde','rosa','amarela'], pernas: ['jeans','saia_longa','bege'], pes: ['sapatilha','tenis_branco','sandalia'], acessorios: ['pulseira','relogio','nada'] },
        menino: { cabeca: ['nenhum','bone','boina'], tronco: ['verde','azul','amarela'], pernas: ['jeans','bege','preto'], pes: ['tenis_branco','papete','sandalia'], acessorios: ['relogio','cinto','nada'] }
      } },
    { id: 'festa', nome: 'Festa de Aniversário', emoji: '🎂', bg: 'palco', descricao: 'Vamos caprichar para a festa!',
      corretas: {
        menina: { cabeca: ['coroa','laco','flores'], tronco: ['vestido','roxo','rosa'], pernas: ['saia_longa','legging','jeans'], pes: ['salto','sapatilha','sandalia'], acessorios: ['pulseira','relogio','cola'] },
        menino: { cabeca: ['coroa','boina','cowboy'], tronco: ['roxo','azul','casaco'], pernas: ['jeans','preto','bege'], pes: ['tenis_branco','papete','sandalia'], acessorios: ['relogio','cinto','oculos'] }
      } },
];

const BG_CLASSES = { quarto: 'bg-quarto', jardim: 'bg-jardim', praia: 'bg-praia', palco: 'bg-palco' };

function atualizarEstrelas() { if (typeof obterEstrelas === 'function') starsEl.textContent = obterEstrelas(); }

function getIconForOption(etapaId, optId) {
    if (etapaId === 'cabeca') return iconHead(optId);
    if (etapaId === 'tronco') return iconTrunk(optId);
    if (etapaId === 'pernas') return iconLegs(optId);
    if (etapaId === 'pes') return iconFeet(optId);
    if (etapaId === 'acessorios') return iconAcc(optId);
    return '';
}

function getOpcoes(etapaId) {
    let lista;
    if (etapaId === 'cabeca') lista = CABECA_OPCOES;
    else if (etapaId === 'tronco') lista = TRONCO_OPCOES;
    else if (etapaId === 'pernas') lista = PERNAS_OPCOES;
    else if (etapaId === 'pes') lista = PES_OPCOES;
    else if (etapaId === 'acessorios') lista = ACESSORIOS_OPCOES;
    else return [];
    return lista.filter(o => !o.g || o.g === genero);
}

function selecionarPersonagem(g) {
    genero = g;
    selectScreen.style.display = 'none';
    occasionScreen.style.display = 'block';
    renderizarOcasioes();
    setTimeout(() => falar(g === 'menina' ? 'Que linda menina! Escolha a ocasião!' : 'Que legal menino! Escolha a ocasião!'), 300);
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
    bloquearClick = false;
    expressao = 'neutral';
    if (timeoutPendente) { clearTimeout(timeoutPendente); timeoutPendente = null; }
    estado = { cabeca: null, tronco: null, pernas: null, pes: null, acessorios: null,
               cabelo_cor: 'castanho', cabelo_estilo: genero === 'menina' ? 'longo_liso' : 'curto' };
    dollWrapper.className = 'doll-wrapper ' + (BG_CLASSES[oc.bg] || '');
    bgSelector.querySelectorAll('.bg-btn').forEach(b => b.classList.toggle('active', b.dataset.bg === oc.bg));
    renderizarEtapa();
    renderizarBoneco();
    atualizarEstrelas();
    setTimeout(() => falar(oc.descricao), 300);
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
    const corretas = (ocasiaoAtual.corretas[genero] && ocasiaoAtual.corretas[genero][etapa.id]) || [];
    const metade = Math.ceil(opcoes.length / 2);

    function buildOptions(list, container) {
        container.innerHTML = '';
        list.forEach(o => {
            const btn = document.createElement('button');
            const isCorrect = corretas.includes(o.id);
            btn.className = 'opt-btn' + (isCorrect ? ' hint-pulse' : '');
            btn.innerHTML = getIconForOption(etapa.id, o.id) + '<span class="opt-check">✓</span>';
            btn.title = o.nome;
            btn.onclick = (e) => escolherOpcao(etapa.id, o, isCorrect, e.currentTarget);
            container.appendChild(btn);
        });
    }
    buildOptions(opcoes.slice(0, metade), leftOptions);
    buildOptions(opcoes.slice(metade), rightOptions);
}

function escolherOpcao(etapaId, opcao, isCorrect, btnEl) {
    if (bloquearClick) return;
    bloquearClick = true;
    if (timeoutPendente) { clearTimeout(timeoutPendente); timeoutPendente = null; }

    estado[etapaId] = opcao.id;
    renderizarBoneco();
    document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    document.querySelectorAll('.hint-pulse').forEach(b => b.classList.remove('hint-pulse'));

    if (isCorrect) {
        expressao = 'happy';
        renderizarBoneco();
        criarSparkle();
        falar('Muito bem! ' + opcao.nome + '!');
        if (typeof playSuccess === 'function') playSuccess();

        timeoutPendente = setTimeout(() => {
            expressao = 'neutral';
            etapaAtual++;
            bloquearClick = false;
            timeoutPendente = null;
            if (etapaAtual >= ETAPAS.length) {
                finalizarFase();
            } else {
                renderizarEtapa();
                renderizarBoneco();
                setTimeout(() => falar(ETAPAS[etapaAtual].hint), 300);
            }
        }, 1500);
    } else {
        expressao = 'sad';
        renderizarBoneco();
        falar('Hmm, ' + opcao.nome + ' não é o melhor para ' + ocasiaoAtual.nome + '. Tente os que estão piscando!');
        if (typeof playError === 'function') playError();

        timeoutPendente = setTimeout(() => {
            expressao = 'neutral';
            bloquearClick = false;
            timeoutPendente = null;
            document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            const opcoes = getOpcoes(etapaId);
            const corretas = (ocasiaoAtual.corretas[genero] && ocasiaoAtual.corretas[genero][etapaId]) || [];
            opcoes.forEach(o => {
                if (corretas.includes(o.id)) {
                    document.querySelectorAll('.opt-btn').forEach(b => { if (b.title === o.nome) b.classList.add('hint-pulse'); });
                }
            });
            estado[etapaId] = null;
            renderizarBoneco();
        }, 2000);
    }
}

function corCabelo() { const c = CORES_CABELO.find(x => x.id === estado.cabelo_cor); return c ? c.cor : '#6d4c41'; }

/* ====== DOLL SVG RENDERING ====== */
function renderizarBoneco() {
    const cc = corCabelo();
    const ccLight = shadeColor(cc, 15);
    const isGirl = genero === 'menina';
    const cx = 110;
    const estilo = estado.cabelo_estilo || (isGirl ? 'longo_liso' : 'curto');
    let svg = '';

    svg += '<defs>';
    svg += '<linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe5d9"/><stop offset="100%" stop-color="#ffccbc"/></linearGradient>';
    svg += '<linearGradient id="skinG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff0e8"/><stop offset="100%" stop-color="#ffccbc"/></linearGradient>';
    svg += '<radialGradient id="cheekG"><stop offset="0%" stop-color="#f48fb1" stop-opacity="0.5"/><stop offset="100%" stop-color="#f48fb1" stop-opacity="0"/></radialGradient>';
    svg += '<linearGradient id="hairG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + ccLight + '"/><stop offset="100%" stop-color="' + shadeColor(cc, -20) + '"/></linearGradient>';
    svg += '</defs>';

    // ===== BODY (breathing) =====
    svg += '<g class="doll-body">';

    // Legs (skin)
    svg += '<path d="M' + (cx-22) + ' 280 L' + (cx-22) + ' 395 Q' + (cx-22) + ' 405 ' + (cx-16) + ' 405 L' + (cx-10) + ' 405 Q' + (cx-8) + ' 405 ' + (cx-8) + ' 395 L' + (cx-8) + ' 285 Z" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<path d="M' + (cx+8) + ' 285 L' + (cx+8) + ' 395 Q' + (cx+8) + ' 405 ' + (cx+10) + ' 405 L' + (cx+16) + ' 405 Q' + (cx+22) + ' 405 ' + (cx+22) + ' 395 L' + (cx+22) + ' 280 Z" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/>';

    // Arms
    svg += '<g class="arm-left"><path d="M' + (cx-42) + ' 200 Q' + (cx-55) + ' 230 ' + (cx-52) + ' 270 Q' + (cx-50) + ' 280 ' + (cx-44) + ' 278 Q' + (cx-42) + ' 240 ' + (cx-38) + ' 210 Z" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/></g>';
    svg += '<g class="arm-right"><path d="M' + (cx+42) + ' 200 Q' + (cx+55) + ' 230 ' + (cx+52) + ' 270 Q' + (cx+50) + ' 280 ' + (cx+44) + ' 278 Q' + (cx+42) + ' 240 ' + (cx+38) + ' 210 Z" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/></g>';

    // Hands
    svg += '<circle cx="' + (cx-48) + '" cy="278" r="8" fill="url(#skinG)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<circle cx="' + (cx+48) + '" cy="278" r="8" fill="url(#skinG)" stroke="#e0a999" stroke-width="1.5"/>';

    // Torso base
    svg += '<path d="M' + (cx-44) + ' 175 Q' + (cx-46) + ' 182 ' + (cx-42) + ' 195 Q' + (cx-40) + ' 210 ' + (cx-40) + ' 230 L' + (cx-42) + ' 270 L' + (cx+42) + ' 270 L' + (cx+40) + ' 230 Q' + (cx+40) + ' 210 ' + (cx+42) + ' 195 Q' + (cx+46) + ' 182 ' + (cx+44) + ' 175 Z" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<path d="M' + (cx-35) + ' 185 Q' + cx + ' 192 ' + (cx+35) + ' 185" fill="none" stroke="' + shadeColor('#ffccbc', -10) + '" stroke-width="1.5" opacity="0.3"/>';
    svg += '<path d="M' + (cx-28) + ' 225 Q' + cx + ' 230 ' + (cx+28) + ' 225" fill="none" stroke="' + shadeColor('#ffccbc', -8) + '" stroke-width="1" opacity="0.15"/>';

    // Neck
    svg += '<rect x="' + (cx-14) + '" y="155" width="28" height="28" rx="10" fill="url(#skinG)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<ellipse cx="' + cx + '" cy="160" rx="16" ry="4" fill="' + shadeColor('#ffccbc', -15) + '" opacity="0.35"/>';

    // === TRONCO CLOTHING ===
    if (estado.tronco) {
        const tc = getTroncoColor(estado.tronco);
        const tcD = shadeColor(tc, -25);
        if (estado.tronco === 'vestido') {
            svg += '<path d="M' + (cx-40) + ' 175 L' + (cx-42) + ' 210 L' + (cx-55) + ' 270 L' + (cx-75) + ' 390 L' + (cx+75) + ' 390 L' + (cx+55) + ' 270 L' + (cx+42) + ' 210 L' + (cx+40) + ' 175 Z" fill="' + tc + '" stroke="' + tcD + '" stroke-width="2"/>';
            svg += '<path d="M' + (cx-38) + ' 178 Q' + (cx-30) + ' 172 ' + (cx-20) + ' 172 L' + (cx+20) + ' 172 Q' + (cx+30) + ' 172 ' + (cx+38) + ' 178" fill="none" stroke="' + tcD + '" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx-50) + ' 300 Q' + cx + ' 310 ' + (cx+50) + ' 300" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>';
            svg += '<circle cx="' + cx + '" cy="250" r="3" fill="#fff" opacity="0.3"/>';
            svg += '<path d="M' + (cx-30) + ' 320 Q' + cx + ' 325 ' + (cx+30) + ' 320" fill="none" stroke="' + tcD + '" stroke-width="1" opacity="0.15"/>';
            svg += '<path d="M' + (cx-50) + ' 360 Q' + cx + ' 365 ' + (cx+50) + ' 360" fill="none" stroke="' + tcD + '" stroke-width="1" opacity="0.15"/>';
        } else if (['casaco','moletom','jaqueta'].includes(estado.tronco)) {
            svg += '<path d="M' + (cx-42) + ' 172 Q' + (cx-45) + ' 195 ' + (cx-43) + ' 210 L' + (cx-45) + ' 272 L' + (cx+45) + ' 272 L' + (cx+43) + ' 210 Q' + (cx+45) + ' 195 ' + (cx+42) + ' 172 Z" fill="' + tc + '" stroke="' + tcD + '" stroke-width="2"/>';
            svg += '<path d="M' + (cx-30) + ' 172 Q' + (cx-25) + ' 165 ' + cx + ' 170 Q' + (cx+25) + ' 165 ' + (cx+30) + ' 172 L' + (cx+25) + ' 180 L' + cx + ' 175 L' + (cx-25) + ' 180 Z" fill="' + shadeColor(tc, 10) + '" stroke="' + tcD + '" stroke-width="1.5"/>';
            svg += '<line x1="' + cx + '" y1="175" x2="' + cx + '" y2="270" stroke="' + tcD + '" stroke-width="1.5" opacity="0.6"/>';
            if (estado.tronco === 'casaco') { svg += '<circle cx="' + cx + '" cy="200" r="2" fill="' + tcD + '"/><circle cx="' + cx + '" cy="220" r="2" fill="' + tcD + '"/><circle cx="' + cx + '" cy="240" r="2" fill="' + tcD + '"/>'; }
            if (estado.tronco === 'jaqueta') { svg += '<rect x="' + (cx-8) + '" y="195" width="16" height="4" rx="2" fill="#ffd700"/>'; }
            if (estado.tronco === 'moletom') {
                svg += '<path d="M' + (cx-43) + ' 255 L' + (cx+43) + ' 255 L' + (cx+46) + ' 272 L' + (cx-46) + ' 272 Z" fill="' + shadeColor(tc, -10) + '" stroke="' + tcD + '" stroke-width="1.5"/>';
                svg += '<path d="M' + (cx-43) + ' 258 L' + (cx+43) + ' 258" stroke="#fff" stroke-width="1" opacity="0.3"/>';
            }
            svg += '<path d="M' + (cx-30) + ' 220 Q' + cx + ' 225 ' + (cx+30) + ' 220" fill="none" stroke="' + tcD + '" stroke-width="1" opacity="0.15"/>';
        } else if (estado.tronco === 'regata') {
            svg += '<path d="M' + (cx-30) + ' 175 L' + (cx-35) + ' 172 L' + (cx-25) + ' 168 L' + (cx-15) + ' 172 L' + (cx+15) + ' 172 L' + (cx+25) + ' 168 L' + (cx+35) + ' 172 L' + (cx+30) + ' 175 L' + (cx+40) + ' 210 L' + (cx+42) + ' 270 L' + (cx-42) + ' 270 L' + (cx-40) + ' 210 Z" fill="' + tc + '" stroke="' + tcD + '" stroke-width="2"/>';
        } else {
            svg += '<path d="M' + (cx-40) + ' 175 Q' + (cx-43) + ' 195 ' + (cx-41) + ' 210 L' + (cx-43) + ' 270 L' + (cx+43) + ' 270 L' + (cx+41) + ' 210 Q' + (cx+43) + ' 195 ' + (cx+40) + ' 175 Z" fill="' + tc + '" stroke="' + tcD + '" stroke-width="2"/>';
            svg += '<path d="M' + (cx-18) + ' 175 Q' + (cx-12) + ' 170 ' + cx + ' 172 Q' + (cx+12) + ' 170 ' + (cx+18) + ' 175" fill="none" stroke="' + tcD + '" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx-35) + ' 210 Q' + cx + ' 215 ' + (cx+35) + ' 210" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.25"/>';
            svg += '<path d="M' + (cx-25) + ' 240 Q' + cx + ' 245 ' + (cx+25) + ' 240" fill="none" stroke="' + tcD + '" stroke-width="1" opacity="0.2"/>';
        }
    }

    // === PERNAS CLOTHING ===
    if (estado.pernas && estado.tronco !== 'vestido') {
        const pc = getPernasColor(estado.pernas);
        const pcD = shadeColor(pc, -25);
        if (['short','bermuda'].includes(estado.pernas)) {
            const h = estado.pernas === 'short' ? 55 : 75;
            svg += '<path d="M' + (cx-30) + ' 270 L' + (cx-32) + ' ' + (270+h) + ' L' + (cx-10) + ' ' + (270+h) + ' L' + (cx-8) + ' 285 L' + (cx+8) + ' 285 L' + (cx+10) + ' ' + (270+h) + ' L' + (cx+32) + ' ' + (270+h) + ' L' + (cx+30) + ' 270 Z" fill="' + pc + '" stroke="' + pcD + '" stroke-width="2"/>';
        } else if (estado.pernas === 'saia_longa') {
            svg += '<path d="M' + (cx-40) + ' 270 L' + (cx+40) + ' 270 L' + (cx+65) + ' 395 L' + (cx-65) + ' 395 Z" fill="' + pc + '" stroke="' + pcD + '" stroke-width="2"/>';
            svg += '<path d="M' + (cx-35) + ' 290 Q' + cx + ' 295 ' + (cx+35) + ' 290" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.2"/>';
            svg += '<path d="M' + (cx-45) + ' 330 Q' + cx + ' 335 ' + (cx+45) + ' 330" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.2"/>';
            svg += '<path d="M' + (cx-55) + ' 370 Q' + cx + ' 375 ' + (cx+55) + ' 370" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.2"/>';
        } else if (estado.pernas === 'legging') {
            svg += '<path d="M' + (cx-25) + ' 270 L' + (cx-27) + ' 395 L' + (cx-16) + ' 395 L' + (cx-14) + ' 285 L' + (cx+14) + ' 285 L' + (cx+16) + ' 395 L' + (cx+27) + ' 395 L' + (cx+25) + ' 270 Z" fill="' + pc + '" stroke="' + pcD + '" stroke-width="2"/>';
        } else if (estado.pernas === 'calca_grossa') {
            svg += '<path d="M' + (cx-32) + ' 270 L' + (cx-34) + ' 395 L' + (cx-18) + ' 395 L' + (cx-14) + ' 285 L' + (cx+14) + ' 285 L' + (cx+18) + ' 395 L' + (cx+34) + ' 395 L' + (cx+32) + ' 270 Z" fill="' + pc + '" stroke="' + pcD + '" stroke-width="2"/>';
            svg += '<rect x="' + (cx-32) + '" y="270" width="64" height="6" rx="3" fill="' + shadeColor(pc,-10) + '" stroke="' + pcD + '" stroke-width="1"/>';
        } else {
            svg += '<path d="M' + (cx-30) + ' 270 L' + (cx-32) + ' 395 L' + (cx-16) + ' 395 L' + (cx-12) + ' 285 L' + (cx+12) + ' 285 L' + (cx+16) + ' 395 L' + (cx+32) + ' 395 L' + (cx+30) + ' 270 Z" fill="' + pc + '" stroke="' + pcD + '" stroke-width="2"/>';
            if (estado.pernas === 'jeans') {
                svg += '<rect x="' + (cx-30) + '" y="270" width="60" height="5" rx="2" fill="' + shadeColor(pc,-15) + '"/>';
                svg += '<line x1="' + cx + '" y1="270" x2="' + cx + '" y2="285" stroke="' + pcD + '" stroke-width="1" opacity="0.4"/>';
            }
        }
    }

    // === PÉS CLOTHING ===
    if (estado.pes) {
        const sc = getPesColor(estado.pes);
        const scD = shadeColor(sc, -25);
        if (estado.pes === 'salto') {
            svg += '<ellipse cx="' + (cx-16) + '" cy="402" rx="16" ry="7" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<rect x="' + (cx-20) + '" y="392" width="8" height="14" fill="' + sc + '"/>';
            svg += '<ellipse cx="' + (cx+16) + '" cy="402" rx="16" ry="7" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<rect x="' + (cx+12) + '" y="392" width="8" height="14" fill="' + sc + '"/>';
        } else if (estado.pes === 'galocha') {
            svg += '<path d="M' + (cx-30) + ' 375 L' + (cx-8) + ' 375 L' + (cx-8) + ' 408 L' + (cx-30) + ' 408 Z" fill="' + sc + '" stroke="' + scD + '" stroke-width="2" rx="4"/>';
            svg += '<path d="M' + (cx+8) + ' 375 L' + (cx+30) + ' 375 L' + (cx+30) + ' 408 L' + (cx+8) + ' 408 Z" fill="' + sc + '" stroke="' + scD + '" stroke-width="2" rx="4"/>';
        } else if (estado.pes === 'bota_marrom') {
            svg += '<path d="M' + (cx-28) + ' 380 L' + (cx-10) + ' 380 L' + (cx-10) + ' 405 L' + (cx-32) + ' 405 L' + (cx-32) + ' 390 Z" fill="' + sc + '" stroke="' + scD + '" stroke-width="2"/>';
            svg += '<path d="M' + (cx+10) + ' 380 L' + (cx+28) + ' 380 L' + (cx+32) + ' 390 L' + (cx+32) + ' 405 L' + (cx+10) + ' 405 Z" fill="' + sc + '" stroke="' + scD + '" stroke-width="2"/>';
        } else if (estado.pes === 'chinelo') {
            svg += '<ellipse cx="' + (cx-16) + '" cy="402" rx="16" ry="8" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx-22) + ' 395 L' + (cx-20) + ' 385 L' + (cx-12) + ' 385 L' + (cx-10) + ' 395" fill="none" stroke="' + scD + '" stroke-width="2"/>';
            svg += '<ellipse cx="' + (cx+16) + '" cy="402" rx="16" ry="8" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx+10) + ' 395 L' + (cx+12) + ' 385 L' + (cx+20) + ' 385 L' + (cx+22) + ' 395" fill="none" stroke="' + scD + '" stroke-width="2"/>';
        } else if (estado.pes === 'crocs') {
            svg += '<ellipse cx="' + (cx-16) + '" cy="402" rx="16" ry="9" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<circle cx="' + (cx-20) + '" cy="398" r="1.5" fill="' + scD + '"/><circle cx="' + (cx-14) + '" cy="396" r="1.5" fill="' + scD + '"/><circle cx="' + (cx-8) + '" cy="398" r="1.5" fill="' + scD + '"/>';
            svg += '<ellipse cx="' + (cx+16) + '" cy="402" rx="16" ry="9" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<circle cx="' + (cx+8) + '" cy="398" r="1.5" fill="' + scD + '"/><circle cx="' + (cx+14) + '" cy="396" r="1.5" fill="' + scD + '"/><circle cx="' + (cx+20) + '" cy="398" r="1.5" fill="' + scD + '"/>';
        } else {
            svg += '<ellipse cx="' + (cx-16) + '" cy="402" rx="17" ry="9" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            svg += '<ellipse cx="' + (cx+16) + '" cy="402" rx="17" ry="9" fill="' + sc + '" stroke="' + scD + '" stroke-width="1.5"/>';
            if (estado.pes.includes('tenis')) {
                svg += '<path d="M' + (cx-30) + ' 402 L' + (cx-2) + ' 402" stroke="' + scD + '" stroke-width="1"/>';
                svg += '<path d="M' + (cx+2) + ' 402 L' + (cx+30) + ' 402" stroke="' + scD + '" stroke-width="1"/>';
            }
            if (estado.pes === 'sandalia') {
                svg += '<path d="M' + (cx-22) + ' 394 L' + (cx-22) + ' 402 M' + (cx-16) + ' 392 L' + (cx-16) + ' 402 M' + (cx-10) + ' 394 L' + (cx-10) + ' 402" stroke="' + scD + '" stroke-width="1.5"/>';
                svg += '<path d="M' + (cx+10) + ' 394 L' + (cx+10) + ' 402 M' + (cx+16) + ' 392 L' + (cx+16) + ' 402 M' + (cx+22) + ' 394 L' + (cx+22) + ' 402" stroke="' + scD + '" stroke-width="1.5"/>';
            }
        }
    }

    svg += '</g>'; // end doll-body

    // ===== HEAD (sway) =====
    svg += '<g class="doll-head">';

    // Hair back layer
    if (estilo !== 'careca' && ['longo_liso','longo_ondas','rabo_cavalo','tranca'].includes(estilo)) {
        svg += '<path d="M' + (cx-48) + ' 95 Q' + (cx-55) + ' 60 ' + cx + ' 48 Q' + (cx+55) + ' 60 ' + (cx+48) + ' 95 L' + (cx+48) + ' 180 Q' + (cx+45) + ' 185 ' + (cx+38) + ' 182 L' + (cx+38) + ' 120 L' + (cx-38) + ' 120 L' + (cx-38) + ' 182 Q' + (cx-45) + ' 185 ' + (cx-48) + ' 180 Z" fill="url(#hairG)"/>';
    }

    // Face
    svg += '<path d="M' + (cx-46) + ' 95 Q' + (cx-48) + ' 58 ' + cx + ' 54 Q' + (cx+48) + ' 58 ' + (cx+46) + ' 95 Q' + (cx+44) + ' 132 ' + cx + ' 146 Q' + (cx-44) + ' 132 ' + (cx-46) + ' 95 Z" fill="url(#skinG)" stroke="#e0a999" stroke-width="2"/>';
    svg += '<path d="M' + (cx-25) + ' 135 Q' + cx + ' 148 ' + (cx+25) + ' 135" fill="none" stroke="' + shadeColor('#ffccbc', -12) + '" stroke-width="2" opacity="0.3"/>';
    // Ears
    svg += '<ellipse cx="' + (cx-47) + '" cy="105" rx="6" ry="9" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<ellipse cx="' + (cx-47) + '" cy="106" rx="3" ry="5" fill="none" stroke="#e0a999" stroke-width="1" opacity="0.5"/>';
    svg += '<ellipse cx="' + (cx+47) + '" cy="105" rx="6" ry="9" fill="url(#skinG2)" stroke="#e0a999" stroke-width="1.5"/>';
    svg += '<ellipse cx="' + (cx+47) + '" cy="106" rx="3" ry="5" fill="none" stroke="#e0a999" stroke-width="1" opacity="0.5"/>';
    // Cheeks
    svg += '<circle cx="' + (cx-28) + '" cy="115" r="12" fill="url(#cheekG)"/>';
    svg += '<circle cx="' + (cx+28) + '" cy="115" r="12" fill="url(#cheekG)"/>';

    // Eyes - expression based
    if (expressao === 'happy') {
        svg += '<path d="M' + (cx-27) + ' 103 Q' + (cx-18) + ' 92 ' + (cx-9) + ' 103" stroke="#4a90d9" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+9) + ' 103 Q' + (cx+18) + ' 92 ' + (cx+27) + ' 103" stroke="#4a90d9" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
        svg += '<circle cx="' + (cx-12) + '" cy="100" r="2" fill="#fff" opacity="0.8"/>';
        svg += '<circle cx="' + (cx+24) + '" cy="100" r="2" fill="#fff" opacity="0.8"/>';
    } else if (expressao === 'sad') {
        svg += '<ellipse cx="' + (cx-18) + '" cy="104" rx="10" ry="9" fill="#fff" stroke="#e0a999" stroke-width="1"/>';
        svg += '<ellipse cx="' + (cx+18) + '" cy="104" rx="10" ry="9" fill="#fff" stroke="#e0a999" stroke-width="1"/>';
        svg += '<circle cx="' + (cx-17) + '" cy="106" r="6" fill="#4a90d9"/>';
        svg += '<circle cx="' + (cx+19) + '" cy="106" r="6" fill="#4a90d9"/>';
        svg += '<circle cx="' + (cx-17) + '" cy="106" r="3.5" fill="#1a237e"/>';
        svg += '<circle cx="' + (cx+19) + '" cy="106" r="3.5" fill="#1a237e"/>';
        svg += '<path d="M' + (cx-24) + ' 112 Q' + (cx-24) + ' 120 ' + (cx-21) + ' 122 Q' + (cx-18) + ' 120 ' + (cx-18) + ' 112 Z" fill="#42a5f5" opacity="0.6"/>';
    } else {
        svg += '<ellipse cx="' + (cx-18) + '" cy="100" rx="10" ry="12" fill="#fff" stroke="#e0a999" stroke-width="1"/>';
        svg += '<ellipse cx="' + (cx+18) + '" cy="100" rx="10" ry="12" fill="#fff" stroke="#e0a999" stroke-width="1"/>';
        svg += '<circle cx="' + (cx-17) + '" cy="102" r="7" fill="#4a90d9"/>';
        svg += '<circle cx="' + (cx+19) + '" cy="102" r="7" fill="#4a90d9"/>';
        svg += '<circle cx="' + (cx-17) + '" cy="102" r="4" fill="#1a237e"/>';
        svg += '<circle cx="' + (cx+19) + '" cy="102" r="4" fill="#1a237e"/>';
        svg += '<circle cx="' + (cx-15) + '" cy="99" r="2.5" fill="#fff"/>';
        svg += '<circle cx="' + (cx+21) + '" cy="99" r="2.5" fill="#fff"/>';
    }
    // Eyebrows - expression based
    if (expressao === 'happy') {
        svg += '<path d="M' + (cx-27) + ' 79 Q' + (cx-18) + ' 74 ' + (cx-9) + ' 79" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+9) + ' 79 Q' + (cx+18) + ' 74 ' + (cx+27) + ' 79" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    } else if (expressao === 'sad') {
        svg += '<path d="M' + (cx-27) + ' 87 L' + (cx-12) + ' 82" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+12) + ' 82 L' + (cx+27) + ' 87" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    } else {
        svg += '<path d="M' + (cx-26) + ' 84 Q' + (cx-18) + ' 81 ' + (cx-10) + ' 84" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+10) + ' 84 Q' + (cx+18) + ' 81 ' + (cx+26) + ' 84" stroke="' + cc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    }
    // Eyelashes (girl)
    if (isGirl) {
        svg += '<path d="M' + (cx-26) + ' 92 Q' + (cx-28) + ' 88 ' + (cx-29) + ' 85" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx-22) + ' 90 Q' + (cx-22) + ' 86 ' + (cx-22) + ' 83" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+26) + ' 92 Q' + (cx+28) + ' 88 ' + (cx+29) + ' 85" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx+22) + ' 90 Q' + (cx+22) + ' 86 ' + (cx+22) + ' 83" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
    }
    // Eyelids (blink)
    svg += '<rect class="eyelid" x="' + (cx-29) + '" y="88" width="22" height="24" fill="url(#skinG)" rx="11" opacity="0"/>';
    svg += '<rect class="eyelid" x="' + (cx+7) + '" y="88" width="22" height="24" fill="url(#skinG)" rx="11" opacity="0"/>';

    // Nose
    svg += '<path d="M' + (cx-3) + ' 110 Q' + cx + ' 118 ' + (cx+3) + ' 110" fill="none" stroke="#e0a999" stroke-width="1.5" stroke-linecap="round"/>';
    svg += '<circle cx="' + cx + '" cy="116" r="1.5" fill="' + shadeColor('#ffccbc', -8) + '" opacity="0.4"/>';

    // Mouth - expression based
    if (expressao === 'happy') {
        svg += '<path d="M' + (cx-20) + ' 125 Q' + cx + ' 148 ' + (cx+20) + ' 125" fill="#e91e63" stroke="#c2185b" stroke-width="2" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx-16) + ' 128 Q' + cx + ' 144 ' + (cx+16) + ' 128" fill="#f48fb1" opacity="0.5"/>';
        svg += '<path d="M' + (cx-24) + ' 123 Q' + (cx-21) + ' 120 ' + (cx-18) + ' 124" fill="none" stroke="#c2185b" stroke-width="1" opacity="0.4"/>';
        svg += '<path d="M' + (cx+18) + ' 124 Q' + (cx+21) + ' 120 ' + (cx+24) + ' 123" fill="none" stroke="#c2185b" stroke-width="1" opacity="0.4"/>';
        svg += '<path d="M' + (cx-14) + ' 138 Q' + cx + ' 142 ' + (cx+14) + ' 138" fill="none" stroke="' + shadeColor('#e91e63', -15) + '" stroke-width="0.8" opacity="0.3"/>';
    } else if (expressao === 'sad') {
        svg += '<path d="M' + (cx-14) + ' 136 Q' + cx + ' 126 ' + (cx+14) + ' 136" fill="none" stroke="#c2185b" stroke-width="2.5" stroke-linecap="round"/>';
    } else {
        svg += '<path d="M' + (cx-12) + ' 128 Q' + cx + ' 138 ' + (cx+12) + ' 128" fill="#e91e63" stroke="#c2185b" stroke-width="1.5" stroke-linecap="round"/>';
        svg += '<path d="M' + (cx-10) + ' 129 Q' + cx + ' 135 ' + (cx+10) + ' 129" fill="#f48fb1" opacity="0.5"/>';
        svg += '<path d="M' + (cx-13) + ' 128 Q' + (cx-8) + ' 126 ' + cx + ' 127 Q' + (cx+8) + ' 126 ' + (cx+13) + ' 128" fill="none" stroke="#c2185b" stroke-width="1" opacity="0.5"/>';
        svg += '<path d="M' + (cx-10) + ' 137 Q' + cx + ' 140 ' + (cx+10) + ' 137" fill="none" stroke="' + shadeColor('#e91e63', -15) + '" stroke-width="0.8" opacity="0.3"/>';
    }

    // === HAIR (front) ===
    if (estilo !== 'careca') {
        if (estilo === 'longo_liso' || estilo === 'longo_ondas') {
            svg += '<path d="M' + (cx-50) + ' 95 Q' + (cx-55) + ' 55 ' + cx + ' 45 Q' + (cx+55) + ' 55 ' + (cx+50) + ' 95 L' + (cx+50) + ' 105 Q' + (cx+40) + ' 100 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 100 ' + (cx-50) + ' 105 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx-35) + ' 80 Q' + (cx-25) + ' 68 ' + cx + ' 65 Q' + (cx+25) + ' 68 ' + (cx+35) + ' 80 L' + (cx+35) + ' 92 Q' + (cx+20) + ' 85 ' + cx + ' 88 Q' + (cx-20) + ' 85 ' + (cx-35) + ' 92 Z" fill="url(#hairG)"/>';
            if (estilo === 'longo_ondas') {
                svg += '<path d="M' + (cx-48) + ' 130 Q' + (cx-52) + ' 145 ' + (cx-46) + ' 160 Q' + (cx-52) + ' 170 ' + (cx-44) + ' 178" fill="none" stroke="url(#hairG)" stroke-width="8" stroke-linecap="round"/>';
                svg += '<path d="M' + (cx+48) + ' 130 Q' + (cx+52) + ' 145 ' + (cx+46) + ' 160 Q' + (cx+52) + ' 170 ' + (cx+44) + ' 178" fill="none" stroke="url(#hairG)" stroke-width="8" stroke-linecap="round"/>';
            }
        } else if (estilo === 'curto') {
            if (isGirl) {
                svg += '<path d="M' + (cx-48) + ' 92 Q' + (cx-52) + ' 55 ' + cx + ' 45 Q' + (cx+52) + ' 55 ' + (cx+48) + ' 92 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 100 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 100 ' + (cx-48) + ' 105 Z" fill="url(#hairG)"/>';
                svg += '<path d="M' + (cx-35) + ' 78 Q' + (cx-20) + ' 65 ' + cx + ' 63 Q' + (cx+20) + ' 65 ' + (cx+35) + ' 78 L' + (cx+35) + ' 90 Q' + (cx+20) + ' 85 ' + cx + ' 88 Q' + (cx-20) + ' 85 ' + (cx-35) + ' 90 Z" fill="url(#hairG)"/>';
            } else {
                svg += '<path d="M' + (cx-50) + ' 90 Q' + (cx-52) + ' 55 ' + cx + ' 48 Q' + (cx+52) + ' 55 ' + (cx+50) + ' 90 L' + (cx+50) + ' 100 Q' + (cx+40) + ' 95 ' + (cx+30) + ' 97 L' + (cx-30) + ' 97 Q' + (cx-40) + ' 95 ' + (cx-50) + ' 100 Z" fill="url(#hairG)"/>';
            }
        } else if (estilo === 'rabo_cavalo') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 58 ' + cx + ' 48 Q' + (cx+52) + ' 58 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx+45) + ' 85 Q' + (cx+70) + ' 105 ' + (cx+65) + ' 165 Q' + (cx+60) + ' 175 ' + (cx+50) + ' 170 Q' + (cx+55) + ' 125 ' + (cx+40) + ' 100 Z" fill="url(#hairG)"/>';
        } else if (estilo === 'tranca') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 58 ' + cx + ' 48 Q' + (cx+52) + ' 58 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx-20) + ' 105 L' + (cx+20) + ' 105 L' + (cx+18) + ' 135 L' + (cx+22) + ' 145 L' + (cx+18) + ' 155 L' + (cx+22) + ' 165 L' + (cx+18) + ' 175 L' + (cx+22) + ' 185" fill="none" stroke="url(#hairG)" stroke-width="7" stroke-linecap="round"/>';
        } else if (estilo === 'cocar') {
            svg += '<path d="M' + (cx-48) + ' 93 Q' + (cx-52) + ' 58 ' + cx + ' 48 Q' + (cx+52) + ' 58 ' + (cx+48) + ' 93 L' + (cx+48) + ' 105 Q' + (cx+40) + ' 101 ' + (cx+35) + ' 105 L' + (cx-35) + ' 105 Q' + (cx-40) + ' 101 ' + (cx-48) + ' 105 Z" fill="url(#hairG)"/>';
            svg += '<circle cx="' + cx + '" cy="65" r="22" fill="url(#hairG)" opacity="0.85"/>';
        } else if (estilo === 'moicano') {
            svg += '<path d="M' + (cx-50) + ' 90 Q' + (cx-52) + ' 55 ' + cx + ' 48 Q' + (cx+52) + ' 55 ' + (cx+50) + ' 90 L' + (cx+50) + ' 100 Q' + (cx+40) + ' 95 ' + (cx+30) + ' 97 L' + (cx-30) + ' 97 Q' + (cx-40) + ' 95 ' + (cx-50) + ' 100 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx-25) + ' 55 L' + (cx+25) + ' 55 L' + (cx+20) + ' 38 L' + (cx-20) + ' 38 Z" fill="url(#hairG)"/>';
        } else if (estilo === 'lateral') {
            svg += '<path d="M' + (cx-55) + ' 90 Q' + (cx-55) + ' 55 ' + cx + ' 48 Q' + (cx+55) + ' 55 ' + (cx+55) + ' 90 L' + (cx+55) + ' 100 Q' + (cx+45) + ' 95 ' + (cx+35) + ' 97 L' + (cx-35) + ' 97 Q' + (cx-45) + ' 95 ' + (cx-55) + ' 100 Z" fill="url(#hairG)"/>';
        } else if (estilo === 'cacheado') {
            for (let px = (cx-48); px <= (cx+48); px += 13) {
                svg += '<circle cx="' + px + '" cy="75" r="13" fill="url(#hairG)"/>';
                svg += '<circle cx="' + px + '" cy="90" r="11" fill="url(#hairG)"/>';
            }
            svg += '<circle cx="' + cx + '" cy="60" r="15" fill="url(#hairG)"/>';
        }
    }
    // Hair shine
    if (estilo !== 'careca') {
        svg += '<path d="M' + (cx-30) + ' 62 Q' + (cx-15) + ' 54 ' + cx + ' 52" fill="none" stroke="#fff" stroke-width="3" opacity="0.2" stroke-linecap="round"/>';
    }

    // === HEAD WEAR ===
    if (estado.cabeca && estado.cabeca !== 'nenhum') {
        if (estado.cabeca === 'coroa') {
            svg += '<path d="M' + (cx-35) + ' 60 L' + (cx-30) + ' 38 L' + (cx-22) + ' 55 L' + cx + ' 33 L' + (cx+22) + ' 55 L' + (cx+30) + ' 38 L' + (cx+35) + ' 60 Z" fill="#ffd700" stroke="#f57f17" stroke-width="2"/>';
            svg += '<rect x="' + (cx-35) + '" y="58" width="70" height="7" rx="3" fill="#ffd700" stroke="#f57f17" stroke-width="1.5"/>';
            svg += '<circle cx="' + cx + '" cy="42" r="3.5" fill="#e91e63"/>';
            svg += '<circle cx="' + (cx-22) + '" cy="52" r="2.5" fill="#42a5f5"/>';
            svg += '<circle cx="' + (cx+22) + '" cy="52" r="2.5" fill="#66bb6a"/>';
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
            svg += '<path d="M' + (cx-40) + ' 52 L' + (cx+40) + ' 52" stroke="#1565c0" stroke-width="1" opacity="0.4"/>';
        } else if (estado.cabeca === 'cowboy') {
            svg += '<ellipse cx="' + cx + '" cy="63" rx="55" ry="9" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<path d="M' + (cx-25) + ' 63 Q' + (cx-25) + ' 38 ' + cx + ' 36 Q' + (cx+25) + ' 38 ' + (cx+25) + ' 63 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<rect x="' + (cx-25) + '" y="58" width="50" height="5" rx="2" fill="#6d4c41"/>';
        } else if (estado.cabeca === 'pirata') {
            svg += '<path d="M' + (cx-45) + ' 65 Q' + (cx-45) + ' 43 ' + cx + ' 41 Q' + (cx+45) + ' 43 ' + (cx+45) + ' 65 L' + (cx+45) + ' 70 L' + (cx-45) + ' 70 Z" fill="#212121" stroke="#000" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="54" r="9" fill="#fff"/>';
            svg += '<circle cx="' + cx + '" cy="54" r="5" fill="#212121"/>';
        } else if (estado.cabeca === 'gorro') {
            svg += '<path d="M' + (cx-40) + ' 65 Q' + (cx-40) + ' 35 ' + cx + ' 33 Q' + (cx+40) + ' 35 ' + (cx+40) + ' 65 Z" fill="#e53935" stroke="#c62828" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="35" r="6" fill="#fff"/>';
            svg += '<rect x="' + (cx-42) + '" y="62" width="84" height="8" rx="4" fill="#fff" opacity="0.8"/>';
            svg += '<path d="M' + (cx-30) + ' 45 L' + (cx-25) + ' 40 L' + (cx-20) + ' 45" stroke="#c62828" stroke-width="1" opacity="0.3"/>';
        } else if (estado.cabeca === 'orelhas') {
            svg += '<path d="M' + (cx-40) + ' 70 L' + (cx-45) + ' 45 L' + (cx-30) + ' 55 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx+40) + ' 70 L' + (cx+45) + ' 45 L' + (cx+30) + ' 55 Z" fill="url(#hairG)"/>';
            svg += '<path d="M' + (cx-38) + ' 65 L' + (cx-40) + ' 52 L' + (cx-33) + ' 58 Z" fill="#f48fb1"/>';
            svg += '<path d="M' + (cx+38) + ' 65 L' + (cx+40) + ' 52 L' + (cx+33) + ' 58 Z" fill="#f48fb1"/>';
        }
    }

    svg += '</g>'; // end doll-head

    // === ACESSORIOS ===
    if (estado.acessorios && estado.acessorios !== 'nada') {
        if (estado.acessorios === 'relogio') {
            svg += '<circle cx="' + (cx-55) + '" cy="230" r="8" fill="#333" stroke="#ffd700" stroke-width="2"/>';
            svg += '<circle cx="' + (cx-55) + '" cy="230" r="4" fill="#fff"/>';
            svg += '<line x1="' + (cx-55) + '" y1="230" x2="' + (cx-55) + '" y2="226" stroke="#333" stroke-width="1"/>';
            svg += '<line x1="' + (cx-55) + '" y1="230" x2="' + (cx-52) + '" y2="230" stroke="#333" stroke-width="1"/>';
        } else if (estado.acessorios === 'pulseira') {
            svg += '<rect x="' + (cx+48) + '" y="225" width="14" height="6" rx="3" fill="#ffd700" stroke="#f57f17" stroke-width="1"/>';
            svg += '<circle cx="' + (cx+55) + '" cy="228" r="2" fill="#e91e63"/>';
        } else if (estado.acessorios === 'cachecol') {
            svg += '<path d="M' + (cx-50) + ' 195 Q' + cx + ' 205 ' + (cx+50) + ' 195 L' + (cx+50) + ' 215 Q' + cx + ' 225 ' + (cx-50) + ' 215 Z" fill="#e53935" stroke="#c62828" stroke-width="2"/>';
            svg += '<path d="M' + (cx+40) + ' 210 L' + (cx+50) + ' 240 L' + (cx+35) + ' 235 Z" fill="#e53935" stroke="#c62828" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx-45) + ' 200 L' + (cx+45) + ' 200" stroke="#fff" stroke-width="1" opacity="0.3"/>';
        } else if (estado.acessorios === 'luvas') {
            svg += '<rect x="' + (cx-65) + '" y="240" width="18" height="25" rx="6" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<rect x="' + (cx+47) + '" y="240" width="18" height="25" rx="6" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
        } else if (estado.acessorios === 'touca') {
            svg += '<ellipse cx="' + cx + '" cy="58" rx="40" ry="18" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="48" r="6" fill="#fff"/>';
        } else if (estado.acessorios === 'oculos') {
            svg += '<circle cx="' + (cx-18) + '" cy="105" r="12" fill="rgba(33,33,33,0.2)" stroke="#333" stroke-width="3"/>';
            svg += '<circle cx="' + (cx+18) + '" cy="105" r="12" fill="rgba(33,33,33,0.2)" stroke="#333" stroke-width="3"/>';
            svg += '<path d="M' + (cx-6) + ' 105 L' + (cx+6) + ' 105" stroke="#333" stroke-width="3"/>';
        } else if (estado.acessorios === 'mochila') {
            svg += '<rect x="' + (cx-70) + '" y="210" width="25" height="40" rx="8" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>';
            svg += '<rect x="' + (cx-68) + '" y="220" width="21" height="12" rx="4" fill="#fff" opacity="0.4"/>';
            svg += '<path d="M' + (cx-65) + ' 210 Q' + (cx-60) + ' 200 ' + (cx-50) + ' 205" fill="none" stroke="#2e7d32" stroke-width="2"/>';
        } else if (estado.acessorios === 'cinto') {
            svg += '<rect x="' + (cx-40) + '" y="262" width="80" height="8" fill="#5d4037" stroke="#3e2723" stroke-width="1"/>';
            svg += '<rect x="' + (cx-6) + '" y="262" width="12" height="8" fill="#ffd700"/>';
        } else if (estado.acessorios === 'cola') {
            svg += '<circle cx="' + (cx+55) + '" cy="230" r="5" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx+55) + ' 235 L' + (cx+55) + ' 255" stroke="#4caf50" stroke-width="2"/>';
            svg += '<circle cx="' + (cx+53) + '" cy="228" r="1.5" fill="#fff"/>';
        }
    }

    dollSvg.innerHTML = svg;
    dollWrapper.classList.remove('expr-happy', 'expr-sad', 'expr-neutral');
    dollWrapper.classList.add('expr-' + expressao);
}

function criarSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
    s.style.left = (30 + Math.random()*40) + '%';
    s.style.top = (20 + Math.random()*60) + '%';
    dollWrapper.appendChild(s);
    setTimeout(() => s.remove(), 800);
}

function finalizarFase() {
    bloquearClick = false;
    if (timeoutPendente) { clearTimeout(timeoutPendente); timeoutPendente = null; }
    expressao = 'happy';
    renderizarBoneco();
    const svgClone = dollSvg.cloneNode(true);
    svgClone.setAttribute('viewBox', '0 0 220 460');
    finalDoll.innerHTML = '';
    finalDoll.appendChild(svgClone);
    celebTitle.textContent = 'Você vestiu para ' + ocasiaoAtual.nome + '! ' + ocasiaoAtual.emoji;
    celebration.style.display = 'flex';
    falar('Parabéns! Você vestiu a boneca para ' + ocasiaoAtual.nome + '!');
    if (typeof playSuccess === 'function') playSuccess();
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    atualizarEstrelas();
    for (let i = 0; i < 40; i++) setTimeout(() => criarConfetti(), i*50);
}

function criarConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = ['#e91e63','#9c27b0','#3f51b5','#03a9f4','#009688','#ffeb3b','#ff9800','#f44336'][Math.floor(Math.random()*8)];
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.animationDuration = (2 + Math.random()*2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
}

function reiniciar() {
    if (timeoutPendente) { clearTimeout(timeoutPendente); timeoutPendente = null; }
    bloquearClick = false;
    expressao = 'neutral';
    celebration.style.display = 'none';
    dressScreen.style.display = 'none';
    occasionScreen.style.display = 'block';
    genero = null; ocasiaoAtual = null; etapaAtual = 0; estado = {};
    leftOptions.innerHTML = ''; rightOptions.innerHTML = '';
    dollWrapper.className = 'doll-wrapper';
}

document.querySelectorAll('.char-btn').forEach(btn => { btn.onclick = () => selecionarPersonagem(btn.dataset.genero); });
btnRestart.onclick = reiniciar;
bgSelector.querySelectorAll('.bg-btn').forEach(btn => {
    btn.onclick = () => {
        dollWrapper.className = 'doll-wrapper ' + (BG_CLASSES[btn.dataset.bg] || '');
        bgSelector.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});

atualizarEstrelas();

const selectScreen = document.getElementById('select-screen');
const dressScreen = document.getElementById('dress-screen');
const dollSvg = document.getElementById('doll');
const dollWrapper = document.getElementById('doll-wrapper');
const leftCats = document.getElementById('left-cats');
const leftOptions = document.getElementById('left-options');
const leftColors = document.getElementById('left-colors');
const rightCats = document.getElementById('right-cats');
const rightOptions = document.getElementById('right-options');
const rightColors = document.getElementById('right-colors');
const btnFinish = document.getElementById('btn-finish');
const celebration = document.getElementById('celebration');
const celebTitle = document.getElementById('celeb-title');
const finalDoll = document.getElementById('final-doll');
const btnRestart = document.getElementById('btn-restart');
const starsEl = document.getElementById('stars-count');
const bgSelector = document.getElementById('bg-selector');

let genero = null;
let categoriaAtual = null;
let estado = {};
let activeSide = 'left';

const CATEGORIAS_MENINA = [
    { id: 'cabelo_cor',    icon: '🎨', label: 'Cor' },
    { id: 'cabelo_estilo', icon: '💇', label: 'Cabelo' },
    { id: 'chapeu',        icon: '👑', label: 'Chapéu' },
    { id: 'blusa',         icon: '👕', label: 'Blusa' },
    { id: 'saia',          icon: '👗', label: 'Saia' },
    { id: 'sapato',        icon: '👟', label: 'Sapato' },
    { id: 'maquiagem',     icon: '💄', label: 'Maquiagem' },
];
const CATEGORIAS_MENINO = [
    { id: 'cabelo_cor',    icon: '🎨', label: 'Cor' },
    { id: 'cabelo_estilo', icon: '💇', label: 'Cabelo' },
    { id: 'chapeu',        icon: '🧢', label: 'Chapéu' },
    { id: 'camisa',        icon: '👕', label: 'Camisa' },
    { id: 'calca',         icon: '👖', label: 'Calça' },
    { id: 'sapato',        icon: '👟', label: 'Sapato' },
];

const CORES_CABELO = [
    { id: 'preto',    cor: '#3e2723', nome: 'preto' },
    { id: 'castanho', cor: '#6d4c41', nome: 'castanho' },
    { id: 'loiro',    cor: '#f9a825', nome: 'loiro' },
    { id: 'ruivo',    cor: '#bf360c', nome: 'ruivo' },
    { id: 'branco',   cor: '#eceff1', nome: 'branco' },
    { id: 'azul',     cor: '#42a5f5', nome: 'azul' },
    { id: 'rosa',     cor: '#ec407a', nome: 'rosa' },
    { id: 'roxo',     cor: '#7b1fa2', nome: 'roxo' },
];

const ESTILOS_CABELO_MENINA = [
    { id: 'longo_liso',  nome: 'longo e liso' },
    { id: 'longo_ondas', nome: 'longo com ondas' },
    { id: 'curto',       nome: 'curto' },
    { id: 'rabo_cavalo', nome: 'rabo de cavalo' },
    { id: 'tranca',      nome: 'trança' },
    { id: 'cocar',       nome: 'cocar' },
];
const ESTILOS_CABELO_MENINO = [
    { id: 'curto',    nome: 'curto' },
    { id: 'careca',   nome: 'careca' },
    { id: 'moicano',  nome: 'moicano' },
    { id: 'lateral',  nome: 'lateral' },
    { id: 'cacheado', nome: 'cacheado' },
    { id: 'rabo',     nome: 'rabo de cavalo' },
];

const CHAPEUS_MENINA = [
    { id: 'nenhum', emoji: '🚫', nome: 'sem chapéu' },
    { id: 'coroa',  emoji: '👑', nome: 'coroa' },
    { id: 'laco',   emoji: '🎀', nome: 'laço' },
    { id: 'flores', emoji: '🌸', nome: 'flores' },
    { id: 'boina',  emoji: '🧢', nome: 'boina' },
];
const CHAPEUS_MENINO = [
    { id: 'nenhum', emoji: '🚫', nome: 'sem chapéu' },
    { id: 'bone',   emoji: '🧢', nome: 'boné' },
    { id: 'cowboy', emoji: '🤠', nome: 'chapéu de cowboy' },
    { id: 'pirata', emoji: '🏴', nome: 'chapéu de pirata' },
    { id: 'coroa',  emoji: '👑', nome: 'coroa' },
];

const BLUSAS_MENINA = [
    { id: 'rosa',    cor: '#f48fb1', nome: 'blusa rosa' },
    { id: 'verde',   cor: '#66bb6a', nome: 'blusa verde' },
    { id: 'azul',    cor: '#42a5f5', nome: 'blusa azul' },
    { id: 'amarela', cor: '#ffeb3b', nome: 'blusa amarela' },
    { id: 'roxo',    cor: '#ab47bc', nome: 'blusa roxa' },
    { id: 'vestido', cor: '#ef5350', nome: 'vestido vermelho' },
];
const CAMISAS_MENINO = [
    { id: 'azul',     cor: '#42a5f5', nome: 'camisa azul' },
    { id: 'verde',    cor: '#66bb6a', nome: 'camisa verde' },
    { id: 'vermelha', cor: '#ef5350', nome: 'camisa vermelha' },
    { id: 'amarela',  cor: '#ffeb3b', nome: 'camisa amarela' },
    { id: 'preto',    cor: '#424242', nome: 'camisa preta' },
    { id: 'listrada', cor: '#5c6bc0', nome: 'camisa listrada' },
];

const SAIAS_MENINA = [
    { id: 'rosa',    cor: '#f48fb1', nome: 'saia rosa' },
    { id: 'azul',    cor: '#42a5f5', nome: 'saia azul' },
    { id: 'jeans',   cor: '#5c6bc0', nome: 'saia jeans' },
    { id: 'amarela', cor: '#ffca28', nome: 'saia amarela' },
    { id: 'branca',  cor: '#f5f5f5', nome: 'saia branca' },
    { id: 'calca',   cor: '#78909c', nome: 'calça' },
];
const CALCAS_MENINO = [
    { id: 'jeans',    cor: '#5c6bc0', nome: 'calça jeans' },
    { id: 'preto',    cor: '#424242', nome: 'calça preta' },
    { id: 'bege',     cor: '#a1887f', nome: 'calça bege' },
    { id: 'verde',    cor: '#66bb6a', nome: 'calça verde' },
    { id: 'vermelha', cor: '#ef5350', nome: 'calça vermelha' },
    { id: 'short',    cor: '#ff7043', nome: 'short' },
];

const SAPATOS_MENINA = [
    { id: 'sapatilha_rosa', cor: '#f48fb1', nome: 'sapatilha rosa' },
    { id: 'tenis_branco',   cor: '#f5f5f5', nome: 'tênis branco' },
    { id: 'bota_marrom',    cor: '#8d6e63', nome: 'bota marrom' },
    { id: 'sandalia',       cor: '#ab47bc', nome: 'sandália' },
    { id: 'salto',          cor: '#e91e63', nome: 'salto' },
    { id: 'galocha',        cor: '#ff7043', nome: 'galocha' },
];
const SAPATOS_MENINO = [
    { id: 'tenis_azul',  cor: '#42a5f5', nome: 'tênis azul' },
    { id: 'tenis_branco',cor: '#f5f5f5', nome: 'tênis branco' },
    { id: 'bota_marrom', cor: '#8d6e63', nome: 'bota marrom' },
    { id: 'sandalia',    cor: '#66bb6a', nome: 'sandália' },
    { id: 'sapato_preto',cor: '#424242', nome: 'sapato preto' },
    { id: 'crocs',       cor: '#ff7043', nome: 'crocs' },
];

const MAQUIAGENS = [
    { id: 'nenhum',         emoji: '🚫', nome: 'sem maquiagem' },
    { id: 'batom_rosa',     emoji: '💄', nome: 'batom rosa' },
    { id: 'batom_vermelho', emoji: '💋', nome: 'batom vermelho' },
    { id: 'blush',          emoji: '😊', nome: 'blush rosado' },
    { id: 'brilho',         emoji: '✨', nome: 'brilho' },
    { id: 'completa',       emoji: '👸', nome: 'maquiagem completa' },
];

const BG_CLASSES = { quarto: 'bg-quarto', jardim: 'bg-jardim', praia: 'bg-praia', palco: 'bg-palco' };
let bgAtual = 'quarto';

function atualizarEstrelas() {
    if (typeof obterEstrelas === 'function') starsEl.textContent = obterEstrelas();
}

function estadoInicial() {
    return {
        cabelo_cor: 'castanho',
        cabelo_estilo: genero === 'menina' ? 'longo_liso' : 'curto',
        chapeu: 'nenhum',
        blusa: genero === 'menina' ? 'rosa' : null,
        camisa: genero === 'menina' ? null : 'azul',
        saia: genero === 'menina' ? 'rosa' : null,
        calca: genero === 'menina' ? null : 'jeans',
        sapato: genero === 'menina' ? 'sapatilha_rosa' : 'tenis_azul',
        maquiagem: genero === 'menina' ? 'nenhum' : null,
    };
}

function selecionarPersonagem(g) {
    genero = g;
    estado = estadoInicial();
    activeSide = 'left';
    selectScreen.style.display = 'none';
    dressScreen.style.display = 'flex';
    renderizarTudo();
    setTimeout(() => {
        falar(g === 'menina' ? 'Que linda menina! Vamos vestir!' : 'Que legal menino! Vamos vestir!');
    }, 300);
}

function renderizarTudo() {
    renderizarCategorias();
    renderizarOpcoes();
    renderizarBoneco();
    atualizarEstrelas();
}

function renderizarCategorias() {
    const cats = genero === 'menina' ? CATEGORIAS_MENINA : CATEGORIAS_MENINO;
    if (!categoriaAtual || !cats.find(c => c.id === categoriaAtual)) {
        categoriaAtual = cats[0].id;
    }
    const mid = Math.ceil(cats.length / 2);
    const leftCatsList = cats.slice(0, mid);
    const rightCatsList = cats.slice(mid);

    function buildTabs(list, container, side) {
        container.innerHTML = '';
        list.forEach(c => {
            const tab = document.createElement('button');
            tab.className = 'cat-tab' + (categoriaAtual === c.id ? ' active' : '');
            tab.innerHTML = '<span class="cat-icon">' + c.icon + '</span><span class="cat-label">' + c.label + '</span>';
            tab.onclick = () => {
                categoriaAtual = c.id;
                activeSide = side;
                renderizarCategorias();
                renderizarOpcoes();
                falar(c.label);
            };
            container.appendChild(tab);
        });
    }
    buildTabs(leftCatsList, leftCats, 'left');
    buildTabs(rightCatsList, rightCats, 'right');
}

function getActiveContainers() {
    if (activeSide === 'right') {
        return { opts: rightOptions, colors: rightColors, optsHide: leftOptions, colorsHide: leftColors };
    }
    return { opts: leftOptions, colors: leftColors, optsHide: rightOptions, colorsHide: rightColors };
}

function renderizarOpcoes() {
    const c = getActiveContainers();
    c.optsHide.innerHTML = '';
    c.colorsHide.innerHTML = '';
    c.colorsHide.style.display = 'none';
    c.opts.innerHTML = '';
    c.colors.innerHTML = '';
    c.colors.style.display = 'none';

    if (categoriaAtual === 'cabelo_cor') {
        c.colors.style.display = 'flex';
        CORES_CABELO.forEach(cor => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (estado.cabelo_cor === cor.id ? ' active' : '');
            btn.style.background = cor.cor;
            btn.title = cor.nome;
            btn.onclick = () => {
                estado.cabelo_cor = cor.id;
                renderizarOpcoes();
                renderizarBoneco();
                criarSparkle();
                falar(cor.nome);
            };
            c.colors.appendChild(btn);
        });
        return;
    }

    let opcoes = [];
    let estadoKey = categoriaAtual;

    if (categoriaAtual === 'cabelo_estilo') {
        opcoes = genero === 'menina' ? ESTILOS_CABELO_MENINA : ESTILOS_CABELO_MENINO;
    } else if (categoriaAtual === 'chapeu') {
        opcoes = genero === 'menina' ? CHAPEUS_MENINA : CHAPEUS_MENINO;
    } else if (categoriaAtual === 'blusa') {
        opcoes = BLUSAS_MENINA;
    } else if (categoriaAtual === 'camisa') {
        opcoes = CAMISAS_MENINO;
    } else if (categoriaAtual === 'saia') {
        opcoes = SAIAS_MENINA;
    } else if (categoriaAtual === 'calca') {
        opcoes = CALCAS_MENINO;
    } else if (categoriaAtual === 'sapato') {
        opcoes = genero === 'menina' ? SAPATOS_MENINA : SAPATOS_MENINO;
    } else if (categoriaAtual === 'maquiagem') {
        opcoes = MAQUIAGENS;
    }

    opcoes.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn' + (estado[estadoKey] === o.id ? ' active' : '');
        let display = o.emoji || '';
        if (o.cor && !o.emoji) {
            display = '<div style="width:36px;height:36px;border-radius:8px;background:' + o.cor + ';border:2px solid #ddd;"></div>';
        }
        btn.innerHTML = display + '<span class="opt-check">✓</span>';
        btn.title = o.nome;
        btn.onclick = () => {
            estado[estadoKey] = o.id;
            renderizarOpcoes();
            renderizarBoneco();
            criarSparkle();
            falar(o.nome);
            if (typeof playPop === 'function') playPop();
        };
        c.opts.appendChild(btn);
    });
}

function corCabelo() {
    const c = CORES_CABELO.find(x => x.id === estado.cabelo_cor);
    return c ? c.cor : '#6d4c41';
}

function renderizarBoneco() {
    const cc = corCabelo();
    const skin = '#ffccbc';
    const skinDark = '#e0a999';
    const skinShadow = '#bcaaa4';
    let svg = '';
    const estilo = estado.cabelo_estilo;
    const isGirl = genero === 'menina';
    const cx = 110;

    svg += '<defs>';
    svg += '<linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="#ffe0d0"/><stop offset="100%" stop-color="#ffccbc"/>';
    svg += '</linearGradient>';
    svg += '<linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="#fff3e0"/><stop offset="100%" stop-color="#ffe0b2"/>';
    svg += '</linearGradient>';
    svg += '</defs>';

    if (isGirl) {
        if (estado.blusa === 'vestido') {
            const v = BLUSAS_MENINA.find(b => b.id === 'vestido');
            svg += '<path d="M' + (cx-50) + ' 210 L' + (cx-50) + ' 290 L' + (cx-70) + ' 400 L' + (cx+70) + ' 400 L' + (cx+50) + ' 290 L' + (cx+50) + ' 210 Z" fill="' + v.cor + '" stroke="#c62828" stroke-width="2"/>';
            svg += '<rect x="' + (cx-50) + '" y="200" width="100" height="22" rx="10" fill="' + v.cor + '" stroke="#c62828" stroke-width="2"/>';
            svg += '<path d="M' + (cx-45) + ' 300 Q' + cx + ' 320 ' + (cx+45) + ' 300" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>';
        } else {
            const b = BLUSAS_MENINA.find(x => x.id === estado.blusa);
            const bc = b ? b.cor : '#f48fb1';
            svg += '<path d="M' + (cx-55) + ' 205 Q' + (cx-50) + ' 195 ' + (cx-35) + ' 195 L' + (cx+35) + ' 195 Q' + (cx+50) + ' 195 ' + (cx+55) + ' 205 L' + (cx+60) + ' 270 L' + (cx-60) + ' 270 Z" fill="' + bc + '" stroke="#e91e63" stroke-width="2"/>';
            svg += '<path d="M' + (cx-35) + ' 195 L' + cx + ' 215 L' + (cx+35) + ' 195" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>';
            const s = SAIAS_MENINA.find(x => x.id === estado.saia);
            if (s && estado.blusa !== 'vestido') {
                if (s.id === 'calca') {
                    svg += '<rect x="' + (cx-35) + '" y="265" width="34" height="130" rx="8" fill="' + s.cor + '" stroke="#455a64" stroke-width="2"/>';
                    svg += '<rect x="' + (cx+1) + '" y="265" width="34" height="130" rx="8" fill="' + s.cor + '" stroke="#455a64" stroke-width="2"/>';
                } else {
                    svg += '<path d="M' + (cx-55) + ' 265 L' + (cx+55) + ' 265 L' + (cx+70) + ' 380 L' + (cx-70) + ' 380 Z" fill="' + s.cor + '" stroke="#e91e63" stroke-width="2"/>';
                    svg += '<path d="M' + (cx-50) + ' 280 Q' + cx + ' 295 ' + (cx+50) + ' 280" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.3"/>';
                }
            }
        }
    } else {
        const cs = CAMISAS_MENINO.find(x => x.id === estado.camisa);
        const csc = cs ? cs.cor : '#42a5f5';
        if (cs && cs.id === 'listrada') {
            svg += '<path d="M' + (cx-55) + ' 205 Q' + (cx-50) + ' 195 ' + (cx-35) + ' 195 L' + (cx+35) + ' 195 Q' + (cx+50) + ' 195 ' + (cx+55) + ' 205 L' + (cx+60) + ' 270 L' + (cx-60) + ' 270 Z" fill="' + csc + '" stroke="#283593" stroke-width="2"/>';
            for (let yy = 205; yy < 270; yy += 14) {
                svg += '<rect x="' + (cx-60) + '" y="' + yy + '" width="120" height="7" fill="#fff" opacity="0.5"/>';
            }
        } else {
            svg += '<path d="M' + (cx-55) + ' 205 Q' + (cx-50) + ' 195 ' + (cx-35) + ' 195 L' + (cx+35) + ' 195 Q' + (cx+50) + ' 195 ' + (cx+55) + ' 205 L' + (cx+60) + ' 270 L' + (cx-60) + ' 270 Z" fill="' + csc + '" stroke="#283593" stroke-width="2"/>';
            svg += '<path d="M' + (cx-35) + ' 195 L' + cx + ' 215 L' + (cx+35) + ' 195" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>';
        }
        const cl = CALCAS_MENINO.find(x => x.id === estado.calca);
        if (cl) {
            if (cl.id === 'short') {
                svg += '<rect x="' + (cx-35) + '" y="265" width="34" height="65" rx="8" fill="' + cl.cor + '" stroke="#bf360c" stroke-width="2"/>';
                svg += '<rect x="' + (cx+1) + '" y="265" width="34" height="65" rx="8" fill="' + cl.cor + '" stroke="#bf360c" stroke-width="2"/>';
                svg += '<rect x="' + (cx-40) + '" y="325" width="80" height="80" rx="10" fill="url(#bodyG)" opacity="0.3"/>';
            } else {
                svg += '<rect x="' + (cx-35) + '" y="265" width="34" height="130" rx="8" fill="' + cl.cor + '" stroke="#37474f" stroke-width="2"/>';
                svg += '<rect x="' + (cx+1) + '" y="265" width="34" height="130" rx="8" fill="' + cl.cor + '" stroke="#37474f" stroke-width="2"/>';
            }
        }
    }

    svg += '<rect x="' + (cx-17) + '" y="180" width="34" height="30" rx="12" fill="url(#skinG)" stroke="' + skinDark + '" stroke-width="1.5"/>';
    svg += '<rect x="' + (cx-30) + '" y="200" width="60" height="15" rx="7" fill="' + skin + '" opacity="0.4"/>';

    if (isGirl) {
        svg += '<path d="M' + (cx-40) + ' 205 Q' + (cx-38) + ' 200 ' + (cx-32) + ' 200 L' + (cx+32) + ' 200 Q' + (cx+38) + ' 200 ' + (cx+40) + ' 205 L' + (cx+40) + ' 215 L' + (cx-40) + ' 215 Z" fill="' + skin + '" opacity="0.25"/>';
    }

    const sap = isGirl ? SAPATOS_MENINA : SAPATOS_MENINO;
    const sp = sap.find(x => x.id === estado.sapato);
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
            svg += '<path d="M' + (cx-42) + ' 400 L' + (cx-18) + ' 400" stroke="#fff" stroke-width="1.5" opacity="0.4"/>';
            svg += '<path d="M' + (cx-2) + ' 400 L' + (cx+22) + ' 400" stroke="#fff" stroke-width="1.5" opacity="0.4"/>';
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

    if (isGirl && estado.maquiagem && estado.maquiagem !== 'nenhum') {
        if (estado.maquiagem === 'batom_rosa' || estado.maquiagem === 'completa') {
            svg += '<path d="M' + (cx-12) + ' 124 Q' + cx + ' 135 ' + (cx+12) + ' 124 Q' + cx + ' 128 ' + (cx-12) + ' 124" fill="#ec407a" opacity="0.75"/>';
        }
        if (estado.maquiagem === 'batom_vermelho' || estado.maquiagem === 'completa') {
            svg += '<path d="M' + (cx-12) + ' 124 Q' + cx + ' 135 ' + (cx+12) + ' 124 Q' + cx + ' 128 ' + (cx-12) + ' 124" fill="#c62828" opacity="0.85"/>';
        }
        if (estado.maquiagem === 'blush' || estado.maquiagem === 'completa') {
            svg += '<circle cx="' + (cx-36) + '" cy="118" r="9" fill="#f48fb1" opacity="0.35"/>';
            svg += '<circle cx="' + (cx+36) + '" cy="118" r="9" fill="#f48fb1" opacity="0.35"/>';
        }
        if (estado.maquiagem === 'brilho' || estado.maquiagem === 'completa') {
            svg += '<circle cx="' + cx + '" cy="128" r="2" fill="#fff" opacity="0.8"/>';
        }
    }

    if (estilo !== 'careca') {
        if (estilo === 'longo_liso') {
            svg += '<path d="M' + (cx-52) + ' 95 Q' + (cx-55) + ' 65 ' + cx + ' 55 Q' + (cx+55) + ' 65 ' + (cx+52) + ' 95 L' + (cx+52) + ' 190 Q' + (cx+50) + ' 195 ' + (cx+40) + ' 192 L' + (cx+40) + ' 125 L' + (cx-40) + ' 125 L' + (cx-40) + ' 192 Q' + (cx-50) + ' 195 ' + (cx-52) + ' 190 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx-48) + ' 60 Q' + cx + ' 52 ' + (cx+48) + ' 60" fill="none" stroke="' + cc + '" stroke-width="3" opacity="0.5"/>';
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
            svg += '<path d="M' + (cx-55) + ' 90 Q' + (cx-60) + ' 80 ' + (cx-55) + ' 75" fill="none" stroke="' + cc + '" stroke-width="3"/>';
        } else if (estilo === 'cacheado') {
            for (let px = (cx-48); px <= (cx+48); px += 13) {
                svg += '<circle cx="' + px + '" cy="75" r="13" fill="' + cc + '"/>';
                svg += '<circle cx="' + px + '" cy="90" r="11" fill="' + cc + '"/>';
            }
            svg += '<circle cx="' + cx + '" cy="60" r="15" fill="' + cc + '"/>';
        } else if (estilo === 'rabo') {
            svg += '<path d="M' + (cx-50) + ' 90 Q' + (cx-52) + ' 60 ' + cx + ' 53 Q' + (cx+52) + ' 60 ' + (cx+50) + ' 90 L' + (cx+50) + ' 100 Q' + (cx+40) + ' 95 ' + (cx+30) + ' 97 L' + (cx-30) + ' 97 Q' + (cx-40) + ' 95 ' + (cx-50) + ' 100 Z" fill="' + cc + '"/>';
            svg += '<path d="M' + (cx+45) + ' 85 Q' + (cx+65) + ' 100 ' + (cx+60) + ' 145 Q' + (cx+55) + ' 155 ' + (cx+48) + ' 150 Q' + (cx+52) + ' 115 ' + (cx+38) + ' 97 Z" fill="' + cc + '"/>';
        }
    }

    if (estado.chapeu && estado.chapeu !== 'nenhum') {
        if (estado.chapeu === 'coroa') {
            svg += '<path d="M' + (cx-35) + ' 60 L' + (cx-30) + ' 38 L' + (cx-22) + ' 55 L' + cx + ' 33 L' + (cx+22) + ' 55 L' + (cx+30) + ' 38 L' + (cx+35) + ' 60 Z" fill="#ffd700" stroke="#f57f17" stroke-width="2"/>';
            svg += '<rect x="' + (cx-35) + '" y="58" width="70" height="7" rx="3" fill="#ffd700" stroke="#f57f17" stroke-width="1.5"/>';
            svg += '<circle cx="' + cx + '" cy="42" r="3.5" fill="#e91e63"/>';
            svg += '<circle cx="' + (cx-25) + '" cy="50" r="2.5" fill="#42a5f5"/>';
            svg += '<circle cx="' + (cx+25) + '" cy="50" r="2.5" fill="#66bb6a"/>';
        } else if (estado.chapeu === 'laco') {
            svg += '<path d="M' + (cx-25) + ' 60 Q' + (cx-35) + ' 50 ' + (cx-30) + ' 43 Q' + (cx-20) + ' 40 ' + (cx-15) + ' 53 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<path d="M' + (cx+25) + ' 60 Q' + (cx+35) + ' 50 ' + (cx+30) + ' 43 Q' + (cx+20) + ' 40 ' + (cx+15) + ' 53 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<circle cx="' + cx + '" cy="55" r="7" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
        } else if (estado.chapeu === 'flores') {
            svg += '<circle cx="' + (cx-35) + '" cy="63" r="8" fill="#f48fb1"/><circle cx="' + (cx-35) + '" cy="63" r="3.5" fill="#fff176"/>';
            svg += '<circle cx="' + cx + '" cy="57" r="8" fill="#ce93d8"/><circle cx="' + cx + '" cy="57" r="3.5" fill="#fff176"/>';
            svg += '<circle cx="' + (cx+35) + '" cy="63" r="8" fill="#81c784"/><circle cx="' + (cx+35) + '" cy="63" r="3.5" fill="#fff176"/>';
        } else if (estado.chapeu === 'boina') {
            svg += '<ellipse cx="' + cx + '" cy="60" rx="38" ry="16" fill="#5c6bc0" stroke="#283593" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="52" r="6" fill="#3f51b5"/>';
        } else if (estado.chapeu === 'bone') {
            svg += '<path d="M' + (cx-45) + ' 65 Q' + (cx-45) + ' 48 ' + cx + ' 45 Q' + (cx+45) + ' 48 ' + (cx+45) + ' 65 L' + (cx+45) + ' 70 L' + (cx-45) + ' 70 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<path d="M' + (cx+45) + ' 65 Q' + (cx+60) + ' 67 ' + (cx+60) + ' 73 L' + (cx+45) + ' 73 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<circle cx="' + (cx+15) + '" cy="55" r="3" fill="#fff" opacity="0.5"/>';
        } else if (estado.chapeu === 'cowboy') {
            svg += '<ellipse cx="' + cx + '" cy="63" rx="55" ry="9" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<path d="M' + (cx-25) + ' 63 Q' + (cx-25) + ' 38 ' + cx + ' 36 Q' + (cx+25) + ' 38 ' + (cx+25) + ' 63 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<path d="M' + (cx-20) + ' 50 L' + (cx+20) + ' 50" stroke="#5d4037" stroke-width="2"/>';
        } else if (estado.chapeu === 'pirata') {
            svg += '<path d="M' + (cx-45) + ' 65 Q' + (cx-45) + ' 43 ' + cx + ' 41 Q' + (cx+45) + ' 43 ' + (cx+45) + ' 65 L' + (cx+45) + ' 70 L' + (cx-45) + ' 70 Z" fill="#212121" stroke="#000" stroke-width="2"/>';
            svg += '<circle cx="' + cx + '" cy="54" r="9" fill="#fff"/><path d="M' + cx + ' 48 L' + (cx+2) + ' 52 L' + (cx+6) + ' 52 L' + (cx+3) + ' 55 L' + (cx+4) + ' 59 L' + cx + ' 57 L' + (cx-4) + ' 59 L' + (cx-3) + ' 55 L' + (cx-6) + ' 52 L' + (cx-2) + ' 52 Z" fill="#212121"/>';
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

function celebrar() {
    const svgClone = dollSvg.cloneNode(true);
    svgClone.setAttribute('viewBox', '0 0 220 440');
    finalDoll.innerHTML = '';
    finalDoll.appendChild(svgClone);

    let descParts = [];
    const estiloObj = (genero === 'menina' ? ESTILOS_CABELO_MENINA : ESTILOS_CABELO_MENINO).find(e => e.id === estado.cabelo_estilo);
    const corObj = CORES_CABELO.find(c => c.id === estado.cabelo_cor);
    if (estiloObj && corObj) descParts.push('cabelo ' + corObj.nome + ' ' + estiloObj.nome);

    if (genero === 'menina') {
        const b = BLUSAS_MENINA.find(x => x.id === estado.blusa);
        if (b) descParts.push(b.nome);
        if (estado.blusa !== 'vestido') {
            const s = SAIAS_MENINA.find(x => x.id === estado.saia);
            if (s) descParts.push(s.nome);
        }
        if (estado.maquiagem && estado.maquiagem !== 'nenhum') {
            const m = MAQUIAGENS.find(x => x.id === estado.maquiagem);
            if (m) descParts.push(m.nome);
        }
    } else {
        const c = CAMISAS_MENINO.find(x => x.id === estado.camisa);
        if (c) descParts.push(c.nome);
        const cl = CALCAS_MENINO.find(x => x.id === estado.calca);
        if (cl) descParts.push(cl.nome);
    }
    const sp = (genero === 'menina' ? SAPATOS_MENINA : SAPATOS_MENINO).find(x => x.id === estado.sapato);
    if (sp) descParts.push(sp.nome);

    const desc = descParts.join(', ');
    celebTitle.textContent = genero === 'menina' ? 'Que linda! 🌟' : 'Que legal! 🌟';
    celebration.style.display = 'flex';

    falar('Que lindo! Você vestiu com ' + desc + '!');
    if (typeof playSuccess === 'function') playSuccess();
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);

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
    selectScreen.style.display = 'block';
    genero = null;
    categoriaAtual = null;
    activeSide = 'left';
    estado = {};
    dollWrapper.className = 'doll-wrapper';
    bgAtual = 'quarto';
    leftCats.innerHTML = '';
    leftOptions.innerHTML = '';
    leftColors.innerHTML = '';
    leftColors.style.display = 'none';
    rightCats.innerHTML = '';
    rightOptions.innerHTML = '';
    rightColors.innerHTML = '';
    rightColors.style.display = 'none';
    document.querySelectorAll('.bg-btn').forEach(b => b.classList.toggle('active', b.dataset.bg === 'quarto'));
}

document.querySelectorAll('.char-btn').forEach(btn => {
    btn.onclick = () => selecionarPersonagem(btn.dataset.genero);
});

btnFinish.onclick = celebrar;
btnRestart.onclick = reiniciar;

bgSelector.querySelectorAll('.bg-btn').forEach(btn => {
    btn.onclick = () => {
        bgAtual = btn.dataset.bg;
        dollWrapper.className = 'doll-wrapper ' + (BG_CLASSES[bgAtual] || '');
        bgSelector.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const nomes = { quarto: 'quarto', jardim: 'jardim', praia: 'praia', palco: 'palco' };
        falar(nomes[bgAtual] || '');
    };
});

atualizarEstrelas();

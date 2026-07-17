const selectScreen = document.getElementById('select-screen');
const dressScreen = document.getElementById('dress-screen');
const dollSvg = document.getElementById('doll');
const dollWrapper = document.getElementById('doll-wrapper');
const catTabs = document.getElementById('category-tabs');
const optionsPanel = document.getElementById('options-panel');
const colorPalette = document.getElementById('color-palette');
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
    catTabs.innerHTML = '';
    cats.forEach(c => {
        const tab = document.createElement('button');
        tab.className = 'cat-tab' + (categoriaAtual === c.id ? ' active' : '');
        tab.innerHTML = '<span class="cat-icon">' + c.icon + '</span><span class="cat-label">' + c.label + '</span>';
        tab.onclick = () => {
            categoriaAtual = c.id;
            renderizarCategorias();
            renderizarOpcoes();
            falar(c.label);
        };
        catTabs.appendChild(tab);
    });
}

function renderizarOpcoes() {
    optionsPanel.innerHTML = '';
    colorPalette.innerHTML = '';
    colorPalette.style.display = 'none';

    if (categoriaAtual === 'cabelo_cor') {
        colorPalette.style.display = 'flex';
        CORES_CABELO.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (estado.cabelo_cor === c.id ? ' active' : '');
            btn.style.background = c.cor;
            btn.title = c.nome;
            btn.onclick = () => {
                estado.cabelo_cor = c.id;
                renderizarOpcoes();
                renderizarBoneco();
                criarSparkle();
                falar(c.nome);
            };
            colorPalette.appendChild(btn);
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
            display = '<div style="width:40px;height:40px;border-radius:8px;background:' + o.cor + ';border:2px solid #ddd;"></div>';
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
        optionsPanel.appendChild(btn);
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
    let svg = '';
    const estilo = estado.cabelo_estilo;
    const isGirl = genero === 'menina';

    svg += '<rect x="0" y="0" width="200" height="420" fill="none"/>';

    if (isGirl) {
        if (estado.blusa === 'vestido') {
            const v = BLUSAS_MENINA.find(b => b.id === 'vestido');
            svg += '<path d="M60 200 L60 280 L40 380 L160 380 L140 280 L140 200 Z" fill="' + v.cor + '" stroke="#c62828" stroke-width="2"/>';
            svg += '<rect x="60" y="190" width="80" height="20" rx="8" fill="' + v.cor + '" stroke="#c62828" stroke-width="2"/>';
        } else {
            const b = BLUSAS_MENINA.find(x => x.id === estado.blusa);
            const bc = b ? b.cor : '#f48fb1';
            svg += '<path d="M55 195 Q60 185 75 185 L125 185 Q140 185 145 195 L150 260 L50 260 Z" fill="' + bc + '" stroke="#e91e63" stroke-width="2"/>';
            const s = SAIAS_MENINA.find(x => x.id === estado.saia);
            if (s && estado.blusa !== 'vestido') {
                if (s.id === 'calca') {
                    svg += '<rect x="65" y="255" width="32" height="120" rx="6" fill="' + s.cor + '" stroke="#455a64" stroke-width="2"/>';
                    svg += '<rect x="103" y="255" width="32" height="120" rx="6" fill="' + s.cor + '" stroke="#455a64" stroke-width="2"/>';
                } else {
                    svg += '<path d="M55 255 L145 255 L160 360 L40 360 Z" fill="' + s.cor + '" stroke="#e91e63" stroke-width="2"/>';
                }
            }
        }
    } else {
        const cs = CAMISAS_MENINO.find(x => x.id === estado.camisa);
        const csc = cs ? cs.cor : '#42a5f5';
        if (cs && cs.id === 'listrada') {
            svg += '<path d="M55 195 Q60 185 75 185 L125 185 Q140 185 145 195 L150 260 L50 260 Z" fill="' + csc + '" stroke="#283593" stroke-width="2"/>';
            for (let yy = 195; yy < 260; yy += 14) {
                svg += '<rect x="50" y="' + yy + '" width="100" height="7" fill="#fff" opacity="0.5"/>';
            }
        } else {
            svg += '<path d="M55 195 Q60 185 75 185 L125 185 Q140 185 145 195 L150 260 L50 260 Z" fill="' + csc + '" stroke="#283593" stroke-width="2"/>';
        }
        const cl = CALCAS_MENINO.find(x => x.id === estado.calca);
        if (cl) {
            if (cl.id === 'short') {
                svg += '<rect x="65" y="255" width="32" height="60" rx="6" fill="' + cl.cor + '" stroke="#bf360c" stroke-width="2"/>';
                svg += '<rect x="103" y="255" width="32" height="60" rx="6" fill="' + cl.cor + '" stroke="#bf360c" stroke-width="2"/>';
            } else {
                svg += '<rect x="65" y="255" width="32" height="120" rx="6" fill="' + cl.cor + '" stroke="#37474f" stroke-width="2"/>';
                svg += '<rect x="103" y="255" width="32" height="120" rx="6" fill="' + cl.cor + '" stroke="#37474f" stroke-width="2"/>';
            }
        }
    }

    svg += '<rect x="83" y="170" width="34" height="30" rx="10" fill="' + skin + '" stroke="' + skinDark + '" stroke-width="1.5"/>';
    svg += '<rect x="70" y="195" width="60" height="15" rx="7" fill="' + skin + '" opacity="0.5"/>';

    if (isGirl) {
        svg += '<path d="M70 200 Q72 195 78 195 L122 195 Q128 195 130 200 L130 210 L70 210 Z" fill="' + skin + '" opacity="0.3"/>';
    }

    const sap = isGirl ? SAPATOS_MENINA : SAPATOS_MENINO;
    const sp = sap.find(x => x.id === estado.sapato);
    if (sp) {
        if (sp.id === 'salto') {
            svg += '<ellipse cx="80" cy="385" rx="18" ry="8" fill="' + sp.cor + '" stroke="#880e4f" stroke-width="2"/>';
            svg += '<rect x="76" y="375" width="8" height="18" fill="' + sp.cor + '"/>';
            svg += '<ellipse cx="120" cy="385" rx="18" ry="8" fill="' + sp.cor + '" stroke="#880e4f" stroke-width="2"/>';
            svg += '<rect x="116" y="375" width="8" height="18" fill="' + sp.cor + '"/>';
        } else if (sp.id === 'galocha') {
            svg += '<path d="M62 360 L98 360 L98 395 L62 395 Z" fill="' + sp.cor + '" stroke="#e64a19" stroke-width="2" rx="6"/>';
            svg += '<path d="M102 360 L138 360 L138 395 L102 395 Z" fill="' + sp.cor + '" stroke="#e64a19" stroke-width="2" rx="6"/>';
        } else {
            svg += '<ellipse cx="80" cy="385" rx="18" ry="10" fill="' + sp.cor + '" stroke="#333" stroke-width="2"/>';
            svg += '<ellipse cx="120" cy="385" rx="18" ry="10" fill="' + sp.cor + '" stroke="#333" stroke-width="2"/>';
        }
    }

    svg += '<circle cx="100" cy="100" r="42" fill="' + skin + '" stroke="' + skinDark + '" stroke-width="2"/>';
    svg += '<ellipse cx="84" cy="100" rx="6" ry="8" fill="#fff" stroke="#333" stroke-width="1.5"/>';
    svg += '<ellipse cx="116" cy="100" rx="6" ry="8" fill="#fff" stroke="#333" stroke-width="1.5"/>';
    svg += '<circle cx="85" cy="102" r="3.5" fill="#1a237e"/>';
    svg += '<circle cx="117" cy="102" r="3.5" fill="#1a237e"/>';
    svg += '<circle cx="86" cy="101" r="1.2" fill="#fff"/>';
    svg += '<circle cx="118" cy="101" r="1.2" fill="#fff"/>';
    svg += '<path d="M90 118 Q100 126 110 118" fill="none" stroke="#d84315" stroke-width="2.5" stroke-linecap="round"/>';
    svg += '<circle cx="76" cy="112" r="6" fill="#f48fb1" opacity="0.5"/>';
    svg += '<circle cx="124" cy="112" r="6" fill="#f48fb1" opacity="0.5"/>';

    if (isGirl && estado.maquiagem && estado.maquiagem !== 'nenhum') {
        if (estado.maquiagem === 'batom_rosa' || estado.maquiagem === 'completa') {
            svg += '<path d="M88 120 Q100 130 112 120 Q100 124 88 120" fill="#ec407a" opacity="0.7"/>';
        }
        if (estado.maquiagem === 'batom_vermelho' || estado.maquiagem === 'completa') {
            svg += '<path d="M88 120 Q100 130 112 120 Q100 124 88 120" fill="#c62828" opacity="0.8"/>';
        }
        if (estado.maquiagem === 'blush' || estado.maquiagem === 'completa') {
            svg += '<circle cx="74" cy="112" r="8" fill="#f48fb1" opacity="0.4"/>';
            svg += '<circle cx="126" cy="112" r="8" fill="#f48fb1" opacity="0.4"/>';
        }
        if (estado.maquiagem === 'brilho' || estado.maquiagem === 'completa') {
            svg += '<path d="M76 88 L92 86" stroke="' + cc + '" stroke-width="2" opacity="0.6"/>';
            svg += '<path d="M108 86 L124 88" stroke="' + cc + '" stroke-width="2" opacity="0.6"/>';
        }
    }

    if (estilo !== 'careca') {
        if (estilo === 'longo_liso') {
            svg += '<path d="M58 90 Q55 60 100 50 Q145 60 142 90 L142 180 Q140 185 130 182 L130 120 L70 120 L70 182 Q60 185 58 180 Z" fill="' + cc + '"/>';
        } else if (estilo === 'longo_ondas') {
            svg += '<path d="M58 90 Q50 60 100 48 Q150 60 142 90 Q148 110 142 130 Q148 150 142 170 Q140 180 130 178 L130 120 L70 120 L70 178 Q60 180 58 170 Q52 150 58 130 Q52 110 58 90 Z" fill="' + cc + '"/>';
        } else if (estilo === 'curto') {
            if (isGirl) {
                svg += '<path d="M62 88 Q58 58 100 50 Q142 58 138 88 L138 105 Q130 100 125 105 L75 105 Q70 100 62 105 Z" fill="' + cc + '"/>';
            } else {
                svg += '<path d="M60 85 Q58 55 100 48 Q142 55 140 85 L140 95 Q130 90 120 92 L80 92 Q70 90 60 95 Z" fill="' + cc + '"/>';
            }
        } else if (estilo === 'rabo_cavalo') {
            svg += '<path d="M62 88 Q58 58 100 50 Q142 58 138 88 L138 100 Q130 96 125 100 L75 100 Q70 96 62 100 Z" fill="' + cc + '"/>';
            svg += '<path d="M135 80 Q160 100 155 160 Q150 170 140 165 Q145 120 130 95 Z" fill="' + cc + '"/>';
        } else if (estilo === 'tranca') {
            svg += '<path d="M62 88 Q58 58 100 50 Q142 58 138 88 L138 100 Q130 96 125 100 L75 100 Q70 96 62 100 Z" fill="' + cc + '"/>';
            svg += '<path d="M90 100 L110 100 L108 130 L112 140 L108 150 L112 160 L108 170 L112 180" fill="none" stroke="' + cc + '" stroke-width="6" stroke-linecap="round"/>';
        } else if (estilo === 'cocar') {
            svg += '<path d="M62 88 Q58 58 100 50 Q142 58 138 88 L138 100 Q130 96 125 100 L75 100 Q70 96 62 100 Z" fill="' + cc + '"/>';
            svg += '<circle cx="100" cy="60" r="20" fill="' + cc + '" opacity="0.8"/>';
        } else if (estilo === 'moicano') {
            svg += '<path d="M60 85 Q58 55 100 48 Q142 55 140 85 L140 95 Q130 90 120 92 L80 92 Q70 90 60 95 Z" fill="' + cc + '"/>';
            svg += '<path d="M85 50 L115 50 L110 35 L90 35 Z" fill="' + cc + '"/>';
        } else if (estilo === 'lateral') {
            svg += '<path d="M55 85 Q55 55 100 48 Q145 55 145 85 L145 95 Q135 90 125 92 L75 92 Q65 90 55 95 Z" fill="' + cc + '"/>';
            svg += '<path d="M55 85 Q50 75 55 70" fill="none" stroke="' + cc + '" stroke-width="3"/>';
        } else if (estilo === 'cacheado') {
            for (let cx = 62; cx <= 138; cx += 12) {
                svg += '<circle cx="' + cx + '" cy="70" r="12" fill="' + cc + '"/>';
                svg += '<circle cx="' + cx + '" cy="85" r="10" fill="' + cc + '"/>';
            }
            svg += '<circle cx="100" cy="55" r="14" fill="' + cc + '"/>';
        } else if (estilo === 'rabo') {
            svg += '<path d="M60 85 Q58 55 100 48 Q142 55 140 85 L140 95 Q130 90 120 92 L80 92 Q70 90 60 95 Z" fill="' + cc + '"/>';
            svg += '<path d="M135 80 Q155 95 150 140 Q145 150 138 145 Q142 110 128 92 Z" fill="' + cc + '"/>';
        }
    }

    if (estado.chapeu && estado.chapeu !== 'nenhum') {
        if (estado.chapeu === 'coroa') {
            svg += '<path d="M75 55 L80 35 L88 50 L100 30 L112 50 L120 35 L125 55 Z" fill="#ffd700" stroke="#f57f17" stroke-width="2"/>';
            svg += '<rect x="75" y="53" width="50" height="6" rx="2" fill="#ffd700" stroke="#f57f17" stroke-width="1.5"/>';
            svg += '<circle cx="100" cy="38" r="3" fill="#e91e63"/>';
        } else if (estado.chapeu === 'laco') {
            svg += '<path d="M85 55 Q75 45 80 38 Q90 35 95 48 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<path d="M115 55 Q125 45 120 38 Q110 35 105 48 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
            svg += '<circle cx="100" cy="50" r="6" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/>';
        } else if (estado.chapeu === 'flores') {
            svg += '<circle cx="75" cy="58" r="7" fill="#f48fb1"/><circle cx="75" cy="58" r="3" fill="#fff176"/>';
            svg += '<circle cx="100" cy="52" r="7" fill="#ce93d8"/><circle cx="100" cy="52" r="3" fill="#fff176"/>';
            svg += '<circle cx="125" cy="58" r="7" fill="#81c784"/><circle cx="125" cy="58" r="3" fill="#fff176"/>';
        } else if (estado.chapeu === 'boina') {
            svg += '<ellipse cx="100" cy="55" rx="35" ry="15" fill="#5c6bc0" stroke="#283593" stroke-width="2"/>';
            svg += '<circle cx="100" cy="48" r="5" fill="#3f51b5"/>';
        } else if (estado.chapeu === 'bone') {
            svg += '<path d="M65 60 Q65 45 100 42 Q135 45 135 60 L135 65 L65 65 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
            svg += '<path d="M135 60 Q150 62 150 68 L135 68 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2"/>';
        } else if (estado.chapeu === 'cowboy') {
            svg += '<ellipse cx="100" cy="58" rx="50" ry="8" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
            svg += '<path d="M75 58 Q75 35 100 33 Q125 35 125 58 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>';
        } else if (estado.chapeu === 'pirata') {
            svg += '<path d="M65 60 Q65 40 100 38 Q135 40 135 60 L135 65 L65 65 Z" fill="#212121" stroke="#000" stroke-width="2"/>';
            svg += '<circle cx="100" cy="50" r="8" fill="#fff"/><path d="M100 44 L102 48 L106 48 L103 51 L104 55 L100 53 L96 55 L97 51 L94 48 L98 48 Z" fill="#212121"/>';
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
    svgClone.setAttribute('viewBox', '0 0 200 420');
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
    estado = {};
    dollWrapper.className = 'doll-wrapper';
    bgAtual = 'quarto';
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

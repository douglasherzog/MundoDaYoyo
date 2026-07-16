const pond = document.getElementById('pond');
const hookLine = document.getElementById('hook-line');
const hook = document.getElementById('hook');
const bobber = document.getElementById('bobber');
const overlay = document.getElementById('catch-overlay');
const catchFish = document.getElementById('catch-fish');
const catchText = document.getElementById('catch-text');
const scoreEl = document.getElementById('score');
const starsEl = document.getElementById('stars-count');
const btnContinue = document.getElementById('btn-continue');

const peixes = [
    { emoji: '🐟', nome: 'um peixinho' },
    { emoji: '🐠', nome: 'um peixe colorido' },
    { emoji: '🐡', nome: 'um baiacu' },
    { emoji: '🦈', nome: 'um tubarão' },
    { emoji: '🐬', nome: 'um golfinho' },
    { emoji: '🦑', nome: 'uma lula' },
    { emoji: '🐙', nome: 'um polvo' },
    { emoji: '🦀', nome: 'um caranguejo' },
    { emoji: '🦞', nome: 'uma lagosta' },
    { emoji: '🐚', nome: 'uma concha' },
    { emoji: '🐢', nome: 'uma tartaruga' },
    { emoji: '🦭', nome: 'uma foca' }
];

let peixesAtuais = [];
let score = 0;
let largura = 0;
let altura = 0;
let anzolX = 0;
let anzolY = 0;
let anzolAlvoX = 0;
let anzolAlvoY = 0;
let estado = 'parado';
let peixeCapturado = null;
let idAnimacao;
let boasVindasDitas = false;

function atualizarDimensoes() {
    const rect = pond.getBoundingClientRect();
    largura = rect.width;
    altura = rect.height;
    if (estado === 'parado') {
        anzolX = largura / 2;
        anzolY = 0;
        posicionarAnzol();
    }
}

function posicionarAnzol() {
    hook.style.left = (anzolX - 18) + 'px';
    hook.style.top = (anzolY - 8) + 'px';
    bobber.style.left = (anzolX - 12) + 'px';
    bobber.style.top = (anzolY - 12) + 'px';
    hookLine.style.left = anzolX + 'px';
    hookLine.style.height = Math.max(0, anzolY) + 'px';
}

function criarPeixe() {
    const tipo = peixes[Math.floor(Math.random() * peixes.length)];
    const el = document.createElement('div');
    el.className = 'fish';
    el.textContent = tipo.emoji;
    const tamanho = 42 + Math.random() * 34;
    el.style.fontSize = tamanho + 'px';
    const direita = Math.random() < 0.5;
    const x = direita ? -80 : largura + 80;
    const y = 50 + Math.random() * (altura - 120);
    const velocidade = 1.5 + Math.random() * 2.5;
    el.style.top = y + 'px';
    el.style.left = x + 'px';
    el.style.transform = direita ? 'scaleX(1)' : 'scaleX(-1)';
    pond.appendChild(el);
    peixesAtuais.push({ el, tipo, x, y, direita, velocidade, tamanho, ativo: true, capturado: false });
}

function animarPeixes() {
    for (let i = peixesAtuais.length - 1; i >= 0; i--) {
        const p = peixesAtuais[i];
        if (!p.ativo || p.capturado) continue;
        p.x += p.direita ? p.velocidade : -p.velocidade;
        if (p.direita && p.x > largura + 100) {
            p.ativo = false;
            p.el.remove();
            peixesAtuais.splice(i, 1);
            continue;
        }
        if (!p.direita && p.x < -100) {
            p.ativo = false;
            p.el.remove();
            peixesAtuais.splice(i, 1);
            continue;
        }
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
    }
    if (estado !== 'capturado') {
        while (peixesAtuais.length < 6) criarPeixe();
    }
}

function animarAnzol() {
    if (estado === 'descendo') {
        const dx = anzolAlvoX - anzolX;
        const dy = anzolAlvoY - anzolY;
        const dist = Math.hypot(dx, dy) || 1;
        const passo = 14;
        if (dist <= passo) {
            anzolX = anzolAlvoX;
            anzolY = anzolAlvoY;
            posicionarAnzol();
            tentarCapturar();
        } else {
            anzolX += (dx / dist) * passo;
            anzolY += (dy / dist) * passo;
            posicionarAnzol();
        }
    } else if (estado === 'subindo') {
        const alvoX = largura / 2;
        const alvoY = 0;
        const dx = alvoX - anzolX;
        const dy = alvoY - anzolY;
        const dist = Math.hypot(dx, dy) || 1;
        const passo = 16;
        if (dist <= passo) {
            anzolX = alvoX;
            anzolY = alvoY;
            posicionarAnzol();
            estado = 'parado';
        } else {
            anzolX += (dx / dist) * passo;
            anzolY += (dy / dist) * passo;
            posicionarAnzol();
        }
    }
}

function tentarCapturar() {
    let capturado = null;
    let melhorDist = 70;
    for (const p of peixesAtuais) {
        if (!p.ativo || p.capturado) continue;
        const cx = p.x + p.tamanho / 2;
        const cy = p.y + p.tamanho / 2;
        const dx = anzolX - cx;
        const dy = (anzolY + 16) - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < melhorDist) {
            melhorDist = dist;
            capturado = p;
        }
    }
    if (capturado) {
        capturar(capturado);
    } else {
        falar('Não pegou nada. Tente de novo!');
        setTimeout(() => { estado = 'subindo'; }, 700);
    }
}

function capturar(p) {
    estado = 'capturado';
    p.capturado = true;
    p.el.remove();
    peixesAtuais = peixesAtuais.filter(x => x !== p);
    peixeCapturado = p;
    score++;
    scoreEl.textContent = score;
    catchFish.textContent = p.tipo.emoji;
    catchText.textContent = `Muito bem! Você pescou ${p.tipo.nome}!`;
    overlay.classList.add('show');
    playSuccess();
    falar(`Muito bem! Você pescou ${p.tipo.nome}!`);
}

function continuar() {
    overlay.classList.remove('show');
    peixeCapturado = null;
    estado = 'subindo';
}

function lancarAnzol(e) {
    if (estado !== 'parado') return;
    e.preventDefault();
    const rect = pond.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(20, Math.min(largura - 20, clientX - rect.left));
    const y = Math.max(60, Math.min(altura - 20, clientY - rect.top));
    anzolAlvoX = x;
    anzolAlvoY = y;
    estado = 'descendo';
    criarOndinha(x, y);
    if (!boasVindasDitas) {
        boasVindasDitas = true;
    }
}

function criarOndinha(x, y) {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = (x - 25) + 'px';
    r.style.top = (y - 25) + 'px';
    r.style.width = '50px';
    r.style.height = '50px';
    pond.appendChild(r);
    setTimeout(() => r.remove(), 800);
}

function loop() {
    animarPeixes();
    animarAnzol();
    idAnimacao = requestAnimationFrame(loop);
}

function atualizarContadorEstrelas() {
    if (typeof obterEstrelas === 'function') {
        starsEl.textContent = obterEstrelas();
    }
}

function iniciar() {
    atualizarDimensoes();
    atualizarContadorEstrelas();
    loop();
    setTimeout(() => {
        falar('Vamos pescar! Clique na água para jogar o anzol!');
    }, 800);
}

pond.addEventListener('mousedown', lancarAnzol);
pond.addEventListener('touchstart', lancarAnzol, { passive: false });
btnContinue.addEventListener('click', continuar);
window.addEventListener('resize', atualizarDimensoes);
window.addEventListener('load', iniciar);

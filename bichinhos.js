const TIPOS = [
    { emoji: '🐛', nome: 'lagarta',    pontos: 5,  vel: 1.2, tam: '2.8rem', desc: 'devagar' },
    { emoji: '🦋', nome: 'borboleta',  pontos: 10, vel: 2.0, tam: '2.4rem', desc: 'ondulada' },
    { emoji: '🐝', nome: 'abelha',     pontos: 15, vel: 3.0, tam: '2.2rem', desc: 'ziguezague' },
    { emoji: '🐦', nome: 'passarinho', pontos: 20, vel: 4.0, tam: '2.0rem', desc: 'reto rápido' },
    { emoji: '🪲', nome: 'joaninha',   pontos: 25, vel: 3.5, tam: '1.8rem', desc: 'pequena rápida' },
];

const DURACAO = 120;
const MAX_BICHINHOS = 5;

let placar = 0;
let acertos = 0;
let tempoRestante = DURACAO;
let timerInterval = null;
let animFrame = null;
let bichinhos = [];
let jogando = false;

const arena = document.getElementById('arena');
const elPlacar = document.getElementById('placar');
const elTempo = document.getElementById('tempo');
const elAcertos = document.getElementById('acertos');
const elTimerBar = document.getElementById('timer-bar');
const elResultado = document.getElementById('resultado');
const elPontosFinais = document.getElementById('pontos-finais');
const elAcertosFinais = document.getElementById('acertos-finais');
const elEstrelas = document.getElementById('estrelas-resultado');
const btnReiniciar = document.getElementById('btn-reiniciar');

function arenaW() { return arena.offsetWidth; }
function arenaH() { return arena.offsetHeight; }

// Movimentos diferentes por tipo
function criarMovimento(tipo, x, y) {
    const vel = tipo.vel;
    switch (tipo.nome) {
        case 'lagarta':
            return { dx: (Math.random() > 0.5 ? 1 : -1) * vel * 0.6, dy: 0, t: 0 };
        case 'borboleta':
            return { dx: (Math.random() > 0.5 ? 1 : -1) * vel, dy: 0, t: Math.random() * Math.PI * 2, amplitude: 40 };
        case 'abelha':
            return { dx: (Math.random() > 0.5 ? 1 : -1) * vel, dy: (Math.random() > 0.5 ? 1 : -1) * vel, t: 0 };
        case 'passarinho':
            const ang = Math.random() * Math.PI * 2;
            return { dx: Math.cos(ang) * vel * 1.2, dy: Math.sin(ang) * vel * 0.4, t: 0 };
        case 'joaninha':
            return { dx: (Math.random() > 0.5 ? 1 : -1) * vel, dy: (Math.random() > 0.5 ? 1 : -1) * vel * 0.8, t: 0 };
        default:
            return { dx: vel, dy: 0, t: 0 };
    }
}

function criarBichinho() {
    const tipo = TIPOS[Math.floor(Math.random() * TIPOS.length)];
    const x = Math.random() * (arenaW() - 60) + 10;
    const y = Math.random() * (arenaH() - 60) + 10;
    const mov = criarMovimento(tipo, x, y);

    const el = document.createElement('div');
    el.className = 'bichinho';
    el.textContent = tipo.emoji;
    el.style.fontSize = tipo.tam;
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    const obj = { tipo, x, y, mov, el, vivo: true };

    function capturar(e) {
        e.preventDefault();
        if (!obj.vivo || !jogando) return;
        obj.vivo = false;
        el.remove();

        placar += tipo.pontos;
        acertos++;
        elPlacar.textContent = placar;
        elAcertos.textContent = acertos;

        // Popup de pontos
        const popup = document.createElement('div');
        popup.className = 'pontos-popup';
        popup.textContent = `+${tipo.pontos}`;
        popup.style.left = (obj.x + 10) + 'px';
        popup.style.top = (obj.y - 10) + 'px';
        arena.appendChild(popup);
        setTimeout(() => popup.remove(), 800);

        playSuccess();

        // Remove e repõe
        bichinhos = bichinhos.filter(b => b !== obj);
        setTimeout(() => {
            if (jogando) bichinhos.push(criarBichinho());
        }, 1000);
    }

    el.addEventListener('click', capturar);
    el.addEventListener('touchstart', capturar, { passive: false });

    arena.appendChild(el);
    return obj;
}

function atualizar() {
    if (!jogando) return;
    const W = arenaW();
    const H = arenaH();

    bichinhos.forEach(b => {
        if (!b.vivo) return;
        b.mov.t += 0.05;

        switch (b.tipo.nome) {
            case 'borboleta':
                b.x += b.mov.dx;
                b.y = b.y + Math.sin(b.mov.t) * 1.5;
                break;
            case 'abelha':
                b.x += b.mov.dx + Math.sin(b.mov.t * 3) * 2;
                b.y += b.mov.dy + Math.cos(b.mov.t * 3) * 2;
                break;
            default:
                b.x += b.mov.dx;
                b.y += b.mov.dy;
        }

        // Ricocheteia nas bordas
        const tam = parseInt(b.tipo.tam) * 10 + 20;
        if (b.x < 0) { b.x = 0; b.mov.dx = Math.abs(b.mov.dx); }
        if (b.x > W - tam) { b.x = W - tam; b.mov.dx = -Math.abs(b.mov.dx); }
        if (b.y < 0) { b.y = 0; b.mov.dy = Math.abs(b.mov.dy || 0.5); }
        if (b.y > H - tam) { b.y = H - tam; b.mov.dy = -Math.abs(b.mov.dy || 0.5); }

        b.el.style.left = b.x + 'px';
        b.el.style.top = b.y + 'px';
    });

    animFrame = requestAnimationFrame(atualizar);
}

function formatarTempo(s) {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m}:${seg.toString().padStart(2, '0')}`;
}

function calcularEstrelas(p) {
    if (p >= 300) return '⭐⭐⭐';
    if (p >= 150) return '⭐⭐';
    if (p >= 50)  return '⭐';
    return '🌟 Continue tentando!';
}

function encerrar() {
    jogando = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animFrame);
    bichinhos.forEach(b => b.el.remove());
    bichinhos = [];
    arena.style.display = 'none';
    elResultado.style.display = 'block';
    elPontosFinais.textContent = placar;
    elAcertosFinais.textContent = acertos;
    elEstrelas.textContent = calcularEstrelas(placar);
    falar(`Parabéns! Você fez ${placar} pontos e acertou ${acertos} bichinhos!`);
}

function iniciar() {
    placar = 0;
    acertos = 0;
    tempoRestante = DURACAO;
    bichinhos = [];
    jogando = true;

    elPlacar.textContent = 0;
    elAcertos.textContent = 0;
    elTempo.textContent = formatarTempo(DURACAO);
    elTimerBar.style.width = '100%';
    arena.innerHTML = '';
    arena.style.display = 'block';
    elResultado.style.display = 'none';

    for (let i = 0; i < MAX_BICHINHOS; i++) {
        bichinhos.push(criarBichinho());
    }

    timerInterval = setInterval(() => {
        tempoRestante--;
        elTempo.textContent = formatarTempo(tempoRestante);
        elTimerBar.style.width = (tempoRestante / DURACAO * 100) + '%';
        if (tempoRestante <= 10) elTimerBar.style.background = 'linear-gradient(90deg, #FF4444, #FF6B9D)';
        if (tempoRestante <= 0) encerrar();
    }, 1000);

    animFrame = requestAnimationFrame(atualizar);
    falar('Clique nos bichinhos! Vai Yoyo!');
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

btnReiniciar.addEventListener('click', iniciar);

iniciar();

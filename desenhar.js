const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

let desenhando = false;
let corAtual = '#FF0000';
let tamanhoPincel = 12;

function ajustarCanvas() {
    const area = canvas.parentElement;
    const largura = Math.min(area.clientWidth, 700);
    const altura = Math.min(window.innerHeight * 0.5, 500);

    const imagemSalva = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = largura;
    canvas.height = altura;
    ctx.putImageData(imagemSalva, 0, 0);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;
}

function limparCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function obterPosicao(evento) {
    const retangulo = canvas.getBoundingClientRect();
    const clienteX = evento.touches ? evento.touches[0].clientX : evento.clientX;
    const clienteY = evento.touches ? evento.touches[0].clientY : evento.clientY;
    return {
        x: clienteX - retangulo.left,
        y: clienteY - retangulo.top
    };
}

function comecarDesenho(evento) {
    evento.preventDefault();
    desenhando = true;
    const posicao = obterPosicao(evento);
    ctx.beginPath();
    ctx.moveTo(posicao.x, posicao.y);
    ctx.lineTo(posicao.x, posicao.y);
    ctx.stroke();
}

function desenhar(evento) {
    if (!desenhando) return;
    evento.preventDefault();
    const posicao = obterPosicao(evento);
    ctx.lineTo(posicao.x, posicao.y);
    ctx.stroke();
}

function pararDesenho() {
    desenhando = false;
    ctx.beginPath();
}

canvas.addEventListener('mousedown', comecarDesenho);
canvas.addEventListener('mousemove', desenhar);
canvas.addEventListener('mouseup', pararDesenho);
canvas.addEventListener('mouseout', pararDesenho);

canvas.addEventListener('touchstart', comecarDesenho, { passive: false });
canvas.addEventListener('touchmove', desenhar, { passive: false });
canvas.addEventListener('touchend', pararDesenho);

document.querySelectorAll('.color-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        botao.classList.add('active');
        corAtual = botao.dataset.color;
        ctx.strokeStyle = corAtual;
        if (typeof playClick === 'function') playClick();
    });
});

document.querySelectorAll('.brush-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
        botao.classList.add('active');
        tamanhoPincel = parseInt(botao.dataset.size, 10);
        ctx.lineWidth = tamanhoPincel;
        if (typeof playClick === 'function') playClick();
    });
});

document.getElementById('btn-clear').addEventListener('click', () => {
    limparCanvas();
    if (typeof playClick === 'function') playClick();
});

document.getElementById('btn-download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'desenho-yoyo.png';
    link.href = canvas.toDataURL();
    link.click();
    if (typeof playSuccess === 'function') playSuccess();
});

function desenharTemplate(tipo) {
    limparCanvas();
    ctx.save();
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 4;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    if (tipo === 'heart') {
        const tamanho = Math.min(w, h) * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx, cy + tamanho * 0.35);
        ctx.bezierCurveTo(cx, cy - tamanho * 0.25, cx - tamanho, cy - tamanho * 0.75, cx - tamanho, cy);
        ctx.bezierCurveTo(cx - tamanho, cy + tamanho * 0.6, cx, cy + tamanho * 0.9, cx, cy + tamanho * 0.9);
        ctx.bezierCurveTo(cx, cy + tamanho * 0.9, cx + tamanho, cy + tamanho * 0.6, cx + tamanho, cy);
        ctx.bezierCurveTo(cx + tamanho, cy - tamanho * 0.75, cx, cy - tamanho * 0.25, cx, cy + tamanho * 0.35);
        ctx.closePath();
        ctx.stroke();
    } else if (tipo === 'star') {
        const raioExterno = Math.min(w, h) * 0.3;
        const raioInterno = raioExterno * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const raio = i % 2 === 0 ? raioExterno : raioInterno;
            const angulo = (Math.PI / 5) * i - Math.PI / 2;
            const x = cx + raio * Math.cos(angulo);
            const y = cy + raio * Math.sin(angulo);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    } else if (tipo === 'flower') {
        const raio = Math.min(w, h) * 0.12;
        for (let i = 0; i < 6; i++) {
            const angulo = (Math.PI / 3) * i;
            const px = cx + raio * 1.8 * Math.cos(angulo);
            const py = cy + raio * 1.8 * Math.sin(angulo);
            ctx.beginPath();
            ctx.arc(px, py, raio, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, raio * 0.6, 0, Math.PI * 2);
        ctx.stroke();
    } else if (tipo === 'house') {
        const tamanho = Math.min(w, h) * 0.35;
        ctx.beginPath();
        ctx.rect(cx - tamanho, cy + tamanho * 0.2, tamanho * 2, tamanho * 1.2);
        ctx.moveTo(cx - tamanho * 1.2, cy + tamanho * 0.2);
        ctx.lineTo(cx, cy - tamanho * 0.8);
        ctx.lineTo(cx + tamanho * 1.2, cy + tamanho * 0.2);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(cx - tamanho * 0.3, cy + tamanho * 0.6, tamanho * 0.6, tamanho * 0.8);
        ctx.stroke();
    } else if (tipo === 'sun') {
        const raio = Math.min(w, h) * 0.18;
        ctx.beginPath();
        ctx.arc(cx, cy, raio, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 12; i++) {
            const angulo = (Math.PI / 6) * i;
            ctx.beginPath();
            ctx.moveTo(cx + raio * Math.cos(angulo), cy + raio * Math.sin(angulo));
            ctx.lineTo(cx + raio * 1.6 * Math.cos(angulo), cy + raio * 1.6 * Math.sin(angulo));
            ctx.stroke();
        }
    }

    ctx.restore();
    ctx.strokeStyle = corAtual;
    ctx.lineWidth = tamanhoPincel;
}

document.querySelectorAll('.template-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        botao.classList.add('active');
        desenharTemplate(botao.dataset.template);
        if (typeof playClick === 'function') playClick();
    });
});

window.addEventListener('resize', () => {
    ajustarCanvas();
});

ajustarCanvas();
limparCanvas();

(function () {
    'use strict';

    const canvas = document.getElementById('arena');
    const ctx = canvas.getContext('2d');
    const elPlacar = document.getElementById('placar');
    const elAcertos = document.getElementById('acertos');
    const elTempo = document.getElementById('tempo');
    const telaInicial = document.getElementById('tela-inicial');
    const telaFinal = document.getElementById('tela-final');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const tituloFinal = document.getElementById('titulo-final');
    const textoFinal = document.getElementById('texto-final');
    const elEstrelas = document.getElementById('estrelas');
    const dicaGesto = document.getElementById('dica-gesto');

    let W, H, escala;
    let jogoAtivo = false;
    let tempoRestante = 60;
    let placar = 0;
    let acertos = 0;
    let timerInterval;
    let lastTime = 0;
    let animId;

    const GRAV = 0.32;
    const AR = 0.995;

    const cesta = {
        x: 0, y: 0, w: 130, h: 10, aroY: 0, redeH: 70,
        tabelaX: 0, tabelaTop: 0, tabelaBottom: 0,
        redeBalanco: 0, redeBalancoVel: 0,
        tabelaBrilho: 0, aroBrilho: 0
    };
    const bola = { x: 0, y: 0, r: 20, vx: 0, vy: 0, gira: 0, lancada: false, noChao: true };
    const yoyo = {
        x: 0, baseY: 0, puloOffset: 0, puloVel: 0,
        estado: 'idle', arremesso: 0, maoX: 0, maoY: 0,
        corpoAng: 0, bracos: { d: { x: 0, y: 0 }, e: { x: 0, y: 0 } }
    };

    const estrelas = [];
    const confetes = [];
    const nuvens = [];
    const impactos = [];

    let estado = { arrastando: false, mx: 0, my: 0 };
    let marcouCesta = false;

    function redimensionar() {
        W = window.innerWidth;
        H = window.innerHeight;
        escala = window.devicePixelRatio || 1;
        canvas.width = W * escala;
        canvas.height = H * escala;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(escala, 0, 0, escala, 0, 0);
        posicionarElementos();
        gerarNuvens();
    }

    function posicionarElementos() {
        cesta.w = Math.min(130, W * 0.3);
        cesta.h = 10;
        cesta.x = W * 0.8;
        cesta.y = H * 0.32;
        cesta.aroY = cesta.y;
        cesta.redeH = Math.min(90, H * 0.18);
        cesta.tabelaX = cesta.x + cesta.w / 2 + 8;
        cesta.tabelaTop = cesta.aroY - cesta.redeH - 20;
        cesta.tabelaBottom = cesta.aroY;

        yoyo.x = W * 0.17;
        yoyo.baseY = H * 0.72;

        if (!bola.lancada) resetarBola(false);
    }

    function gerarNuvens() {
        nuvens.length = 0;
        for (let i = 0; i < 5; i++) {
            nuvens.push({
                x: Math.random() * W,
                y: H * (0.05 + Math.random() * 0.18),
                tam: 30 + Math.random() * 40,
                vel: 0.2 + Math.random() * 0.4
            });
        }
    }

    function maoDefault() {
        return { x: yoyo.x + 45, y: yoyo.baseY + yoyo.puloOffset - 52 };
    }

    function resetarBola(redesenhar = true) {
        bola.vx = 0;
        bola.vy = 0;
        bola.lancada = false;
        bola.noChao = true;
        bola.gira = 0;
        const mao = maoDefault();
        yoyo.maoX = mao.x;
        yoyo.maoY = mao.y;
        yoyo.corpoAng = 0;
        yoyo.arremesso = 0;
        yoyo.estado = 'idle';
        yoyo.puloVel = 0;
        yoyo.puloOffset = 0;
        bola.x = yoyo.maoX;
        bola.y = yoyo.maoY;
        marcouCesta = false;
        if (redesenhar) posicionarElementos();
    }

    function iniciarJogo() {
        placar = 0;
        acertos = 0;
        tempoRestante = 60;
        jogoAtivo = true;
        telaInicial.style.display = 'none';
        telaFinal.style.display = 'none';
        dicaGesto.style.display = 'block';
        elPlacar.textContent = 0;
        elAcertos.textContent = 0;
        elTempo.textContent = 60;
        resetarBola(false);

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!jogoAtivo) return;
            tempoRestante--;
            elTempo.textContent = tempoRestante;
            if (tempoRestante <= 0) encerrarJogo();
        }, 1000);

        redimensionar();

        if (animId) cancelAnimationFrame(animId);
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);

        falar('Basquete da Yoyo! Puxe a bola para tras e solte para acertar a cesta!');
        trackGamePlayed('basquete');
    }

    function encerrarJogo() {
        jogoAtivo = false;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        dicaGesto.style.display = 'none';

        const estrelasQty = acertos >= 6 ? 3 : acertos >= 3 ? 2 : acertos >= 1 ? 1 : 0;
        elEstrelas.textContent = '⭐'.repeat(estrelasQty) || '🌟';
        tituloFinal.textContent = estrelasQty === 3 ? '🏆 Incrível!' : estrelasQty > 0 ? '🎉 Muito bem!' : '🌟 Continue tentando!';
        textoFinal.textContent = `Você fez ${placar} pontos e acertou ${acertos} cestas!`;
        telaFinal.style.display = 'flex';

        if (acertos > 0) {
            playVictory();
            falar(`Parabéns! Você acertou ${acertos} cestas!`);
        } else {
            falar('Não desista, tente de novo!');
        }

        if (typeof adicionarEstrelas === 'function') {
            adicionarEstrelas(estrelasQty);
        } else if (typeof trackStars === 'function') {
            trackStars(estrelasQty);
        }
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: px, y: py };
    }

    function onDown(e) {
        if (!jogoAtivo || bola.lancada) return;
        const p = getPos(e);
        const d = Math.hypot(p.x - bola.x, p.y - bola.y);
        if (d < 100) {
            estado.arrastando = true;
            estado.mx = p.x;
            estado.my = p.y;
            dicaGesto.style.display = 'none';
            yoyo.estado = 'mira';
        }
    }

    function onMove(e) {
        if (!estado.arrastando) return;
        e.preventDefault();
        const p = getPos(e);
        estado.mx = p.x;
        estado.my = p.y;

        // A bola segue o dedo sem limitacao, mas nao pode ir alem da tela
        yoyo.maoX = Math.max(30, Math.min(W - 30, p.x));
        yoyo.maoY = Math.max(50, Math.min(H * 0.8, p.y));
        bola.x = yoyo.maoX;
        bola.y = yoyo.maoY;
    }

    function onUp(e) {
        if (!estado.arrastando) return;
        estado.arrastando = false;

        const mao = maoDefault();
        const dx = mao.x - yoyo.maoX;
        const dy = mao.y - yoyo.maoY;
        const dist = Math.hypot(dx, dy);

        if (dist < 5) return;

        const alvoX = cesta.x;
        const alvoY = cesta.aroY + 5;
        const angAlvo = Math.atan2(alvoY - mao.y, alvoX - mao.y);
        const angPuxada = Math.atan2(dy, dx);

        // Arremesso assistido: usa o angulo da cesta como base e mistura com a direcao do gesto
        let ang = angAlvo;
        const dif = normalizarAngulo(angPuxada - angAlvo);
        const desloc = Math.max(-0.35, Math.min(0.35, dif * 0.35));
        ang += desloc;

        // Forca baseada na puxada
        let forca = Math.min(dist, 300) / 6;
        forca = Math.max(12, Math.min(forca, 30));

        let vx = Math.cos(ang) * forca;
        let vy = Math.sin(ang) * forca;

        const v = Math.hypot(vx, vy);
        const maxV = 26;
        if (v > maxV) {
            vx = (vx / v) * maxV;
            vy = (vy / v) * maxV;
        }

        bola.vx = vx;
        bola.vy = vy;
        bola.lancada = true;
        bola.noChao = false;
        bola.gira = (bola.vx + bola.vy) * 0.02;
        yoyo.estado = 'arremesso';
        yoyo.arremesso = 0;
        playClick();
    }

    function normalizarAngulo(a) {
        while (a > Math.PI) a -= Math.PI * 2;
        while (a < -Math.PI) a += Math.PI * 2;
        return a;
    }

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    function desenharFundo() {
        const grad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
        grad.addColorStop(0, '#4facfe');
        grad.addColorStop(1, '#00f2fe');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H * 0.45);

        nuvens.forEach(n => {
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.tam, 0, Math.PI * 2);
            ctx.arc(n.x + n.tam * 0.7, n.y - n.tam * 0.2, n.tam * 0.85, 0, Math.PI * 2);
            ctx.arc(n.x + n.tam * 1.3, n.y, n.tam * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            n.x += n.vel;
            if (n.x - n.tam > W) n.x = -n.tam * 2;
        });

        const grama = ctx.createLinearGradient(0, H * 0.45, 0, H);
        grama.addColorStop(0, '#43aa8b');
        grama.addColorStop(1, '#2d6a4f');
        ctx.fillStyle = grama;
        ctx.fillRect(0, H * 0.45, W, H * 0.55);

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.ellipse((i * W / 19), H * 0.46 + Math.sin(i) * 3, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        const quadra = ctx.createLinearGradient(0, H * 0.55, 0, H);
        quadra.addColorStop(0, '#e9c46a');
        quadra.addColorStop(1, '#d4a373');
        ctx.fillStyle = quadra;
        ctx.beginPath();
        ctx.moveTo(W * 0.05, H * 0.55);
        ctx.lineTo(W * 0.95, H * 0.55);
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W * 0.05, H * 0.55);
        ctx.lineTo(W * 0.95, H * 0.55);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.75, Math.min(W, H) * 0.16, 0, Math.PI * 2);
        ctx.stroke();
    }

    function desenharCesta() {
        const { x, w, h, aroY, redeH, tabelaX, tabelaTop, tabelaBottom, redeBalanco, tabelaBrilho, aroBrilho } = cesta;

        ctx.save();

        // Tabela
        ctx.save();
        ctx.translate(tabelaX, (tabelaTop + tabelaBottom) / 2);
        ctx.rotate(Math.sin(tabelaBrilho * Math.PI) * 0.04);
        const grad = ctx.createLinearGradient(-8, 0, 8, 0);
        grad.addColorStop(0, '#6d597a');
        grad.addColorStop(0.5, '#9d4edd');
        grad.addColorStop(1, '#6d597a');
        ctx.fillStyle = grad;
        ctx.fillRect(-5, -(tabelaBottom - tabelaTop) / 2, 10, tabelaBottom - tabelaTop);
        ctx.shadowColor = `rgba(157, 78, 221, ${tabelaBrilho})`;
        ctx.shadowBlur = 20 * tabelaBrilho;
        ctx.fillRect(-5, -(tabelaBottom - tabelaTop) / 2, 10, tabelaBottom - tabelaTop);
        ctx.restore();

        ctx.fillStyle = '#b185db';
        ctx.fillRect(tabelaX - 5, tabelaTop, 10, 18);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tabelaX - 5, tabelaTop, 10, 18);

        // Aro
        ctx.save();
        ctx.translate(x, aroY);
        ctx.rotate(Math.sin(aroBrilho * Math.PI) * 0.05);
        ctx.shadowColor = `rgba(239, 71, 111, ${aroBrilho})`;
        ctx.shadowBlur = 25 * aroBrilho;
        ctx.lineWidth = h;
        ctx.strokeStyle = '#ef476f';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-w / 2, 0);
        ctx.lineTo(w / 2, 0);
        ctx.stroke();
        ctx.restore();

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.moveTo(x - w / 2 + 3, aroY - 2);
        ctx.lineTo(x + w / 2 - 3, aroY - 2);
        ctx.stroke();

        // Rede
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1.5;
        const passos = 8;
        for (let i = 1; i < passos; i++) {
            const px = x - w / 2 + (w / passos) * i;
            const balanco = Math.sin(redeBalanco + i * 0.5) * 5;
            ctx.beginPath();
            ctx.moveTo(px, aroY);
            ctx.quadraticCurveTo(px + balanco, aroY + redeH * 0.4, px + balanco * 0.6 + 6, aroY + redeH);
            ctx.stroke();
        }
        for (let i = 1; i < 5; i++) {
            const py = aroY + (redeH / 5) * i;
            const balanco = Math.sin(redeBalanco + i * 0.6) * 5;
            ctx.beginPath();
            ctx.moveTo(x - w / 2 + 2, py);
            ctx.quadraticCurveTo(x + balanco, py + 6, x + w / 2 - 2, py);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.moveTo(x - w / 2, aroY);
        ctx.lineTo(x + w / 2, aroY);
        ctx.lineTo(x + w / 2 - 6, aroY + redeH);
        ctx.lineTo(x - w / 2 + 6, aroY + redeH);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Decai brilho
        cesta.tabelaBrilho = Math.max(0, cesta.tabelaBrilho - 0.06);
        cesta.aroBrilho = Math.max(0, cesta.aroBrilho - 0.06);
    }

    function desenharYoyo() {
        const x = yoyo.x;
        const y = yoyo.baseY + yoyo.puloOffset;

        if (yoyo.estado === 'arremesso') {
            yoyo.arremesso += 0.05;
            if (yoyo.arremesso >= 1) {
                yoyo.arremesso = 1;
                yoyo.estado = 'idle';
            }
        }

        const mao = maoDefault();
        let maoX = yoyo.maoX;
        let maoY = yoyo.maoY;

        if (yoyo.estado === 'idle') {
            maoX = mao.x;
            maoY = mao.y;
            yoyo.corpoAng = 0;
        } else if (yoyo.estado === 'arremesso') {
            const t = yoyo.arremesso;
            // Braco sobe e depois volta
            if (t < 0.25) {
                const p = t / 0.25;
                maoX = yoyo.maoX + (x + 70 - yoyo.maoX) * p;
                maoY = yoyo.maoY + (y - 90 - yoyo.maoY) * p;
            } else {
                const p = (t - 0.25) / 0.75;
                maoX = (x + 70) + (mao.x - (x + 70)) * p;
                maoY = (y - 90) + (mao.y - (y - 90)) * p;
            }
            yoyo.corpoAng = Math.sin(t * Math.PI) * 0.35;
        }

        yoyo.maoX += (maoX - yoyo.maoX) * 0.2;
        yoyo.maoY += (maoY - yoyo.maoY) * 0.2;

        const maoDX = yoyo.maoX - x;
        const maoDY = yoyo.maoY - y;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(yoyo.corpoAng);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.14)';
        ctx.beginPath();
        ctx.ellipse(0, 50 - yoyo.puloOffset, 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pernas
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, 14);
        ctx.lineTo(-10, 42);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, 14);
        ctx.lineTo(10, 42);
        ctx.stroke();

        // Sapatilhas
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-10, 44, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(10, 44, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vestidinho dourado rodado
        const dourado = ctx.createLinearGradient(-18, 4, 18, 40);
        dourado.addColorStop(0, '#fff5b8');
        dourado.addColorStop(0.4, '#ffd700');
        dourado.addColorStop(1, '#cfa300');
        ctx.fillStyle = dourado;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.bezierCurveTo(26, 6, 30, 28, 14, 38);
        ctx.lineTo(0, 42);
        ctx.lineTo(-14, 38);
        ctx.bezierCurveTo(-30, 28, -26, 6, 0, -10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#bfa000';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Bracos
        ctx.strokeStyle = '#ffe0bd';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';

        // Braco direito
        ctx.beginPath();
        ctx.moveTo(10, -6);
        ctx.lineTo(maoDX * 0.8, maoDY * 0.8);
        ctx.stroke();

        // Mao direita
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(maoDX, maoDY, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Braco esquerdo apoio
        ctx.beginPath();
        ctx.moveTo(-10, -6);
        ctx.quadraticCurveTo(-24, 8, -20, 24);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-20, 26, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Cabeca grande
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(0, -32, 27, 0, Math.PI * 2);
        ctx.fill();

        // Orelhas
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.ellipse(-25, -32, 4, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(25, -32, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cabelo castanho
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.arc(0, -36, 29, Math.PI, 0);
        ctx.bezierCurveTo(34, -30, 38, -6, 30, 14);
        ctx.bezierCurveTo(28, 26, 18, 34, 10, 28);
        ctx.bezierCurveTo(4, 34, -4, 34, -10, 28);
        ctx.bezierCurveTo(-18, 34, -28, 26, -30, 14);
        ctx.bezierCurveTo(-38, -6, -34, -30, 0, -36);
        ctx.fill();

        // Franja
        ctx.fillStyle = '#a0703e';
        ctx.beginPath();
        ctx.arc(-10, -42, 9, 0, Math.PI * 2);
        ctx.arc(2, -44, 10, 0, Math.PI * 2);
        ctx.arc(14, -42, 9, 0, Math.PI * 2);
        ctx.fill();

        // Olhos grandes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-9, -32, 7, 8.5, 0, 0, Math.PI * 2);
        ctx.ellipse(9, -32, 7, 8.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.arc(-9, -31, 4, 0, Math.PI * 2);
        ctx.arc(9, -31, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-6.5, -33, 1.6, 0, Math.PI * 2);
        ctx.arc(11.5, -33, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Nariz
        ctx.fillStyle = '#e0b090';
        ctx.beginPath();
        ctx.arc(0, -25, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Sorriso
        ctx.strokeStyle = '#d48c8c';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, -22, 5.5, 0.15, Math.PI - 0.15);
        ctx.stroke();

        // Bochechas
        ctx.fillStyle = 'rgba(255, 140, 140, 0.32)';
        ctx.beginPath();
        ctx.arc(-17, -25, 6, 0, Math.PI * 2);
        ctx.arc(17, -25, 6, 0, Math.PI * 2);
        ctx.fill();

        // Borboletinha
        ctx.save();
        ctx.translate(-16, -50);
        ctx.rotate(Math.sin(performance.now() * 0.008) * 0.3);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(-5, -3, 6, 10, -0.6, 0, Math.PI * 2);
        ctx.ellipse(5, -3, 6, 10, 0.6, 0, Math.PI * 2);
        ctx.ellipse(0, 6, 6, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c9a000';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }

    function desenharBola() {
        const sombraY = H * 0.86;
        const dist = Math.abs(bola.y - sombraY);
        const alpha = Math.max(0.05, 0.35 - dist / 600);
        const sx = 18 + dist / 20;
        const sy = 6 + dist / 60;

        ctx.save();
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.ellipse(bola.x, sombraY, sx, sy, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(bola.x, bola.y);
        ctx.rotate(bola.gira);

        const grad = ctx.createRadialGradient(-6, -6, 3, 0, 0, bola.r);
        grad.addColorStop(0, '#ff9f43');
        grad.addColorStop(0.5, '#e67e22');
        grad.addColorStop(1, '#ba4a00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, bola.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-bola.r + 4, 0);
        ctx.lineTo(bola.r - 4, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -bola.r + 4);
        ctx.lineTo(0, bola.r - 4);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, bola.r * 0.7, 0.3, Math.PI - 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, bola.r * 0.7, Math.PI + 0.3, -0.3);
        ctx.stroke();

        ctx.restore();
    }

    function desenharMira() {
        if (!estado.arrastando) return;

        const mao = maoDefault();
        const dx = mao.x - yoyo.maoX;
        const dy = mao.y - yoyo.maoY;
        const dist = Math.min(Math.hypot(dx, dy), 300);
        const ang = Math.atan2(dy, dx);

        const passos = 20;
        const v = Math.max(12, dist / 6);

        for (let i = 1; i <= passos; i++) {
            const t = i * 0.8;
            const px = bola.x + Math.cos(ang) * v * t * 0.65;
            const py = bola.y + Math.sin(ang) * v * t * 0.65 + 0.5 * GRAV * t * t * 0.14;
            if (px < 0 || px > W || py > H) break;

            const alpha = 1 - i / passos;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 4.5 + alpha * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Linha do estilingue
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(mao.x, mao.y);
        ctx.lineTo(yoyo.maoX, yoyo.maoY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function criarConfete(x, y) {
        const cores = ['#FF6B9D', '#FF8C42', '#FFD93D', '#6BCB77', '#4D96FF', '#A66CFF'];
        return {
            x, y,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 1.3) * 14,
            cor: cores[Math.floor(Math.random() * cores.length)],
            tam: Math.random() * 7 + 4,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.4,
            vida: 1
        };
    }

    function atualizarConfetes() {
        for (let i = confetes.length - 1; i >= 0; i--) {
            const c = confetes[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.45;
            c.rot += c.vRot;
            c.vida -= 0.012;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rot);
            ctx.globalAlpha = Math.max(0, c.vida);
            ctx.fillStyle = c.cor;
            ctx.fillRect(-c.tam / 2, -c.tam / 2, c.tam, c.tam);
            ctx.restore();

            if (c.vida <= 0 || c.y > H) confetes.splice(i, 1);
        }
    }

    function criarEstrela(x, y) {
        return {
            x, y,
            vy: -3 - Math.random() * 3,
            escala: 0.6 + Math.random() * 0.6,
            vida: 1.2,
            brilho: 0
        };
    }

    function atualizarEstrelas() {
        for (let i = estrelas.length - 1; i >= 0; i--) {
            const s = estrelas[i];
            s.y += s.vy;
            s.vida -= 0.02;
            s.brilho += 0.15;

            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.scale(s.escala, s.escala);
            ctx.globalAlpha = Math.max(0, s.vida);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 12 + Math.sin(s.brilho) * 6;
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⭐', 0, 0);
            ctx.restore();

            if (s.vida <= 0) estrelas.splice(i, 1);
        }
    }

    function colidirBolaPonto(px, py, amortecer = 0.65) {
        const dx = bola.x - px;
        const dy = bola.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < bola.r) {
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = bola.vx * nx + bola.vy * ny;
            bola.vx = (bola.vx - 2 * dot * nx) * amortecer;
            bola.vy = (bola.vy - 2 * dot * ny) * amortecer;
            const overlap = bola.r - dist;
            bola.x += nx * overlap;
            bola.y += ny * overlap;
            return true;
        }
        return false;
    }

    function colidirBolaSegmento(x1, y1, x2, y2, amortecer = 0.65) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        let t = ((bola.x - x1) * dx + (bola.y - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        return colidirBolaPonto(px, py, amortecer);
    }

    function colidirTabela() {
        const tx = cesta.tabelaX;
        const top = cesta.tabelaTop;
        const bot = cesta.tabelaBottom;
        if (bola.x + bola.r > tx - 8 && bola.x - bola.r < tx + 8 &&
            bola.y > top && bola.y < bot) {
            const nx = bola.x < tx ? -1 : 1;
            const dot = bola.vx * nx;
            bola.vx = (bola.vx - 2 * dot) * 0.5;
            bola.x += nx * (bola.r + 8 - Math.abs(bola.x - tx));
            cesta.tabelaBrilho = 1;
            criarImpacto(bola.x, bola.y, '#9d4edd', 16);
            playClick();
            return true;
        }
        return false;
    }

    function colidirAro() {
        const { x, aroY, w } = cesta;
        const frontRim = { x: x - w / 2, y: aroY };
        const backRim = { x: x + w / 2, y: aroY };
        const rimRadius = 6;

        const dx = backRim.x - frontRim.x;
        const dy = backRim.y - frontRim.y;
        const len2 = dx * dx + dy * dy;
        let t = ((bola.x - frontRim.x) * dx + (bola.y - frontRim.y) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = frontRim.x + t * dx;
        const py = frontRim.y + t * dy;
        const dist = Math.hypot(bola.x - px, bola.y - py);

        if (dist < bola.r + rimRadius) {
            const nx = (bola.x - px) / dist;
            const ny = (bola.y - py) / dist;
            const dot = bola.vx * nx + bola.vy * ny;
            bola.vx = (bola.vx - 2 * dot * nx) * 0.75;
            bola.vy = (bola.vy - 2 * dot * ny) * 0.75;
            const overlap = bola.r + rimRadius - dist;
            bola.x += nx * overlap;
            bola.y += ny * overlap;
            cesta.aroBrilho = 1;
            criarImpacto(bola.x, bola.y, '#ef476f', 16);
            playClick();
            return true;
        }

        if (colidirBolaPonto(frontRim.x, frontRim.y, 0.75)) {
            cesta.aroBrilho = 1;
            criarImpacto(frontRim.x, frontRim.y, '#ef476f', 16);
            playClick();
            return true;
        }
        if (colidirBolaPonto(backRim.x, backRim.y, 0.75)) {
            cesta.aroBrilho = 1;
            criarImpacto(backRim.x, backRim.y, '#ef476f', 16);
            playClick();
            return true;
        }

        return false;
    }

    function criarImpacto(x, y, cor, qtd = 12) {
        for (let i = 0; i < qtd; i++) {
            const ang = (Math.PI * 2 * i) / qtd + Math.random() * 0.3;
            const vel = 3 + Math.random() * 5;
            impactos.push({
                x, y,
                vx: Math.cos(ang) * vel,
                vy: Math.sin(ang) * vel,
                cor,
                tam: Math.random() * 4 + 2,
                vida: 1
            });
        }
    }

    function atualizarImpactos() {
        for (let i = impactos.length - 1; i >= 0; i--) {
            const p = impactos[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.vida -= 0.025;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.vida);
            ctx.fillStyle = p.cor;
            ctx.shadowColor = p.cor;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (p.vida <= 0 || p.y > H) impactos.splice(i, 1);
        }
    }

    function verificarCesta() {
        const { x, w, aroY, redeH } = cesta;

        if (bola.vy < 0) {
            marcouCesta = false;
            return;
        }

        const limFront = x - w / 2 + 6;
        const limBack = x + w / 2 - 6;
        const limAroTop = aroY - bola.r;
        const limAroBot = aroY + 22;

        if (bola.x > limFront && bola.x < limBack && bola.y >= limAroTop && bola.y <= limAroBot && !marcouCesta) {
            marcouCesta = true;
            acertos++;
            const bonus = Math.min(30, Math.floor((Math.abs(bola.vx) + Math.abs(bola.vy)) * 0.7));
            placar += 10 + bonus;
            elAcertos.textContent = acertos;
            elPlacar.textContent = placar;

            playSuccess();
            falar('Cesta!');

            cesta.redeBalancoVel += 1.8;

            for (let i = 0; i < 28; i++) confetes.push(criarConfete(x, aroY));
            for (let i = 0; i < 6; i++) estrelas.push(criarEstrela(x, aroY));

            yoyo.puloVel = -5;
            yoyo.estado = 'celebra';
        }

        if (bola.y > aroY && bola.y < aroY + redeH && bola.x > limFront && bola.x < limBack && !marcouCesta) {
            cesta.redeBalancoVel += 0.1;
            bola.vx *= 0.92;
        }
    }

    function atualizarFisica() {
        if (!bola.lancada) return;

        bola.vy += GRAV;
        bola.vx *= AR;
        bola.vy *= AR;
        bola.x += bola.vx;
        bola.y += bola.vy;
        bola.gira += bola.vx * 0.015;

        const chao = H * 0.86;

        if (bola.y + bola.r >= chao) {
            bola.y = chao - bola.r;
            bola.vy = -bola.vy * 0.6;
            bola.vx *= 0.72;
            if (Math.abs(bola.vy) < 1.2) {
                bola.noChao = true;
                bola.lancada = false;
                setTimeout(resetarBola, 600);
            }
        }

        if (bola.x - bola.r < 0) {
            bola.x = bola.r;
            bola.vx = Math.abs(bola.vx) * 0.55;
        }
        if (bola.x + bola.r > W) {
            bola.x = W - bola.r;
            bola.vx = -Math.abs(bola.vx) * 0.55;
        }
        if (bola.y - bola.r < 0) {
            bola.y = bola.r;
            bola.vy = Math.abs(bola.vy) * 0.45;
        }

        if (bola.x > cesta.x - cesta.w / 2 - 50 && bola.x < cesta.tabelaX + 30 &&
            bola.y > cesta.aroY - cesta.redeH - 60 && bola.y < cesta.aroY + cesta.redeH + 30) {
            colidirTabela();
            colidirAro();
        }

        verificarCesta();
    }

    function atualizarAnimacaoYoyo() {
        if (yoyo.puloVel !== 0 || yoyo.puloOffset !== 0) {
            yoyo.puloOffset += yoyo.puloVel;
            yoyo.puloVel += 0.35;
            if (yoyo.puloOffset > 0) {
                yoyo.puloOffset = 0;
                yoyo.puloVel = 0;
                if (yoyo.estado === 'celebra') yoyo.estado = 'idle';
            }
        }
    }

    function atualizarRede() {
        cesta.redeBalanco += cesta.redeBalancoVel;
        cesta.redeBalancoVel *= 0.92;
    }

    function loop(now) {
        if (!jogoAtivo) return;

        const dt = (now - lastTime) / 16;
        lastTime = now;

        desenharFundo();
        desenharCesta();
        desenharMira();
        atualizarAnimacaoYoyo();
        desenharYoyo();
        desenharBola();
        atualizarImpactos();
        atualizarFisica();
        atualizarRede();
        atualizarConfetes();
        atualizarEstrelas();

        animId = requestAnimationFrame(loop);
    }

    btnIniciar.addEventListener('click', () => { playClick(); iniciarJogo(); });
    btnReiniciar.addEventListener('click', () => { playClick(); iniciarJogo(); });

    window.addEventListener('resize', () => {
        if (jogoAtivo) redimensionar();
    });

    window.trackGamePlayed = window.trackGamePlayed || function () {};
    window.trackStars = window.trackStars || function () {};

    redimensionar();
})();

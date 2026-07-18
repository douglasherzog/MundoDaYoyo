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
        x: 0, y: 0, w: 130, h: 10, aroY: 0, redeH: 75,
        tabelaX: 0, tabelaTop: 0, tabelaBottom: 0,
        redeBalanco: 0, redeBalancoVel: 0,
        tabelaBrilho: 0, aroBrilho: 0
    };
    const bola = { x: 0, y: 0, r: 18, vx: 0, vy: 0, gira: 0, lancada: false, noChao: true };
    const yoyo = {
        x: 0, baseY: 0, puloOffset: 0, puloVel: 0,
        estado: 'idle', arremesso: 0, maoX: 0, maoY: 0,
        corpoAng: 0, pescoco: { x: 0, y: 0 }, ombro: { x: 0, y: 0 }
    };

    const estrelas = [];
    const confetes = [];
    const nuvens = [];
    const impactos = [];
    const flutuantes = [];

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
        cesta.x = W * 0.78;
        cesta.y = H * 0.32;
        cesta.aroY = cesta.y;
        cesta.redeH = Math.min(95, H * 0.2);
        cesta.tabelaX = cesta.x + cesta.w / 2 + 8;
        cesta.tabelaTop = cesta.aroY - cesta.redeH - 20;
        cesta.tabelaBottom = cesta.aroY;

        yoyo.x = W * 0.16;
        yoyo.baseY = H * 0.72;
        yoyo.pescoco = { x: 0, y: -34 };
        yoyo.ombro = { x: 0, y: -30 };

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
        return { x: yoyo.x + 42, y: yoyo.baseY + yoyo.puloOffset - 50 };
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
        estado.mx = Math.max(30, Math.min(W - 30, p.x));
        estado.my = Math.max(50, Math.min(H * 0.8, p.y));
        yoyo.maoX = estado.mx;
        yoyo.maoY = estado.my;
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

        // Angulo base aponta para a cesta
        const alvoX = cesta.x;
        const alvoY = cesta.aroY;
        const angBase = Math.atan2(alvoY - mao.y, alvoX - mao.x);
        const angPuxada = Math.atan2(dy, dx);

        // Mistura a direcao da puxada com a direcao da cesta
        const dif = normalizarAngulo(angPuxada - angBase);
        const mix = 0.55;
        let s = Math.sin(angPuxada) * mix + Math.sin(angBase) * (1 - mix);
        let c = Math.cos(angPuxada) * mix + Math.cos(angBase) * (1 - mix);

        // Jogador ainda pode mirar um pouco para cima/baixo
        const ajusteAltura = Math.max(-0.35, Math.min(0.35, dif * 0.4));
        const ang = Math.atan2(s, c) + ajusteAltura;

        // Forca baseada na puxada, com minimo para garantir que chegue
        let forca = Math.min(dist, 320) / 7.5;
        forca = Math.max(14, Math.min(forca, 28));

        let vx = Math.cos(ang) * forca;
        let vy = Math.sin(ang) * forca;

        const v = Math.hypot(vx, vy);
        if (v > 28) {
            vx = (vx / v) * 28;
            vy = (vy / v) * 28;
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
        ctx.shadowBlur = 24 * tabelaBrilho;
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
        ctx.shadowBlur = 28 * aroBrilho;
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

        cesta.tabelaBrilho = Math.max(0, cesta.tabelaBrilho - 0.05);
        cesta.aroBrilho = Math.max(0, cesta.aroBrilho - 0.05);
    }

    function desenharYoyo() {
        const x = yoyo.x;
        const y = yoyo.baseY + yoyo.puloOffset;
        const respiro = Math.sin(performance.now() * 0.004) * 1.2;

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
            maoX = mao.x + Math.sin(performance.now() * 0.004) * 3;
            maoY = mao.y + respiro;
            yoyo.corpoAng = 0;
        } else if (yoyo.estado === 'arremesso') {
            const t = yoyo.arremesso;
            if (t < 0.2) {
                // Mao acompanha lancamento
                const p = t / 0.2;
                maoX = yoyo.maoX + (x + 65 - yoyo.maoX) * p;
                maoY = yoyo.maoY + (y - 85 - yoyo.maoY) * p;
            } else {
                const p = (t - 0.2) / 0.8;
                maoX = (x + 65) + (mao.x - (x + 65)) * p;
                maoY = (y - 85) + (mao.y - (y - 85)) * p;
            }
            yoyo.corpoAng = Math.sin(t * Math.PI) * 0.35;
        } else if (yoyo.estado === 'celebra') {
            maoX = mao.x + Math.sin(performance.now() * 0.012) * 18;
            maoY = mao.y - 35 + Math.sin(performance.now() * 0.018) * 8;
            yoyo.corpoAng = Math.sin(performance.now() * 0.012) * 0.1;
        } else if (yoyo.estado === 'mira') {
            yoyo.corpoAng = (yoyo.maoX - x) * 0.0025;
        }

        yoyo.maoX += (maoX - yoyo.maoX) * 0.18;
        yoyo.maoY += (maoY - yoyo.maoY) * 0.18;

        const maoDX = yoyo.maoX - x;
        const maoDY = yoyo.maoY - y;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(yoyo.corpoAng);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.13)';
        ctx.beginPath();
        ctx.ellipse(0, 54 - yoyo.puloOffset, 32, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pernas (coxa + meia calça branca + sapatilha)
        ctx.strokeStyle = '#ffe0bd';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        // Coxas
        ctx.beginPath();
        ctx.moveTo(-7, 16);
        ctx.lineTo(-12, 28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(7, 16);
        ctx.lineTo(12, 28);
        ctx.stroke();

        // Meias-calças
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-12, 28);
        ctx.lineTo(-13, 44);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(12, 28);
        ctx.lineTo(13, 44);
        ctx.stroke();

        // Sapatilhas
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-13, 46, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(13, 46, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vestidinho dourado (saia)
        const dourado = ctx.createLinearGradient(-22, 4, 22, 42);
        dourado.addColorStop(0, '#fff5b8');
        dourado.addColorStop(0.4, '#ffd700');
        dourado.addColorStop(1, '#cfa300');
        ctx.fillStyle = dourado;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.bezierCurveTo(28, 6, 32, 28, 16, 38);
        ctx.lineTo(0, 42);
        ctx.lineTo(-16, 38);
        ctx.bezierCurveTo(-32, 28, -28, 6, 0, -12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#bfa000';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Tronco
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.roundRect(-11, -22, 22, 18, 6);
        ctx.fill();
        ctx.strokeStyle = '#bfa000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pescoco
        ctx.fillStyle = '#ffe0bd';
        ctx.fillRect(-3, -28, 6, 8);

        // Bracos
        ctx.strokeStyle = '#ffe0bd';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';

        // Braco direito
        ctx.beginPath();
        ctx.moveTo(10, -18);
        ctx.lineTo(maoDX * 0.85, maoDY * 0.85);
        ctx.stroke();

        // Mao direita
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(maoDX, maoDY, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Braco esquerdo apoio
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        if (yoyo.estado === 'celebra') {
            ctx.quadraticCurveTo(-28, -50, -22, -70);
            ctx.beginPath();
            ctx.arc(-22, -70, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-10, -18);
            ctx.quadraticCurveTo(-28, -50, -22, -70);
        } else {
            ctx.quadraticCurveTo(-26, 6, -22, 24);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-22, 26, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Cabeca
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(0, -36, 28, 0, Math.PI * 2);
        ctx.fill();

        // Orelhas
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.ellipse(-27, -36, 4, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(27, -36, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cabelo castanho ondulado
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.arc(0, -40, 30, Math.PI, 0);
        ctx.bezierCurveTo(36, -32, 42, -6, 34, 16);
        ctx.bezierCurveTo(32, 28, 22, 36, 12, 30);
        ctx.bezierCurveTo(6, 36, -6, 36, -12, 30);
        ctx.bezierCurveTo(-22, 36, -32, 28, -34, 16);
        ctx.bezierCurveTo(-42, -6, -36, -32, 0, -40);
        ctx.fill();

        // Franja ondulada
        ctx.fillStyle = '#a0703e';
        ctx.beginPath();
        ctx.arc(-12, -48, 10, 0, Math.PI * 2);
        ctx.arc(2, -50, 11, 0, Math.PI * 2);
        ctx.arc(16, -48, 10, 0, Math.PI * 2);
        ctx.fill();

        // Olhos grandes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-10, -36, 8, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(10, -36, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.arc(-10, -35, 4.5, 0, Math.PI * 2);
        ctx.arc(10, -35, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-7, -38, 2, 0, Math.PI * 2);
        ctx.arc(13, -38, 2, 0, Math.PI * 2);
        ctx.fill();

        // Nariz
        ctx.fillStyle = '#e0b090';
        ctx.beginPath();
        ctx.arc(0, -29, 2.3, 0, Math.PI * 2);
        ctx.fill();

        // Sorriso
        ctx.strokeStyle = '#d48c8c';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, -24, 6, 0.15, Math.PI - 0.15);
        ctx.stroke();

        // Bochechas
        ctx.fillStyle = 'rgba(255, 140, 140, 0.32)';
        ctx.beginPath();
        ctx.arc(-19, -28, 6, 0, Math.PI * 2);
        ctx.arc(19, -28, 6, 0, Math.PI * 2);
        ctx.fill();

        // Borboletinha dourada
        ctx.save();
        ctx.translate(-18, -56);
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
        const dist = Math.min(Math.hypot(dx, dy), 320);
        const ang = Math.atan2(dy, dx);

        const passos = 22;
        const v = Math.max(14, dist / 7.5);

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

        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(mao.x, mao.y);
        ctx.lineTo(yoyo.maoX, yoyo.maoY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function criarConfete(x, y, dourado = false) {
        const cores = dourado
            ? ['#FFD700', '#FFA500', '#FFEA70', '#FFCA28']
            : ['#FF6B9D', '#FF8C42', '#FFD93D', '#6BCB77', '#4D96FF', '#A66CFF'];
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

    function criarFlutuante(texto, x, y, cor) {
        flutuantes.push({ texto, x, y, vy: -2, vida: 1.5, cor });
    }

    function atualizarFlutuantes() {
        for (let i = flutuantes.length - 1; i >= 0; i--) {
            const f = flutuantes[i];
            f.y += f.vy;
            f.vida -= 0.02;

            ctx.save();
            ctx.globalAlpha = Math.max(0, f.vida);
            ctx.fillStyle = f.cor;
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeText(f.texto, f.x, f.y);
            ctx.fillText(f.texto, f.x, f.y);
            ctx.restore();

            if (f.vida <= 0) flutuantes.splice(i, 1);
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
        const dist = Math.hypot(bola.x - px, bola.y - py);
        if (dist < bola.r) {
            const nx = (bola.x - px) / dist;
            const ny = (bola.y - py) / dist;
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

    function colidirTabela() {
        const tx = cesta.tabelaX;
        const top = cesta.tabelaTop;
        const bot = cesta.tabelaBottom;

        // Tabela é um retangulo fino na vertical
        if (bola.x + bola.r > tx - 6 && bola.x - bola.r < tx + 6 &&
            bola.y > top && bola.y < bot) {
            const lado = bola.x < tx ? -1 : 1;
            // Reflete no eixo X
            bola.vx = -bola.vx * 0.55;
            bola.vy *= 0.9;
            bola.x = tx + lado * (bola.r + 7);

            cesta.tabelaBrilho = 1;
            criarImpacto(bola.x, bola.y, '#9d4edd', 18);
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

        // Colisao com o aro horizontal
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

            // Se a bola vem de cima e bate no aro pela frente, pode quicar para dentro
            // se for proximo do centro
            if (bola.vy > 0 && bola.x > x - w / 4 && bola.x < x + w / 4 && ny < -0.3) {
                // Dribble no aro: cai para dentro
                bola.vx *= 0.85;
                bola.vy = Math.abs(bola.vy) * 0.35;
                bola.x += nx * (bola.r + rimRadius - dist);
                bola.y += ny * (bola.r + rimRadius - dist);
            } else {
                bola.vx = (bola.vx - 2 * dot * nx) * 0.78;
                bola.vy = (bola.vy - 2 * dot * ny) * 0.78;
                bola.x += nx * (bola.r + rimRadius - dist);
                bola.y += ny * (bola.r + rimRadius - dist);
            }

            cesta.aroBrilho = 1;
            criarImpacto(bola.x, bola.y, '#ef476f', 18);
            playClick();
            return true;
        }

        // Pontas do aro
        if (colidirBolaPonto(frontRim.x, frontRim.y, 0.78)) {
            cesta.aroBrilho = 1;
            criarImpacto(frontRim.x, frontRim.y, '#ef476f', 18);
            playClick();
            return true;
        }
        if (colidirBolaPonto(backRim.x, backRim.y, 0.78)) {
            cesta.aroBrilho = 1;
            criarImpacto(backRim.x, backRim.y, '#ef476f', 18);
            playClick();
            return true;
        }

        return false;
    }

    function criarImpacto(x, y, cor, qtd = 12) {
        for (let i = 0; i < qtd; i++) {
            const ang = (Math.PI * 2 * i) / qtd + Math.random() * 0.5;
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

        const limFront = x - w / 2 + 4;
        const limBack = x + w / 2 - 4;
        const limAroTop = aroY - bola.r;
        const limAroBot = aroY + 24;

        // Bola passou pelo aro vindo de cima
        if (bola.x > limFront && bola.x < limBack && bola.y >= limAroTop && bola.y <= limAroBot && !marcouCesta) {
            marcouCesta = true;
            acertos++;
            const bonus = Math.min(30, Math.floor((Math.abs(bola.vx) + Math.abs(bola.vy)) * 0.7));
            placar += 10 + bonus;
            elAcertos.textContent = acertos;
            elPlacar.textContent = placar;

            cesta.redeBalancoVel += 2.2;

            // Cesta limpa: sem tocar em nada recentemente
            if (bola.vx > 2 && Math.abs(bola.vy) < 12 && !impactouAroTabela) {
                playSuccess();
                falar('Shuuuuáááá! Cesta!');
                criarFlutuante('SHUUUUÁÁÁÁ!', x, aroY, '#FFD700');
                for (let i = 0; i < 40; i++) confetes.push(criarConfete(x, aroY, true));
                for (let i = 0; i < 8; i++) estrelas.push(criarEstrela(x, aroY));
                // Onda expansiva dourada
                criarOnda(x, aroY, '#FFD700');
            } else {
                playSuccess();
                falar('Cesta!');
                for (let i = 0; i < 28; i++) confetes.push(criarConfete(x, aroY));
                for (let i = 0; i < 6; i++) estrelas.push(criarEstrela(x, aroY));
            }

            yoyo.puloVel = -5.5;
            yoyo.estado = 'celebra';
        }

        // Bola dentro da rede ainda nao marcou
        if (bola.y > aroY && bola.y < aroY + redeH && bola.x > limFront && bola.x < limBack && !marcouCesta) {
            cesta.redeBalancoVel += 0.15;
            bola.vx *= 0.9;
        }
    }

    let impactouAroTabela = false;

    function criarOnda(x, y, cor) {
        const ondas = [];
        for (let i = 0; i < 3; i++) {
            ondas.push({ x, y, raio: 10, alpha: 1, cor });
        }

        function animar() {
            for (let i = ondas.length - 1; i >= 0; i--) {
                const o = ondas[i];
                o.raio += 4;
                o.alpha -= 0.02;

                ctx.save();
                ctx.globalAlpha = Math.max(0, o.alpha);
                ctx.strokeStyle = o.cor;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.raio, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                if (o.alpha <= 0) ondas.splice(i, 1);
            }

            if (ondas.length > 0) requestAnimationFrame(animar);
        }

        animar();
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
                impactouAroTabela = false;
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

        // Colisoes com cesta
        if (bola.x > cesta.x - cesta.w / 2 - 60 && bola.x < cesta.tabelaX + 40 &&
            bola.y > cesta.aroY - cesta.redeH - 80 && bola.y < cesta.aroY + cesta.redeH + 40) {
            const colTabela = colidirTabela();
            const colAro = colidirAro();
            if (colTabela || colAro) impactouAroTabela = true;
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
        atualizarFlutuantes();
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

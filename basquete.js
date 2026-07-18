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

    const GRAV = 0.45;
    const AR = 0.995;

    const cesta = { x: 0, y: 0, w: 80, h: 10, aroY: 0, redeH: 65, tabelaX: 0, tabelaTop: 0, tabelaBottom: 0, redeBalanco: 0, redeBalancoVel: 0 };
    const bola = { x: 0, y: 0, r: 18, vx: 0, vy: 0, gira: 0, lancada: false, noChao: true };
    const boneca = { x: 0, y: 0, baseY: 0, pulo: 0, puloOffset: 0, estado: 'idle', maoX: 0, maoY: 0, maoAng: 0, corpoAng: 0, arremesso: 0, historico: [] };

    const estrelas = [];
    const confetes = [];
    const nuvens = [];
    const impactos = [];

    let estado = { arrastando: false, startX: 0, startY: 0, mx: 0, my: 0, maoBaseX: 0, maoBaseY: 0 };
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
        cesta.w = Math.min(100, W * 0.26);
        cesta.h = 10;
        cesta.x = W * 0.8;
        cesta.y = H * 0.36;
        cesta.aroY = cesta.y;
        cesta.redeH = Math.min(90, H * 0.18);
        cesta.tabelaX = cesta.x + cesta.w / 2 + 6;
        cesta.tabelaTop = cesta.aroY - cesta.redeH - 20;
        cesta.tabelaBottom = cesta.aroY;

        boneca.x = W * 0.14;
        boneca.baseY = H * 0.74;
        boneca.puloOffset = 0;
        boneca.estado = 'idle';

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
        // Mão fica do lado direito do corpo, levemente à frente
        return {
            x: boneca.x + 42,
            y: boneca.baseY + boneca.puloOffset - 42
        };
    }

    function resetarBola(redesenhar = true) {
        bola.vx = 0;
        bola.vy = 0;
        bola.lancada = false;
        bola.noChao = true;
        bola.gira = 0;
        const mao = maoDefault();
        boneca.maoX = mao.x;
        boneca.maoY = mao.y;
        boneca.maoAng = 0;
        boneca.corpoAng = 0;
        boneca.arremesso = 0;
        boneca.estado = 'idle';
        boneca.historico = [];
        bola.x = boneca.maoX;
        bola.y = boneca.maoY;
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

        falar('Basquete da Yoyo! Puxe a bola e arremesse na cesta!');
        trackGamePlayed('basquete');
    }

    function encerrarJogo() {
        jogoAtivo = false;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        dicaGesto.style.display = 'none';

        const estrelasQty = acertos >= 8 ? 3 : acertos >= 4 ? 2 : acertos >= 1 ? 1 : 0;
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
        if (d < 90) {
            estado.arrastando = true;
            estado.mx = p.x;
            estado.my = p.y;
            const mao = maoDefault();
            estado.maoBaseX = mao.x;
            estado.maoBaseY = mao.y;
            estado.startX = estado.mx;
            estado.startY = estado.my;
            dicaGesto.style.display = 'none';
            boneca.estado = 'mira';
        }
    }

    function onMove(e) {
        if (!estado.arrastando) return;
        e.preventDefault();
        const p = getPos(e);
        estado.mx = p.x;
        estado.my = p.y;

        // Mantem a bola seguindo o dedo, mas limita distancia da boneca
        const mao = maoDefault();
        const dx = p.x - mao.x;
        const dy = p.y - mao.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 160;
        if (dist > maxDist) {
            const ang = Math.atan2(dy, dx);
            estado.mx = mao.x + Math.cos(ang) * maxDist;
            estado.my = mao.y + Math.sin(ang) * maxDist;
        }

        // A bola fica na mao, que segue o cursor
        boneca.maoX = estado.mx;
        boneca.maoY = estado.my;
        bola.x = boneca.maoX;
        bola.y = boneca.maoY;
        boneca.historico.push({ x: boneca.maoX, y: boneca.maoY, t: performance.now() });
        if (boneca.historico.length > 6) boneca.historico.shift();
    }

    function onUp(e) {
        if (!estado.arrastando) return;
        estado.arrastando = false;

        const mao = maoDefault();
        // Vetor da mao puxada de volta a posicao base: quanto mais puxou para tras/baixo, mais forte o arremesso para cesta
        const dx = mao.x - boneca.maoX;
        const dy = mao.y - boneca.maoY;
        const dist = Math.hypot(dx, dy);
        if (dist < 12) return;

        // Fator de forca: puxada longa gera arremesso forte, puxada curta gera arremesso suave
        const forca = Math.min(dist, 160) / 9;
        const ang = Math.atan2(dy, dx);

        bola.vx = Math.cos(ang) * forca * 1.3;
        bola.vy = Math.sin(ang) * forca * 1.3;

        // Limita velocidade maxima
        const v = Math.hypot(bola.vx, bola.vy);
        const maxV = 22;
        if (v > maxV) {
            bola.vx = (bola.vx / v) * maxV;
            bola.vy = (bola.vy / v) * maxV;
        }

        bola.lancada = true;
        bola.noChao = false;
        bola.gira = (bola.vx + bola.vy) * 0.015;
        boneca.estado = 'arremesso';
        boneca.arremesso = 0;
        playClick();
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
        const { x, w, h, aroY, redeH, tabelaX, tabelaTop, tabelaBottom, redeBalanco } = cesta;

        ctx.save();

        // Tabela
        const grad = ctx.createLinearGradient(tabelaX - 6, 0, tabelaX + 6, 0);
        grad.addColorStop(0, '#6d597a');
        grad.addColorStop(0.5, '#9d4edd');
        grad.addColorStop(1, '#6d597a');
        ctx.fillStyle = grad;
        ctx.fillRect(tabelaX - 5, tabelaTop, 10, tabelaBottom - tabelaTop);

        ctx.fillStyle = '#b185db';
        ctx.fillRect(tabelaX - 5, tabelaTop, 10, 18);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tabelaX - 5, tabelaTop, 10, 18);

        // Aro
        ctx.lineWidth = h;
        ctx.strokeStyle = '#ef476f';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - w / 2, aroY);
        ctx.lineTo(x + w / 2, aroY);
        ctx.stroke();

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
            const balanco = Math.sin(redeBalanco + i * 0.5) * 4;
            ctx.beginPath();
            ctx.moveTo(px, aroY);
            ctx.quadraticCurveTo(px + balanco, aroY + redeH * 0.4, px + balanco * 0.6 + 6, aroY + redeH);
            ctx.stroke();
        }
        for (let i = 1; i < 5; i++) {
            const py = aroY + (redeH / 5) * i;
            const balanco = Math.sin(redeBalanco + i * 0.6) * 4;
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
    }

    function desenharBoneca() {
        const x = boneca.x;
        const y = boneca.baseY + boneca.puloOffset + Math.sin(performance.now() * 0.004) * 2;

        // Atualiza animacao do arremesso
        if (boneca.estado === 'arremesso') {
            boneca.arremesso += 0.08;
            if (boneca.arremesso >= 1) {
                boneca.arremesso = 1;
                boneca.estado = 'idle';
            }
        }

        const maoDefaultPos = maoDefault();
        let alvoMaoX = boneca.maoX;
        let alvoMaoY = boneca.maoY;

        if (boneca.estado === 'idle') {
            alvoMaoX = maoDefaultPos.x;
            alvoMaoY = maoDefaultPos.y;
            boneca.corpoAng = 0;
        } else if (boneca.estado === 'mira') {
            // Corpo inclina e mao segue a bola
            const dx = boneca.maoX - boneca.x;
            const dy = boneca.maoY - boneca.baseY;
            boneca.maoAng = Math.atan2(dy, dx);
            boneca.corpoAng = Math.max(-0.35, Math.min(0.35, (boneca.maoX - boneca.x) * 0.003));
        } else if (boneca.estado === 'arremesso') {
            // Mao segue a bola no inicio, depois volta
            const t = boneca.arremesso;
            if (t < 0.35) {
                // Mao acompanha a bola que acabou de sair
                const suave = t / 0.35;
                alvoMaoX = alvoMaoX + (bola.x - alvoMaoX) * suave;
                alvoMaoY = alvoMaoY + (bola.y - alvoMaoY) * suave;
            } else {
                // Mao volta ao default com swing elegante
                const ret = (t - 0.35) / 0.65;
                alvoMaoX = alvoMaoX + (maoDefaultPos.x - alvoMaoX) * ret;
                alvoMaoY = alvoMaoY + (maoDefaultPos.y - alvoMaoY) * ret;
            }
            boneca.corpoAng = 0.25 * (1 - t);
        } else if (boneca.estado === 'celebra') {
            boneca.corpoAng = Math.sin(performance.now() * 0.02) * 0.15;
            alvoMaoX = maoDefaultPos.x + Math.sin(performance.now() * 0.015) * 20;
            alvoMaoY = maoDefaultPos.y - 30 - Math.abs(Math.sin(performance.now() * 0.02)) * 20;
        }

        // Suaviza posicao da mao
        boneca.maoX += (alvoMaoX - boneca.maoX) * 0.25;
        boneca.maoY += (alvoMaoY - boneca.maoY) * 0.25;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(boneca.corpoAng);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath();
        ctx.ellipse(0, 52 - boneca.puloOffset, 26, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pernas (meia calça branca + sapatilha branca)
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, 18);
        ctx.lineTo(-10, 46);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, 18);
        ctx.lineTo(10, 46);
        ctx.stroke();

        // Sapatilhas brancas
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-10, 48, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(10, 48, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(-10, 48, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(10, 48, 8, 4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Vestidinho dourado (corpo)
        const dourado = ctx.createLinearGradient(-15, 10, 15, 45);
        dourado.addColorStop(0, '#ffe66d');
        dourado.addColorStop(0.5, '#ffd700');
        dourado.addColorStop(1, '#c9a000');
        ctx.fillStyle = dourado;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(22, 32);
        ctx.lineTo(0, 38);
        ctx.lineTo(-22, 32);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Bracos
        const ombroX = 0;
        const ombroY = -8;
        const maoDX = boneca.maoX - x;
        const maoDY = boneca.maoY - y;
        const maoDist = Math.hypot(maoDX, maoDY);
        const maoAng = Math.atan2(maoDY, maoDX);

        // Braco direito (arremesso) - estendido
        ctx.strokeStyle = '#ffe0bd';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(12, -5);
        ctx.lineTo(maoDX, maoDY);
        ctx.stroke();

        // Braco esquerdo (apoio) - levemente curvado
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.quadraticCurveTo(-25, 5, -20, 20);
        ctx.stroke();

        // Mao
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(maoDX, maoDY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Cabeca
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(0, -28, 20, 0, Math.PI * 2);
        ctx.fill();

        // Cabelo castanho comprido e ondulado
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.arc(0, -30, 22, Math.PI, 0); // topo
        ctx.quadraticCurveTo(28, -20, 28, 10);
        ctx.quadraticCurveTo(30, 30, 18, 42);
        ctx.quadraticCurveTo(8, 36, 0, 40);
        ctx.quadraticCurveTo(-8, 36, -18, 42);
        ctx.quadraticCurveTo(-30, 30, -28, 10);
        ctx.quadraticCurveTo(-28, -20, 0, -30);
        ctx.fill();

        // Franja ondulada
        ctx.fillStyle = '#a0703e';
        ctx.beginPath();
        ctx.arc(0, -34, 18, 0.1, Math.PI - 0.1);
        ctx.fill();

        // Olhos
        ctx.fillStyle = '#3d2b1f';
        ctx.beginPath();
        ctx.arc(-6, -28, 2.5, 0, Math.PI * 2);
        ctx.arc(6, -28, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Sorriso
        ctx.strokeStyle = '#c65d57';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -22, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Bochechas rosadas
        ctx.fillStyle = 'rgba(255, 160, 160, 0.35)';
        ctx.beginPath();
        ctx.arc(-11, -24, 3, 0, Math.PI * 2);
        ctx.arc(11, -24, 3, 0, Math.PI * 2);
        ctx.fill();

        // Borboletinha dourada no cabelo
        ctx.save();
        ctx.translate(-16, -42);
        ctx.rotate(Math.sin(performance.now() * 0.008) * 0.3);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(-5, -3, 6, 9, -0.5, 0, Math.PI * 2);
        ctx.ellipse(5, -3, 6, 9, 0.5, 0, Math.PI * 2);
        ctx.ellipse(0, 4, 6, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c9a000';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
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

        const dx = estado.maoBaseX - estado.mx;
        const dy = estado.maoBaseY - estado.my;
        const forca = Math.min(Math.hypot(dx, dy), 220);
        const ang = Math.atan2(dy, dx);

        const passos = 16;
        const passo = forca / 6;

        for (let i = 1; i <= passos; i++) {
            const t = i;
            const px = bola.x + Math.cos(ang) * passo * t * 0.65;
            const py = bola.y + Math.sin(ang) * passo * t * 0.65 + 0.5 * GRAV * t * t * 0.12;
            if (px < 0 || px > W || py > H) break;

            const alpha = 1 - i / passos;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 3 + alpha * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(boneca.maoX, boneca.maoY);
        ctx.lineTo(estado.mx, estado.my);
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
        if (colidirBolaSegmento(tx, top, tx, bot, 0.5)) {
            criarImpacto(bola.x, bola.y, '#9d4edd');
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
            criarImpacto(bola.x, bola.y, '#ef476f');
            playClick();
            return true;
        }

        if (colidirBolaPonto(frontRim.x, frontRim.y, 0.7)) {
            criarImpacto(frontRim.x, frontRim.y, '#ef476f');
            playClick();
            return true;
        }
        if (colidirBolaPonto(backRim.x, backRim.y, 0.7)) {
            criarImpacto(backRim.x, backRim.y, '#ef476f');
            playClick();
            return true;
        }

        return false;
    }

    function criarImpacto(x, y, cor) {
        for (let i = 0; i < 8; i++) {
            impactos.push({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 1) * 8,
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
            p.vy += 0.4;
            p.vida -= 0.04;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.vida);
            ctx.fillStyle = p.cor;
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

        const limFront = x - w / 2 + 10;
        const limBack = x + w / 2 - 10;
        const limAroTop = aroY - bola.r;
        const limAroBot = aroY + 18;

        if (bola.x > limFront && bola.x < limBack && bola.y >= limAroTop && bola.y <= limAroBot && !marcouCesta) {
            marcouCesta = true;
            acertos++;
            const bonus = Math.min(30, Math.floor((Math.abs(bola.vx) + Math.abs(bola.vy)) * 0.7));
            placar += 10 + bonus;
            elAcertos.textContent = acertos;
            elPlacar.textContent = placar;

            playSuccess();
            falar('Cesta!');

            cesta.redeBalancoVel += 1.2;

            for (let i = 0; i < 22; i++) confetes.push(criarConfete(x, aroY));
            for (let i = 0; i < 5; i++) estrelas.push(criarEstrela(x, aroY));

            boneca.estado = 'celebra';
            boneca.pulo = 1;
        }

        if (bola.y > aroY && bola.y < aroY + redeH && bola.x > limFront && bola.x < limBack && !marcouCesta) {
            cesta.redeBalancoVel += 0.08;
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

        if (bola.x > cesta.x - cesta.w / 2 - 40 && bola.x < cesta.tabelaX + 20 &&
            bola.y > cesta.aroY - cesta.redeH - 40 && bola.y < cesta.aroY + cesta.redeH + 20) {
            colidirTabela();
            colidirAro();
        }

        verificarCesta();
    }

    function atualizarAnimacaoBoneca() {
        // Celebracao/pulo
        if (boneca.pulo > 0) {
            boneca.pulo += 0.12;
            boneca.puloOffset = -Math.sin(Math.min(boneca.pulo, 1) * Math.PI) * 35;
            if (boneca.pulo >= 1) {
                boneca.pulo = 0;
                boneca.puloOffset = 0;
                if (boneca.estado === 'celebra') boneca.estado = 'idle';
            }
        } else {
            boneca.puloOffset = 0;
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
        atualizarAnimacaoBoneca();
        desenharBoneca();
        desenharMira();
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

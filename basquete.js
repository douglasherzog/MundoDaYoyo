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

    const cesta = { x: 0, y: 0, w: 80, h: 10, aroY: 0, redeH: 65 };
    const bola = { x: 0, y: 0, r: 18, vx: 0, vy: 0, gira: 0, lancada: false, noChao: true };
    const yoyo = { x: 0, baseY: 0, pulo: 0, puloOffset: 0 };

    const estrelas = [];
    const confetes = [];
    const nuvens = [];

    let estado = { arrastando: false, startX: 0, startY: 0, mx: 0, my: 0 };
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

        yoyo.x = W * 0.14;
        yoyo.baseY = H * 0.73;
        yoyo.puloOffset = 0;

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

    function resetarBola(redesenhar = true) {
        bola.vx = 0;
        bola.vy = 0;
        bola.lancada = false;
        bola.noChao = true;
        bola.gira = 0;
        bola.x = yoyo.x + 50;
        bola.y = yoyo.baseY - 35;
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

        falar('Basquete da Yoyo! Arraste e solte a bola na cesta!');
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
        if (d < 70) {
            estado.arrastando = true;
            estado.startX = bola.x;
            estado.startY = bola.y;
            estado.mx = p.x;
            estado.my = p.y;
            dicaGesto.style.display = 'none';
        }
    }

    function onMove(e) {
        if (!estado.arrastando) return;
        e.preventDefault();
        const p = getPos(e);
        estado.mx = p.x;
        estado.my = p.y;
    }

    function onUp(e) {
        if (!estado.arrastando) return;
        estado.arrastando = false;

        const dx = estado.startX - estado.mx;
        const dy = estado.startY - estado.my;
        const forca = Math.min(Math.hypot(dx, dy), 220) / 6.5;
        if (forca < 4) return;

        const ang = Math.atan2(dy, dx);
        bola.vx = Math.cos(ang) * forca * 1.2;
        bola.vy = Math.sin(ang) * forca * 1.2;
        bola.lancada = true;
        bola.noChao = false;
        bola.gira = forca * 0.05;
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
        const { x, y, w, h, aroY, redeH } = cesta;

        ctx.save();
        ctx.strokeStyle = '#9d4edd';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 4, aroY - redeH - 20);
        ctx.lineTo(x + w / 2 + 4, aroY);
        ctx.stroke();

        ctx.lineWidth = h;
        ctx.strokeStyle = '#ef476f';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - w / 2, aroY);
        ctx.lineTo(x + w / 2, aroY);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1.5;
        for (let i = 1; i < 7; i++) {
            const px = x - w / 2 + (w / 7) * i;
            ctx.beginPath();
            ctx.moveTo(px, aroY);
            ctx.lineTo(px + 8, aroY + redeH);
            ctx.stroke();
        }
        for (let i = 1; i < 5; i++) {
            const py = aroY + (redeH / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x - w / 2 + 2, py);
            ctx.quadraticCurveTo(x, py + 8, x + w / 2 - 2, py);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(x - w / 2, aroY);
        ctx.lineTo(x + w / 2, aroY);
        ctx.lineTo(x + w / 2 - 8, aroY + redeH);
        ctx.lineTo(x - w / 2 + 8, aroY + redeH);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function desenharYoyo() {
        const x = yoyo.x;
        const y = yoyo.baseY + yoyo.puloOffset + Math.sin(performance.now() * 0.006) * 4;

        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, 32 - yoyo.puloOffset, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff9a9e';
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fad2e1';
        ctx.beginPath();
        ctx.arc(-8, -6, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-8, -6, 3, 0, Math.PI * 2);
        ctx.arc(8, -6, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d62839';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 4, 9, 0, Math.PI, false);
        ctx.stroke();

        ctx.fillStyle = '#FF6B9D';
        ctx.font = 'bold 13px Comic Sans MS, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('YOYO', 0, 38);

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

        const dx = estado.startX - estado.mx;
        const dy = estado.startY - estado.my;
        const forca = Math.min(Math.hypot(dx, dy), 220);
        const ang = Math.atan2(dy, dx);

        const passos = 14;
        const passo = forca / 5;

        for (let i = 1; i <= passos; i++) {
            const t = i;
            const px = bola.x + Math.cos(ang) * passo * t * 0.55;
            const py = bola.y + Math.sin(ang) * passo * t * 0.55 + 0.5 * GRAV * t * t * 0.12;
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
        ctx.moveTo(bola.x, bola.y);
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

    function verificarCesta() {
        if (bola.vy < 0) marcouCesta = false;

        const { x, y, w, aroY } = cesta;
        const dentroX = bola.x > x - w / 2 + 8 && bola.x < x + w / 2 - 8;
        const passouAro = bola.y >= aroY - bola.r && bola.y <= aroY + 18;
        const vindoDeCima = bola.vy > 0;

        if (dentroX && passouAro && vindoDeCima && !marcouCesta) {
            marcouCesta = true;
            acertos++;
            const bonus = Math.min(30, Math.floor((Math.abs(bola.vx) + Math.abs(bola.vy)) * 0.7));
            placar += 10 + bonus;
            elAcertos.textContent = acertos;
            elPlacar.textContent = placar;

            playSuccess();
            falar('Cesta!');

            for (let i = 0; i < 22; i++) confetes.push(criarConfete(x, aroY));
            for (let i = 0; i < 5; i++) estrelas.push(criarEstrela(x, aroY));

            yoyo.pulo = 1;
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

        if (bola.x > cesta.x - cesta.w / 2 - 20 &&
            bola.x < cesta.x + cesta.w / 2 + 20 &&
            bola.y > cesta.aroY - 20 && bola.y < cesta.aroY + 60) {
            verificarCesta();
        }
    }

    function desenharEfeitos() {
        if (yoyo.pulo > 0) {
            yoyo.pulo += 0.12;
            yoyo.puloOffset = -Math.sin(Math.min(yoyo.pulo, 1) * Math.PI) * 35;
            if (yoyo.pulo >= 1) {
                yoyo.pulo = 0;
                yoyo.puloOffset = 0;
            }
        } else {
            yoyo.puloOffset = 0;
        }
    }

    function loop(now) {
        if (!jogoAtivo) return;

        const dt = (now - lastTime) / 16;
        lastTime = now;

        desenharFundo();
        desenharCesta();
        desenharYoyo();
        desenharMira();
        desenharBola();
        desenharEfeitos();
        atualizarFisica();
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

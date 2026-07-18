(function () {
    'use strict';

    const canvas = document.getElementById('arena');
    const wrap = document.getElementById('arena-wrap');
    const elPlacar = document.getElementById('placar');
    const elAcertos = document.getElementById('acertos');
    const elTempo = document.getElementById('tempo');
    const elTutorial = document.getElementById('tutorial');
    const elOverlay = document.getElementById('overlay');
    const elPontosFinais = document.getElementById('pontos-finais');
    const elAcertosFinais = document.getElementById('acertos-finais');
    const elEstrelas = document.getElementById('estrelas');
    const btnReiniciar = document.getElementById('btn-reiniciar');

    const ctx = canvas.getContext('2d');

    let W, H, scale;
    let jogoAtivo = false;
    let tempoRestante = 60;
    let placar = 0;
    let acertos = 0;
    let tentativas = 0;
    let timerInterval;
    let lastTime = 0;
    let animId;

    const estado = {
        arrastando: false,
        puxando: false,
        startX: 0,
        startY: 0,
        mouseX: 0,
        mouseY: 0,
        esperandoLancamento: true
    };

    const bola = {
        x: 0, y: 0,
        vx: 0, vy: 0,
        r: 18,
        gira: 0,
        lancada: false,
        noChao: true
    };

    const cesta = {
        x: 0, y: 0,
        w: 70, h: 12,
        aroY: 0,
        redeAlt: 55
    };

    const yoyo = {
        x: 0, y: 0,
        pulo: 0,
        animFrame: 0
    };

    const confetes = [];
    const estrelas = [];

    const GRAV = 0.55;
    const AR = 0.995;
    const QUADRA = { x: 0, y: 0, w: 0, h: 0 };

    function redimensionar() {
        const rect = wrap.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        W = canvas.width;
        H = canvas.height;
        scale = window.devicePixelRatio || 1;
        ctx.scale(scale, scale);
        W /= scale;
        H /= scale;

        QUADRA.w = W;
        QUADRA.h = H;

        posicionarElementos();
    }

    function posicionarElementos() {
        cesta.x = W * 0.78;
        cesta.y = H * 0.42;
        cesta.w = Math.min(90, W * 0.22);
        cesta.h = 12;
        cesta.aroY = cesta.y;

        yoyo.x = W * 0.18;
        yoyo.y = H * 0.78;

        if (!bola.lancada && bola.noChao) {
            bola.x = yoyo.x + 55;
            bola.y = yoyo.y - 25;
        }
    }

    function iniciar() {
        placar = 0;
        acertos = 0;
        tentativas = 0;
        tempoRestante = 60;
        jogoAtivo = true;
        estado.esperandoLancamento = true;
        estado.arrastando = false;
        estado.puxando = false;
        bola.lancada = false;
        bola.noChao = true;
        bola.vx = 0;
       bola.vy = 0;
        confetes.length = 0;
        estrelas.length = 0;

        elPlacar.textContent = 0;
        elAcertos.textContent = 0;
        elTempo.textContent = tempoRestante;
        elOverlay.style.display = 'none';
        elTutorial.style.display = 'block';

        redimensionar();
        posicionarElementos();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!jogoAtivo) return;
            tempoRestante--;
            elTempo.textContent = tempoRestante;
            if (tempoRestante <= 0) encerrar();
        }, 1000);

        if (animId) cancelAnimationFrame(animId);
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);

        falar('Arraste e solte para marcar pontos!');
        trackGamePlayed('basquete');
    }

    function encerrar() {
        jogoAtivo = false;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);

        const totalEstrelas = Math.min(3, Math.floor(acertos / 2));
        elEstrelas.textContent = '⭐'.repeat(totalEstrelas) || '🌟';
        elPontosFinais.textContent = placar;
        elAcertosFinais.textContent = acertos;
        elOverlay.style.display = 'flex';

        if (acertos >= 2) {
            playVictory();
            falar(`Parabéns! Você fez ${acertos} cestas!`);
            for (let i = 0; i < 30; i++) {
                confetes.push(criarConfete(W / 2, H / 2));
            }
        } else {
            falar(`Você fez ${acertos} cestas. Tente de novo!`);
        }

        trackStars(typeof totalEstrelas === 'number' ? totalEstrelas : 0);
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x: cx, y: cy };
    }

    function onDown(e) {
        if (!jogoAtivo || bola.lancada) return;
        const pos = getPos(e);
        const dx = pos.x - bola.x;
        const dy = pos.y - bola.y;
        if (Math.hypot(dx, dy) < 60) {
            estado.arrastando = true;
            estado.puxando = true;
            estado.startX = pos.x;
            estado.startY = pos.y;
            estado.mouseX = pos.x;
            estado.mouseY = pos.y;
            elTutorial.style.display = 'none';
        }
    }

    function onMove(e) {
        if (!estado.arrastando) return;
        e.preventDefault();
        const pos = getPos(e);
        estado.mouseX = pos.x;
        estado.mouseY = pos.y;
    }

    function onUp(e) {
        if (!estado.arrastando) return;
        estado.arrastando = false;
        estado.puxando = false;

        const dx = estado.startX - estado.mouseX;
        const dy = estado.startY - estado.mouseY;
        const forca = Math.min(Math.hypot(dx, dy), 160) / 7.5;
        const ang = Math.atan2(dy, dx);

        if (forca < 2) {
            bola.vx = 0;
            bola.vy = 0;
            return;
        }

        bola.vx = Math.cos(ang) * forca * 1.6;
        bola.vy = Math.sin(ang) * forca * 1.6;
        bola.lancada = true;
        bola.noChao = false;
        bola.gira = forca * 0.15;
        tentativas++;
        playClick();
    }

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    function desenharQuadra() {
        const grad = ctx.createLinearGradient(0, H * 0.5, 0, H);
        grad.addColorStop(0, '#f4a261');
        grad.addColorStop(1, '#e76f51');
        ctx.fillStyle = grad;
        ctx.fillRect(0, H * 0.5, W, H * 0.5);

        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(W * 0.15, H * 0.5);
        ctx.lineTo(W * 0.85, H * 0.5);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(W * 0.35, H * 0.78, H * 0.18, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 12; i++) {
            const sx = W * 0.05 + (W * 0.9 / 12) * i;
            const sy = H * 0.52 + Math.sin(i * 0.8 + performance.now() * 0.002) * 4;
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath();
            ctx.ellipse(sx, sy, 4, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function desenharCesta() {
        const { x, y, w, h, aroY, redeAlt } = cesta;

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#d62839';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 6, y);
        ctx.lineTo(x + w / 2 + 6, y - 55);
        ctx.stroke();

        ctx.strokeStyle = '#ef476f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - w / 2, aroY);
        ctx.lineTo(x + w / 2, aroY);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        for (let i = 1; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(x - w / 2 + (w / 6) * i, aroY);
            ctx.lineTo(x - w / 2 + 6 + (w / 6) * i * 0.7, aroY + redeAlt);
            ctx.stroke();
        }
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x - w / 2 + 4, aroY + (redeAlt / 4) * i);
            ctx.quadraticCurveTo(x, aroY + (redeAlt / 4) * i + 6, x + w / 2 - 4, aroY + (redeAlt / 4) * i);
            ctx.stroke();
        }
    }

    function desenharYoyo() {
        const x = yoyo.x;
        const y = yoyo.y - Math.sin(yoyo.animFrame * 0.12) * 5;

        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = '#f4d35e';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e76f51';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-6, -4, 3, 0, Math.PI * 2);
        ctx.arc(6, -4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d62839';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 5, 8, 0, Math.PI, false);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Comic Sans MS, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('YOYO', 0, 36);

        ctx.restore();
    }

    function desenharBola() {
        const grad = ctx.createRadialGradient(bola.x - 5, bola.y - 5, 3, bola.x, bola.y, bola.r);
        grad.addColorStop(0, '#ff9f43');
        grad.addColorStop(1, '#e67e22');

        ctx.save();
        ctx.translate(bola.x, bola.y);
        ctx.rotate(bola.gira);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, bola.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-bola.r + 3, 0);
        ctx.lineTo(bola.r - 3, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -bola.r + 3);
        ctx.lineTo(0, bola.r - 3);
        ctx.stroke();

        ctx.restore();
    }

    function desenharMira() {
        if (!estado.puxando) return;

        const dx = estado.startX - estado.mouseX;
        const dy = estado.startY - estado.mouseY;
        const forca = Math.min(Math.hypot(dx, dy), 160);
        const ang = Math.atan2(dy, dx);

        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(bola.x, bola.y);
        ctx.lineTo(bola.x + Math.cos(ang) * forca, bola.y + Math.sin(ang) * forca);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 1; i <= 5; i++) {
            const t = i / 5;
            const px = bola.x + Math.cos(ang) * forca * t;
            const py = bola.y + Math.sin(ang) * forca * t;
            ctx.beginPath();
            ctx.arc(px, py, 4 * (1 - t * 0.5), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function criarConfete(x, y) {
        const cores = ['#FF6B9D', '#FF8C42', '#FFD93D', '#6BCB77', '#4D96FF', '#A66CFF'];
        return {
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 1.2) * 10,
            cor: cores[Math.floor(Math.random() * cores.length)],
            tam: Math.random() * 8 + 4,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.3,
            vida: 1
        };
    }

    function desenharConfetes() {
        for (let i = confetes.length - 1; i >= 0; i--) {
            const c = confetes[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.4;
            c.rot += c.vRot;
            c.vida -= 0.015;

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
            vy: -2 - Math.random() * 2,
            escala: 0.5 + Math.random() * 0.5,
            vida: 1.2
        };
    }

    function desenharEstrelas() {
        for (let i = estrelas.length - 1; i >= 0; i--) {
            const s = estrelas[i];
            s.y += s.vy;
            s.vida -= 0.02;

            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.scale(s.escala, s.escala);
            ctx.globalAlpha = Math.max(0, s.vida);
            ctx.fillStyle = '#FFD700';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⭐', 0, 0);
            ctx.restore();

            if (s.vida <= 0) estrelas.splice(i, 1);
        }
    }

    let marcouCesta = false;

    function atualizarFisica() {
        if (!bola.lancada) return;

        bola.vy += GRAV;
        bola.vx *= AR;
        bola.vy *= AR;
        bola.x += bola.vx;
        bola.y += bola.vy;
        bola.gira += 0.12;

        const chao = H * 0.85;

        if (bola.y + bola.r >= chao) {
            bola.y = chao - bola.r;
            bola.vy = -bola.vy * 0.55;
            bola.vx *= 0.75;
            if (Math.abs(bola.vy) < 1) {
                bola.noChao = true;
                bola.lancada = false;
                setTimeout(resetarBola, 400);
            }
        }

        if (bola.x - bola.r < 0) {
            bola.x = bola.r;
            bola.vx = -bola.vx * 0.65;
        }
        if (bola.x + bola.r > W) {
            bola.x = W - bola.r;
            bola.vx = -bola.vx * 0.65;
        }
        if (bola.y - bola.r < 0) {
            bola.y = bola.r;
            bola.vy = Math.abs(bola.vy) * 0.5;
        }

        verificarCesta();
    }

    function verificarCesta() {
        if (bola.vy < 0) marcouCesta = false;

        const aroX = cesta.x;
        const aroY = cesta.aroY;
        const w = cesta.w;

        const dentroX = bola.x > aroX - w / 2 + 8 && bola.x < aroX + w / 2 - 8;
        const passouAro = bola.y >= aroY && bola.y <= aroY + 20;
        const vindoDeCima = bola.vy > 0;

        if (dentroX && passouAro && vindoDeCima && !marcouCesta) {
            marcouCesta = true;
            acertos++;
            placar += 10 + Math.floor(Math.abs(bola.vx)) + Math.floor(Math.abs(bola.vy));
            elAcertos.textContent = acertos;
            elPlacar.textContent = placar;
            playSuccess();
            falar('Cesta! Muito bem!');
            for (let i = 0; i < 12; i++) {
                confetes.push(criarConfete(cesta.x, cesta.aroY));
            }
            estrelas.push(criarEstrela(cesta.x, cesta.aroY));
        }
    }

    function resetarBola() {
        bola.vx = 0;
        bola.vy = 0;
        bola.lancada = false;
        bola.noChao = true;
        bola.gira = 0;
        posicionarElementos();
        marcouCesta = false;
        estado.esperandoLancamento = true;
    }

    function limparCanvas() {
        ctx.clearRect(0, 0, W, H);

        const ceu = ctx.createLinearGradient(0, 0, 0, H * 0.5);
        ceu.addColorStop(0, '#87CEEB');
        ceu.addColorStop(1, '#bde0fe');
        ctx.fillStyle = ceu;
        ctx.fillRect(0, 0, W, H * 0.5);

        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            const cx = W * (0.12 + i * 0.2) + Math.sin(performance.now() * 0.0005 + i) * 10;
            const cy = H * (0.1 + Math.cos(i) * 0.05);
            ctx.beginPath();
            ctx.arc(cx, cy, 25 + i * 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop(now) {
        if (!jogoAtivo) return;

        const dt = (now - lastTime) / 16;
        lastTime = now;

        yoyo.animFrame += dt;

        limparCanvas();
        desenharQuadra();
        desenharCesta();
        desenharYoyo();
        desenharMira();
        desenharBola();
        desenharConfetes();
        desenharEstrelas();

        atualizarFisica();

        animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', redimensionar);

    btnReiniciar.addEventListener('click', function () {
        playClick();
        iniciar();
    });

    if (typeof trackGamePlayed !== 'function') {
        window.trackGamePlayed = function () {};
    }
    if (typeof trackStars !== 'function') {
        window.trackStars = function () {};
    }

    document.addEventListener('DOMContentLoaded', iniciar);
    if (document.readyState !== 'loading') iniciar();
})();

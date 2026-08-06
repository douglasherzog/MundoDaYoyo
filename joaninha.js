(function () {
    'use strict';

    const canvas = document.getElementById('jogoCanvas');
    const ctx = canvas.getContext('2d');
    const areaJogo = document.getElementById('areaJogo');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const tituloJogo = document.getElementById('tituloJogo');
    const pontosJogo = document.getElementById('pontosJogo');
    const mensagemTela = document.getElementById('mensagemTela');

    let W = 0, H = 0;
    let modo = null;
    let animId = null;
    let ultimoT = 0;
    let emTransicao = false;

    const CORES = [
        { nome: 'vermelho', hex: '#e63946' },
        { nome: 'azul', hex: '#0077b6' },
        { nome: 'amarelo', hex: '#ffd166' },
        { nome: 'verde', hex: '#4caf50' },
        { nome: 'roxo', hex: '#9d4edd' },
        { nome: 'laranja', hex: '#fb5607' },
        { nome: 'rosa', hex: '#ff70a6' }
    ];

    const NOTAS = [261.63, 329.63, 392.00, 523.25, 659.25];

    const floresIcones = ['🌸', '🌼', '🌺', '🌻', '🌷', '🌹'];

    function redimensionar() {
        const tela = document.getElementById('telaCanvas');
        const barra = document.querySelector('.barra-jogo');
        let w = tela.clientWidth;
        let h = tela.clientHeight;
        if (w <= 10 || h <= 10) {
            const area = document.getElementById('areaJogo');
            const barraH = (barra && barra.clientHeight) || 56;
            w = (area.clientWidth || window.innerWidth || 320) - 1;
            h = (area.clientHeight || window.innerHeight || 480) - barraH;
        }
        W = Math.max(10, w);
        H = Math.max(10, h);
        const escala = window.devicePixelRatio || 1;
        canvas.width = Math.floor(W * escala);
        canvas.height = Math.floor(H * escala);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(escala, 0, 0, escala, 0, 0);
    }

    function falar(texto) {
        if (typeof window.falar === 'function') window.falar(texto);
        else if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(texto);
            u.lang = 'pt-BR';
            u.rate = 0.9;
            u.pitch = 1.1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        }
    }

    function tocarNota(freq, dur = 0.3) {
        if (typeof window.playMusicNote === 'function') window.playMusicNote(freq, dur);
        else if (typeof window.playTone === 'function') window.playTone(freq, dur, 'sine', 0.25);
    }

    function sucesso() {
        if (typeof window.playSuccess === 'function') window.playSuccess();
        criarConfetes();
    }

    function erro() {
        if (typeof window.playError === 'function') window.playError();
    }

    function mostrarMensagem(texto, tempo = 1500) {
        mensagemTela.textContent = texto;
        mensagemTela.classList.add('visivel');
        setTimeout(() => mensagemTela.classList.remove('visivel'), tempo);
    }

    function ajustarPontos(valor) {
        pontosJogo.textContent = '🌟 ' + valor;
    }

    let confetes = [];
    function criarConfetes(x, y, qtd = 18) {
        for (let i = 0; i < qtd; i++) {
            confetes.push({
                x: x || W / 2,
                y: y || H / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 8 - 3,
                cor: CORES[Math.floor(Math.random() * CORES.length)].hex,
                tam: Math.random() * 6 + 4,
                vida: 1
            });
        }
    }

    function atualizarConfetes() {
        for (let i = confetes.length - 1; i >= 0; i--) {
            const p = confetes[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
            p.vida -= 0.015;
            ctx.globalAlpha = Math.max(0, p.vida);
            ctx.fillStyle = p.cor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
            ctx.fill();
            if (p.vida <= 0) confetes.splice(i, 1);
        }
        ctx.globalAlpha = 1;
    }

    function desenhaJoaninha(x, y, raio, asaAng = 0, corPintada) {
        ctx.save();
        ctx.translate(x, y);

        // asas
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.ellipse(-raio * 0.9, -raio * 0.4, raio * 0.8, raio * 0.5, asaAng, 0, Math.PI * 2);
        ctx.ellipse(raio * 0.9, -raio * 0.4, raio * 0.8, raio * 0.5, -asaAng, 0, Math.PI * 2);
        ctx.fill();

        // corpo
        ctx.fillStyle = corPintada || '#e63946';
        ctx.beginPath();
        ctx.arc(0, 0, raio, 0, Math.PI * 2);
        ctx.fill();

        // cabeca
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, -raio * 0.85, raio * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // olhos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-raio * 0.18, -raio * 1.05, raio * 0.18, 0, Math.PI * 2);
        ctx.arc(raio * 0.18, -raio * 1.05, raio * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-raio * 0.18, -raio * 1.05, raio * 0.08, 0, Math.PI * 2);
        ctx.arc(raio * 0.18, -raio * 1.05, raio * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // antenas
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-raio * 0.2, -raio * 1.2);
        ctx.quadraticCurveTo(-raio * 0.6, -raio * 1.7, -raio * 0.9, -raio * 1.4);
        ctx.moveTo(raio * 0.2, -raio * 1.2);
        ctx.quadraticCurveTo(raio * 0.6, -raio * 1.7, raio * 0.9, -raio * 1.4);
        ctx.stroke();

        // manchas
        ctx.fillStyle = '#111';
        const spots = [[-0.4, -0.3], [0.4, -0.3], [0, 0.2], [-0.5, 0.4], [0.5, 0.4], [0, -0.6]];
        for (const [a, b] of spots) {
            ctx.beginPath();
            ctx.arc(a * raio * 0.8, b * raio * 0.8, raio * 0.16, 0, Math.PI * 2);
            ctx.fill();
        }

        // sorriso
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -raio * 0.35, raio * 0.25, 0.1, Math.PI - 0.1);
        ctx.stroke();

        ctx.restore();
    }

    function desenhaFlor(x, y, tamanho, cor) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(-3, 0, 6, tamanho * 0.8);
        for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            ctx.save();
            ctx.rotate(ang);
            ctx.fillStyle = cor || '#ff9a9e';
            ctx.beginPath();
            ctx.ellipse(0, -tamanho * 0.5, tamanho * 0.35, tamanho * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, tamanho * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // =====================================================
    // JOGO 1: VOA NO JARDIM
    // =====================================================
    let voa = {
        joaninha: { x: 0, y: 0, vy: 0, raio: 22, asa: 0 },
        itens: [],
        nuvens: [],
        pontos: 0,
        vidas: 3,
        tempoItem: 0,
        terminado: false,
        init() {
            this.joaninha.x = W * 0.2;
            this.joaninha.y = H * 0.5;
            this.joaninha.vy = 0;
            this.itens = [];
            this.nuvens = [];
            for (let i = 0; i < 4; i++) this.nuvens.push({ x: Math.random() * W, y: Math.random() * H * 0.5, s: 30 + Math.random() * 40 });
            this.pontos = 0;
            this.vidas = 3;
            this.terminado = false;
            ajustarPontos(0);
            falar('Joaninha voa no jardim! Toque para subir e pegue as gotinhas coloridas!');
        },
        flap() {
            if (this.terminado) return;
            this.joaninha.vy = -5.5;
            tocarNota(600, 0.08);
        },
        toque(x, y) { this.flap(); },
        tecla(e) { if (e.code === 'Space' || e.code === 'Enter') this.flap(); },
        update(dt) {
            if (this.terminado) return;
            this.joaninha.vy += 0.25;
            this.joaninha.y += this.joaninha.vy;
            this.joaninha.asa += 0.5;
            if (this.joaninha.y < this.joaninha.raio) { this.joaninha.y = this.joaninha.raio; this.joaninha.vy = 0; }
            if (this.joaninha.y > H - this.joaninha.raio) { this.joaninha.y = H - this.joaninha.raio; this.joaninha.vy = 0; }

            this.tempoItem += dt;
            if (this.tempoItem > 80) {
                this.tempoItem = 0;
                const tipo = Math.random() > 0.75 ? 'abelha' : 'gota';
                const cor = CORES[Math.floor(Math.random() * CORES.length)];
                this.itens.push({ x: W + 30, y: Math.random() * (H - 80) + 40, tipo, cor, r: 14, vx: -2.5 - Math.random() * 1.5 });
            }

            for (let i = this.itens.length - 1; i >= 0; i--) {
                const it = this.itens[i];
                it.x += it.vx;
                const dx = this.joaninha.x - it.x;
                const dy = this.joaninha.y - it.y;
                const dist = Math.hypot(dx, dy);
                if (dist < this.joaninha.raio + it.r) {
                    if (it.tipo === 'gota') {
                        this.pontos++;
                        ajustarPontos(this.pontos);
                        falar(it.cor.nome);
                        tocarNota(NOTAS[this.pontos % NOTAS.length], 0.2);
                        criarConfetes(it.x, it.y, 6);
                    } else {
                        this.vidas--;
                        erro();
                        falar('Cuidado com a abelha!');
                        this.joaninha.vy = -2;
                        if (this.vidas <= 0) this.terminar();
                    }
                    this.itens.splice(i, 1);
                } else if (it.x < -50) this.itens.splice(i, 1);
            }

            for (const n of this.nuvens) { n.x -= 0.3; if (n.x < -80) n.x = W + 80; }

            if (this.pontos >= 8 && !this.terminado) this.terminar(true);
        },
        terminar(venceu) {
            this.terminado = true;
            if (venceu) {
                sucesso();
                falar('Parabéns! Você ajudou a joaninha!');
                mostrarMensagem('🌸 Parabéns!', 2500);
            } else {
                falar('Fim de jogo! Tente de novo!');
                mostrarMensagem('🐞 Tente de novo!', 2500);
            }
        },
        draw() {
            ctx.fillStyle = '#e0f7fa';
            ctx.fillRect(0, 0, W, H);
            for (const n of this.nuvens) {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.s, 0, Math.PI * 2);
                ctx.arc(n.x + n.s * 0.8, n.y - n.s * 0.3, n.s * 0.7, 0, Math.PI * 2);
                ctx.arc(n.x - n.s * 0.8, n.y - n.s * 0.3, n.s * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#81c784';
            ctx.fillRect(0, H - 20, W, 20);
            let idx = 0;
            for (let x = 80; x < W - 40; x += 120) {
                desenhaFlor(x, H - 35, 18 + (idx % 3) * 5, CORES[idx % CORES.length].hex);
                idx++;
            }
            for (const it of this.itens) {
                if (it.tipo === 'gota') {
                    ctx.fillStyle = it.cor.hex;
                    ctx.beginPath();
                    ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.font = '28px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🐝', it.x, it.y);
                }
            }
            desenhaJoaninha(this.joaninha.x, this.joaninha.y, this.joaninha.raio, Math.sin(this.joaninha.asa) * 0.3);

            // vidas
            ctx.font = '22px serif';
            ctx.textAlign = 'left';
            ctx.fillText('💖'.repeat(this.vidas), 10, 30);
        }
    };

    // =====================================================
    // JOGO 2: PINTADINHA
    // =====================================================
    let pinta = {
        spots: [],
        raio: 70,
        selecionada: 0,
        terminado: false,
        init() {
            this.terminado = false;
            this.spots = [];
            this.floresChao = [];
            for (let i = 0; i < 5; i++) this.floresChao.push({ x: Math.random() * W, y: H - 40, t: 20, cor: CORES[i % CORES.length].hex });
            const ang = Math.PI * 2 / 7;
            for (let i = 0; i < 7; i++) {
                const a = i * ang + 0.2;
                this.spots.push({
                    x: W / 2 + Math.cos(a) * this.raio * 0.6,
                    y: H / 2 - 60 + Math.sin(a) * this.raio * 0.6,
                    cor: null,
                    r: 16
                });
            }
            this.selecionada = 0;
            ajustarPontos(0);
            falar('Pinte as bolinhas da joaninha! Escolha uma cor e toque!');
        },
        toque(x, y) {
            const palY = H - 90;
            const palW = 50;
            for (let i = 0; i < CORES.length; i++) {
                const px = (W - CORES.length * palW) / 2 + i * palW + palW / 2;
                const py = palY;
                if (Math.hypot(x - px, y - py) < 20) {
                    this.selecionada = i;
                    tocarNota(NOTAS[i], 0.2);
                    return;
                }
            }
            for (const s of this.spots) {
                if (Math.hypot(x - s.x, y - s.y) < s.r * 1.8) {
                    if (s.cor === this.selecionada) return;
                    s.cor = this.selecionada;
                    tocarNota(NOTAS[this.selecionada], 0.25);
                    falar(CORES[this.selecionada].nome);
                    criarConfetes(s.x, s.y, 5);
                    this.verificarFim();
                    return;
                }
            }
        },
        tecla(e) {},
        verificarFim() {
            if (this.spots.every(s => s.cor !== null)) {
                this.terminado = true;
                ajustarPontos(7);
                sucesso();
                falar('Uau! A joaninha ficou linda!');
                mostrarMensagem('🎨 Linda!', 2500);
            } else {
                ajustarPontos(this.spots.filter(s => s.cor !== null).length);
            }
        },
        update(dt) {},
        draw() {
            ctx.fillStyle = '#fff5f5';
            ctx.fillRect(0, 0, W, H);
            for (const f of this.floresChao) desenhaFlor(f.x, f.y, f.t, f.cor);

            // joaninha base
            ctx.save();
            ctx.translate(W / 2, H / 2 - 60);
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.arc(0, 0, this.raio, 0, Math.PI * 2);
            ctx.fill();
            // linha divisoria
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-this.raio * 0.6, -this.raio * 0.4);
            ctx.quadraticCurveTo(0, -this.raio * 0.2, this.raio * 0.6, -this.raio * 0.4);
            ctx.stroke();
            ctx.restore();

            for (const s of this.spots) {
                ctx.fillStyle = s.cor !== null ? CORES[s.cor].hex : '#222';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                if (s.cor === null) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }

            // cabeca
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(W / 2, H / 2 - 60 - this.raio * 0.85, this.raio * 0.45, 0, Math.PI * 2);
            ctx.fill();

            // paleta
            const palY = H - 90;
            const palW = 50;
            for (let i = 0; i < CORES.length; i++) {
                const px = (W - CORES.length * palW) / 2 + i * palW + palW / 2;
                ctx.fillStyle = CORES[i].hex;
                ctx.beginPath();
                ctx.arc(px, palY, this.selecionada === i ? 24 : 18, 0, Math.PI * 2);
                ctx.fill();
                if (this.selecionada === i) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }
            ctx.fillStyle = '#444';
            ctx.font = 'bold 18px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('Escolha uma cor e toque na bolinha', W / 2, H - 35);
        }
    };

    // =====================================================
    // JOGO 3: LABIRINTO
    // =====================================================
    let labirinto = {
        caminho: [],
        joaninhaPos: 0,
        arrastando: false,
        raio: 18,
        terminado: false,
        gerou: false,
        flor: { x: 0, y: 0 },
        init() {
            this.terminado = false;
            this.arrastando = false;
            this.gerou = false;
            this.gerarCaminho();
            ajustarPontos(0);
            falar('Leve a joaninha até a flor! Arraste pelo caminho verde!');
        },
        gerarCaminho() {
            const margem = 80;
            const passo = 70;
            this.caminho = [];
            let cx = margem;
            let cy = H - margem;
            const fases = [
                { dx: passo, dy: 0 }, { dx: 0, dy: -passo },
                { dx: passo, dy: 0 }, { dx: 0, dy: -passo },
                { dx: passo, dy: 0 }, { dx: 0, dy: -passo },
                { dx: -passo, dy: 0 }, { dx: 0, dy: -passo },
                { dx: -passo, dy: 0 }, { dx: 0, dy: -passo }
            ];
            this.caminho.push({ x: cx, y: cy });
            for (const f of fases) {
                cx += f.dx;
                cy += f.dy;
                if (cx < margem) cx = margem;
                if (cx > W - margem) cx = W - margem;
                if (cy < margem) cy = margem;
                this.caminho.push({ x: cx, y: cy });
            }
            this.caminho.push({ x: this.caminho[this.caminho.length - 1].x, y: this.caminho[this.caminho.length - 1].y });
            this.joaninhaPos = { x: this.caminho[0].x, y: this.caminho[0].y };
            this.flor = { x: this.caminho[this.caminho.length - 1].x, y: this.caminho[this.caminho.length - 1].y };
        },
        toque(x, y) {
            if (this.terminado) return;
            this.arrastando = true;
            this.mover(x, y);
        },
        mover(x, y) {
            if (!this.arrastando || this.terminado) return;
            let noCaminho = false;
            for (let i = 0; i < this.caminho.length - 1; i++) {
                const a = this.caminho[i];
                const b = this.caminho[i + 1];
                const proj = projetaPontoSegmento(x, y, a, b);
                const dist = Math.hypot(x - proj.x, y - proj.y);
                if (dist < 45) noCaminho = true;
            }
            if (noCaminho) {
                this.joaninhaPos.x = x;
                this.joaninhaPos.y = y;
            } else {
                this.joaninhaPos.x = this.caminho[0].x;
                this.joaninhaPos.y = this.caminho[0].y;
                falar('Ops, fora do caminho!');
            }
            const distFlor = Math.hypot(this.joaninhaPos.x - this.flor.x, this.joaninhaPos.y - this.flor.y);
            if (distFlor < 40) this.terminar();
        },
        toqueFim() { this.arrastando = false; },
        tecla(e) {},
        terminar() {
            this.terminado = true;
            ajustarPontos(1);
            sucesso();
            falar('Chegou na flor!');
            mostrarMensagem('🌸 Chegou!', 2500);
        },
        update(dt) {},
        draw() {
            if (!this.gerou) { this.gerarCaminho(); this.gerou = true; }
            ctx.fillStyle = '#e8f5e9';
            ctx.fillRect(0, 0, W, H);
            // grama
            for (let i = 0; i < W; i += 20) {
                ctx.strokeStyle = '#a5d6a7';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(i + 5, H);
                ctx.lineTo(i, H - 15);
                ctx.stroke();
            }
            // trilha
            ctx.strokeStyle = '#66bb6a';
            ctx.lineWidth = 60;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            for (const p of this.caminho) ctx.lineTo(p.x, p.y);
            ctx.stroke();
            // borda trilha
            ctx.strokeStyle = '#43a047';
            ctx.lineWidth = 6;
            ctx.stroke();

            desenhaFlor(this.flor.x, this.flor.y, 40, '#ff6b9d');
            desenhaJoaninha(this.joaninhaPos.x, this.joaninhaPos.y, this.raio, 0);

            ctx.fillStyle = '#444';
            ctx.font = 'bold 18px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('Arraste a joaninha pelo caminho verde', W / 2, 40);
        }
    };

    function projetaPontoSegmento(px, py, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len2 = dx * dx + dy * dy;
        if (len2 === 0) return a;
        let t = ((px - a.x) * dx + (py - a.y) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        return { x: a.x + t * dx, y: a.y + t * dy };
    }

    // =====================================================
    // JOGO 4: RITMO DAS FLORES
    // =====================================================
    let ritmo = {
        flores: [],
        desafio: null,
        pontos: 0,
        terminado: false,
        gerou: false,
        init() {
            this.terminado = false;
            this.pontos = 0;
            this.gerou = false;
            ajustarPontos(0);
            falar('Ritmo das flores! Toque nas flores coloridas!');
        },
        gerarFlores() {
            this.flores = [];
            const raio = Math.min(W, H) * 0.28;
            const cx = W / 2;
            const cy = H / 2 - 20;
            for (let i = 0; i < 5; i++) {
                const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
                this.flores.push({
                    x: cx + Math.cos(ang) * raio,
                    y: cy + Math.sin(ang) * raio,
                    cor: CORES[i],
                    nota: NOTAS[i],
                    r: 36
                });
            }
        },
        novoDesafio() {
            const f = this.flores[Math.floor(Math.random() * this.flores.length)];
            this.desafio = f;
            falar('Toque na flor ' + f.cor.nome + '!');
        },
        toque(x, y) {
            if (this.terminado) return;
            for (const f of this.flores) {
                const d = Math.hypot(x - f.x, y - f.y);
                if (d < f.r) {
                    tocarNota(f.nota, 0.4);
                    criarConfetes(f.x, f.y, 5);
                    if (this.desafio === f) {
                        this.pontos++;
                        ajustarPontos(this.pontos);
                        falar(f.cor.nome + '! Muito bem!');
                        if (this.pontos >= 5) this.terminar();
                        else this.novoDesafio();
                    } else {
                        falar(f.cor.nome);
                    }
                    return;
                }
            }
        },
        tecla(e) {},
        terminar() {
            this.terminado = true;
            sucesso();
            falar('Você tocou todas! Linda música!');
            mostrarMensagem('🎵 Que música!', 2500);
        },
        update(dt) {},
        draw() {
            if (!this.gerou) { this.gerarFlores(); this.gerou = true; this.novoDesafio(); }
            ctx.fillStyle = '#f3e5f5';
            ctx.fillRect(0, 0, W, H);
            // sol
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(W - 60, 60, 40, 0, Math.PI * 2);
            ctx.fill();
            for (const f of this.flores) {
                desenhaFlor(f.x, f.y, f.r, f.cor.hex);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Comic Sans MS';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(f.cor.nome, f.x, f.y + 8);
            }
            if (this.desafio) {
                ctx.fillStyle = '#444';
                ctx.font = 'bold 20px Comic Sans MS';
                ctx.textAlign = 'center';
                ctx.fillText('Toque na flor ' + this.desafio.cor.nome + '!', W / 2, H - 40);
            }
        }
    };

    // =====================================================
    // JOGO 5: ONDE ESTOU?
    // =====================================================
    let esconde = {
        lugares: [],
        correto: 0,
        pontos: 0,
        rodadas: 0,
        terminado: false,
        gerou: false,
        frase: '',
        init() {
            this.terminado = false;
            this.pontos = 0;
            this.rodadas = 0;
            this.gerou = false;
            this.floresChao = [];
            for (let i = 0; i < 10; i++) this.floresChao.push({ x: Math.random() * W, y: H - 35, t: 14, cor: CORES[i % 7].hex });
            ajustarPontos(0);
            falar('Onde está a joaninha? Escute e toque no lugar certo!');
        },
        gerarLugares() {
            this.lugares = [
                { x: W * 0.2, y: H * 0.4, r: 50, emoji: '🍃', nome: 'folha', prep: 'debaixo da folha' },
                { x: W * 0.5, y: H * 0.6, r: 45, emoji: '🪨', nome: 'pedra', prep: 'atrás da pedra' },
                { x: W * 0.8, y: H * 0.35, r: 55, emoji: '🌼', nome: 'flor', prep: 'dentro da flor' },
                { x: W * 0.3, y: H * 0.75, r: 50, emoji: '🍄', nome: 'cogumelo', prep: 'ao lado do cogumelo' }
            ];
            this.novaRodada();
        },
        novaRodada() {
            if (this.rodadas >= 4) { this.terminar(); return; }
            this.correto = Math.floor(Math.random() * this.lugares.length);
            this.frase = 'A joaninha está ' + this.lugares[this.correto].prep + '.';
            this.rodadas++;
            setTimeout(() => falar(this.frase), 500);
        },
        toque(x, y) {
            if (this.terminado) return;
            for (let i = 0; i < this.lugares.length; i++) {
                const l = this.lugares[i];
                if (Math.hypot(x - l.x, y - l.y) < l.r) {
                    if (i === this.correto) {
                        this.pontos++;
                        ajustarPontos(this.pontos);
                        sucesso();
                        falar('Achou! A joaninha estava ' + l.prep + '.');
                        criarConfetes(l.x, l.y, 12);
                        setTimeout(() => this.novaRodada(), 1500);
                    } else {
                        erro();
                        falar('Tente outro lugar!');
                    }
                    return;
                }
            }
        },
        tecla(e) {},
        terminar() {
            this.terminado = true;
            sucesso();
            falar('Você achou a joaninha todas as vezes!');
            mostrarMensagem('🐞 Você achou!', 2500);
        },
        update(dt) {},
        draw() {
            if (!this.gerou) { this.gerarLugares(); this.gerou = true; }
            ctx.fillStyle = '#dcedc8';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#81c784';
            ctx.fillRect(0, H - 25, W, 25);
            for (const f of this.floresChao) desenhaFlor(f.x, f.y, f.t, f.cor);

            for (let i = 0; i < this.lugares.length; i++) {
                const l = this.lugares[i];
                ctx.font = l.r * 1.6 + 'px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(l.emoji, l.x, l.y);
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(l.x, l.y + l.r * 0.4, l.r * 0.8, l.r * 0.2, 0, 0, Math.PI * 2);
                ctx.stroke();
                if (i === this.correto) {
                    // joaninha escondida levemente visivel (rabinho)
                    ctx.save();
                    ctx.translate(l.x + l.r * 0.4, l.y + l.r * 0.2);
                    ctx.fillStyle = '#111';
                    ctx.beginPath();
                    ctx.arc(0, 0, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            ctx.fillStyle = '#444';
            ctx.font = 'bold 18px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText(this.frase || 'Onde está a joaninha?', W / 2, 50);
        }
    };

    const modos = { voa, pinta, labirinto, ritmo, esconde };
    const nomes = { voa: 'Voa no Jardim', pinta: 'Pintadinha', labirinto: 'Labirinto', ritmo: 'Ritmo', esconde: 'Onde Estou?' };

    function iniciarModo(nome) {
        if (emTransicao) return;
        emTransicao = true;
        if (animId) cancelAnimationFrame(animId);
        modo = modos[nome];
        tituloJogo.textContent = nomes[nome];
        confetes = [];
        menuPrincipal.parentElement.style.display = 'none';
        areaJogo.classList.add('ativo');
        areaJogo.offsetHeight;
        redimensionar();
        setTimeout(() => {
            redimensionar();
            if (modo && modo.init) modo.init();
            ultimoT = performance.now();
            emTransicao = false;
            animId = requestAnimationFrame(loop);
        }, 80);
    }

    function voltarMenu() {
        emTransicao = true;
        if (animId) cancelAnimationFrame(animId);
        areaJogo.classList.remove('ativo');
        menuPrincipal.parentElement.style.display = 'block';
        modo = null;
        emTransicao = false;
    }

    function loop(now) {
        if (!modo) return;
        if (W <= 0 || H <= 0) {
            redimensionar();
            animId = requestAnimationFrame(loop);
            return;
        }
        const dt = now - ultimoT;
        ultimoT = now;
        ctx.clearRect(0, 0, W, H);
        if (modo.update) modo.update(dt);
        if (modo.draw) modo.draw();
        atualizarConfetes();
        animId = requestAnimationFrame(loop);
    }

    document.querySelectorAll('.card-jogo').forEach(c => {
        c.addEventListener('click', () => iniciarModo(c.dataset.jogo));
    });

    document.getElementById('btnVoltar').addEventListener('click', voltarMenu);

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    canvas.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (!modo || !modo.toque) return;
        const p = getPos(e);
        modo.toque(p.x, p.y);
        if (modo.toqueInicio) modo.toqueInicio(p.x, p.y);
    });

    canvas.addEventListener('pointermove', e => {
        e.preventDefault();
        if (!modo || !modo.mover) return;
        const p = getPos(e);
        modo.mover(p.x, p.y);
    });

    canvas.addEventListener('pointerup', e => {
        e.preventDefault();
        if (!modo || !modo.toqueFim) return;
        modo.toqueFim();
    });

    window.addEventListener('keydown', e => {
        if (modo && modo.tecla) modo.tecla(e);
    });

    window.addEventListener('resize', () => {
        if (modo) redimensionar();
    });
})();

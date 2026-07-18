const CHAVE_ESTRELAS = 'mundodayoyo_estrelas';

function carregarEstrelas() {
    try {
        const salvo = localStorage.getItem(CHAVE_ESTRELAS);
        return salvo ? parseInt(salvo, 10) : 0;
    } catch (e) {
        return 0;
    }
}

function salvarEstrelas(quantidade) {
    try {
        localStorage.setItem(CHAVE_ESTRELAS, quantidade.toString());
    } catch (e) {
        // Ignora erros de armazenamento
    }
}

let estrelasAtuais = carregarEstrelas();

function obterEstrelas() {
    return estrelasAtuais;
}

function adicionarEstrelas(quantidade = 1) {
    estrelasAtuais += quantidade;
    salvarEstrelas(estrelasAtuais);
    atualizarContador();
    animarEstrela(quantidade);
    if (typeof YoyoAchievements !== 'undefined') YoyoAchievements.trackStars(estrelasAtuais);
}

function criarContador() {
    let contador = document.getElementById('star-counter');
    if (!contador) {
        contador = document.createElement('div');
        contador.id = 'star-counter';
        contador.className = 'star-counter';
        contador.title = 'Estrelas da Yoyo';

        const header = document.querySelector('header');
        if (header) {
            header.appendChild(contador);
        } else {
            document.body.insertBefore(contador, document.body.firstChild);
        }
    }
    return contador;
}

function atualizarContador() {
    const contador = criarContador();
    contador.textContent = `⭐ ${estrelasAtuais}`;
}

function animarEstrela(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        setTimeout(() => {
            const estrela = document.createElement('div');
            estrela.className = 'star-float';
            estrela.textContent = '⭐';
            estrela.style.left = `${50 + (Math.random() * 20 - 10)}%`;
            estrela.style.bottom = '100px';
            document.body.appendChild(estrela);

            setTimeout(() => {
                estrela.remove();
            }, 1500);
        }, i * 300);
    }
}

function inicializarEstrelas() {
    atualizarContador();
}

inicializarEstrelas();

(function () {
    'use strict';

    /*
     * O overlay de bloqueio de fullscreen e o auto-fullscreen foram desativados
     * porque estavam aparecendo a todo momento e atrapalhando a crianca.
     * As estrelas e o contador continuam funcionando normalmente.
     */

    // Remove qualquer overlay antigo que possa ter ficado no cache
    document.addEventListener('DOMContentLoaded', function () {
        var antigos = document.querySelectorAll('#lockdown-overlay, .lockdown-overlay');
        antigos.forEach(function (el) { el.remove(); });
    });

    function entrarFullscreen() {
        const el = document.documentElement;
        if (el.requestFullscreen) return el.requestFullscreen();
        if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        if (el.msRequestFullscreen) return el.msRequestFullscreen();
        return Promise.resolve();
    }

    document.addEventListener('keydown', function (e) {
        var k = e.key;
        var ctrl = e.ctrlKey || e.metaKey;
        var alt = e.altKey;

        if (k === 'F11') { e.preventDefault(); return false; }
        if (k === 'Escape') { e.preventDefault(); return false; }
        if (k === 'F5') { e.preventDefault(); return false; }
        if (ctrl && k === 'r') { e.preventDefault(); return false; }
        if (ctrl && k === 't') { e.preventDefault(); return false; }
        if (ctrl && k === 'n') { e.preventDefault(); return false; }
        if (ctrl && k === 'w') { e.preventDefault(); return false; }
        if (ctrl && k === 'j') { e.preventDefault(); return false; }
        if (ctrl && (k === '1' || k === '2' || k === '3' || k === '4' || k === '5' || k === '6' || k === '7' || k === '8' || k === '9')) { e.preventDefault(); return false; }
        if (ctrl && e.shiftKey && k === 'T') { e.preventDefault(); return false; }
        if (ctrl && e.shiftKey && k === 'N') { e.preventDefault(); return false; }
        if (ctrl && e.shiftKey && k === 'I') { e.preventDefault(); return false; }
        if (ctrl && e.shiftKey && k === 'J') { e.preventDefault(); return false; }
        if (ctrl && e.shiftKey && k === 'C') { e.preventDefault(); return false; }
        if (alt && k === 'Home') { e.preventDefault(); return false; }
        if (alt && k === 'ArrowLeft') { e.preventDefault(); return false; }
        if (alt && k === 'ArrowRight') { e.preventDefault(); return false; }
        if (alt && k === 'd') { e.preventDefault(); return false; }
        if (k === 'F1') { e.preventDefault(); return false; }
        if (k === 'F2') { e.preventDefault(); return false; }
        if (k === 'F3') { e.preventDefault(); return false; }
        if (k === 'F4') { e.preventDefault(); return false; }
        if (k === 'F6') { e.preventDefault(); return false; }
        if (k === 'F7') { e.preventDefault(); return false; }
        if (k === 'F8') { e.preventDefault(); return false; }
        if (k === 'F9') { e.preventDefault(); return false; }
        if (k === 'F10') { e.preventDefault(); return false; }
        if (k === 'F12') { e.preventDefault(); return false; }
    });

    document.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); return false; });
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault(); return false;
        }
    });
})();

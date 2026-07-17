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

    let overlayLock = null;

    function criarOverlayLock() {
        if (overlayLock) return overlayLock;
        overlayLock = document.createElement('div');
        overlayLock.id = 'lockdown-overlay';
        overlayLock.style.cssText = [
            'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
            'background:rgba(123,31,162,0.95)', 'z-index:99999',
            'display:flex', 'flex-direction:column',
            'align-items:center', 'justify-content:center',
            'cursor:pointer', 'text-align:center', 'gap:1rem',
            'font-family:sans-serif'
        ].join(';');
        overlayLock.innerHTML =
            '<div style="font-size:5rem">🎮</div>' +
            '<div style="font-size:2.5rem;color:#fff;font-weight:bold">Clique aqui para voltar a jogar!</div>' +
            '<div style="font-size:1.5rem;color:#e1bee7">👆 Toque na tela</div>';
        overlayLock.addEventListener('click', function () {
            entrarFullscreen();
            overlayLock.style.display = 'none';
        });
        document.body.appendChild(overlayLock);
        return overlayLock;
    }

    function mostrarOverlayLock() {
        const ov = criarOverlayLock();
        ov.style.display = 'flex';
    }

    function entrarFullscreen() {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }

    function sairFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            return false;
        }
        return true;
    }

    document.addEventListener('fullscreenchange', function () {
        if (sairFullscreen()) mostrarOverlayLock();
    });
    document.addEventListener('webkitfullscreenchange', function () {
        if (sairFullscreen()) mostrarOverlayLock();
    });

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

    var autoFsDone = false;
    function autoFullscreen() {
        if (autoFsDone) return;
        autoFsDone = true;
        entrarFullscreen();
    }
    document.addEventListener('click', autoFullscreen);
    document.addEventListener('touchstart', autoFullscreen);
    document.addEventListener('keydown', autoFullscreen);
    window.addEventListener('load', function () {
        setTimeout(function () {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                mostrarOverlayLock();
            }
        }, 1000);
    });
})();

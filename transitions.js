/* ====== PAGE TRANSITIONS — Smooth fade/slide between pages ====== */
(function () {
    'use strict';

    var overlay = null;
    var isTransitioning = false;

    function createOverlay() {
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'page-transition';
        overlay.style.cssText = [
            'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
            'background:linear-gradient(135deg,#6c5ce7,#a29bfe)',
            'z-index:99998', 'display:flex', 'align-items:center',
            'justify-content:center', 'opacity:0', 'pointer-events:none',
            'transition:opacity 0.35s ease'
        ].join(';');

        var inner = document.createElement('div');
        inner.style.cssText = 'text-align:center';
        inner.innerHTML =
            '<div style="font-size:3rem;animation:transBounce 0.6s ease-in-out infinite">🦄</div>' +
            '<div style="color:#fff;font-size:1.5rem;font-family:sans-serif;margin-top:10px;font-weight:bold">Carregando...</div>';
        overlay.appendChild(inner);
        document.body.appendChild(overlay);
        return overlay;
    }

    function navigateTo(url) {
        if (isTransitioning) return;
        isTransitioning = true;
        var ov = createOverlay();
        ov.style.opacity = '1';
        ov.style.pointerEvents = 'auto';

        setTimeout(function () {
            window.location.href = url;
        }, 400);
    }

    function fadeInPage() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.style.opacity = '1';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            createOverlay();
            fadeInPage();
            interceptLinks();
        });
    } else {
        createOverlay();
        fadeInPage();
        interceptLinks();
    }

    function interceptLinks() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a');
            if (!link) return;

            var href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('http') || link.target === '_blank') return;

            if (link.dataset.noTransition) return;

            e.preventDefault();
            navigateTo(href);
        });
    }

    var style = document.createElement('style');
    style.textContent = '@keyframes transBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.1)}}';
    document.head.appendChild(style);
})();

/* ====== PAGE TRANSITIONS — Smooth fade between pages ====== */
(function () {
    'use strict';

    function fadeOutAndNavigate(url) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        setTimeout(function () {
            window.location.href = url;
        }, 200);
    }

    function fadeInPage() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.style.opacity = '1';
            });
        });
    }

    function interceptLinks() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a');
            if (!link) return;

            var href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('http') || link.target === '_blank') return;

            if (link.dataset.noTransition) return;

            e.preventDefault();
            fadeOutAndNavigate(href);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            fadeInPage();
            interceptLinks();
        });
    } else {
        fadeInPage();
        interceptLinks();
    }
})();

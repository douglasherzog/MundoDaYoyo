/* ====== YOYO MASCOT — Animated unicorn companion for all games ====== */
(function () {
    'use strict';

    let mascotEl = null;
    let bubbleEl = null;
    let svgEl = null;
    let currentMood = 'idle';
    let bubbleTimeout = null;
    let idleTimeout = null;
    let streakCount = 0;
    let errorStreakCount = 0;
    let lastInteraction = Date.now();

    const PHRASES = {
        success: [
            'Muito bem, Yoyo!',
            'Você é incrível!',
            'Isso! Você conseguiu!',
            'Que inteligente!',
            'Woooow! Arrasou!',
            'Cada vez melhor!'
        ],
        error: [
            'Quase! Tenta de novo!',
            'Não desanima, dá pra fazer!',
            'Hmm, será que outra opção?',
            'Você consegue, tenta mais uma vez!'
        ],
        streak3: [
            'Três seguidos! Você é uma campeã!',
            'Wow, três acertos! Que prodígio!'
        ],
        streak5: [
            'Cinco seguidos! Você é uma lenda!',
            'Imparável! Cinco acertos!'
        ],
        errorStreak2: [
            'Tudo bem! Respire e tente de novo.',
            'Vamos com calma, você consegue!'
        ],
        idle: [
            'Estou aqui pra te ajudar!',
            'Que tal jogar mais um pouquinho?',
            'Tô te esperando! ✨',
            'Bora brincar?'
        ],
        welcome: [
            'Bora brincar!',
            'Vamos nessa!'
        ]
    };

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    const MASCOT_SVG = '<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
            '<linearGradient id="yoyoBody" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#f0f0f5"/>' +
            '</linearGradient>' +
            '<linearGradient id="yoyoMane" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#ff9a9e"/><stop offset="50%" stop-color="#fad0c4"/><stop offset="100%" stop-color="#a18cd1"/>' +
            '</linearGradient>' +
            '<radialGradient id="yoyoCheek">' +
                '<stop offset="0%" stop-color="#ff8a80" stop-opacity="0.6"/><stop offset="100%" stop-color="#ff8a80" stop-opacity="0"/>' +
            '</radialGradient>' +
        '</defs>' +
        // Tail
        '<path class="yoyo-tail" d="M15 95 Q5 80 10 65 Q15 55 25 60" fill="none" stroke="url(#yoyoMane)" stroke-width="7" stroke-linecap="round"/>' +
        // Body
        '<ellipse class="yoyo-body" cx="55" cy="95" rx="28" ry="22" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1.5"/>' +
        // Legs
        '<rect x="38" y="108" width="7" height="14" rx="3" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        '<rect x="50" y="110" width="7" height="12" rx="3" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        '<rect x="62" y="108" width="7" height="14" rx="3" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        '<rect x="74" y="110" width="7" height="12" rx="3" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        // Neck + Head
        '<ellipse cx="80" cy="62" rx="18" ry="20" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1.5"/>' +
        // Ears
        '<path class="yoyo-ear-l" d="M68 48 L64 35 L74 45 Z" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        '<path class="yoyo-ear-r" d="M92 48 L96 35 L86 45 Z" fill="url(#yoyoBody)" stroke="#e8e8f0" stroke-width="1"/>' +
        // Horn
        '<path class="yoyo-horn" d="M80 30 L76 48 L84 48 Z" fill="#ffd700" stroke="#f57f17" stroke-width="1"/>' +
        '<path d="M78 36 L82 36 M77 40 L83 40 M78 44 L82 44" stroke="#f57f17" stroke-width="0.8" opacity="0.5"/>' +
        // Mane
        '<path class="yoyo-mane" d="M62 55 Q55 45 60 38 Q68 40 70 50 Q60 35 68 30 Q75 38 74 48 Q68 38 75 35 Q80 42 78 52 Z" fill="url(#yoyoMane)"/>' +
        '<path d="M60 70 Q52 65 55 58 Q62 60 63 68 Z" fill="url(#yoyoMane)"/>' +
        // Cheeks
        '<circle cx="71" cy="66" r="6" fill="url(#yoyoCheek)"/>' +
        '<circle cx="89" cy="66" r="6" fill="url(#yoyoCheek)"/>' +
        // Eyes
        '<g class="yoyo-eyes">' +
            '<ellipse class="yoyo-eye-l" cx="74" cy="60" rx="4" ry="5" fill="#333"/>' +
            '<ellipse class="yoyo-eye-r" cx="86" cy="60" rx="4" ry="5" fill="#333"/>' +
            '<circle cx="75" cy="58" r="1.5" fill="#fff"/>' +
            '<circle cx="87" cy="58" r="1.5" fill="#fff"/>' +
        '</g>' +
        // Happy eyes (hidden by default)
        '<g class="yoyo-eyes-happy" style="display:none">' +
            '<path d="M70 62 Q74 56 78 62" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
            '<path d="M82 62 Q86 56 90 62" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        // Sad eyes (hidden by default)
        '<g class="yoyo-eyes-sad" style="display:none">' +
            '<ellipse cx="74" cy="62" rx="4" ry="4" fill="#333"/>' +
            '<ellipse cx="86" cy="62" rx="4" ry="4" fill="#333"/>' +
            '<path d="M70 56 L78 58" stroke="#333" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M82 58 L90 56" stroke="#333" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M72 66 Q72 70 74 71 Q76 70 76 66" fill="#42a5f5" opacity="0.7"/>' +
        '</g>' +
        // Mouth
        '<path class="yoyo-mouth" d="M76 70 Q80 73 84 70" stroke="#e91e63" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path class="yoyo-mouth-happy" d="M74 69 Q80 76 86 69" stroke="#e91e63" stroke-width="2.5" fill="#e91e63" stroke-linecap="round" style="display:none"/>' +
        '<path class="yoyo-mouth-sad" d="M75 73 Q80 68 85 73" stroke="#e91e63" stroke-width="2.5" fill="none" stroke-linecap="round" style="display:none"/>' +
        // Sparkles
        '<g class="yoyo-sparkles" opacity="0">' +
            '<text x="95" y="35" font-size="10">✨</text>' +
            '<text x="20" y="50" font-size="8">⭐</text>' +
            '<text x="100" y="80" font-size="8">💫</text>' +
        '</g>' +
    '</svg>';

    function createMascot() {
        if (mascotEl) return mascotEl;

        mascotEl = document.createElement('div');
        mascotEl.id = 'yoyo-mascot';
        mascotEl.className = 'yoyo-mascot yoyo-idle';
        mascotEl.innerHTML = MASCOT_SVG;

        bubbleEl = document.createElement('div');
        bubbleEl.id = 'yoyo-bubble';
        bubbleEl.className = 'yoyo-bubble';

        var wrapper = document.createElement('div');
        wrapper.id = 'yoyo-mascot-wrapper';
        wrapper.appendChild(mascotEl);
        wrapper.appendChild(bubbleEl);
        document.body.appendChild(wrapper);

        svgEl = mascotEl.querySelector('svg');

        mascotEl.addEventListener('click', function () {
            YoyoMascot.say(pick(PHRASES.welcome));
            YoyoMascot.setMood('happy');
            setTimeout(function () { YoyoMascot.setMood('idle'); }, 2000);
        });

        startIdleCheck();
        return mascotEl;
    }

    function startIdleCheck() {
        if (idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(function () {
            if (Date.now() - lastInteraction > 15000 && currentMood === 'idle') {
                YoyoMascot.say(pick(PHRASES.idle));
            }
            startIdleCheck();
        }, 20000);
    }

    function setMood(mood) {
        currentMood = mood;
        mascotEl.className = 'yoyo-mascot yoyo-' + mood;
        lastInteraction = Date.now();

        var eyes = svgEl.querySelector('.yoyo-eyes');
        var eyesHappy = svgEl.querySelector('.yoyo-eyes-happy');
        var eyesSad = svgEl.querySelector('.yoyo-eyes-sad');
        var mouth = svgEl.querySelector('.yoyo-mouth');
        var mouthHappy = svgEl.querySelector('.yoyo-mouth-happy');
        var mouthSad = svgEl.querySelector('.yoyo-mouth-sad');
        var sparkles = svgEl.querySelector('.yoyo-sparkles');

        [eyes, eyesHappy, eyesSad].forEach(function (e) { if (e) e.style.display = 'none'; });
        [mouth, mouthHappy, mouthSad].forEach(function (m) { if (m) m.style.display = 'none'; });
        if (sparkles) sparkles.setAttribute('opacity', '0');

        if (mood === 'happy') {
            if (eyesHappy) eyesHappy.style.display = '';
            if (mouthHappy) mouthHappy.style.display = '';
            if (sparkles) sparkles.setAttribute('opacity', '1');
        } else if (mood === 'sad') {
            if (eyesSad) eyesSad.style.display = '';
            if (mouthSad) mouthSad.style.display = '';
        } else {
            if (eyes) eyes.style.display = '';
            if (mouth) mouth.style.display = '';
        }

        if (mood !== 'idle') {
            setTimeout(function () {
                if (currentMood === mood) setMood('idle');
            }, mood === 'celebrate' ? 3000 : 2000);
        }
    }

    function say(text) {
        if (!bubbleEl) return;
        bubbleEl.textContent = text;
        bubbleEl.classList.add('yoyo-bubble-show');
        if (bubbleTimeout) clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(function () {
            bubbleEl.classList.remove('yoyo-bubble-show');
        }, 4000);
    }

    function onCorrect() {
        streakCount++;
        errorStreakCount = 0;
        lastInteraction = Date.now();

        if (streakCount >= 5) {
            setMood('celebrate');
            say(pick(PHRASES.streak5));
        } else if (streakCount >= 3) {
            setMood('happy');
            say(pick(PHRASES.streak3));
        } else {
            setMood('happy');
            say(pick(PHRASES.success));
        }
    }

    function onError() {
        errorStreakCount++;
        streakCount = 0;
        lastInteraction = Date.now();

        if (errorStreakCount >= 2) {
            setMood('sad');
            say(pick(PHRASES.errorStreak2));
        } else {
            setMood('sad');
            say(pick(PHRASES.error));
        }
    }

    function onVictory() {
        setMood('celebrate');
        say('Parabéns! Você é uma estrela! 🌟');
    }

    function hide() {
        var wrapper = document.getElementById('yoyo-mascot-wrapper');
        if (wrapper) wrapper.style.display = 'none';
    }

    function show() {
        var wrapper = document.getElementById('yoyo-mascot-wrapper');
        if (wrapper) wrapper.style.display = '';
    }

    // Auto-create on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMascot);
    } else {
        createMascot();
    }

    // Global API
    window.YoyoMascot = {
        onCorrect: onCorrect,
        onError: onError,
        onVictory: onVictory,
        say: say,
        setMood: setMood,
        hide: hide,
        show: show,
        resetStreak: function () { streakCount = 0; errorStreakCount = 0; }
    };
})();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

/* ===== RICHER SFX ===== */

function playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
        setTimeout(() => playTone(freq, 0.25, 'sine', 0.25), index * 120);
    });
    setTimeout(() => playTone(1318.51, 0.3, 'triangle', 0.15), 480);
    if (typeof adicionarEstrelas === 'function') {
        setTimeout(() => adicionarEstrelas(1), 400);
    }
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.onCorrect();
}

function playError() {
    playTone(200, 0.15, 'sawtooth', 0.12);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.15), 120);
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.onError();
}

function playClick() {
    playTone(800, 0.06, 'sine', 0.12);
}

function playPop() {
    playTone(600, 0.08, 'sine', 0.15);
    setTimeout(() => playTone(900, 0.06, 'sine', 0.1), 40);
}

function playHover() {
    playTone(1200, 0.04, 'sine', 0.06);
}

function playVictory() {
    const fanfare = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
    fanfare.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.2), i * 150);
    });
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.onVictory();
}

function playMagic() {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => playTone(800 + Math.random() * 1200, 0.1, 'sine', 0.08), i * 50);
    }
}

function playMusicNote(frequency, duration = 0.3) {
    playTone(frequency, duration, 'sine', 0.3);
}

/* ===== BACKGROUND MUSIC ENGINE ===== */
const BgMusic = {
    playing: false,
    muted: false,
    intervalId: null,
    melodyIndex: 0,

    melody: [
        261.63, 329.63, 392.00, 329.63,
        293.66, 349.23, 440.00, 349.23,
        329.63, 392.00, 523.25, 392.00,
        293.66, 349.23, 440.00, 349.23
    ],
    bass: [
        130.81, 130.81, 196.00, 196.00,
        146.83, 146.83, 220.00, 220.00,
        164.81, 164.81, 261.63, 261.63,
        146.83, 146.83, 220.00, 220.00
    ],

    start: function () {
        if (this.playing || this.muted) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        this.playing = true;
        this.melodyIndex = 0;
        var self = this;
        this.intervalId = setInterval(function () { self._tick(); }, 400);
    },

    stop: function () {
        this.playing = false;
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    },

    toggle: function () {
        this.muted = !this.muted;
        if (this.muted) this.stop();
        else this.start();
        return this.muted;
    },

    _tick: function () {
        if (this.muted) return;
        var i = this.melodyIndex % this.melody.length;
        playTone(this.melody[i], 0.35, 'triangle', 0.06);
        playTone(this.bass[i], 0.35, 'sine', 0.04);
        this.melodyIndex++;
    }
};

/* ===== MUSIC TOGGLE BUTTON ===== */
(function () {
    function createMusicBtn() {
        if (document.getElementById('yoyo-music-btn')) return;
        var btn = document.createElement('button');
        btn.id = 'yoyo-music-btn';
        btn.textContent = '🎵';
        btn.title = 'Ligar/desligar música';
        btn.onclick = function () {
            var muted = BgMusic.toggle();
            btn.textContent = muted ? '🔇' : '🎵';
            btn.classList.toggle('muted', muted);
            if (!muted) playClick();
        };
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMusicBtn);
    } else {
        createMusicBtn();
    }

    var started = false;
    function tryStart() {
        if (started) return;
        started = true;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        BgMusic.start();
    }
    document.addEventListener('click', tryStart);
    document.addEventListener('touchstart', tryStart);
    document.addEventListener('keydown', tryStart);
})();

/* ===== HOVER SOUND ON BUTTONS ===== */
(function () {
    function attachHover() {
        document.querySelectorAll('button, .menu-card, .opt-btn, a[href]').forEach(function (el) {
            if (el.dataset.yoyoHover) return;
            el.dataset.yoyoHover = '1';
            el.addEventListener('mouseenter', function () { if (!BgMusic.muted) playHover(); });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachHover);
    } else {
        attachHover();
    }
    setTimeout(attachHover, 1500);
})();

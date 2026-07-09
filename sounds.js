const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioCtx) return;

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

function playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
        setTimeout(() => playTone(freq, 0.25, 'sine', 0.25), index * 120);
    });

    if (typeof adicionarEstrelas === 'function') {
        setTimeout(() => adicionarEstrelas(1), 400);
    }
}

function playError() {
    playTone(150, 0.4, 'sawtooth', 0.2);
    setTimeout(() => playTone(120, 0.4, 'sawtooth', 0.2), 200);
}

function playClick() {
    playTone(800, 0.08, 'sine', 0.15);
}

function playPop() {
    playTone(600, 0.1, 'sine', 0.2);
}

function playMusicNote(frequency, duration = 0.3) {
    playTone(frequency, duration, 'sine', 0.3);
}

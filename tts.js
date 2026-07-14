function selecionarVozPTBR() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.toLowerCase() === 'pt-br') ||
           voices.find(v => v.lang.toLowerCase().startsWith('pt')) ||
           voices[0];
}

function falarWeb(texto) {
    if (!('speechSynthesis' in window)) return false;
    const sintese = window.speechSynthesis;
    sintese.cancel();
    sintese.resume();
    const msg = new SpeechSynthesisUtterance(texto);
    const voz = selecionarVozPTBR();
    if (voz) msg.voice = voz;
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    msg.pitch = 1.1;
    msg.onstart = () => sintese.resume();
    sintese.speak(msg);
    return true;
}

function usarServidorTtsLocal() {
    return location.protocol === 'http:' &&
        (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
}

function falar(texto) {
    const textoLimpo = String(texto || '').replace(/\s+/g, ' ').trim();
    if (!textoLimpo) return;

    if (!usarServidorTtsLocal()) {
        falarWeb(textoLimpo);
        return;
    }

    // Tenta o servidor TTS local primeiro (Linux)
    // Se nao estiver disponivel, usa Web Speech API (Windows/Android)
    const url = `http://127.0.0.1:8766/falar?texto=${encodeURIComponent(textoLimpo)}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('TTS server error');
            return response.blob();
        })
        .then(blob => {
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play().catch(err => {
                console.log('Erro ao tocar audio TTS:', err);
                // Tenta novamente com interacao simulada
                document.addEventListener('click', function once() {
                    audio.play();
                    document.removeEventListener('click', once);
                }, { once: true });
            });
        })
        .catch((err) => {
            console.log('TTS server nao respondeu, usando Web Speech:', err);
            falarWeb(textoLimpo);
        });
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', selecionarVozPTBR);
    window.addEventListener('pageshow', () => window.speechSynthesis.resume());
}

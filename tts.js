function selecionarVozPTBR() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.toLowerCase() === 'pt-br') ||
           voices.find(v => v.lang.toLowerCase().startsWith('pt')) ||
           voices[0];
}

function falarLocal(texto) {
    const url = `http://127.0.0.1:8766/falar?texto=${encodeURIComponent(texto)}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('TTS server error');
            return response.blob();
        })
        .then(blob => {
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play();
        })
        .catch(() => {
            // Silenciosamente ignora erro do servidor TTS
        });
}

function falar(texto) {
    if (!texto) return;

    // Tenta Web Speech API primeiro
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        const voz = selecionarVozPTBR();
        if (voz) msg.voice = voz;
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);

        // Se nao houver vozes instaladas, usa o servidor TTS local como fallback
        if (window.speechSynthesis.getVoices().length === 0) {
            falarLocal(texto);
        }
    } else {
        // Web Speech API nao disponivel, usa servidor TTS local
        falarLocal(texto);
    }
}

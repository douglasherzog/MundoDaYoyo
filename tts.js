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

    // Usa o servidor TTS local como padrao (mais confiavel no Linux)
    // e mantem a Web Speech API como fallback
    falarLocal(texto);

    // Tambem tenta a Web Speech API, caso haja vozes naturais instaladas
    if ('speechSynthesis' in window) {
        const vozes = window.speechSynthesis.getVoices();
        if (vozes.length > 0) {
            const voz = selecionarVozPTBR();
            if (voz && voz.lang.toLowerCase() !== 'pt-br') {
                // Se nao houver voz pt-br nativa, nao usa Web Speech API
                return;
            }
        }
    }
}

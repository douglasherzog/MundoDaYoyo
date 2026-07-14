const TTS_AUDIO_BASE_URL = new URL('audio/tts/', location.href);
let manifestoTtsPromise;
let audioTtsAtual;
let falaTtsAtual = 0;

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

function carregarManifestoTts() {
    if (!manifestoTtsPromise) {
        manifestoTtsPromise = fetch(new URL('manifest.json', TTS_AUDIO_BASE_URL))
            .then(response => {
                if (!response.ok) throw new Error('Manifesto de áudio indisponível');
                return response.json();
            })
            .catch(error => {
                console.log('Áudios pré-gerados indisponíveis:', error);
                return {};
            });
    }
    return manifestoTtsPromise;
}

function pararAudioTts() {
    if (!audioTtsAtual) return;
    audioTtsAtual.pause();
    audioTtsAtual.currentTime = 0;
    audioTtsAtual = null;
}

async function falarAudioPreGerado(texto, falaId) {
    const manifesto = await carregarManifestoTts();
    const arquivo = manifesto[texto];
    if (!arquivo || falaId !== falaTtsAtual) return false;

    const audio = new Audio(new URL(arquivo, TTS_AUDIO_BASE_URL));
    audioTtsAtual = audio;
    audio.onended = () => {
        if (audioTtsAtual === audio) audioTtsAtual = null;
    };

    try {
        await audio.play();
        return true;
    } catch (error) {
        console.log('Erro ao tocar áudio pré-gerado:', error);
        if (audioTtsAtual === audio) audioTtsAtual = null;
        return false;
    }
}

function falarNoServidorLocal(texto) {
    // Tenta o servidor TTS local primeiro (Linux)
    // Se nao estiver disponivel, usa Web Speech API (Windows/Android)
    const url = `http://127.0.0.1:8766/falar?texto=${encodeURIComponent(texto)}`;
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
            falarWeb(texto);
        });
}

function falar(texto) {
    const textoLimpo = String(texto || '').replace(/\s+/g, ' ').trim();
    if (!textoLimpo) return;

    falaTtsAtual++;
    const falaId = falaTtsAtual;
    pararAudioTts();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (usarServidorTtsLocal()) {
        falarNoServidorLocal(textoLimpo);
        return;
    }

    falarAudioPreGerado(textoLimpo, falaId).then(tocou => {
        if (!tocou && falaId === falaTtsAtual) falarWeb(textoLimpo);
    });
}

carregarManifestoTts();

if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', selecionarVozPTBR);
    window.addEventListener('pageshow', () => window.speechSynthesis.resume());
}

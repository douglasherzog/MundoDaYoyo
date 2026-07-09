#!/bin/bash
# Instala vozes de texto para fala (TTS) para o Chromium funcionar no Mundo da Yoyo

USUARIO="yoyo"

echo "=== Instalando vozes TTS para o Chromium ==="

sudo apt update

# Instala speech-dispatcher, espeak e picotts (melhor qualidade em portugues)
sudo apt install -y \
    speech-dispatcher \
    speech-dispatcher-espeak \
    espeak \
    espeak-data \
    espeak-ng \
    espeak-ng-data \
    libttspico0 \
    libttspico-utils \
    libttspico-data

# Configura o speech-dispatcher para usar espeak como padrao
if [ -f /etc/speech-dispatcher/speechd.conf ]; then
    sudo sed -i 's/^#AddModule.*espeak/AddModule "espeak"       "sd_espeak"     "espeak.conf"/' /etc/speech-dispatcher/speechd.conf 2>/dev/null || true
    sudo sed -i 's/^#DefaultModule.*$/DefaultModule espeak/' /etc/speech-dispatcher/speechd.conf 2>/dev/null || true
fi

# Reinicia o speech-dispatcher
sudo systemctl restart speech-dispatcher 2>/dev/null || true
sudo -u $USUARIO speech-dispatcher -t 2>/dev/null || true

echo ""
echo "=== Testando TTS via linha de comando ==="
echo "Testando espeak:"
espeak -v pt-br "Ola, Mundo da Yoyo" 2>/dev/null || true

echo "Testando pico:"
pico2wave -l pt-BR -w /tmp/teste-tts.wav "Ola, Mundo da Yoyo" 2>/dev/null || true
aplay /tmp/teste-tts.wav 2>/dev/null || true

echo ""
echo "Reinicie o computador para o Chromium reconhecer as vozes."

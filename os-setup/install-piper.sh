#!/bin/bash
# Instala Piper TTS (voz neural offline) para o Mundo da Yoyo
# Piper usa redes neurais - som muito mais natural que pico2wave/espeak/RHVoice

USUARIO="yoyo"
PASTA_PIPER="/home/$USUARIO/.local/share/piper"
BIN_PIPER="/usr/local/bin/piper"

echo "=== Instalando Piper TTS (voz neural) ==="

# Baixa o binario do Piper (pre-compilado)
if [ ! -f "$BIN_PIPER" ]; then
    echo "Baixando Piper..."
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        URL="https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz"
    else
        echo "Arquitetura $ARCH nao suportada pelo Piper pre-compilado."
        echo "Instalando via pip..."
        sudo apt install -y python3-pip
        sudo -u $USUARIO pip3 install piper-tts --break-system-packages 2>/dev/null || true
        exit 0
    fi

    TMP=$(mktemp -d)
    wget -qO "$TMP/piper.tar.gz" "$URL"
    tar xzf "$TMP/piper.tar.gz" -C "$TMP"
    sudo cp "$TMP/piper/piper" "$BIN_PIPER"
    sudo chmod +x "$BIN_PIPER"
    rm -rf "$TMP"
    echo "Binario Piper instalado em $BIN_PIPER"
else
    echo "Piper ja instalado."
fi

# Baixa a voz em portugues brasileiro (felipe - masculino natural)
# Alternativas: pt_BR-faber-medium (masculino), pt_BR-felipe-medium (masculino)
# Para feminino mais natural, usamos a voz medium
mkdir -p "$PASTA_PIPER/voices"
sudo -u $USUARIO mkdir -p "$PASTA_PIPER/voices"

VOZ_ONNX="$PASTA_PIPER/voices/pt_BR-faber-medium.onnx"
VOZ_JSON="${VOZ_ONNX}.json"

if [ ! -f "$VOZ_ONNX" ]; then
    echo "Baixando voz pt_BR-faber-medium..."
    sudo -u $USUARIO wget -qO "$VOZ_ONNX" \
        "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/BR/faber/medium/pt_BR-faber-medium.onnx"
    sudo -u $USUARIO wget -qO "$VOZ_JSON" \
        "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/BR/faber/medium/pt_BR-faber-medium.onnx.json"
else
    echo "Voz ja baixada."
fi

# Testa
echo ""
echo "=== Testando Piper ==="
echo "Ola Yoyo, bem vinda ao mundo magico!" | $BIN_PIPER \
    --model "$VOZ_ONNX" \
    --output_file /tmp/teste-piper.wav 2>/dev/null

if [ -f /tmp/teste-piper.wav ]; then
    aplay /tmp/teste-piper.wav 2>/dev/null
    echo "Piper funcionando! Voz neural instalada com sucesso."
else
    echo "Erro: Piper nao conseguiu gerar audio."
    exit 1
fi

echo ""
echo "=== Instalacao concluida ==="
echo "Piper: $BIN_PIPER"
echo "Voz:   $VOZ_ONNX"
echo ""
echo "Reinicie o servidor TTS para usar a nova voz:"
echo "  sudo systemctl restart mundodayoyo-tts"

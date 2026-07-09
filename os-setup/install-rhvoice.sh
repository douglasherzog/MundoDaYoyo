#!/bin/bash
# Instala RHVoice com voz brasileira para TTS mais natural no Linux

USUARIO="yoyo"

echo "=== Instalando RHVoice (voz mais natural) ==="

sudo apt update

# Tenta instalar do repositorio padrao
sudo apt install -y rhvoice rhvoice-brazilian-portuguese 2>/dev/null || true

# Se nao estiver no repositorio, instala via snap/AppImage ou compila
if ! command -v RHVoice-test &>/dev/null && ! command -v rhvoice-test &>/dev/null; then
    echo "RHVoice nao encontrado nos repositorios. Tentando instalar via PPA..."
    sudo add-apt-repository -y ppa:rhvoice/ppa 2>/dev/null || true
    sudo apt update
    sudo apt install -y rhvoice rhvoice-brazilian-portuguese 2>/dev/null || true
fi

# Verifica qual comando esta disponivel
if command -v RHVoice-test &>/dev/null || command -v rhvoice-test &>/dev/null || \
   command -v RHVoice-client &>/dev/null || command -v rhvoice-client &>/dev/null; then
    echo "RHVoice instalado com sucesso."
else
    echo "AVISO: Nao foi possivel instalar o RHVoice. Sera usado pico2wave/espeak."
fi

echo ""
echo "Reinicie o computador para usar as novas vozes."

#!/bin/bash
# Corrige problemas comuns de audio no Linux Mint para o Mundo da Yoyo

echo "=== Diagnostico de audio ==="

# Verifica usuario do kiosk
USUARIO="yoyo"

# Adiciona usuario ao grupo audio (precisa para acessar a placa de som)
if ! groups $USUARIO | grep -q '\baudio\b'; then
    echo "Adicionando $USUARIO ao grupo audio..."
    sudo usermod -aG audio $USUARIO
fi

# Verifica se pulseaudio esta instalado
if ! command -v pactl &>/dev/null; then
    echo "Instalando utilitarios de audio..."
    sudo apt update
    sudo apt install -y pulseaudio pulseaudio-utils pavucontrol alsa-utils
fi

# Garante que o PulseAudio esteja habilitado para o usuario do kiosk
echo "Configurando PulseAudio para iniciar automaticamente..."
sudo -u $USUARIO mkdir -p /home/$USUARIO/.config/pulse

# Para qualquer instancia travada e inicia o PulseAudio para o usuario yoyo
sudo -u $USUARIO pulseaudio --kill 2>/dev/null || true
sleep 1
sudo -u $USUARIO pulseaudio --start 2>/dev/null || true
sleep 2

# Desmuta e ajusta o volume padrao via ALSA e PulseAudio
echo "Ajustando volume..."
sudo amixer sset Master 80% unmute 2>/dev/null || true
sudo -u $USUARIO pactl set-sink-mute @DEFAULT_SINK@ 0 2>/dev/null || true
sudo -u $USUARIO pactl set-sink-volume @DEFAULT_SINK@ 80% 2>/dev/null || true

# Lista dispositivos de audio
echo ""
echo "=== Dispositivos de audio disponiveis ==="
sudo -u $USUARIO pactl list sinks short 2>/dev/null || true

# Testa som via ALSA e PulseAudio
echo ""
echo "=== Testando som ==="
if command -v speaker-test &>/dev/null; then
    echo "Teste ALSA (3 segundos)..."
    sudo speaker-test -c 2 -t sine -f 1000 -l 1 -p 1 2>/dev/null || true
    echo "Teste PulseAudio (3 segundos)..."
    sudo -u $USUARIO speaker-test -c 2 -t sine -f 1000 -l 1 -p 1 2>/dev/null || true
fi

echo ""
echo "=== Instrucoes ==="
echo "Se ainda nao ouvir som, verifique:"
echo "1. Se o cabo/caixa de som esta conectado"
echo "2. Se o volume fisico do computador/caixa esta ligado"
echo "3. Rode 'alsamixer' localmente para escolher a placa e ajustar o volume"
echo ""
echo "Para tornar o audio permanente no kiosk, reinicie o computador."

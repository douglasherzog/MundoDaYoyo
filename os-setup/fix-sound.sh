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
    sudo apt install -y pulseaudio pulseaudio-utils pavucontrol
fi

# Garante que o PulseAudio esteja habilitado para o usuario do kiosk
echo "Configurando PulseAudio para iniciar automaticamente..."
sudo -u $USUARIO mkdir -p /home/$USUARIO/.config/pulse

# Desmuta e ajusta o volume padrao
echo "Ajustando volume..."
sudo -u $USUARIO pactl set-sink-mute @DEFAULT_SINK@ 0 2>/dev/null || true
sudo -u $USUARIO pactl set-sink-volume @DEFAULT_SINK@ 80% 2>/dev/null || true

# Lista dispositivos de audio
echo ""
echo "=== Dispositivos de audio disponiveis ==="
sudo -u $USUARIO pactl list sinks short 2>/dev/null || true

# Testa som com beep padrao
echo ""
echo "=== Testando som ==="
sudo -u $USUARIO pactl set-sink-mute @DEFAULT_SINK@ 0
sudo -u $USUARIO pactl set-sink-volume @DEFAULT_SINK@ 70%
# Tenta tocar um som de teste se o sox ou speaker-test estiverem disponiveis
if command -v speaker-test &>/dev/null; then
    echo "Iniciando teste de 3 segundos..."
    sudo -u $USUARIO speaker-test -t sine -f 1000 -l 1 -p 1 &
fi

echo ""
echo "=== Instrucoes ==="
echo "Se ainda nao ouvir som, verifique:"
echo "1. Se o cabo/caixa de som esta conectado"
echo "2. Se o volume fisico do computador/caixa esta ligado"
echo "3. Se a saida de audio correta foi selecionada em: pavucontrol"
echo ""
echo "Reinicie o computador se o usuario foi adicionado ao grupo audio."

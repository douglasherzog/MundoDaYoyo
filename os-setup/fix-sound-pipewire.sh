#!/bin/bash
# Corrige audio quando o Linux Mint usa PipeWire (padrao no Mint 21+)

USUARIO="yoyo"

echo "=== Corrigindo audio com PipeWire ==="

# Instala utilitarios caso faltem
sudo apt update
sudo apt install -y pipewire pipewire-pulse wireplumber pulseaudio-utils pavucontrol alsa-utils

# Reativa os servicos globais do PipeWire
systemctl --global enable pipewire pipewire-pulse wireplumber 2>/dev/null || true

# Para e reinicia o PipeWire para o usuario do kiosk
sudo -u $USUARIO systemctl --user stop pipewire pipewire-pulse wireplumber 2>/dev/null || true
sleep 2
sudo -u $USUARIO systemctl --user start pipewire pipewire-pulse wireplumber 2>/dev/null || true
sleep 2

# Tambem tenta iniciar manualmente se o systemd nao estiver gerenciando
sudo -u $USUARIO pipewire &>/dev/null &
sleep 1
sudo -u $USUARIO pipewire-pulse &>/dev/null &
sleep 1
sudo -u $USUARIO wireplumber &>/dev/null &
sleep 2

# Configura o ambiente de runtime
echo "export XDG_RUNTIME_DIR=/run/user/$(id -u $USUARIO)" >> /home/$USUARIO/.bashrc

# Ajusta volume
sudo -u $USUARIO pactl set-sink-mute @DEFAULT_SINK@ 0 2>/dev/null || true
sudo -u $USUARIO pactl set-sink-volume @DEFAULT_SINK@ 80% 2>/dev/null || true

# Testa o som
echo ""
echo "=== Testando som ==="
sudo -u $USUARIO speaker-test -c 2 -t sine -f 1000 -l 1 -p 1 2>/dev/null || true

echo ""
echo "Sinks disponiveis:"
sudo -u $USUARIO pactl list sinks short 2>/dev/null || true

echo ""
echo "Reinicie o computador se o som ainda nao funcionar."

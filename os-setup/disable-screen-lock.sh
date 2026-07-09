#!/bin/bash
# Desativa a tela de bloqueio por senha quando o computador fica ocioso
# Mantem apenas o descanso de tela (screen blanking)

USUARIO="yoyo"

echo "=== Desativando bloqueio de tela por senha ==="

# Configura o screensaver do XFCE para nao travar
sudo -u "$USUARIO" xfconf-query -c xfce4-screensaver -p /lock/enabled -n -t bool -s false 2>/dev/null || \
    sudo -u "$USUARIO" xfconf-query -c xfce4-screensaver -p /lock/enabled -s false 2>/dev/null || true

sudo -u "$USUARIO" xfconf-query -c xfce4-screensaver -p /lock/activation-enabled -n -t bool -s false 2>/dev/null || \
    sudo -u "$USUARIO" xfconf-query -c xfce4-screensaver -p /lock/activation-enabled -s false 2>/dev/null || true

# Desativa o light-locker (comum no XFCE)
if dpkg -l | grep -q light-locker; then
    echo "Removendo light-locker..."
    sudo apt remove -y light-locker 2>/dev/null || true
fi

# Configuracoes genericas de seguranca (GNOME/Cinnamon)
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver active-lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver lock-delay 0 2>/dev/null || true

# Desativa bloqueio ao suspender/hibernar no XFCE
sudo -u "$USUARIO" xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/lock-screen-suspend-hibernate -n -t bool -s false 2>/dev/null || \
    sudo -u "$USUARIO" xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/lock-screen-suspend-hibernate -s false 2>/dev/null || true

echo ""
echo "Bloqueio de tela desativado. A tela ainda pode escurecer/descansar, mas nao pedira senha."

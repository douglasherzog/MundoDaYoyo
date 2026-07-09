#!/bin/bash
# Mundo da Yoyo - Sistema Educacional Kiosk
# Instala e configura o Linux para iniciar direto no Mundo da Yoyo

set -e

URL_JOGO="https://douglasherzog.github.io/MundoDaYoyo"
USUARIO="yoyo"
PASTA_AUTOSTART="/home/$USUARIO/.config/autostart"
ARQUIVO_KIOSK="/usr/local/bin/mundodayoyo-kiosk.sh"
ARQUIVO_DESKTOP="$PASTA_AUTOSTART/mundodayoyo.desktop"

echo "=== Configurando Mundo da Yoyo como ambiente educacional ==="

# Atualiza pacotes
sudo apt update

# Instala o Chromium
sudo apt install -y chromium-browser unclutter

# Cria o usuario yoyo se nao existir
if ! id "$USUARIO" &>/dev/null; then
    sudo useradd -m -s /bin/bash "$USUARIO"
    sudo usermod -aG audio,video,plugdev "$USUARIO"
    echo "Usuario $USUARIO criado. Defina uma senha para manutencao:"
    sudo passwd "$USUARIO"
else
    echo "Usuario $USUARIO ja existe."
fi

# Configura login automatico
if command -v lightdm &>/dev/null; then
    sudo sed -i "s/^#\?autologin-user=.*/autologin-user=$USUARIO/" /etc/lightdm/lightdm.conf || true
    sudo sed -i "s/^#\?autologin-user-timeout=.*/autologin-user-timeout=0/" /etc/lightdm/lightdm.conf || true
    sudo sed -i "s/^#\?greeter-hide-users=.*/greeter-hide-users=true/" /etc/lightdm/lightdm.conf || true
fi

if command -v gdm3 &>/dev/null; then
    sudo sed -i "s/^#\?AutomaticLoginEnable.*/AutomaticLoginEnable=true/" /etc/gdm3/custom.conf || true
    sudo sed -i "s/^#\?AutomaticLogin.*/AutomaticLogin=$USUARIO/" /etc/gdm3/custom.conf || true
fi

# Cria o script do kiosk
sudo tee "$ARQUIVO_KIOSK" > /dev/null <<EOF
#!/bin/bash
# Limpa a tela do cursor quando parado
unclutter -idle 0.1 &

# Abre o Mundo da Yoyo em modo quiosque
chromium-browser --kiosk --app=$URL_JOGO \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --no-first-run \
    --disable-features=TranslateUI \
    --enable-features=OverlayScrollbars \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --touch-events=enabled \
    --user-data-dir=/home/$USUARIO/.config/chromium-yoyo
EOF

sudo chmod +x "$ARQUIVO_KIOSK"

# Cria entrada de inicializacao automatica
sudo mkdir -p "$PASTA_AUTOSTART"
sudo tee "$ARQUIVO_DESKTOP" > /dev/null <<EOF
[Desktop Entry]
Type=Application
Name=Mundo da Yoyo
Exec=$ARQUIVO_KIOSK
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

sudo chown -R "$USUARIO:$USUARIO" "/home/$USUARIO/.config"

# Desativa bloqueio de tela e suspensao
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.session idle-delay 0 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver lock-delay 0 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver active-lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power idle-dim false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-timeout 0 2>/dev/null || true

# Cria atalho de emergencia para terminal (Ctrl+Alt+T)
TECLA_ATALHO="/home/$USUARIO/.config/dconf/user"
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.media-keys terminal '<Ctrl><Alt>t' 2>/dev/null || true

echo ""
echo "=== Instalacao concluida ==="
echo "Reinicie o computador. O Mundo da Yoyo abrira automaticamente."
echo "Para manutencao, pressione Ctrl+Alt+T para abrir o terminal."

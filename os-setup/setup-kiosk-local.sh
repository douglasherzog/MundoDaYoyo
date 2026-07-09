#!/bin/bash
# Mundo da Yoyo - Sistema Educacional Kiosk (versao offline)
# Instala e configura o Linux para iniciar direto no Mundo da Yoyo
# usando os arquivos locais, sem depender da internet apos a instalacao

URL_JOGO="file:///home/yoyo/MundoDaYoyo/index.html"
USUARIO="yoyo"
PASTA_PROJETO="/home/$USUARIO/MundoDaYoyo"
PASTA_AUTOSTART="/home/$USUARIO/.config/autostart"
ARQUIVO_KIOSK="/usr/local/bin/mundodayoyo-kiosk.sh"
ARQUIVO_DESKTOP="$PASTA_AUTOSTART/mundodayoyo.desktop"

echo "=== Configurando Mundo da Yoyo (modo offline) ==="

# Descobre o nome correto do navegador ja instalado
if command -v chromium-browser &>/dev/null; then
    NAVEGADOR="chromium-browser"
elif command -v chromium &>/dev/null; then
    NAVEGADOR="chromium"
elif command -v google-chrome &>/dev/null; then
    NAVEGADOR="google-chrome"
elif command -v firefox &>/dev/null; then
    NAVEGADOR="firefox"
else
    NAVEGADOR=""
fi

# Atualiza pacotes e instala dependencias
sudo apt update
sudo apt install -y unclutter git

# Instala o navegador se ainda nao tiver nenhum
if [ -z "$NAVEGADOR" ]; then
    echo "Nenhum navegador encontrado. Tentando instalar Chromium..."
    if sudo apt install -y chromium; then
        NAVEGADOR="chromium"
    else
        echo "Chromium falhou. Instalando Firefox como alternativa..."
        sudo apt install -y firefox
        NAVEGADOR="firefox"
    fi
fi

if [ -z "$NAVEGADOR" ]; then
    echo "ERRO: Nao foi possivel instalar nenhum navegador."
    exit 1
fi

echo "Navegador usado: $NAVEGADOR"

# Cria o usuario yoyo se nao existir
if ! id "$USUARIO" &>/dev/null; then
    sudo useradd -m -s /bin/bash "$USUARIO"
    sudo usermod -aG audio,video,plugdev "$USUARIO"
    echo "Usuario $USUARIO criado. Defina uma senha para manutencao:"
    sudo passwd "$USUARIO"
else
    echo "Usuario $USUARIO ja existe."
fi

# Baixa o projeto do GitHub para a pasta local
if [ -d "$PASTA_PROJETO/.git" ]; then
    echo "Projeto ja existe localmente. Atualizando..."
    sudo -u "$USUARIO" git -C "$PASTA_PROJETO" pull origin main
else
    echo "Baixando o projeto para $PASTA_PROJETO ..."
    sudo -u "$USUARIO" git clone https://github.com/douglasherzog/MundoDaYoyo.git "$PASTA_PROJETO"
fi

# Configura login automatico no LightDM (padrao do Linux Mint)
if command -v lightdm &>/dev/null || [ -d /etc/lightdm ]; then
    ARQUIVO_LIGHTDM="/etc/lightdm/lightdm.conf"
    sudo mkdir -p /etc/lightdm

    if [ -f "$ARQUIVO_LIGHTDM" ]; then
        sudo cp "$ARQUIVO_LIGHTDM" "$ARQUIVO_LIGHTDM.bak"
    fi

    sudo tee "$ARQUIVO_LIGHTDM" > /dev/null <<EOF
[Seat:*]
autologin-user=$USUARIO
autologin-user-timeout=0
autologin-session=lightdm-xsession
EOF
fi

# Configura login automatico no GDM3
if command -v gdm3 &>/dev/null || [ -d /etc/gdm3 ]; then
    ARQUIVO_GDM="/etc/gdm3/custom.conf"

    if [ -f "$ARQUIVO_GDM" ]; then
        sudo cp "$ARQUIVO_GDM" "$ARQUIVO_GDM.bak"
        sudo sed -i "s/^#\?AutomaticLoginEnable.*/AutomaticLoginEnable=true/" "$ARQUIVO_GDM" || true
        sudo sed -i "s/^#\?AutomaticLogin.*/AutomaticLogin=$USUARIO/" "$ARQUIVO_GDM" || true
    fi
fi

# Cria o script do kiosk
sudo tee "$ARQUIVO_KIOSK" > /dev/null <<EOF
#!/bin/bash

# Limpa a tela do cursor quando parado
pkill unclutter || true
unclutter -idle 0.1 &

# Abre o Mundo da Yoyo em modo quiosque
$NAVEGADOR --kiosk --app=$URL_JOGO \\
    --disable-infobars \\
    --disable-session-crashed-bubble \\
    --disable-restore-session-state \\
    --no-first-run \\
    --disable-features=TranslateUI \\
    --enable-features=OverlayScrollbars \\
    --disable-pinch \\
    --overscroll-history-navigation=0 \\
    --touch-events=enabled \\
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
sudo -u "$USUARIO" gsettings set org.gnome.desktop.screensaver active-lock-enabled false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power idle-dim false 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0 2>/dev/null || true
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-timeout 0 2>/dev/null || true

# Atalho de emergencia para terminal (Ctrl+Alt+T)
sudo -u "$USUARIO" gsettings set org.gnome.settings-daemon.plugins.media-keys terminal '<Ctrl><Alt>t' 2>/dev/null || true

echo ""
echo "=== Instalacao concluida ==="
echo "Reinicie o computador. O Mundo da Yoyo abrira automaticamente."
echo "Para manutencao, pressione Ctrl+Alt+T para abrir o terminal."
echo "O projeto esta em $PASTA_PROJETO"

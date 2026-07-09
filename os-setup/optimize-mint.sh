#!/bin/bash
# Otimiza o Linux Mint para rodar apenas o Mundo da Yoyo
# Remove programas desnecessarios e desativa servicos para deixar o boot mais rapido

echo "=== Otimizando Linux Mint para o Mundo da Yoyo ==="

# Atualiza lista de pacotes
sudo apt update

# Remove programas desnecessarios para um ambiente infantil
PROGRAMAS_REMOVER=(
    "libreoffice-*"
    "thunderbird*"
    "hexchat*"
    "transmission*"
    "gimp"
    "vlc"
    "pix"
    "xplayer"
    "xed"
    "warzone2100"
    "aisleriot"
    "gnome-games*"
    "cheese"
    "rhythmbox"
    "totem"
    "simple-scan"
)

for pacote in "${PROGRAMAS_REMOVER[@]}"; do
    echo "Removendo: $pacote"
    sudo apt remove -y $pacote 2>/dev/null || true
done

# Limpa pacotes orfaos
sudo apt autoremove -y
sudo apt autoclean

# Desativa servicos desnecessarios
SERVICOS_DESATIVAR=(
    "bluetooth"
    "cups"
    "cups-browsed"
    "avahi-daemon"
    "ModemManager"
)

for servico in "${SERVICOS_DESATIVAR[@]}"; do
    echo "Desativando servico: $servico"
    sudo systemctl stop $servico 2>/dev/null || true
    sudo systemctl disable $servico 2>/dev/null || true
done

# Desativa animacoes do Cinnamon para tornar mais rapido
if command -v gsettings &>/dev/null; then
    sudo -u yoyo gsettings set org.cinnamon desktop-effects enable-effects false 2>/dev/null || true
    sudo -u yoyo gsettings set org.cinnamon.desktop.interface enable-animations false 2>/dev/null || true
fi

# Desabilita a tela de boas-vindas do Mint
sudo rm -f /etc/xdg/autostart/mintwelcome.desktop 2>/dev/null || true

# Desabilita atualizacoes automaticas (adulto deve fazer manualmente)
sudo systemctl stop mintupdate-automation-upgrade 2>/dev/null || true
sudo systemctl disable mintupdate-automation-upgrade 2>/dev/null || true
sudo systemctl stop mintupdate-automation-refresh 2>/dev/null || true
sudo systemctl disable mintupdate-automation-refresh 2>/dev/null || true

echo ""
echo "=== Otimizacao concluida ==="
echo "Reinicie o computador para aplicar todas as mudancas."
echo "Para ver o tempo de boot, use: systemd-analyze"

#!/bin/bash
# Instala e configura vozes TTS para o Chromium no Mundo da Yoyo

USUARIO="yoyo"
RUNTIME_DIR="/run/user/$(id -u $USUARIO)"

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

# Cria servico systemd do usuario para iniciar speech-dispatcher na sessao
sudo mkdir -p /home/$USUARIO/.config/systemd/user
sudo tee /home/$USUARIO/.config/systemd/user/speech-dispatcher.service > /dev/null <<EOF
[Unit]
Description=Speech Dispatcher

[Service]
Type=simple
ExecStart=/usr/bin/speech-dispatcher -d -l 1
Restart=on-failure

[Install]
WantedBy=default.target
EOF

sudo chown -R $USUARIO:$USUARIO /home/$USUARIO/.config/systemd

# Para instancias antigas e inicia o servico
sudo -u $USUARIO pkill -f speech-dispatcher 2>/dev/null || true
sleep 1
sudo -u $USUARIO systemctl --user daemon-reload
sudo -u $USUARIO systemctl --user enable speech-dispatcher
sudo -u $USUARIO systemctl --user start speech-dispatcher
sleep 2

# Ajusta permissoes do socket
sudo mkdir -p $RUNTIME_DIR/speech-dispatcher
sudo chown -R $USUARIO:$USUARIO $RUNTIME_DIR/speech-dispatcher 2>/dev/null || true

echo ""
echo "=== Testando TTS via linha de comando ==="
echo "Testando spd-say:"
sudo -u $USUARIO spd-say -l pt-br -t female1 "Ola, Mundo da Yoyo" 2>/dev/null || true

echo "Testando espeak:"
espeak -v pt-br "Ola, Mundo da Yoyo" 2>/dev/null || true

echo "Testando pico:"
pico2wave -l pt-BR -w /tmp/teste-tts.wav "Ola, Mundo da Yoyo" 2>/dev/null || true
aplay /tmp/teste-tts.wav 2>/dev/null || true

echo ""
echo "Reinicie o computador para o Chromium reconhecer as vozes."

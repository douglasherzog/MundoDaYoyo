#!/bin/bash
# Cria servico systemd para o TTS server do Mundo da Yoyo
# Assim o TTS inicia automaticamente no boot

USUARIO="yoyo"

echo "=== Criando servico TTS do Mundo da Yoyo ==="

sudo tee /etc/systemd/system/mundodayoyo-tts.service > /dev/null <<EOF
[Unit]
Description=Mundo da Yoyo - Servidor TTS (Piper)
After=network.target

[Service]
Type=simple
User=$USUARIO
ExecStart=/usr/bin/python3 /home/$USUARIO/MundoDaYoyo/os-setup/tts-server.py
Restart=on-failure
RestartSec=3
Environment=HOME=/home/$USUARIO

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable mundodayoyo-tts
sudo systemctl start mundodayoyo-tts

echo ""
echo "Gerando cache de todas as frases (pode demorar alguns minutos)..."
sudo -u $USUARIO python3 /home/$USUARIO/MundoDaYoyo/os-setup/gerar-cache-tts.py

echo ""
echo "Reiniciando servico com cache completo..."
sudo systemctl restart mundodayoyo-tts

echo ""
echo "Servico criado e iniciado!"
echo "Status:"
sudo systemctl status mundodayoyo-tts --no-pager
echo ""
echo "O TTS agora inicia automaticamente no boot."

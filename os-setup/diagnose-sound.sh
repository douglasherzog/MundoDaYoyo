#!/bin/bash
# Diagnostico completo de audio no Linux Mint
# Salva um relatorio em /tmp/audio-diagnostic.txt

RELATORIO="/tmp/audio-diagnostic.txt"

echo "=== Relatorio de Diagnostico de Audio ===" > "$RELATORIO"
date >> "$RELATORIO"
echo "" >> "$RELATORIO"

echo "--- Usuario e grupos ---" >> "$RELATORIO"
whoami >> "$RELATORIO"
groups >> "$RELATORIO"
echo "" >> "$RELATORIO"

echo "--- Cartoes ALSA ---" >> "$RELATORIO"
cat /proc/asound/cards >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Dispositivos ALSA ---" >> "$RELATORIO"
aplay -l >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Modulos de som carregados ---" >> "$RELATORIO"
lsmod | grep -E "snd|sound" >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Processos de audio ---" >> "$RELATORIO"
ps aux | grep -E "pulse|pipewire|alsa|jack" | grep -v grep >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Informacoes do PulseAudio ---" >> "$RELATORIO"
pactl info >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Sinks disponiveis ---" >> "$RELATORIO"
pactl list sinks short >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Volume Master ALSA ---" >> "$RELATORIO"
amixer sget Master >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Teste de som ALSA ---" >> "$RELATORIO"
speaker-test -c 2 -t sine -f 1000 -l 1 -p 1 >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "--- Teste de som PulseAudio ---" >> "$RELATORIO"
pactl set-sink-mute @DEFAULT_SINK@ 0 >> "$RELATORIO" 2>&1
pactl set-sink-volume @DEFAULT_SINK@ 80% >> "$RELATORIO" 2>&1
speaker-test -c 2 -t sine -f 1000 -l 1 -p 1 >> "$RELATORIO" 2>&1
echo "" >> "$RELATORIO"

echo "Relatorio salvo em: $RELATORIO"
cat "$RELATORIO"

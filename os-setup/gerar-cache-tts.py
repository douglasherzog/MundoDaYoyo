#!/usr/bin/env python3
"""
Extrai todas as frases passadas para falar() nos arquivos .js
e gera o cache de áudio TTS para todas elas.
Execute: python3 gerar-cache-tts.py
"""

import os
import re
import json
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.expanduser("~/.cache/mundodayoyo-tts")
PIPER_BIN = "/usr/local/bin/piper"
PIPER_VOZ = os.path.expanduser("~/.local/share/piper/voices/pt_BR-faber-medium.onnx")
SOX_BIN = "/usr/bin/sox"
PITCH_SEMITONES = 3.0
SPEED_FACTOR = 1.05

os.makedirs(CACHE_DIR, exist_ok=True)


def extrair_frases():
    """Extrai todas as frases de falar('...') e falar(\"...\") dos arquivos .js"""
    frases = set()
    padroes = [
        re.compile(r"falar\s*\(\s*'([^']+)'\s*\)", re.IGNORECASE),
        re.compile(r"falar\s*\(\s*\"([^\"]+)\"\s*\)", re.IGNORECASE),
        re.compile(r"falar\s*\(\s*`([^`]+)`\s*\)", re.IGNORECASE),
    ]

    for arquivo in os.listdir(BASE_DIR):
        if not arquivo.endswith('.js'):
            continue
        caminho = os.path.join(BASE_DIR, arquivo)
        try:
            with open(caminho, 'r', encoding='utf-8') as f:
                conteudo = f.read()
        except Exception:
            continue

        for padrao in padroes:
            for match in padrao.finditer(conteudo):
                frase = match.group(1).strip()
                # Remove variáveis/templates ${...} - só cacheia frases estáticas
                if '${' not in frase and len(frase) > 1:
                    frases.add(frase)

    return sorted(frases)


def gerar_audio(texto):
    """Gera áudio WAV para uma frase usando Piper + sox."""
    hash_texto = str(abs(hash(texto)))
    caminho = os.path.join(CACHE_DIR, f"{hash_texto}.wav")
    caminho_raw = os.path.join(CACHE_DIR, f"{hash_texto}_raw.wav")

    if os.path.exists(caminho):
        return caminho  # Já existe

    if os.path.isfile(PIPER_BIN) and os.path.isfile(PIPER_VOZ):
        try:
            with subprocess.Popen(
                [PIPER_BIN, "--model", PIPER_VOZ, "--output_file", caminho_raw],
                stdin=subprocess.PIPE,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            ) as proc:
                proc.communicate(texto.encode("utf-8"), timeout=30)
            if os.path.exists(caminho_raw) and os.path.getsize(caminho_raw) > 0:
                if os.path.isfile(SOX_BIN):
                    try:
                        subprocess.run(
                            [SOX_BIN, caminho_raw, caminho,
                             "pitch", str(PITCH_SEMITONES * 100),
                             "tempo", str(SPEED_FACTOR)],
                            check=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL,
                        )
                        os.remove(caminho_raw)
                        if os.path.exists(caminho) and os.path.getsize(caminho) > 0:
                            return caminho
                    except Exception:
                        pass
                os.rename(caminho_raw, caminho)
                return caminho
        except Exception:
            pass
    return None


def main():
    print("=== Gerador de Cache TTS - Mundo da Yoyo ===")
    print()

    frases = extrair_frases()
    print(f"Encontradas {len(frases)} frases únicas nos arquivos .js")
    print()

    # Salva lista de frases para referência
    lista_file = os.path.join(CACHE_DIR, "frases.json")
    with open(lista_file, 'w', encoding='utf-8') as f:
        json.dump(frases, f, ensure_ascii=False, indent=2)
    print(f"Lista salva em {lista_file}")
    print()

    geradas = 0
    puladas = 0
    erros = 0

    for i, frase in enumerate(frases):
        hash_texto = str(abs(hash(frase)))
        caminho = os.path.join(CACHE_DIR, f"{hash_texto}.wav")

        if os.path.exists(caminho):
            puladas += 1
            continue

        resultado = gerar_audio(frase)
        if resultado:
            geradas += 1
            print(f"  [{i+1}/{len(frases)}] ✓ {frase[:50]}")
        else:
            erros += 1
            print(f"  [{i+1}/{len(frases)}] ✗ ERRO: {frase[:50]}")

    print()
    print(f"=== Resumo ===")
    print(f"Total de frases: {len(frases)}")
    print(f"Geradas agora:   {geradas}")
    print(f"Já em cache:     {puladas}")
    print(f"Erros:           {erros}")
    print(f"Cache em:        {CACHE_DIR}")
    print(f"Tamanho do cache: {sum(os.path.getsize(os.path.join(CACHE_DIR, f)) for f in os.listdir(CACHE_DIR) if f.endswith('.wav')) // 1024} KB")


if __name__ == "__main__":
    main()

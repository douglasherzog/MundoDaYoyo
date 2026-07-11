#!/usr/bin/env python3
# Servidor local de Texto para Fala (TTS) para o Mundo da Yoyo
# Usa pico2wave (melhor qualidade) ou espeak como fallback

import os
import json
import subprocess
import tempfile
import threading
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = 8766
CACHE_DIR = os.path.expanduser("~/.cache/mundodayoyo-tts")

os.makedirs(CACHE_DIR, exist_ok=True)


PIPER_BIN = "/usr/local/bin/piper"
PIPER_VOZ = os.path.expanduser("~/.local/share/piper/voices/pt_BR-faber-medium.onnx")
SOX_BIN = "/usr/bin/sox"
# Pitch +40% para deixar a voz mais feminina (estilo professora)
PITCH_SEMITONES = 3.0
SPEED_FACTOR = 1.05  # Ligeiramente mais rapido (estilo professora animada)


def gerar_audio(texto):
    """Gera arquivo WAV com o texto falado. Retorna caminho ou None."""
    hash_texto = str(abs(hash(texto)))
    caminho = os.path.join(CACHE_DIR, f"{hash_texto}.wav")
    caminho_raw = os.path.join(CACHE_DIR, f"{hash_texto}_raw.wav")

    if os.path.exists(caminho):
        return caminho

    # 1) Piper - voz neural (melhor qualidade, mais natural)
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
                # Se sox estiver disponivel, aumenta o pitch para voz feminina
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
                # Fallback: usa o audio original sem pitch
                os.rename(caminho_raw, caminho)
                return caminho
        except Exception:
            pass

    # 2) RHVoice - boa qualidade
    rhvoice_cmds = [
        ["RHVoice-test", "-p", "brazilian-portuguese", "-o", caminho],
        ["rhvoice-test", "-p", "brazilian-portuguese", "-o", caminho],
    ]
    for cmd in rhvoice_cmds:
        try:
            with subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) as proc:
                proc.communicate(texto.encode("utf-8"), timeout=10)
            if os.path.exists(caminho) and os.path.getsize(caminho) > 0:
                return caminho
        except Exception:
            pass

    # 3) pico2wave - qualidade razoavel
    try:
        subprocess.run(
            ["pico2wave", "-l", "pt-BR", "-w", caminho, texto],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return caminho
    except Exception:
        pass

    # 4) espeak - fallback basico
    try:
        subprocess.run(
            ["espeak", "-v", "pt-br", "-w", caminho, texto],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return caminho
    except Exception:
        pass

    return None


FRASES_JSON = os.path.join(CACHE_DIR, "frases.json")

FRASES_COMUNS_FALLBACK = [
    "Muito bem!", "Tente de novo", "Tente de novo!", "Parabens!",
    "Isso mesmo!", "Vamos brincar?", "Acertou!", "Mandou bem!",
]


def carregar_frases():
    """Carrega lista de frases do JSON gerado pelo gerar-cache-tts.py."""
    try:
        if os.path.exists(FRASES_JSON):
            with open(FRASES_JSON, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception:
        pass
    return FRASES_COMUNS_FALLBACK


def pre_carregar_frases():
    """Gera áudio das frases mais comuns em background na inicialização."""
    frases = carregar_frases()
    for frase in frases:
        caminho = os.path.join(CACHE_DIR, f"{abs(hash(frase))}.wav")
        if not os.path.exists(caminho):
            try:
                gerar_audio(frase)
            except Exception:
                pass


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Servidor HTTP que atende múltiplas requisições em paralelo."""
    daemon_threads = True


class TTSHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silencia logs para nao poluir
        pass

    def do_GET(self):
        if not self.path.startswith("/falar?"):
            self.send_error(404)
            return

        try:
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            texto = params.get("texto", [""])[0]

            if not texto:
                self.send_error(400)
                return

            caminho = gerar_audio(texto)

            if not caminho or not os.path.exists(caminho):
                self.send_error(500)
                return

            with open(caminho, "rb") as f:
                dados = f.read()

            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(dados)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(dados)

        except Exception as e:
            self.send_error(500)


if __name__ == "__main__":
    # Pre-carrega frases comuns em background (nao bloqueia o servidor)
    thread_preload = threading.Thread(target=pre_carregar_frases, daemon=True)
    thread_preload.start()

    servidor = ThreadedHTTPServer(("127.0.0.1", PORT), TTSHandler)
    print(f"Servidor TTS iniciado em http://127.0.0.1:{PORT}")
    servidor.serve_forever()

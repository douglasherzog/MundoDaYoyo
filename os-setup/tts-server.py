#!/usr/bin/env python3
# Servidor local de Texto para Fala (TTS) para o Mundo da Yoyo
# Usa pico2wave (melhor qualidade) ou espeak como fallback

import os
import subprocess
import tempfile
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8766
CACHE_DIR = os.path.expanduser("~/.cache/mundodayoyo-tts")

os.makedirs(CACHE_DIR, exist_ok=True)


def gerar_audio(texto):
    """Gera arquivo WAV com o texto falado. Retorna caminho ou None."""
    hash_texto = str(abs(hash(texto)))
    caminho = os.path.join(CACHE_DIR, f"{hash_texto}.wav")

    if os.path.exists(caminho):
        return caminho

    # Tenta pico2wave primeiro (melhor qualidade em pt-BR)
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

    # Fallback para espeak
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
    servidor = HTTPServer(("127.0.0.1", PORT), TTSHandler)
    print(f"Servidor TTS iniciado em http://127.0.0.1:{PORT}")
    servidor.serve_forever()

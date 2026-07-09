#!/usr/bin/env python3
"""
Servidor admin local para o Mundo da Yoyo.
Permite desligar, reiniciar e ajustar o volume do sistema
via requisicoes vindas do navegador em modo quiosque.
"""

import json
import os
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "127.0.0.1"
PORT = 8765


def executar(comando):
    try:
        resultado = subprocess.run(
            comando,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return {"status": "ok", "saida": resultado.stdout.strip()}
    except subprocess.CalledProcessError as erro:
        return {"status": "erro", "saida": erro.stderr.strip()}


class AdminHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _responder(self, codigo, dados):
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(dados).encode("utf-8"))

    def do_OPTIONS(self):
        self._responder(200, {})

    def do_POST(self):
        if self.path not in ["/shutdown", "/reboot", "/volume"]:
            self._responder(404, {"status": "erro", "mensagem": "rota nao encontrada"})
            return

        tamanho = int(self.headers.get("Content-Length", 0))
        corpo = self.rfile.read(tamanho).decode("utf-8") if tamanho > 0 else "{}"

        try:
            dados = json.loads(corpo) if corpo else {}
        except json.JSONDecodeError:
            dados = {}

        if self.path == "/shutdown":
            resposta = executar("poweroff")
        elif self.path == "/reboot":
            resposta = executar("reboot")
        elif self.path == "/volume":
            nivel = dados.get("nivel", 70)
            resposta = executar(f"pactl set-sink-volume @DEFAULT_SINK@ {nivel}%")

        self._responder(200, resposta)


if __name__ == "__main__":
    servidor = HTTPServer((HOST, PORT), AdminHandler)
    print(f"Servidor admin do Mundo da Yoyo rodando em http://{HOST}:{PORT}")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor admin encerrado.")
        sys.exit(0)

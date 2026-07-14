import argparse
import asyncio
import hashlib
import json
import re
import sys
from pathlib import Path

import edge_tts

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "audio" / "tts"
VOICE = "pt-BR-FranciscaNeural"
RATE = "-8%"
sys.stdout.reconfigure(encoding="utf-8")
PROPERTY_PATTERN = re.compile(
    r"(?:fala|som|instrucao|texto|nome|pergunta|mensagem)\s*:\s*(['\"])(.*?)\1",
    re.IGNORECASE,
)
SPEAK_PATTERN = re.compile(r"falar\s*\(\s*(['\"])(.*?)\1\s*\)", re.IGNORECASE)


def normalizar(texto):
    return re.sub(r"\s+", " ", texto).strip()


def coletar_frases():
    frases = set()
    for caminho in BASE_DIR.glob("*.js"):
        conteudo = caminho.read_text(encoding="utf-8")
        for padrao in (PROPERTY_PATTERN, SPEAK_PATTERN):
            for match in padrao.finditer(conteudo):
                frase = normalizar(match.group(2))
                if len(frase) > 1 and "${" not in frase:
                    frases.add(frase)
    return sorted(frases)


def nome_arquivo(frase):
    digest = hashlib.sha256(frase.encode("utf-8")).hexdigest()[:16]
    return f"{digest}.mp3"


async def gerar_audio(frase, destino):
    comunicador = edge_tts.Communicate(frase, VOICE, rate=RATE)
    await comunicador.save(str(destino))


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    frases = coletar_frases()
    print(f"Frases encontradas: {len(frases)}")

    if args.dry_run:
        for frase in frases:
            print(frase)
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifesto = {}
    for indice, frase in enumerate(frases, start=1):
        arquivo = nome_arquivo(frase)
        destino = OUTPUT_DIR / arquivo
        manifesto[frase] = arquivo
        if destino.exists() and destino.stat().st_size > 0:
            print(f"[{indice}/{len(frases)}] existente: {frase[:70]}")
            continue
        print(f"[{indice}/{len(frases)}] gerando: {frase[:70]}")
        await gerar_audio(frase, destino)

    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifesto, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Manifesto criado: {OUTPUT_DIR / 'manifest.json'}")


if __name__ == "__main__":
    asyncio.run(main())

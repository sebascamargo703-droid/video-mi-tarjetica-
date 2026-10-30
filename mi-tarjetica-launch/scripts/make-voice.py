"""Genera la locución (voz femenina) del video a partir de src/voiceover.json.

Motor: Kokoro-82M (open source, corre local, sin API). Voz "ef_dora" con
fonética de español latinoamericano ("es-419": seseo, sin la z española).

Instalación (una sola vez):
    python3 -m venv .venv-voz
    .venv-voz/bin/pip install kokoro-onnx soundfile
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Uso (desde mi-tarjetica-launch/):
    .venv-voz/bin/python scripts/make-voice.py --models /ruta/a/los/modelos
    .venv-voz/bin/python scripts/make-voice.py --models ... --stories   (historias de Instagram)

Escribe public/voz/<id>.wav, guarda la duración de cada frase en
src/voiceover.json y revisa que ninguna frase se pise con la siguiente.

Si sale "Error processing file .../phontab", instala espeak-ng del sistema y
apunta PHONEMIZER_ESPEAK_LIBRARY a su libespeak-ng.so.
"""
import argparse
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VO_JSON = ROOT / "src" / "voiceover.json"
TIMELINE = ROOT / "src" / "timeline.ts"
OUT = ROOT / "public" / "voz"


def scene_starts():
    """Lee src/timeline.ts y calcula el segundo en que empieza cada escena."""
    src = TIMELINE.read_text()
    total = float(re.search(r"TOTAL_SEC = ([\d.]+)", src).group(1))
    rows = re.findall(
        r'\{ id: "(\w+)", sec: ([\d.]+), out: (null|\{ kind: "\w+", sec: ([\d.]+) \})',
        src,
    )
    starts, t = {}, 0.0
    for sid, sec, _, out in rows:
        starts[sid] = t
        t += float(sec) - (float(out) if out else 0.0)
    return starts, total


def master(x, sr):
    """Limpieza ligera: recorta silencios, quita graves de sobra, comprime suave y normaliza."""
    thr = 0.004 * np.max(np.abs(x))
    idx = np.where(np.abs(x) > thr)[0]
    x = x[max(0, idx[0] - int(0.06 * sr)) : idx[-1] + int(0.18 * sr)]
    # Filtro paso alto de 1er orden (~80 Hz)
    a = np.exp(-2 * np.pi * 80 / sr)
    y = np.zeros_like(x)
    prev_x = prev_y = 0.0
    for i, v in enumerate(x):
        prev_y = a * (prev_y + v - prev_x)
        prev_x = v
        y[i] = prev_y
    # Compresión suave (rodilla blanda) y normalización a -1 dBFS
    y = y / (np.max(np.abs(y)) + 1e-9)
    y = np.tanh(1.6 * y) / np.tanh(1.6)
    y *= 10 ** (-1 / 20)
    fade = int(0.01 * sr)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return y.astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=".", help="carpeta con kokoro-v1.0.onnx y voices-v1.0.bin")
    ap.add_argument("--stories", action="store_true", help="genera la voz de las historias de Instagram")
    args = ap.parse_args()
    models = Path(args.models)
    onnx = next(models.glob("kokoro*.onnx"))
    voices = next(models.glob("voices*.bin"))
    kokoro = Kokoro(str(onnx), str(voices))
    if args.stories:
        return make_stories(kokoro)

    data = json.loads(VO_JSON.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    for line in data["lines"]:
        audio, sr = kokoro.create(
            line["text"], voice=data["voice"], speed=line.get("speed", 1.0), lang=data["lang"]
        )
        audio = master(audio, sr)
        sf.write(OUT / f"{line['id']}.wav", audio, sr)
        line["durationSec"] = round(len(audio) / sr, 3)

    VO_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    starts, total = scene_starts()
    print(f"{'frase':<18}{'empieza':>8}{'termina':>9}  texto")
    prev_end, prev_id = 0.0, None
    for line in data["lines"]:
        start = starts[line["scene"]] + line["at"]
        end = start + line["durationSec"]
        warn = ""
        if prev_id and start < prev_end + 0.15:
            warn = f"  ⚠ se pisa con {prev_id}"
        if end > total:
            warn += "  ⚠ pasa del final"
        print(f"{line['id']:<18}{start:8.2f}{end:9.2f}  {line['text']}{warn}")
        prev_end, prev_id = end, line["id"]


STORIES_JSON = ROOT / "src" / "social" / "instagram" / "voice.json"
STORIES_OUT = ROOT / "public" / "voz-ig"


def make_stories(kokoro):
    """Historias: cada una tiene su duración y sus frases con segundo absoluto."""
    data = json.loads(STORIES_JSON.read_text())
    STORIES_OUT.mkdir(parents=True, exist_ok=True)
    for story in data["stories"]:
        prev_end, prev_id = 0.0, None
        for line in story["lines"]:
            audio, sr = kokoro.create(
                line["text"], voice=data["voice"], speed=line.get("speed", 1.0), lang=data["lang"]
            )
            audio = master(audio, sr)
            sf.write(STORIES_OUT / f"{story['id']}-{line['id']}.wav", audio, sr)
            line["durationSec"] = round(len(audio) / sr, 3)
            end = line["at"] + line["durationSec"]
            warn = ""
            if prev_id and line["at"] < prev_end + 0.15:
                warn = f"  ⚠ se pisa con {prev_id}"
            if end > story["duration"] - 0.8:
                warn += "  ⚠ muy cerca del final de la historia"
            print(f"{story['id']:<20}{line['id']:<3}{line['at']:6.2f}{end:7.2f}  {line['text']}{warn}")
            prev_end, prev_id = end, line["id"]
    STORIES_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

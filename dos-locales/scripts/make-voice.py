"""Genera la locución (voz femenina, español latino) de src/voiceover.json.

Motor: Kokoro-82M (open source, local, sin API), voz "ef_dora", fonética "es-419".
Instalación (una vez):  pip install kokoro-onnx soundfile
  y descarga kokoro-v1.0.onnx + voices-v1.0.bin de
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Uso (desde es-legal/):  python3 scripts/make-voice.py --models /carpeta/con/los/modelos

Escribe public/voz/<id>.wav (sin silencios en los extremos) y guarda en
src/voiceover.json la duración de cada frase ("dur"). El video arma su línea de
tiempo con esas duraciones + "pause", así que si cambias una frase todo se reacomoda.
Algunas palabras van escritas como suenan ("Uálet", "cú erre").
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VO = ROOT / "src" / "voiceover.json"
OUT = ROOT / "public" / "voz"

ap = argparse.ArgumentParser()
ap.add_argument("--models", required=True)
ap.add_argument("--voice", default="ef_dora")
ap.add_argument("--speed", type=float, default=1.1)
args = ap.parse_args()

m = Path(args.models)
onnx = next(p for p in [m / "kokoro-v1.0.onnx", m / "kokoro.onnx"] if p.exists())
voices = next(p for p in [m / "voices-v1.0.bin", m / "voices.bin"] if p.exists())
kokoro = Kokoro(str(onnx), str(voices))
OUT.mkdir(parents=True, exist_ok=True)

items = json.loads(VO.read_text())
for it in items:
    x, sr = kokoro.create(it["say"], voice=args.voice, speed=it.get("speed", args.speed), lang="es-419")
    # recorta silencio de los extremos (umbral -45 dB) dejando 30 ms
    env = np.abs(x) > 10 ** (-45 / 20)
    idx = np.flatnonzero(env)
    a, b = max(0, idx[0] - int(0.03 * sr)), min(len(x), idx[-1] + int(0.03 * sr))
    x = x[a:b]
    fade = int(0.01 * sr)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    sf.write(OUT / f"{it['id']}.wav", x, sr)
    it["dur"] = round(len(x) / sr, 3)
    print(f"{it['id']:7s} {it['dur']:5.2f}s  {it['say']}")

VO.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")
total = sum(i["dur"] + i["pause"] for i in items)
print(f"voz total: {total:.2f}s")

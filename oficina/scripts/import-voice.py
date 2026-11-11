"""Importa una locución grabada aparte (ElevenLabs, locutora…) a public/voz/.

Uso (desde es-legal/):  python3 scripts/import-voice.py <carpeta con q1.mp3, q2.mp3, … cta.mp3>

Cada archivo se convierte a WAV mono 44.1 kHz, se le quitan los silencios de los extremos
(dejando 40 ms) y su duración se guarda como "dur" en src/voiceover.json; el video se
reacomoda solo a la nueva voz. Los ids que falten en la carpeta conservan su audio actual.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
VO = ROOT / "src" / "voiceover.json"
OUT = ROOT / "public" / "voz"
SR = 44100

src = Path(sys.argv[1])
items = json.loads(VO.read_text())
for it in items:
    f = next((src / f"{it['id']}{ext}" for ext in (".mp3", ".wav", ".m4a") if (src / f"{it['id']}{ext}").exists()), None)
    if f is None:
        print(f"{it['id']:7s} (sin archivo, se deja igual)")
        continue
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).copy()
    idx = np.flatnonzero(np.abs(x) > 10 ** (-42 / 20))
    a, b = max(0, idx[0] - int(0.04 * SR)), min(len(x), idx[-1] + int(0.04 * SR))
    x = x[a:b]
    fade = int(0.008 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    sf.write(OUT / f"{it['id']}.wav", x, SR)
    it["dur"] = round(len(x) / SR, 3)
    print(f"{it['id']:7s} {it['dur']:5.2f}s")

VO.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")
print(f"voz total: {sum(i['dur'] + i['pause'] for i in items):.2f}s")

#!/usr/bin/env python3
"""
Genera tiempos EXACTOS palabra por palabra de la locución con Whisper y los
imprime en el formato de src/data/subtitles.ts:  w("palabra", inicioMs, finMs),

Uso (en tu máquina, necesita internet la primera vez para bajar el modelo):
    pip install faster-whisper
    python3 scripts/transcribe-words.py                # modelo "small"
    python3 scripts/transcribe-words.py medium > /tmp/words.txt

Pega la salida dentro de SUBTITLE_WORDS y corrige la ortografía si hace falta
(p. ej. "Mitarjetica" → "MiTarjetica"). Las palabras clave se colorean solas
según ACCENT_KEYWORDS.
"""
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

MODEL = sys.argv[1] if len(sys.argv) > 1 else "small"
SRC = "public/video-base.mp4"

pcm = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", SRC, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
    stdout=subprocess.PIPE,
    check=True,
).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0

model = WhisperModel(MODEL, device="cpu", compute_type="int8")
segments, _ = model.transcribe(
    audio,
    language="es",
    word_timestamps=True,
    initial_prompt="MiTarjetica, Apple Wallet, Google Wallet, base de datos, proximidad, TARJETICA.",
)
for seg in segments:
    print(f"  // {seg.start:.2f}s · {seg.text.strip()}")
    for word in seg.words:
        print(f"  w({json.dumps(word.word.strip(), ensure_ascii=False)}, {round(word.start * 1000)}, {round(word.end * 1000)}),")

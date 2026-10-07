import os
import subprocess
import numpy as np
from faster_whisper import WhisperModel

model = WhisperModel("tiny", device="cpu", compute_type="int8")

for clip in ["IMG_1092.MOV", "IMG_1094.MOV", "IMG_1095.MOV"]:
    filepath = os.path.join("clips_seleccionados", clip)
    cmd = ["ffmpeg", "-y", "-i", filepath, "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    audio_data = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0
    segments, _ = model.transcribe(audio_data, language="es")
    print(f"=== {clip} ({len(audio_data)/16000:.2f}s) ===")
    for s in segments:
        print(f"[{s.start:.2f} -> {s.end:.2f}] {s.text}")

print("=== take8_cta_cierre.mp4 ===")
cmd = ["ffmpeg", "-y", "-i", "public/user_clips/take8_cta_cierre.mp4", "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"]
p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
audio_data = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0
segments, _ = model.transcribe(audio_data, language="es")
for s in segments:
    print(f"[{s.start:.2f} -> {s.end:.2f}] {s.text}")

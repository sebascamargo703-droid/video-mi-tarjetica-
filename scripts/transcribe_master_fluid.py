import json
import numpy as np
import subprocess
from faster_whisper import WhisperModel

model = WhisperModel("tiny", device="cpu", compute_type="int8")

cmd = [
    "ffmpeg", "-y", "-i", "public/user_clips/master_creador_fluid.mp4",
    "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"
]
p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
audio_data = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0

print("Transcribing master_creador_fluid.mp4...")
segments, info = model.transcribe(audio_data, language="es")

subs = []
for s in segments:
    print(f"[{s.start:.2f}s -> {s.end:.2f}s] (frames: {int(s.start*30)} -> {int(s.end*30)}): {s.text.strip()}")
    subs.append({
        "start_sec": s.start,
        "end_sec": s.end,
        "start_frame": int(s.start * 30),
        "end_frame": int(s.end * 30),
        "text": s.text.strip()
    })

with open("master_fluid_subs.json", "w", encoding="utf-8") as f:
    json.dump(subs, f, ensure_ascii=False, indent=2)

print("Saved to master_fluid_subs.json")

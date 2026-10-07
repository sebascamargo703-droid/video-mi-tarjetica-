import os
import subprocess
import numpy as np
from faster_whisper import WhisperModel

model = WhisperModel("tiny", device="cpu", compute_type="int8")
cmd = ["ffmpeg", "-y", "-i", "public/user_clips/master_creador_audio.wav", "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"]
p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
audio_data = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0
segments, _ = model.transcribe(audio_data, language="es")
print("=== Segments of new master fluid audio ===")
for s in segments:
    print(f"[{s.start:.2f}s ({int(s.start*30)}f) -> {s.end:.2f}s ({int(s.end*30)}f)] {s.text}")

import os
import subprocess
import json
import numpy as np
from faster_whisper import WhisperModel

print("Loading Whisper tiny model...")
model = WhisperModel("tiny", device="cpu", compute_type="int8")

clips_dir = "clips_seleccionados"
clips = sorted([f for f in os.listdir(clips_dir) if f.lower().endswith(".mov")])

results = {}

for clip in clips:
    filepath = os.path.join(clips_dir, clip)
    temp_wav = f"scratch_audio_{clip}.wav"
    
    # Extract 16kHz mono wav with ffmpeg
    subprocess.run([
        "ffmpeg", "-y", "-i", filepath,
        "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le",
        "-"
    ], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    # Read raw PCM 16-bit
    cmd = [
        "ffmpeg", "-y", "-i", filepath,
        "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"
    ]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    audio_data = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0

    print(f"\n==========================================")
    print(f"Clip: {clip} (samples={len(audio_data)}, duration={len(audio_data)/16000:.2f}s)")
    segments, info = model.transcribe(audio_data, language="es")
    clip_segments = []
    full_text = []
    for s in segments:
        text = s.text.strip()
        print(f"  [{s.start:.2f}s -> {s.end:.2f}s] {text}")
        clip_segments.append({"start": s.start, "end": s.end, "text": text})
        full_text.append(text)
    
    results[clip] = {
        "full_text": " ".join(full_text),
        "segments": clip_segments
    }

with open("clips_transcriptions.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nFinished all! Saved to clips_transcriptions.json")

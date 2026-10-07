import subprocess
import json
import numpy as np

clips = [
    "IMG_1044.MOV",
    "IMG_1045.MOV",
    "IMG_1046.MOV",
    "IMG_1053.MOV",
    "IMG_1055.MOV",
    "IMG_1056.MOV",
    "IMG_1076.MOV",
    "IMG_1079.MOV",
    "IMG_1082.MOV",
    "IMG_1084.MOV",
    "IMG_1088.MOV",
    "IMG_1092.MOV",
    "IMG_1094.MOV",
]

report = []

for clip in clips:
    filepath = f"clips_seleccionados/{clip}"
    # Read raw audio
    cmd = ["ffmpeg", "-y", "-i", filepath, "-vn", "-ar", "16000", "-ac", "1", "-f", "s16le", "-"]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    samples = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0
    duration = len(samples) / 16000.0

    # Calculate RMS in 100ms windows
    window = 1600
    rms = [np.sqrt(np.mean(samples[i:i+window]**2)) for i in range(0, len(samples), window)]
    threshold = 0.02
    speech_windows = [i for i, r in enumerate(rms) if r > threshold]
    if speech_windows:
        speech_start = speech_windows[0] * 0.1
        speech_end = (speech_windows[-1] + 1) * 0.1
    else:
        speech_start = 0
        speech_end = duration

    report.append({
        "clip": clip,
        "duration": round(duration, 2),
        "speech_start": round(speech_start, 2),
        "speech_end": round(speech_end, 2)
    })

print(json.dumps(report, indent=2))
with open("speech_timing_report.json", "w") as f:
    json.dump(report, f, indent=2)

import subprocess
import json

clips_to_check = [
    ("IMG_1044.MOV", 1.8, 6.6),
    ("IMG_1045.MOV", 1.2, 5.5),
    ("IMG_1046.MOV", 0.5, 4.6),
    ("IMG_1053.MOV", 1.0, 8.5),
    ("IMG_1056.MOV", 0.6, 7.8),
    ("IMG_1076.MOV", 0.8, 7.8),
    ("IMG_1082.MOV", 0.9, 5.8),
    ("IMG_1084.MOV", 0.4, 5.4),
    ("IMG_1088.MOV", 0.5, 3.8),
    ("IMG_1092.MOV", 0.6, 5.8),
    ("IMG_1094.MOV", 0.4, 7.0),
]

for filename, default_start, default_end in clips_to_check:
    filepath = f"clips_seleccionados/{filename}"
    # Use silencedetect with -35dB threshold
    cmd = [
        "ffmpeg", "-i", filepath,
        "-af", "silencedetect=noise=-32dB:d=0.2",
        "-f", "null", "-"
    ]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    lines = [l for l in p.stderr.splitlines() if "silence_" in l]
    print(f"\n=== {filename} ===")
    for l in lines:
        print("  ", l.strip())

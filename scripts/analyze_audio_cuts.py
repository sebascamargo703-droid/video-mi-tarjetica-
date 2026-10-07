import subprocess
import json
import re

candidates = [
    ("IMG_1044.MOV", "01_gancho"),
    ("IMG_1045.MOV", "02_costo_5x"),
    ("IMG_1046.MOV", "03_motivo_volver"),
    ("IMG_1056.MOV", "04_visita_asegurada"),
    ("IMG_1053.MOV", "04_alt_visita"),
    ("IMG_1076.MOV", "05_sellos_premios"),
    ("IMG_1082.MOV", "06_proximidad"),
    ("IMG_1084.MOV", "06_alt_proximidad"),
    ("IMG_1088.MOV", "07_base_datos"),
    ("IMG_1092.MOV", "08_cta_comenta"),
    ("IMG_1094.MOV", "08_alt_cta_enlace"),
]

for filename, label in candidates:
    filepath = f"clips_seleccionados/{filename}"
    cmd = [
        "ffmpeg", "-i", filepath,
        "-af", "silencedetect=noise=-30dB:d=0.3",
        "-f", "null", "-"
    ]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    print(f"\n======================================")
    print(f"File: {filename} ({label})")
    
    # Extract silencedetect output
    silences = []
    for line in p.stderr.splitlines():
        if "silencedetect" in line:
            print(" ", line.strip())

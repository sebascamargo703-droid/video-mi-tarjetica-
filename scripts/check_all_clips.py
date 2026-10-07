import subprocess
import json

clips_config = [
    {"id": "take1_gancho", "src": "clips_seleccionados/IMG_1044.MOV", "start": 2.1, "duration": 4.4},
    {"id": "take2_costo5x", "src": "clips_seleccionados/IMG_1045.MOV", "start": 1.4, "duration": 3.9},
    {"id": "take3_razon_volver", "src": "clips_seleccionados/IMG_1046.MOV", "start": 0.6, "duration": 3.9},
    {"id": "take4_solucion_celular", "src": "clips_seleccionados/IMG_1056.MOV", "start": 0.8, "duration": 6.8},
    {"id": "take5_sellos_premios", "src": "clips_seleccionados/IMG_1076.MOV", "start": 1.0, "duration": 6.6},
    {"id": "take6_proximidad", "src": "clips_seleccionados/IMG_1082.MOV", "start": 1.0, "duration": 4.7},
    {"id": "take7_base_datos", "src": "clips_seleccionados/IMG_1088.MOV", "start": 0.6, "duration": 3.1},
    {"id": "take8_cta_cierre", "src": "clips_seleccionados/IMG_1092.MOV", "start": 0.5, "duration": 6.0},
]

for c in clips_config:
    # check silencedetect on the source clip
    cmd = ["ffmpeg", "-i", c["src"], "-af", "silencedetect=noise=-30dB:d=0.2", "-f", "null", "-"]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    silences = [line for line in p.stderr.splitlines() if "silencedetect" in line]
    print(f"=== {c['id']} ({c['src']}) ===")
    print(f"Config: start={c['start']}, dur={c['duration']} (ends at {c['start']+c['duration']:.2f})")
    for s in silences[:4]:
        print(" ", s)
    if len(silences) > 4:
        print("  ...", silences[-2:])

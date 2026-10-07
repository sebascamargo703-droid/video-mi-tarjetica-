import subprocess
import os
import json

os.makedirs("public/user_clips", exist_ok=True)

clips_config = [
    {
        "id": "take1_gancho",
        "src": "clips_seleccionados/IMG_1044.MOV",
        "start": 2.1,
        "duration": 4.4,
        "text": "No necesitas clientes nuevos, necesitas que los que ya te compraron te vuelvan a elegir."
    },
    {
        "id": "take2_costo5x",
        "src": "clips_seleccionados/IMG_1045.MOV",
        "start": 1.4,
        "duration": 3.9,
        "text": "Conseguir un cliente nuevo cuesta hasta 5 veces más que retener uno actual."
    },
    {
        "id": "take3_razon_volver",
        "src": "clips_seleccionados/IMG_1046.MOV",
        "start": 0.6,
        "duration": 3.9,
        "text": "Si no regresan, no es tu servicio, es que no le estás dando una razón para volver."
    },
    {
        "id": "take4_solucion_celular",
        "src": "clips_seleccionados/IMG_1056.MOV",
        "start": 0.8,
        "duration": 6.8,
        "text": "Haz que cada compra de hoy sea una visita asegurada para mañana con Mi Tarjetica, una tarjeta digital que va en el celular de tus clientes."
    },
    {
        "id": "take5_sellos_premios",
        "src": "clips_seleccionados/IMG_1076.MOV",
        "start": 1.0,
        "duration": 6.6,
        "text": "Premia la fidelidad de tus clientes con una tarjeta en la que acumulan sellos y obtienen descuentos y recompensas."
    },
    {
        "id": "take6_proximidad",
        "src": "clips_seleccionados/IMG_1082.MOV",
        "start": 1.0,
        "duration": 4.7,
        "text": "Con aviso de proximidad, le avisa a tu cliente cada vez que pasa cerca de tu negocio."
    },
    {
        "id": "take7_base_datos",
        "src": "clips_seleccionados/IMG_1088.MOV",
        "start": 0.6,
        "duration": 3.1,
        "text": "Y mantienes una base de datos real actualizada de tu negocio."
    },
    {
        "id": "take8_cta_cierre",
        "src": "clips_seleccionados/IMG_1092.MOV",
        "start": 0.5,
        "duration": 6.0,
        "text": "Deja de perder clientes todos los días. Comenta la palabra TARJETICA y te enviamos toda la información."
    }
]

for item in clips_config:
    out_path = f"public/user_clips/{item['id']}.mp4"
    print(f"Processing {item['id']} from {item['src']} (start={item['start']}, dur={item['duration']})...")
    # Cut, scale to 1080x1920 (crop or scale), audio normalization
    # iPhone video is 3840x2160 with rotation -90, so it renders 2160x3840. We scale to 1080x1920.
    filter_complex = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"
    audio_filter = "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:ss=0:d=0.08,afade=t=out:st={st}:d=0.15".format(st=item['duration']-0.15)
    
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(item['start']),
        "-t", str(item['duration']),
        "-i", item['src'],
        "-vf", filter_complex,
        "-af", audio_filter,
        "-c:v", "libx264", "-preset", "fast", "-crf", "19",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"-> Created {out_path}")

print("\nAll user clips prepared!")

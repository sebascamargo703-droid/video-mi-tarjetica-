import subprocess
import os

clips = [
    "public/user_clips/take1_gancho.mp4",
    "public/user_clips/take2_costo5x.mp4",
    "public/user_clips/take3_razon_volver.mp4",
    "public/user_clips/take4_solucion_celular.mp4",
    "public/user_clips/take5_sellos_premios.mp4",
    "public/user_clips/take6_proximidad.mp4",
    "public/user_clips/take7_base_datos.mp4",
    "public/user_clips/take8_cta_cierre.mp4",
]

# Let's get the exact duration of each clip
durations = []
for c in clips:
    cmd = ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", c]
    res = subprocess.run(cmd, capture_output=True, text=True)
    import json
    d = float(json.loads(res.stdout)["format"]["duration"])
    durations.append(d)

print("Clip durations:", durations)

# We will chain them using xfade and acrossfade with transition=fade (0.15s)
trans_d = 0.15
inputs = []
for c in clips:
    inputs.extend(["-i", c])

# Build filter_complex
# For 8 clips, we have 7 transitions
# Offset for xfade i is: sum(durations[:i+1]) - (i+1)*trans_d
v_filters = []
a_filters = []

last_v = "0:v"
last_a = "0:a"
curr_offset = durations[0] - trans_d

for i in range(1, len(clips)):
    next_v = f"{i}:v"
    next_a = f"{i}:a"
    out_v = f"v{i}"
    out_a = f"a{i}"
    
    # xfade
    v_filters.append(f"[{last_v}][{next_v}]xfade=transition=fade:duration={trans_d}:offset={curr_offset:.3f}[{out_v}]")
    # acrossfade
    a_filters.append(f"[{last_a}][{next_a}]acrossfade=d={trans_d}[{out_a}]")
    
    last_v = out_v
    last_a = out_a
    if i < len(clips) - 1:
        curr_offset += durations[i] - trans_d

filter_str = ";".join(v_filters + a_filters)

out_file = "public/user_clips/master_creador_fluid.mp4"

cmd = [
    "ffmpeg", "-y",
    *inputs,
    "-filter_complex", filter_str,
    "-map", f"[{last_v}]",
    "-map", f"[{last_a}]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
    "-c:a", "aac", "-b:a", "192k",
    "-pix_fmt", "yuv420p",
    out_file
]

print("Running ffmpeg master fluid concatenation...")
subprocess.run(cmd)
print("Finished creating:", out_file)

# Extract audio WAV 48kHz for Remotion Audio component
audio_wav = "public/user_clips/master_creador_audio.wav"
print("Extracting clean 48kHz audio wav to:", audio_wav)
subprocess.run([
    "ffmpeg", "-y", "-i", out_file,
    "-vn", "-ar", "48000", "-ac", "2",
    audio_wav
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Finished extracting audio wav.")

# Check total duration
cmd = ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", out_file]
res = subprocess.run(cmd, capture_output=True, text=True)
total_dur = float(json.loads(res.stdout)["format"]["duration"])
print(f"Total fluid master duration: {total_dur:.2f}s ({int(round(total_dur * 30))} frames @ 30fps)")

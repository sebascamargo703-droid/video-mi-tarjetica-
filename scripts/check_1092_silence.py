import subprocess
import json

cmd = ["ffmpeg", "-i", "clips_seleccionados/IMG_1092.MOV", "-af", "silencedetect=noise=-30dB:d=0.2", "-f", "null", "-"]
p = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
for line in p.stderr.splitlines():
    if "silencedetect" in line:
        print(line)

print("Duration of IMG_1092.MOV:")
cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "clips_seleccionados/IMG_1092.MOV"]
print(subprocess.run(cmd, capture_output=True, text=True).stdout)

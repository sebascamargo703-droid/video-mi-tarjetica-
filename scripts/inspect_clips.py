import os
import subprocess
import json

clips_dir = "clips_seleccionados"
clips = sorted(os.listdir(clips_dir))

for clip in clips:
    if not clip.lower().endswith(".mov"):
        continue
    filepath = os.path.join(clips_dir, clip)
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", filepath
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        data = json.loads(res.stdout)
        duration = float(data.get("format", {}).get("duration", 0))
        v_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), {})
        w = v_stream.get("width")
        h = v_stream.get("height")
        print(f"{clip}: duration={duration:.2f}s, resolution={w}x{h}")

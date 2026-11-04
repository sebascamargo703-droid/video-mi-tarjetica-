"""Mezcla el audio final sin pasar por el navegador (rápido): voz, música con "ducking" y efectos,
con los mismos tiempos que src/timeline.ts y src/DosLocales.tsx. Útil cuando solo cambia el audio:

  python3 scripts/mix-audio.py out/audio-mezcla.wav
  ffmpeg -i out/dos-locales.mp4 -i out/audio-mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k out/final.mp4
"""
import json
import math
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR, FPS, LEAD, TAIL = 48000, 30, 0.3, 2.8
vo = json.loads((ROOT / "src" / "voiceover.json").read_text())
V, t = {}, LEAD
for it in vo:
    V[it["id"]] = {"at": t, "end": t + it["dur"], "dur": it["dur"], "say": it["say"]}
    t += it["dur"] + it["pause"]
DUR = math.ceil((V["h1"]["end"] + TAIL) * 10) / 10
N = round(DUR * FPS)
TOTAL = N / FPS

clean = lambda w: re.sub(r"[^\w]", "", w.lower())
def word_at(i, k):
    words = V[i]["say"].split()
    w = [len(clean(x)) + 1.5 for x in words]
    return V[i]["at"] + sum(w[:k]) / sum(w) * V[i]["dur"] * 0.96
def word_time(i, needle):
    words = [clean(x) for x in V[i]["say"].split()]
    k = next((n for n, x in enumerate(words) if x == needle), None)
    if k is None:
        k = next((n for n, x in enumerate(words) if needle in x), 0)
    return word_at(i, k)

pre = 0.12
S = {"same": V["b1"]["at"] - pre, "diff": V["b2"]["at"] - pre, "leave": V["c1"]["at"] - pre, "card": V["c2"]["at"] - pre,
     "days": V["d1"]["at"] - pre, "notif": word_time("d2", "recuerda") - 0.1, "choice": V["e1"]["at"] - pre,
     "product": V["f1"]["at"] - pre, "you": V["g1"]["at"] - pre, "cta": V["h1"]["at"] - pre}

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

out = np.zeros((int(TOTAL * SR) + SR, 2), np.float32)
def add(sig, at, vol):
    a = int(round(at * FPS)) * SR // FPS  # Remotion arranca cada <Sequence> en un cuadro exacto
    b = min(len(out), a + len(sig))
    if b > a:
        out[a:b] += sig[: b - a] * vol

# música con ducking (misma fórmula que musicVolume en DosLocales.tsx, evaluada por cuadro)
music = load(ROOT / "public" / "music.mp3")
duck, mvol = 0.12, 0.3
env = np.zeros(N)
for f in range(N):
    tt = f / FPS
    speaking = any(V[i]["at"] - 0.15 < tt < V[i]["end"] + 0.15 for i in V)
    near = min(min(abs(tt - V[i]["at"]), abs(tt - V[i]["end"])) for i in V)
    base = duck if speaking else duck + (mvol - duck) * min(1, near / 0.3)
    env[f] = base * min(1, tt / 0.4) * min(1, (TOTAL - tt) / 1.4)
gain = np.repeat(env, SR // FPS)[: len(music)]
m = music[: len(gain)] * gain[:, None]
out[: len(m)] += m

for i in V:
    add(load(ROOT / "public" / "voz" / f"{i}.wav"), V[i]["at"], 1.0)

sfx = ROOT / "public" / "sfx"
W, P, T = 0.32, 0.4, 0.45
for k, at in S.items():
    add(load(sfx / "whoosh-soft.mp3"), at - 0.08, W * 0.35 if k == "notif" else W)
for at, f, vol in [
    (V["a1"]["at"] + 0.6, "pop", P * 0.7), (V["a1"]["at"] + 1.3, "pop", P * 0.5), (word_time("b1", "precios") + 0.25, "pop", P),
    (V["c1"]["at"] + 1.4, "pop", P), (word_time("c2", "razón"), "tap", T), (S["notif"] - 0.35, "ring-pulse", 0.4),
    (S["notif"] + 0.4, "haptic", 0.45 * 0.45), (S["notif"] + 0.45, "notification", 0.5 * 0.4), (V["e1"]["at"] + 0.7, "pop", P * 0.7),
    (word_time("f2", "premios"), "pop", P), (word_time("f2", "avisos"), "notification", 0.5 * 0.7),
    (V["h1"]["at"] + 1.0 + 9 * 3 / 30 + 0.25, "tap", T),
]:
    add(load(sfx / f"{f}.mp3"), at, vol)

out = out[: int(TOTAL * SR)]
peak = np.max(np.abs(out))
if peak > 0.98:
    out *= 0.98 / peak
dst = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "out" / "audio-mezcla.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(dst)], input=out.tobytes(), check=True)
print(f"{dst}  {TOTAL:.2f}s  pico {peak:.2f}")

"""Música y efectos de "Del boceto al 3D" (síntesis desde cero, sin samples).

Pop suave y luminoso a 112 BPM: pluck en arpegio, pad, bajo y batería ligera que entra con el mapa,
más efectos en los momentos clave (zoom, aviso, toque, bajada a la calle, "Aquí", premio, cierre).
Los tiempos salen de src/timeline.ts. Uso (desde boceto/): python3 scripts/make-audio.py
"""
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
src = (ROOT / "src" / "timeline.ts").read_text()
T = {k: float(v) for k, v in re.findall(r"(\w+):\s*([\d.]+),", src.split("export const T")[1])}
DUR = float(re.search(r"DURATION_SEC = ([\d.]+)", src).group(1))
N = int(DUR * SR)
rng = np.random.default_rng(5)
BPM = 112
BEAT = 60 / BPM
out = np.zeros((N, 2))


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    out[i : i + len(sig), 0] += sig * gain * l * 1.41
    out[i : i + len(sig), 1] += sig * gain * r * 1.41


def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def pluck(m, dur=0.6, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * bright * np.sin(4 * np.pi * f * t) * np.exp(-t * 6) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t * 10)
    return s * env(n, 0.003, dur / 3)


def pad(ms, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * t * (1 + d)) for m in ms for d in (-0.003, 0.003))
    e = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    return s * e / (len(ms) * 2)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    s = rng.standard_normal(n)
    s = np.diff(np.concatenate([[0], s]))
    return s * env(n, 0.001, 0.05 if open_ else 0.012)


def clap():
    n = int(0.25 * SR)
    s = rng.standard_normal(n)
    t = np.arange(n) / SR
    e = np.exp(-t * 18) + 0.6 * np.exp(-((t - 0.012) ** 2) / 1e-6)
    return np.convolve(s, np.ones(6) / 6, "same") * e


def whoosh(dur=0.9, up=True):
    n = int(dur * SR)
    s = rng.standard_normal(n)
    t = np.arange(n) / SR
    out_ = np.zeros(n)
    lp = 0.0
    for i in range(n):
        k = t[i] / dur if up else 1 - t[i] / dur
        a = 0.02 + 0.25 * k
        lp += a * (s[i] - lp)
        out_[i] = lp
    return out_ * np.sin(np.pi * t / dur) ** 2 * 3


def ding(m, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5)) * env(n, 0.002, 0.35)


# --- armonía: I–V–vi–IV en Do (luminoso)
prog = [[60, 64, 67, 71], [55, 59, 62, 67], [57, 60, 64, 67], [53, 57, 60, 64]]
bass = [36, 31, 33, 29]
bar = BEAT * 4
start = 0.0
nbars = int(DUR / bar) + 1
for b in range(nbars):
    t0 = start + b * bar
    ch = prog[b % 4]
    add(pad([m + 12 for m in ch[:3]], bar + 0.5), t0, 0.10)
    # arpegio en corcheas
    pat = [0, 1, 2, 3, 2, 1, 2, 3]
    for i, p in enumerate(pat):
        tt = t0 + i * BEAT / 2
        if tt > T["out"] + 1.2:
            break
        add(pluck(ch[p] + 12, 0.5, 0.8), tt, 0.10 if tt > T["mapIn"] - 0.1 else 0.07, pan=(-0.3 if i % 2 else 0.3))
    if t0 >= T["mapIn"] - 0.05:
        for i in range(4):
            add(pluck(bass[b % 4] + (12 if i % 2 else 0), 0.45, 0.3), t0 + i * BEAT, 0.22)
# batería desde el mapa, se corta en el "Aquí" y vuelve en el premio
for i in range(int(DUR / (BEAT / 2))):
    tt = i * BEAT / 2
    on = (T["mapIn"] <= tt < T["aqui"]) or (T["reward"] <= tt < T["out"] + 0.9)
    if not on:
        continue
    if i % 2 == 0:
        add(kick(), tt, 0.55)
    if i % 4 == 2:
        add(clap(), tt, 0.16)
    add(hat(i % 4 == 3), tt, 0.06, pan=0.2)

# --- efectos
add(whoosh(0.85, True), T["zoomIn"], 0.12)
add(ding(84, 1.0), T["mapIn"] + 0.05, 0.10)
add(ding(88, 1.2), T["enter"], 0.16)
add(ding(95, 1.2), T["enter"] + 0.12, 0.12)
add(pluck(91, 0.15, 1.5), T["tap"], 0.14)
add(whoosh(1.3, True), T["swoop"] - 0.1, 0.16)
for k, tt in enumerate(np.arange(T["street"] + 0.4, T["aqui"] - 0.2, 0.75)):
    add(pluck(96, 0.12, 0.5), float(tt), 0.04)  # tic de distancia
add(ding(84, 1.4), T["aqui"], 0.15)
add(ding(91, 1.4), T["aqui"] + 0.1, 0.12)
for i, m in enumerate([84, 88, 91, 96]):
    add(ding(m, 1.0), T["reward"] + 0.45 + i * 0.07, 0.09)
add(whoosh(0.8, False), T["out"] - 0.2, 0.10)
add(ding(79, 2.0), T["out"] + 0.3, 0.12)
add(pad([72, 76, 79], 2.2), T["out"] + 0.3, 0.12)

# salida suave
tt = np.arange(N) / SR
out *= np.minimum(1, (DUR - tt) / 0.8)[:, None] * np.minimum(1, tt / 0.05)[:, None]
out /= max(1e-6, np.abs(out).max()) / 0.9
pcm = (out * 32767).astype(np.int16)
with tempfile.TemporaryDirectory() as d:
    w = Path(d) / "m.wav"
    with wave.open(str(w), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(pcm.tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(w), "-b:a", "192k", str(ROOT / "public" / "music.mp3")], check=True)
print("✓ public/music.mp3", DUR, "s")

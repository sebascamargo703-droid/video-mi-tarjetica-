"""Genera la música y los efectos de Panel desde cero (síntesis, sin samples).

  public/music.mp3             electrónica minimal (~104 BPM): precisión y calma (placeholder)
  public/sfx/whoosh-soft.mp3   entrada y salida del panel
  public/sfx/tick-roll.mp3     ticks suaves que frenan mientras ruedan los odómetros
  public/sfx/draw.mp3          trazo del sparkline
  public/sfx/row.mp3           muy sutil, por cada fila de cliente
  public/sfx/alert-soft.mp3    etiqueta "No ha vuelto" (elegante, no alarmante)
  public/sfx/pop.mp3           etiquetas, punto del sparkline y puntos del logo

Uso (desde panel/):  python3 scripts/make-audio.py
Lee los tiempos de src/timeline.ts. Requiere numpy y `npx remotion ffmpeg`.
"""
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
DUR = 18.0
rng = np.random.default_rng(2026)
BPM = 104.0  # placeholder: electrónica minimal 100–110 BPM
BEAT = 60.0 / BPM
T = {k: float(v) for k, v in re.findall(r"(\w+):\s*([\d.]+),", (ROOT / "src" / "timeline.ts").read_text())}


def t(sec):
    return np.arange(int(SR * sec)) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, cutoff, width=800):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec / (1 + np.exp((f - cutoff) / (width / 6))), n=len(x))


def highpass(x, cutoff, width=800):
    return x - lowpass(x, cutoff, width)


def add(buf, sig, at):
    a = int(round(at * SR))
    if a >= len(buf) or a < 0:
        return
    b = min(len(buf), a + len(sig))
    buf[a:b] += sig[: b - a]


def to_mp3(x, path, peak=0.89):
    st = x if x.ndim == 2 else np.stack([x, x], axis=1)
    st = st / (np.max(np.abs(st)) + 1e-9) * peak
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        with wave.open(tmp.name, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((st * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-c:a", "libmp3lame", "-b:a", "192k", str(path)],
            cwd=ROOT,
            check=True,
        )
    print("✓", path.relative_to(ROOT))



# ---------------- Instrumentos ----------------
def kick(vel=1.0):
    tt = t(0.35)
    f = 44 + 70 * np.exp(-tt * 38)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * vel


def click(vel=1.0):
    tt = t(0.06)
    return (np.sin(2 * np.pi * 2400 * tt) * 0.5 + highpass(rng.standard_normal(len(tt)), 4000) * 0.5) * np.exp(-tt * 120) * vel


def hat(vel=1.0):
    tt = t(0.04)
    return highpass(rng.standard_normal(len(tt)), 8000, 2000) * np.exp(-tt * 110) * 0.16 * vel


def bell(m, dur=1.6, vel=1.0):
    """FM suave tipo campana/Rhodes."""
    tt = t(dur)
    f = hz(m)
    mod = np.sin(2 * np.pi * f * 2 * tt) * 1.6 * np.exp(-tt * 5)
    return np.sin(2 * np.pi * f * tt + mod) * np.exp(-tt * 3.2) * np.minimum(1, tt * 500) * vel


def pad(notes, dur):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for det in (-0.06, 0.06):
            f = hz(m) * 2 ** (det / 12)
            out += np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt) + 0.1 * np.sin(2 * np.pi * 3 * f * tt)
    att, rel = int(min(0.8, dur / 3) * SR), int(min(0.8, dur / 3) * SR)
    env = np.ones(len(tt))
    env[:att] = np.sin(np.linspace(0, np.pi / 2, att)) ** 2
    env[-rel:] *= np.cos(np.linspace(0, np.pi / 2, rel)) ** 2
    return lowpass(out, 1400) * env / len(notes)


def sub(m, dur):
    tt = t(dur)
    return np.sin(2 * np.pi * hz(m) * tt) * np.minimum(1, tt * 200) * np.exp(-tt * 2.2) * np.clip((dur - tt) * 40, 0, 1)


# ---------------- Música: Dm9 – Bbmaj7 – Fmaj7 – C6 ----------------
N = int(SR * DUR)
drums = np.zeros(N)
low = np.zeros(N)
keys = np.zeros(N)
pads = np.zeros(N)
CHORDS = [[50, 57, 60, 64, 65], [46, 53, 57, 62], [41, 53, 57, 60, 64], [48, 55, 57, 64]]
ROOTS = [38, 34, 41, 36]
SEQ = [[74, 72, 69, 76], [74, 70, 69, 72], [72, 69, 67, 76], [72, 67, 69, 74]]
groove_from, groove_to = T["panelIn"], T["panelOut"]
breath = (T["lostTag"] - 0.25, T["lostTag"] + 0.5)  # respira en "No ha vuelto"

bar = 4 * BEAT
for b in range(int(DUR / bar) + 1):
    t0 = b * bar
    ch = b % 4
    add(pads, pad(CHORDS[ch], bar + 0.9), t0)
    for st in range(16):
        at = t0 + st * BEAT / 4
        if at >= DUR:
            break
        groove = groove_from <= at < groove_to and not (breath[0] <= at < breath[1])
        if groove:
            if st % 4 == 0:
                add(drums, kick(0.9), at)
            if st in (4, 12):
                add(drums, click(0.55), at)
            add(drums, hat(1.0 if st % 4 == 2 else 0.45), at)
            if st in (0, 6, 10):
                add(low, sub(ROOTS[ch], BEAT * 0.9), at)
        # secuencia de campanas (corcheas con hueco), presente todo el tiempo
        if st % 2 == 0 and st not in (6, 14) and at < DUR - 1.2:
            add(keys, bell(SEQ[ch][(st // 2) % 4], 1.2, 0.5 if groove else 0.38), at)

# Cierre del CTA: acorde que queda
for i, m in enumerate([62, 65, 69, 72, 76]):
    add(keys, bell(m, 2.6, 0.5), T["cta"] + i * 0.06)

# eco (delay de corchea con puntillo) para las campanas
d = int(BEAT * 0.75 * SR)
echo = np.zeros(N)
echo[d:] += keys[:-d] * 0.35
echo[2 * d :] += keys[: -2 * d] * 0.15
keys = keys + lowpass(echo, 2500)

env = np.ones(N)
for b in range(int(DUR / BEAT) + 1):  # sidechain suave
    at = b * BEAT
    if groove_from <= at < groove_to:
        a = int(at * SR)
        seg = np.arange(min(N - a, int(0.25 * SR))) / SR
        env[a : a + len(seg)] = np.minimum(env[a : a + len(seg)], 1 - 0.35 * np.exp(-seg / 0.08))

mix = drums * 0.7 + low * 0.55 + (pads * 0.3 + keys * 0.32) * env
wide = keys * 0.06
to_mp3(np.stack([mix + wide, mix - wide], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Efectos ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)

dur = 0.8
tt = t(dur)
noise = rng.standard_normal(len(tt))
bands = [lowpass(noise, c) for c in (600, 1600, 4000)]
p = tt / dur
w = bands[0] * np.clip(1 - p * 2, 0, 1) + bands[1] * (1 - np.abs(p * 2 - 1)) + bands[2] * np.clip(p * 2 - 1, 0, 1)
to_mp3(w * np.sin(np.pi * p) ** 1.5, SFX / "whoosh-soft.mp3")

# ticks que se frenan: intervalos de 22 ms a 130 ms
x = np.zeros(int(SR * 1.6))
at, gap, i = 0.0, 0.022, 0
while at < 1.45:
    tt = t(0.03)
    tick = (np.sin(2 * np.pi * 3200 * tt) * 0.5 + highpass(rng.standard_normal(len(tt)), 5000) * 0.5) * np.exp(-tt * 260)
    add(x, tick * (1 - at / 1.6) ** 0.7 * (0.8 + 0.2 * (i % 2)), at)
    at += gap
    gap *= 1.09
    i += 1
to_mp3(x, SFX / "tick-roll.mp3", peak=0.7)

# trazo: tono que sube + roce de lápiz
dur = 1.15
tt = t(dur)
p = tt / dur
tone = np.sin(2 * np.pi * np.cumsum(520 * 2 ** (p * 0.9)) / SR) * 0.35
scratch = lowpass(highpass(rng.standard_normal(len(tt)), 2500), 7000) * 0.25
to_mp3((tone + scratch) * np.sin(np.pi * p) ** 0.8, SFX / "draw.mp3", peak=0.6)

# fila: deslizamiento corto y suave
dur = 0.22
tt = t(dur)
p = tt / dur
to_mp3((lowpass(rng.standard_normal(len(tt)), 2200) * 0.7 + np.sin(2 * np.pi * 1300 * tt) * 0.15) * np.sin(np.pi * p) ** 2, SFX / "row.mp3", peak=0.6)

# alerta suave: dos notas descendentes tipo marimba
x = np.zeros(int(SR * 1.4))
for k, m in enumerate([79, 74]):
    tt = t(1.0)
    note = (np.sin(2 * np.pi * hz(m) * tt) + 0.2 * np.sin(2 * np.pi * hz(m) * 4 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 5) * np.minimum(1, tt * 400)
    add(x, note, k * 0.16)
to_mp3(x, SFX / "alert-soft.mp3", peak=0.75)

tt = t(0.22)
f = 320 + 700 * (1 - np.exp(-tt * 60))
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 250) * 0.3, SFX / "pop.mp3")
print(f"BPM {BPM:g}")

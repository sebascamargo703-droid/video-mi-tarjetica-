"""Audio de relleno para "La silla vacía" (síntesis propia con numpy, sin samples ni derechos de autor).

Genera en /public:
  music.mp3         22 s · noche lo-fi en La menor que se abre a mayor cuando Andrés vuelve
  notification.mp3  vibración doble + "ding"
  door.mp3          pestillo + puerta + campanita
  stamp.mp3         golpe del sello + destello

Los tiempos de la música salen de SCENES / MOMENTS en src/constants.ts, así que
si cambias el ritmo del video basta con volver a correr:  python3 scripts/make-audio.py
Requiere numpy y ffmpeg en el PATH. Puedes reemplazar cualquier archivo por uno tuyo.
"""
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
src = (ROOT / "src" / "constants.ts").read_text()
DUR = float(re.search(r"durationSec:\s*([\d.]+)", src).group(1))
SC = {m.group(1): (float(m.group(2)), float(m.group(3))) for m in re.finditer(r"(\w+):\s*\{\s*from:\s*([\d.]+),\s*to:\s*([\d.]+)\s*\}", src)}
MO = {k: float(v) for k, v in re.findall(r"^\s*(\w+):\s*([\d.]+),\s*(?://.*)?$", src.split("export const MOMENTS")[1].split("} as const")[0], re.M)}
rng = np.random.default_rng(11)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tone(n):
    return np.arange(n) / SR


def pad(notes, dur, attack=1.2, release=1.5, bright=0.0):
    n = int(dur * SR)
    t = tone(n)
    s = np.zeros(n)
    for m in notes:
        for d in (-0.004, 0.0, 0.004):
            f = hz(m) * (1 + d)
            s += np.sin(2 * np.pi * f * t + rng.random() * 6) + bright * 0.3 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / release)
    return s * env / (len(notes) * 3)


def keys(m, dur=2.2, bright=0.5):
    n = int(dur * SR)
    t = tone(n)
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + bright * 0.4 * np.sin(4 * np.pi * f * t) * np.exp(-t * 4) + bright * 0.15 * np.sin(6 * np.pi * f * t) * np.exp(-t * 7)
    return s * np.minimum(1, t / 0.006) * np.exp(-t * 2.4)


def kick(soft=True):
    n = int(0.4 * SR)
    t = tone(n)
    f = 42 + (60 if soft else 100) * np.exp(-t * 26)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)


def noise_sweep(dur, up=True, lo=0.01, hi=0.3):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    y = np.zeros(n)
    lp = 0.0
    for i in range(n):
        k = i / n if up else 1 - i / n
        a = lo + (hi - lo) * k * k
        lp += a * (x[i] - lp)
        y[i] = lp
    return y


def echo(x, delay=0.33, fb=0.38, taps=4):
    y = x.copy()
    d = int(delay * SR)
    for k in range(1, taps + 1):
        if k * d >= len(x):
            break
        y[k * d :] += x[: len(x) - k * d] * fb**k
    return y


def save(name, sig, peak=0.9):
    sig = np.asarray(sig, dtype=float)
    sig = sig / max(1e-9, np.abs(sig).max()) * peak
    pcm = (np.clip(sig, -1, 1) * 32767).astype(np.int16)
    if pcm.ndim == 1:
        pcm = np.stack([pcm, pcm], axis=1)
    with tempfile.TemporaryDirectory() as d:
        w = Path(d) / "a.wav"
        with wave.open(str(w), "wb") as f:
            f.setnchannels(2)
            f.setsampwidth(2)
            f.setframerate(SR)
            f.writeframes(pcm.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(w), "-b:a", "192k", str(ROOT / "public" / name)], check=True)
    print("✓ public/" + name, f"{len(sig) / SR:.1f} s")


# ───────────── música ─────────────
N = int(DUR * SR)
mus = np.zeros(N)


def add(sig, at, gain=1.0):
    i = int(at * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    mus[i : i + len(sig)] += sig * gain


T_CALLE, T_AVISO, T_VUELTA, T_SILLA, T_CIERRE = SC["calle"][0], SC["aviso"][0], SC["vuelta"][0], SC["silla"][0], SC["cierre"][0]
BEAT = 60 / 80  # 80 BPM

# noche: bajo sostenido en La menor y notas sueltas de piano con eco
add(pad([33, 45, 52], T_SILLA + 0.8, attack=1.5, release=1.6), 0, 0.5)
add(pad([57, 60, 64], T_VUELTA - T_CALLE + 1.5, attack=2.5, release=2.0), T_CALLE - 0.5, 0.22)
melody = [(0.4, 69), (1.9, 72), (3.4, 76), (4.9, 74), (6.4, 72), (7.9, 69), (9.4 + 0.6, 76), (11.2, 77), (12.7, 76), (14.2, 72)]
for at, m in melody:
    if at < T_SILLA - 0.6:
        add(echo(keys(m, 2.4, 0.45)), at, 0.26)
# pulso suave que entra en la calle y crece hacia la vuelta
t = T_CALLE + 0.5
while t < T_SILLA - 0.1:
    g = 0.16 + 0.24 * min(1, max(0, (t - T_CALLE) / (T_SILLA - T_CALLE)))
    add(kick(), t, g)
    if t > T_VUELTA:
        add(kick(), t + BEAT / 2, g * 0.6)
    t += BEAT
# arpegio en la vuelta + subida hacia el momento en que entra
arp = [57, 64, 69, 72, 76, 72, 69, 64]
t, i = T_VUELTA + 0.4, 0
while t < T_SILLA - 0.3:
    add(keys(arp[i % len(arp)] + 12, 0.7, 0.8), t, 0.12 + 0.1 * (t - T_VUELTA) / (T_SILLA - T_VUELTA))
    t += BEAT / 2
    i += 1
add(noise_sweep(1.6, True) * np.linspace(0, 1, int(1.6 * SR)) ** 2, T_SILLA - 1.6, 0.5)
# la silla se llena: acorde mayor cálido (La mayor) que florece, con brillo
add(pad([45, 57, 61, 64, 69], DUR - T_SILLA + 0.2, attack=0.5, release=1.6, bright=0.6), T_SILLA, 0.85)
add(pad([73, 76, 81], DUR - T_SILLA, attack=1.4, release=1.8, bright=0.4), T_SILLA + 0.2, 0.3)
for k, m in enumerate([69, 73, 76, 81, 85]):
    add(echo(keys(m, 2.0, 0.9), 0.25, 0.4), T_SILLA + 0.1 + k * 0.14, 0.2)
t = T_SILLA
while t < T_CIERRE + 1.2:
    add(kick(), t, 0.3)
    t += BEAT
for at, m in [(T_CIERRE + 0.3, 81), (T_CIERRE + 1.0, 85), (T_CIERRE + 1.7, 88)]:
    add(echo(keys(m, 2.2, 0.7)), at, 0.16)
tt = tone(N)
mus *= np.minimum(1, tt / 0.4) * np.minimum(1, (DUR - tt) / 1.0)
save("music.mp3", mus, 0.85)

# ───────────── notificación: dos vibraciones + ding ─────────────
n = int(1.5 * SR)
s = np.zeros(n)
for at in (0.0, 0.2):
    m = int(0.13 * SR)
    t = tone(m)
    buzz = np.sign(np.sin(2 * np.pi * 150 * t)) * 0.5 + np.sin(2 * np.pi * 75 * t)
    i = int(at * SR)
    s[i : i + m] += buzz * np.minimum(1, t / 0.01) * np.minimum(1, (0.13 - t) / 0.02) * 0.5
for at, m_ in ((0.04, 88), (0.19, 93)):
    k = keys(m_, 1.2, 0.9)
    i = int(at * SR)
    s[i : i + len(k)] += k[: n - i] * 0.9
save("notification.mp3", s)

# ───────────── puerta: pestillo + bisagra + campanita ─────────────
n = int(1.8 * SR)
s = np.zeros(n)
click = rng.standard_normal(int(0.03 * SR)) * np.exp(-tone(int(0.03 * SR)) * 180)
s[: len(click)] += click * 0.9
m = int(0.7 * SR)
t = tone(m)
creak = np.sin(2 * np.pi * np.cumsum(180 + 90 * np.sin(2 * np.pi * 3 * t) + 60 * t) / SR) * 0.12 + noise_sweep(0.7, True, 0.02, 0.12)[:m] * 0.5
i = int(0.06 * SR)
s[i : i + m] += creak * np.sin(np.pi * t / 0.7) ** 2 * 0.6
for at, mm in ((0.42, 96), (0.52, 100), (0.66, 96)):
    k = keys(mm, 1.0, 1.0)
    i = int(at * SR)
    s[i : i + len(k)] += k[: n - i] * 0.35
save("door.mp3", s)

# ───────────── sello: golpe + destello ─────────────
n = int(1.5 * SR)
s = np.zeros(n)
m = int(0.35 * SR)
t = tone(m)
thump = np.sin(2 * np.pi * np.cumsum(55 + 130 * np.exp(-t * 30)) / SR) * np.exp(-t * 10)
s[:m] += thump
tick = rng.standard_normal(int(0.02 * SR)) * np.exp(-tone(int(0.02 * SR)) * 250)
s[: len(tick)] += tick * 0.6
for k, mm in enumerate((84, 88, 91, 96, 100)):
    kk = keys(mm, 1.0, 1.0)
    i = int((0.07 + k * 0.055) * SR)
    s[i : i + len(kk)] += kk[: n - i] * 0.3
save("stamp.mp3", s)

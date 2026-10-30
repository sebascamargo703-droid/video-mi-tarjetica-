"""Genera la música, el ambiente de calle y los efectos de PasoCerca desde cero (síntesis).

  public/music.mp3              groove nocturno lounge/afrobeat suave (placeholder, ~100 BPM)
  public/sfx/street.mp3         ambiente de calle muy sutil (escena del mapa)
  public/sfx/ring-pulse.mp3     al entrar en la geocerca
  public/sfx/whoosh-soft.mp3    zoom al celular
  public/sfx/haptic.mp3         vibración (3 pulsos)
  public/sfx/notification.mp3   la notificación
  public/sfx/tap.mp3            toque sobre la notificación
  public/sfx/pop.mp3            micheladas y badge

Uso (desde paso-cerca/):  python3 scripts/make-audio.py
Requiere numpy y `npx remotion ffmpeg` (viene con @remotion/cli).
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
rng = np.random.default_rng(42)
BPM = float(re.search(r"bpm:\s*([\d.]+)", (ROOT / "src" / "brand.ts").read_text()).group(1))
BEAT = 60.0 / BPM
STEP = BEAT / 4


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
    a = int(at * SR)
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
def kick():
    tt = t(0.4)
    f = 48 + 90 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 300) * 0.15


def rim():
    tt = t(0.12)
    return (np.sin(2 * np.pi * 820 * tt) * 0.6 + highpass(rng.standard_normal(len(tt)), 2500) * 0.4) * np.exp(-tt * 55)


def shaker(acc=1.0):
    tt = t(0.07)
    n = highpass(rng.standard_normal(len(tt)), 6000, 2000)
    env = np.minimum(1, tt * 300) * np.exp(-tt * 60)
    return n * env * 0.22 * acc


def conga(m):
    tt = t(0.3)
    f = hz(m) * (1 + 0.25 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14) * 0.6


def rhodes(notes, dur):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        f = hz(m)
        out += (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 6) + 0.12 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 10))
    trem = 1 + 0.18 * np.sin(2 * np.pi * 4.5 * tt)
    env = np.minimum(1, tt * 200) * np.exp(-tt * 1.6)
    return out * env * trem


def bass(m, dur):
    tt = t(dur)
    return (np.sin(2 * np.pi * hz(m) * tt) + 0.2 * np.sin(2 * np.pi * 2 * hz(m) * tt)) * np.minimum(1, tt * 150) * np.exp(-tt * 3)


def marimba(m, dur=0.6):
    tt = t(dur)
    f = hz(m)
    return (np.sin(2 * np.pi * f * tt) + 0.22 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 40)) * np.exp(-tt * 8) * np.minimum(1, tt * 400)


# ---------------- Música ----------------
N = int(SR * DUR)
drums = np.zeros(N)
keys = np.zeros(N)
low = np.zeros(N)
chords = [[57, 60, 64, 67, 71], [50, 54, 57, 60, 64], [53, 57, 60, 64, 67], [52, 56, 59, 62, 65]]  # Am9 D9 Fmaj9 E7
roots = [45, 38, 41, 40]
bass_steps = [0, 3, 6, 10, 14]
kick_steps = [0, 6, 10]
rim_steps = [4, 12]
conga_steps = {3: 64, 7: 62, 11: 64, 14: 59}
chord_steps = [2, 7, 11]
drums_in = 2.0
phone_drop = (7.1, 8.4)  # respira justo antes de la notificación
cta = 15.0

n_bars = int(DUR / (BEAT * 4)) + 1
for bar in range(n_bars):
    b0 = bar * 4 * BEAT
    ch = bar % 4
    for st in range(16):
        tt0 = b0 + st * STEP
        if tt0 >= DUR:
            break
        swing = STEP * 0.12 if st % 2 == 1 else 0
        at = tt0 + swing
        full = drums_in <= tt0 < cta
        drop = phone_drop[0] <= tt0 < phone_drop[1]
        if full and not drop:
            if st in kick_steps:
                add(drums, kick(), at)
            if st in rim_steps:
                add(drums, rim() * 0.5, at)
            if st in conga_steps:
                add(drums, conga(conga_steps[st]), at)
        if tt0 < cta:
            add(drums, shaker(1.0 if st % 4 == 2 else 0.55), at)
            if st in chord_steps:
                add(keys, rhodes(chords[ch], 0.9) * (0.5 if tt0 < drums_in else 0.75), at)
            if st in bass_steps and tt0 >= drums_in and not drop:
                add(low, bass(roots[ch] + (12 if st == 14 else 0), 0.45), at)

# Final del CTA: acorde que queda sonando
add(keys, rhodes([57, 64, 67, 71, 76], 3.0) * 1.1, cta)
add(low, bass(45, 2.5), cta)
add(drums, kick(), cta)
# Acento cuando aparece la notificación
for i, m in enumerate([76, 81, 84]):
    add(keys, marimba(m) * 0.5, 8.45 + i * 0.09)

keys = lowpass(keys, 3500)
intro = np.interp(np.arange(N) / SR, [0, drums_in - 0.2, drums_in], [1, 1, 0])
keys = lowpass(keys, 1200) * intro + keys * (1 - intro)
mix = drums * 0.8 + keys * 0.5 + low * 0.6
left = mix + keys * 0.05
right = mix - keys * 0.05
to_mp3(np.stack([left, right], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Ambiente de calle ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)
dur = 6.0
n = int(SR * dur)
brown = np.cumsum(rng.standard_normal(n))
brown = highpass(brown - np.mean(brown), 40)
amb = lowpass(brown, 500)
amb /= np.max(np.abs(amb)) + 1e-9
murmur = lowpass(highpass(rng.standard_normal(n), 300), 1100) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * np.arange(n) / SR + 1.3) ** 2)
street = amb * 0.6 + murmur / (np.max(np.abs(murmur)) + 1e-9) * 0.25
for center, width in [(1.6, 2.2), (4.3, 2.6)]:  # dos carros pasando a lo lejos
    tt = np.arange(n) / SR
    env = np.exp(-(((tt - center) / (width / 3)) ** 2))
    car = lowpass(rng.standard_normal(n), 900) * env
    street += car / (np.max(np.abs(car)) + 1e-9) * 0.45
to_mp3(street, SFX / "street.mp3", peak=0.6)

# ---------------- Efectos ----------------
tt = t(1.6)
sweep = np.sin(2 * np.pi * np.cumsum(220 + 260 * (1 - np.exp(-tt * 3))) / SR) * np.exp(-tt * 2.2)
boom = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 5)
shimmer = highpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 3) * 0.1
to_mp3(sweep * 0.6 + boom * 0.7 + shimmer + marimba(81, 1.6) * 0.35, SFX / "ring-pulse.mp3")

dur = 0.75
tt = t(dur)
noise = rng.standard_normal(len(tt))
bands = [lowpass(noise, c) for c in (600, 1600, 4000)]
p = tt / dur
w = bands[0] * np.clip(1 - p * 2, 0, 1) + bands[1] * (1 - np.abs(p * 2 - 1)) + bands[2] * np.clip(p * 2 - 1, 0, 1)
to_mp3(w * np.sin(np.pi * p) ** 1.5, SFX / "whoosh-soft.mp3")

x = np.zeros(int(SR * 0.45))
for i in range(3):
    tt = t(0.075)
    buzz = np.sign(np.sin(2 * np.pi * 165 * tt)) * 0.5 + np.sin(2 * np.pi * 165 * tt) * 0.5
    add(x, lowpass(buzz, 900) * np.sin(np.pi * tt / 0.075), i * 0.12)
to_mp3(x, SFX / "haptic.mp3")

x = np.zeros(int(SR * 1.1))
for i, m in enumerate([88, 95]):
    tt = t(0.9)
    add(x, (np.sin(2 * np.pi * hz(m) * tt) + 0.3 * np.sin(2 * np.pi * hz(m) * 2.01 * tt)) * np.exp(-tt * 6) * np.minimum(1, tt * 400), i * 0.13)
to_mp3(x, SFX / "notification.mp3")

tt = t(0.12)
to_mp3(np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt * 70) * 0.6 + highpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.5, SFX / "tap.mp3")

tt = t(0.24)
f = 300 + 650 * (1 - np.exp(-tt * 60))
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 20) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 250) * 0.3, SFX / "pop.mp3")
print(f"BPM {BPM:g}")

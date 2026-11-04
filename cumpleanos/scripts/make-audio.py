"""Genera la música y los efectos de Cumpleanos desde cero (síntesis, sin samples).

  public/music.mp3              piano + cuerdas suaves con pulso ligero (~94 BPM, placeholder)
  public/sfx/tick.mp3           tick suave de cada día del calendario
  public/sfx/whoosh-soft.mp3    zoom al celular
  public/sfx/haptic.mp3         vibración (3 pulsos)
  public/sfx/notification.mp3   la notificación
  public/sfx/sparkle.mp3        destellos dorados
  public/sfx/tap.mp3            toque sobre la notificación
  public/sfx/pop.mp3            día del cumpleaños, esmalte y badge

Uso (desde cumpleanos/):  python3 scripts/make-audio.py
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
rng = np.random.default_rng(1014)
BPM = float(re.search(r"bpm:\s*([\d.]+)", (ROOT / "src" / "brand.ts").read_text()).group(1))
BEAT = 60.0 / BPM


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
def piano(m, dur=1.6, vel=1.0):
    tt = t(dur)
    f = hz(m)
    partials = [(1, 1.0, 2.2), (2, 0.42, 3.5), (3, 0.2, 5.0), (4, 0.1, 7.0), (5, 0.05, 9.0)]
    out = sum(a * np.sin(2 * np.pi * f * k * tt * (1 + 0.0004 * k * k)) * np.exp(-tt * d) for k, a, d in partials)
    hammer = lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 120) * 0.08
    return (out + hammer) * np.minimum(1, tt * 600) * vel


def strings(notes, dur):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for det in (-0.07, 0.0, 0.07):
            f = hz(m) * 2 ** (det / 12)
            vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * tt)
            for h in range(1, 7):
                out += np.sin(2 * np.pi * f * h * np.cumsum(vib) / SR) / (h**1.2)
    att = int(min(1.2, dur / 3) * SR)
    env = np.ones(len(tt))
    env[:att] = np.sin(np.linspace(0, np.pi / 2, att)) ** 2
    rel = int(min(1.0, dur / 3) * SR)
    env[-rel:] *= np.cos(np.linspace(0, np.pi / 2, rel)) ** 2
    return lowpass(out * env, 1800)


def soft_kick():
    tt = t(0.35)
    f = 50 + 70 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)


def brush():
    tt = t(0.18)
    return highpass(rng.standard_normal(len(tt)), 4000, 2000) * np.minimum(1, tt * 80) * np.exp(-tt * 18) * 0.25


# ---------------- Música (F mayor: Fmaj7 – Dm9 – Bbmaj7 – Csus/C) ----------------
N = int(SR * DUR)
keys = np.zeros(N)
pad = np.zeros(N)
pulse = np.zeros(N)
chords = [[53, 57, 60, 64], [50, 53, 57, 60, 64], [46, 50, 53, 57], [48, 53, 55, 60]]
arp = [[65, 69, 72, 76], [62, 65, 69, 72], [58, 62, 65, 69], [60, 65, 67, 72]]
bar = 4 * BEAT
n_bars = int(DUR / bar) + 1
pulse_from, pulse_to = 3.0, 15.0
for b in range(n_bars):
    t0 = b * bar
    if t0 >= 15.0:
        break
    ch = b % 4
    add(pad, strings(chords[ch], bar + 0.6), t0)
    add(keys, piano(chords[ch][0] - 12, 2.4, 0.8), t0)
    for k in range(8):  # arpegio en corcheas
        at = t0 + k * BEAT / 2
        if at >= 15.0:
            break
        note = arp[ch][[0, 1, 2, 3, 2, 1, 2, 3][k]]
        add(keys, piano(note, 1.4, 0.55 if k % 2 else 0.7), at)
    for k in range(4):
        at = t0 + k * BEAT
        if pulse_from <= at < pulse_to and not (8.6 <= at < 9.3):
            if k in (0, 2):
                add(pulse, soft_kick(), at)
            add(pulse, brush(), at + BEAT / 2)

# Momento de la notificación: acorde brillante. Cierre: acorde largo.
for i, m in enumerate([77, 81, 84, 89]):
    add(keys, piano(m, 2.0, 0.6), 9.0 + i * 0.07)
add(pad, strings([53, 60, 65, 69, 72], 3.2) * 1.2, 15.0)
add(keys, piano(41, 3.0, 0.9), 15.0)
add(keys, piano(65, 3.0, 0.6), 15.0)

intro = np.interp(np.arange(N) / SR, [0, 2.8, 3.1], [1, 1, 0])
pad_mix = lowpass(pad, 900) * intro + pad * (1 - intro)
mix = keys * 0.55 + pad_mix * 0.16 + pulse * 0.45
to_mp3(np.stack([mix + keys * 0.05, mix - keys * 0.05], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Efectos ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)

tt = t(0.14)
tick = np.sin(2 * np.pi * 1450 * tt) * np.exp(-tt * 60) * 0.6 + np.sin(2 * np.pi * 2900 * tt) * np.exp(-tt * 90) * 0.2
to_mp3(tick + highpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 400) * 0.2, SFX / "tick.mp3")

dur = 0.8
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

x = np.zeros(int(SR * 1.8))
for i, m in enumerate([96, 100, 103, 108, 103, 108, 112]):
    tt = t(0.6)
    add(x, np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 9) * np.minimum(1, tt * 500) * (0.5 + 0.1 * (i % 3)), 0.03 + i * 0.13 + rng.random() * 0.04)
x += highpass(rng.standard_normal(len(x)), 8000) * np.exp(-np.arange(len(x)) / SR * 2.5) * 0.05
to_mp3(x, SFX / "sparkle.mp3", peak=0.7)

tt = t(0.12)
to_mp3(np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt * 70) * 0.6 + highpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.5, SFX / "tap.mp3")

tt = t(0.24)
f = 300 + 650 * (1 - np.exp(-tt * 60))
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 20) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 250) * 0.3, SFX / "pop.mp3")
print(f"BPM {BPM:g}")

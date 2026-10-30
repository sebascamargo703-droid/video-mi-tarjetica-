"""Genera la música y los efectos de Lavadero desde cero (síntesis, sin samples).

  public/music.mp3              pop alegre (~116 BPM) con pausa suave a los 11 s y golpe a los 13.5 s
  public/sfx/engine.mp3         arranque suave del carro
  public/sfx/water.mp3          agua del lavado (se recorta por pasada)
  public/sfx/brush.mp3          cepillos girando
  public/sfx/bubble-pop.mp3     burbuja que revienta
  public/sfx/sparkle.mp3        el carro sale limpio
  public/sfx/drop.mp3           cada gota que llega a la tarjeta
  public/sfx/unlock.mp3         premio disponible
  public/sfx/reverse-beep.mp3   la reversa

Uso (desde lavadero/):  python3 scripts/make-audio.py
Lee los tiempos de src/timeline.ts (slowFrom, prize…). Requiere numpy y `npx remotion ffmpeg`.
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
rng = np.random.default_rng(10)
BPM = 116.0  # placeholder: pop alegre 110–120 BPM
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
    f = 48 + 100 * np.exp(-tt * 34)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8) + lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.15) * vel


def clap(vel=1.0):
    x = np.zeros(int(SR * 0.25))
    for k, d in enumerate([0, 0.01, 0.021]):
        tt = t(0.25 - d)
        add(x, lowpass(highpass(rng.standard_normal(len(tt)), 1000), 7000) * np.exp(-tt * (90 if k < 2 else 18)) * 0.6, d)
    return x * vel


def hat(vel=1.0):
    tt = t(0.05)
    return highpass(rng.standard_normal(len(tt)), 8000, 2000) * np.exp(-tt * 90) * 0.2 * vel


def pluck(m, dur=0.35, vel=1.0):
    tt = t(dur)
    f = hz(m)
    x = sum(np.sin(2 * np.pi * f * h * tt) * np.exp(-tt * (9 + 6 * h)) / h for h in range(1, 6))
    return x * np.minimum(1, tt * 900) * vel


def bass(m, dur):
    tt = t(dur)
    f = hz(m)
    x = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 6)
    return x * np.minimum(1, tt * 300) * np.exp(-tt * 3) * np.clip((dur - tt) * 60, 0, 1)


def pad(notes, dur, bright=1400):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for det in (-0.08, 0.08):
            f = hz(m) * 2 ** (det / 12)
            out += np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)
    att, rel = int(min(0.4, dur / 3) * SR), int(min(0.6, dur / 3) * SR)
    env = np.ones(len(tt))
    env[:att] = np.sin(np.linspace(0, np.pi / 2, att)) ** 2
    env[-rel:] *= np.cos(np.linspace(0, np.pi / 2, rel)) ** 2
    return lowpass(out, bright) * env / len(notes)


def bell(m, dur=1.2, vel=1.0):
    tt = t(dur)
    f = hz(m)
    return np.sin(2 * np.pi * f * tt + np.sin(2 * np.pi * f * 3.5 * tt) * 1.2 * np.exp(-tt * 6)) * np.exp(-tt * 3.5) * np.minimum(1, tt * 600) * vel


# ---------------- Música: C – G – Am – F ----------------
N = int(SR * DUR)
drums = np.zeros(N)
low = np.zeros(N)
keys = np.zeros(N)
pads = np.zeros(N)
CH = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65]]
ROOTS = [36, 43, 45, 41]
MEL = [[72, 76, 79, 76], [74, 79, 74, 71], [72, 76, 81, 76], [77, 72, 69, 72]]
pause_from, hit = T["slowFrom"], T["prize"]
outro = T["sceneOut"]
intro_end = T["carIn"]

bar = 4 * BEAT
for b in range(int(DUR / bar) + 1):
    t0 = b * bar
    ch = b % 4
    for st in range(16):
        at = t0 + st * BEAT / 4
        if at >= DUR:
            break
        paused = pause_from <= at < hit
        full = intro_end <= at < outro and not paused
        if full or (at < intro_end and st % 8 == 0) or (at >= outro and st % 8 == 0 and at < DUR - 1.2):
            if st % 4 == 0:
                add(drums, kick(0.95 if full else 0.6), at)
        if full:
            if st in (4, 12):
                add(drums, clap(0.75), at)
            add(drums, hat(1.0 if st % 4 == 2 else 0.5), at)
            if st in (0, 3, 6, 8, 11, 14):
                add(low, bass(ROOTS[ch] + (12 if st in (6, 14) else 0), BEAT * 0.45), at)
        if not paused and st % 2 == 0 and at < DUR - 1.0:
            m = MEL[ch][(st // 2) % 4] if st % 4 == 0 else CH[ch][(st // 2) % 3] + 12
            add(keys, pluck(m, 0.35, 0.55 if full else 0.4), at)
    if not (pause_from <= t0 < hit):
        add(pads, pad(CH[ch], bar + 0.4), t0)

# Pausa suave: un acorde sostenido y unas campanitas lentas mientras va la cámara lenta
add(pads, pad([60, 64, 67, 72], hit - pause_from + 0.4, 1000) * 1.4, pause_from)
for i, m in enumerate([79, 84, 88, 91]):
    add(keys, bell(m, 1.6, 0.35), pause_from + 0.3 + i * 0.55)
# Golpe a los 13.5 s
add(drums, kick(1.3), hit)
crash = highpass(rng.standard_normal(int(SR * 1.8)), 5000, 3000) * np.exp(-np.arange(int(SR * 1.8)) / SR * 2.5) * 0.5
add(drums, crash, hit)
add(low, bass(36, 1.2) * 1.3, hit)
for i, m in enumerate([72, 76, 79, 84]):
    add(keys, bell(m, 1.4, 0.45), hit + i * 0.03)
# Cierre del CTA
for i, m in enumerate([60, 67, 72, 76, 79]):
    add(keys, bell(m, 2.2, 0.35), outro + 0.25 + i * 0.05)

env = np.ones(N)
for b in range(int(DUR / BEAT) + 1):
    at = b * BEAT
    if intro_end <= at < outro and not (pause_from <= at < hit):
        a = int(at * SR)
        seg = np.arange(min(N - a, int(0.2 * SR))) / SR
        env[a : a + len(seg)] = np.minimum(env[a : a + len(seg)], 1 - 0.4 * np.exp(-seg / 0.06))

mix = drums * 0.7 + low * 0.6 + (pads * 0.28 + keys * 0.34) * env
wide = keys * 0.07
to_mp3(np.stack([mix + wide, mix - wide], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Efectos ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)

# motor: ronroneo que sube suave
dur = 1.6
tt = t(dur)
f0 = 38 + 22 * np.clip(tt / 0.6, 0, 1) - 6 * np.clip((tt - 0.9) / 0.7, 0, 1)
ph = 2 * np.pi * np.cumsum(f0) / SR
rumble = np.sign(np.sin(ph)) * 0.4 + np.sin(ph) * 0.6 + np.sin(2 * ph) * 0.3
x = lowpass(rumble, 500) * np.minimum(1, tt * 4) * np.clip((dur - tt) / 0.5, 0, 1)
to_mp3(x, SFX / "engine.mp3", peak=0.75)

# agua: ruido filtrado con gorgoteo
dur = 2.0
tt = t(dur)
n = lowpass(highpass(rng.standard_normal(len(tt)), 600), 7000)
gurgle = sum(np.sin(2 * np.pi * (300 + 500 * rng.random()) * tt + rng.random() * 6) * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + 4 * rng.random()) * tt)) for _ in range(6)) * 0.04
x = (n * 0.5 + gurgle) * np.minimum(1, tt * 20) * np.clip((dur - tt) * 8, 0, 1)
to_mp3(x, SFX / "water.mp3", peak=0.7)

# cepillos: zumbido con frote rítmico
dur = 1.8
tt = t(dur)
swish = lowpass(highpass(rng.standard_normal(len(tt)), 1200), 4000) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt) ** 2)
hum = np.sin(2 * np.pi * 90 * tt) * 0.15
to_mp3((swish * 0.5 + hum) * np.minimum(1, tt * 10) * np.clip((dur - tt) * 6, 0, 1), SFX / "brush.mp3", peak=0.6)

# burbuja que revienta
tt = t(0.12)
f = 900 + 1800 * np.exp(-tt * 70)
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 45) + highpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 400) * 0.4, SFX / "bubble-pop.mp3", peak=0.7)

# destellos
x = np.zeros(int(SR * 1.3))
for i, m in enumerate([96, 100, 103, 108, 103, 108]):
    tt = t(0.6)
    add(x, np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 9) * np.minimum(1, tt * 500) * (0.5 + 0.1 * (i % 3)), 0.02 + i * 0.1)
to_mp3(x, SFX / "sparkle.mp3", peak=0.7)

# gota: "plip" con caída de tono
tt = t(0.3)
f = 500 + 1300 * np.exp(-tt * 28)
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 16) * np.minimum(1, tt * 2000), SFX / "drop.mp3", peak=0.8)

# premio desbloqueado: arpegio brillante + campana
x = np.zeros(int(SR * 1.6))
for i, m in enumerate([72, 76, 79, 84, 88]):
    add(x, bell(m, 1.2, 0.8), i * 0.07)
to_mp3(x, SFX / "unlock.mp3")

# reversa: tres bips amables
x = np.zeros(int(SR * 1.2))
for i in range(3):
    tt = t(0.16)
    add(x, (np.sin(2 * np.pi * 1250 * tt) + 0.2 * np.sin(2 * np.pi * 2500 * tt)) * np.minimum(1, tt * 300) * np.clip((0.16 - tt) * 60, 0, 1), i * 0.36)
to_mp3(x, SFX / "reverse-beep.mp3", peak=0.6)
print(f"BPM {BPM:g}")

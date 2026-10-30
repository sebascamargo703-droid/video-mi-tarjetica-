"""Genera la música y los efectos del video TapSello desde cero (síntesis, sin samples).

Lee el BPM y los beats de los taps de src/brand.ts para que la música marque
exactamente los toques y los sellos. Escribe:
  public/music.mp3                 beat minimal y pegajoso (placeholder; cámbialo por uno con licencia)
  public/sfx/tap.mp3               cada toque en "+1 sello"
  public/sfx/whoosh-soft.mp3       el sello viajando
  public/sfx/pop.mp3               el sello llenándose
  public/sfx/unlock.mp3            premio desbloqueado
  public/sfx/notification.mp3      la notificación

Uso (desde tap-sello/):  python3 scripts/make-audio.py
Requiere numpy y que `npx remotion ffmpeg` funcione (viene con @remotion/cli).
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
rng = np.random.default_rng(104)

brand_src = (ROOT / "src" / "brand.ts").read_text()
BPM = float(re.search(r"bpm:\s*([\d.]+)", brand_src).group(1))
TAP_BEATS = [int(x) for x in re.search(r"tapBeats:\s*\[([^\]]+)\]", brand_src).group(1).split(",")]
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
    if a >= len(buf):
        return
    b = min(len(buf), a + len(sig))
    buf[a:b] += sig[: b - a]


def to_mp3(x, path):
    """Normaliza y codifica a MP3. `x` puede ser mono (N,) o estéreo (N, 2)."""
    st = x if x.ndim == 2 else np.stack([x, x], axis=1)
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.89
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
    tt = t(0.42)
    f = 46 + 110 * np.exp(-tt * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7.5)
    click = lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 260) * 0.25
    return body + click


def snap():
    tt = t(0.22)
    n = highpass(rng.standard_normal(len(tt)), 1400)
    tone = np.sin(2 * np.pi * 220 * tt) * np.exp(-tt * 40) * 0.25
    env = np.exp(-tt * 26)
    # doble ataque tipo "clap" suave
    env2 = np.concatenate([np.zeros(int(0.012 * SR)), env[: len(tt) - int(0.012 * SR)]])
    return n * (env * 0.6 + env2 * 0.5) * 0.55 + tone


def hat(open_=False):
    tt = t(0.18 if open_ else 0.06)
    n = highpass(rng.standard_normal(len(tt)), 7500, 1500)
    return n * np.exp(-tt * (18 if open_ else 70)) * 0.35


def marimba(m, dur=0.5):
    tt = t(dur)
    f = hz(m)
    return (np.sin(2 * np.pi * f * tt) + 0.22 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 40)) * np.exp(-tt * 9) * np.minimum(1, tt * 400)


def pad_chord(notes, dur):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for d in (-0.08, 0.08):
            f = hz(m) * 2 ** (d / 12)
            for h in range(1, 6):
                out += np.sin(2 * np.pi * f * h * tt + h) / (h**1.3)
    att = int(0.35 * SR)
    env = np.ones(len(tt))
    env[:att] = np.linspace(0, 1, att)
    env[-att:] *= np.linspace(1, 0, att)
    return lowpass(out * env, 1300)


def bass(m, dur):
    tt = t(dur)
    return np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 2.2) * np.minimum(1, tt * 200)


# ---------------- Música ----------------
N = int(SR * DUR)
drums = np.zeros(N)
melody = np.zeros(N)
pads = np.zeros(N)
low = np.zeros(N)

n_beats = int(DUR / BEAT) + 1
drums_in = 4  # entran con los celulares
break_from = int(13.0 / BEAT)  # se aligera en la notificación
cta_beat = int(np.ceil(16.0 / BEAT))
riff = [74, None, 77, 81, None, 79, 77, None, 74, None, 72, 74, None, 77, None, 69]
chords = [[50, 53, 57, 60, 64], [46, 50, 53, 57, 62]]  # Dm9 → Bbmaj9
roots = [38, 34]

for b in range(n_beats):
    bt = b * BEAT
    bar = b // 4
    chord_idx = (b // 8) % 2
    if b % 8 == 0 and b < cta_beat:
        add(pads, pad_chord(chords[chord_idx], 8 * BEAT + 0.4), bt)
    if b >= drums_in and b < cta_beat:
        if b < break_from:
            if b % 2 == 0:
                add(drums, kick(), bt)
                add(low, bass(roots[chord_idx], BEAT * 1.6), bt)
            if b % 4 == 3:
                add(drums, kick() * 0.6, bt + BEAT / 2)
        if b % 2 == 1:
            add(drums, snap(), bt)
        add(drums, hat(), bt + BEAT / 2)
        add(drums, hat() * 0.55, bt)
    # Riff en corcheas
    for k in range(2):
        step = (b % 8) * 2 + k
        note = riff[step]
        if note is not None and b < cta_beat:
            vel = 0.55 if b < drums_in else 0.8
            add(melody, marimba(note) * vel, bt + k * BEAT / 2)

# Acentos en los taps y en el premio
for tb in TAP_BEATS:
    add(melody, marimba(86, 0.6) * 0.5, tb * BEAT)
unlock_t = (TAP_BEATS[-1] + 1) * BEAT + 0.28
for i, m in enumerate([74, 78, 81, 86]):
    add(melody, marimba(m, 0.9) * 0.6, unlock_t + i * 0.07)
# Golpe final del CTA
add(pads, pad_chord([50, 57, 62, 64, 69], 3.0) * 1.3, cta_beat * BEAT)
add(drums, kick(), cta_beat * BEAT)
add(low, bass(38, 2.5), cta_beat * BEAT)

# Intro filtrada (0–2 s): se abre cuando entran los celulares
open_curve = np.interp(np.arange(N) / SR, [0, drums_in * BEAT - 0.2, drums_in * BEAT], [0, 0, 1])
melody = lowpass(melody, 1800) * (1 - open_curve) + melody * open_curve

mix = drums * 0.9 + melody * 0.55 + pads * 0.18 + low * 0.55
# Estéreo: hats y riff se abren un poco
left = mix + melody * 0.06
right = mix - melody * 0.06
to_mp3(np.stack([left, right], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Efectos ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)

tt = t(0.12)
to_mp3(np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 70) * 0.6 + highpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.5, SFX / "tap.mp3")

dur = 0.62
tt = t(dur)
noise = rng.standard_normal(len(tt))
bands = [lowpass(noise, c) for c in (700, 1800, 4200)]
prog = tt / dur
mixw = bands[0] * np.clip(1 - prog * 2, 0, 1) + bands[1] * (1 - np.abs(prog * 2 - 1)) + bands[2] * np.clip(prog * 2 - 1, 0, 1)
to_mp3(mixw * np.sin(np.pi * prog) ** 1.5, SFX / "whoosh-soft.mp3")

tt = t(0.22)
f = 320 + 700 * (1 - np.exp(-tt * 70))
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 250) * 0.3, SFX / "pop.mp3")

x = np.zeros(int(SR * 1.6))
for i, m in enumerate([74, 78, 81, 86, 90]):
    n = marimba(m, 1.2) + 0.4 * np.sin(2 * np.pi * hz(m + 12) * t(1.2)) * np.exp(-t(1.2) * 5)
    add(x, n * (0.7 + 0.08 * i), i * 0.065)
shimmer = highpass(rng.standard_normal(len(x)), 6000) * np.exp(-np.arange(len(x)) / SR * 3) * 0.12
to_mp3(x + shimmer, SFX / "unlock.mp3")

x = np.zeros(int(SR * 1.0))
for i, m in enumerate([88, 95]):
    tt = t(0.8)
    add(x, (np.sin(2 * np.pi * hz(m) * tt) + 0.3 * np.sin(2 * np.pi * hz(m) * 2.01 * tt)) * np.exp(-tt * 6) * np.minimum(1, tt * 400), i * 0.13)
to_mp3(x, SFX / "notification.mp3")
print(f"BPM {BPM:g} · taps en beats {TAP_BEATS}")

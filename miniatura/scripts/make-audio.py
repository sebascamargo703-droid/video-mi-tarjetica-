"""Música y efectos de "Miniatura" (síntesis, sin canciones de terceros) → public/audio.wav.

0–4 s: tren (rumor + golpes de rieles) y un pad que crece con un "riser".
4 s: impacto + whoosh y entra el ritmo (120 bpm) con el motor.
7.6 s: whoosh y acordes más brillantes; se apaga al final.
Uso (desde miniatura/): python3 scripts/make-audio.py
"""
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, lfilter

SR = 48000
DUR = 11.0
CUT1, CUT2 = 4.0, 7.6
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
out = np.zeros((N, 2))


def lp(x, f, o=2):
    b, a = butter(o, f / (SR / 2), "low")
    return lfilter(b, a, x)


def hp(x, f, o=2):
    b, a = butter(o, f / (SR / 2), "high")
    return lfilter(b, a, x)


def env(a, b, attack=0.01, release=0.2):
    e = np.zeros(N)
    i0, i1 = int(a * SR), int(b * SR)
    e[i0:i1] = 1
    k = int(attack * SR)
    e[i0 : i0 + k] = np.linspace(0, 1, k)
    k = int(release * SR)
    e[max(i0, i1 - k) : i1] *= np.linspace(1, 0, min(k, i1 - i0))
    return e


def add(sig, gain=1.0, pan=0.0):
    out[:, 0] += sig * gain * (1 - max(0, pan))
    out[:, 1] += sig * gain * (1 + min(0, pan))


def hit(at, sig):
    i = int(at * SR)
    j = min(N, i + len(sig))
    if i < N:
        add_seg = np.zeros(N)
        add_seg[i:j] = sig[: j - i]
        return add_seg
    return np.zeros(N)


# --- tren: rumor grave + golpes de rieles "ta-dum"
noise = rng.standard_normal(N)
rumble = lp(noise, 160) * 0.9 + lp(noise, 600) * 0.15
add(rumble * env(0, CUT1 + 0.2, 0.3, 0.4), 0.35)
clack = np.zeros(N)
for k in np.arange(0.35, CUT1, 0.62):
    for d in (0, 0.09):
        n = int(0.05 * SR)
        s = lp(rng.standard_normal(n), 900) * np.exp(-np.linspace(0, 9, n))
        clack += hit(k + d, s)
add(clack, 0.5)

# --- pad que crece (acorde La menor) + riser de ruido
pad = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for f in (220, 261.6, 329.6, 440))
pad = lp(pad, 1800) * np.clip(t / CUT1, 0, 1) ** 2 * env(0, CUT1, 0.5, 0.05)
add(pad, 0.05)
riser = hp(rng.standard_normal(N), 800) * np.clip((t - (CUT1 - 1.2)) / 1.2, 0, 1) ** 3 * env(0, CUT1, 0.01, 0.02)
add(riser, 0.18)

# --- impacto en el corte 1 y whoosh en el corte 2
n = int(1.6 * SR)
tt = np.arange(n) / SR
boom = np.sin(2 * np.pi * (55 * tt - 20 * tt**2)) * np.exp(-tt * 3) + lp(rng.standard_normal(n), 300) * np.exp(-tt * 10) * 0.6
add(hit(CUT1, boom), 0.75)
for c, g in ((CUT1 - 0.25, 0.3), (CUT2 - 0.3, 0.35)):
    n = int(0.7 * SR)
    w = hp(lp(rng.standard_normal(n), 3000), 300) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(hit(c, w), g, pan=0.3)

# --- ritmo 120 bpm desde el corte 1
beat = 0.5
kick_n = int(0.35 * SR)
kt = np.arange(kick_n) / SR
kick = np.sin(2 * np.pi * (48 * kt + 90 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)
hat_n = int(0.05 * SR)
hat = hp(rng.standard_normal(hat_n), 7000) * np.exp(-np.linspace(0, 12, hat_n))
k_track = np.zeros(N)
h_track = np.zeros(N)
for b in np.arange(CUT1, DUR - 0.5, beat):
    k_track += hit(b, kick)
    h_track += hit(b + beat / 2, hat)
add(k_track, 0.55)
add(h_track, 0.12, pan=-0.2)

# --- bajo y motor
bass_notes = [55, 55, 65.4, 49]
bass = np.zeros(N)
for i, b in enumerate(np.arange(CUT1, DUR, beat * 2)):
    f = bass_notes[i % 4]
    seg = env(b, min(DUR, b + beat * 2), 0.01, 0.15)
    bass += np.sign(np.sin(2 * np.pi * f * t)) * seg
add(lp(bass, 220), 0.12)
engine_f = 62 + 6 * np.sin(2 * np.pi * 0.7 * t)
phase = 2 * np.pi * np.cumsum(engine_f) / SR
engine = lp(((phase / (2 * np.pi)) % 1) * 2 - 1, 500) + 0.3 * lp(rng.standard_normal(N), 250)
add(engine * env(CUT1, DUR, 0.05, 0.8), 0.12)

# --- acordes brillantes en la autopista
chords = sum(np.sin(2 * np.pi * f * t) for f in (329.6, 392, 493.9, 659.3))
gate = (np.sin(2 * np.pi * 4 * t) > 0).astype(float)
add(lp(chords * gate, 2500) * env(CUT2, DUR, 0.3, 0.8), 0.035)

# master
out = out / np.max(np.abs(out)) * 0.89
out *= np.clip((DUR - t) / 0.7, 0, 1)[:, None]
dst = Path(__file__).resolve().parent.parent / "public" / "audio.wav"
sf.write(dst, out.astype(np.float32), SR)
print(dst, f"{DUR}s")

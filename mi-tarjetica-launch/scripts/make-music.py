"""Cama musical suave (45 s) sintetizada desde cero, pensada para ir debajo de la voz.

Pad cálido de acordes (Dmaj9 → Bm9 → Gmaj9 → A6sus), un arpegio tipo marimba
que entra con la revelación del producto y un bajo sub. Sin samples.
Uso: python3 scripts/make-music.py  → public/music/cama.wav
     npx remotion ffmpeg -i public/music/cama.wav -b:a 192k public/music/cama.mp3
Si quieres una canción con licencia, cambia `audio.music` en src/brand.ts.
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 45.0
BPM = 96
BEAT = 60 / BPM
N = int(SR * DUR)
t_all = np.arange(N) / SR

CHORDS = {
    "Dmaj9": [50, 57, 61, 64, 66],
    "Bm9": [47, 54, 57, 61, 62],
    "Gmaj9": [43, 50, 54, 57, 59],
    "A6sus": [45, 52, 54, 59, 62],
}
PROGRESSION = ["Dmaj9", "Bm9", "Gmaj9", "A6sus"] * 2 + ["Dmaj9"]
SEG = 5.0  # dos compases por acorde

REVEAL_AT = 5.7  # entra el arpegio con la revelación del producto
MESSAGE_AT = 37.1  # pequeño "lift" en el mensaje central


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass_fft(x, cutoff, width=900):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    curve = 1 / (1 + np.exp((f - cutoff) / (width / 6)))
    return np.fft.irfft(spec * curve, n=len(x))


def pad_note(freq, n):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for detune in (-0.12, 0.0, 0.12):  # tres "osciladores" ligeramente desafinados
        f = freq * 2 ** (detune / 12)
        for h in range(1, 9):
            out += np.sin(2 * np.pi * f * h * t + h * 0.7) / (h ** 1.15)
    return out / 3


pad = np.zeros(N)
bass = np.zeros(N)
fade = 1.6
for i, name in enumerate(PROGRESSION):
    start = i * SEG
    end = min(DUR, start + SEG + fade)
    a, b = int(start * SR), int(end * SR)
    n = b - a
    env = np.ones(n)
    att = int(fade * SR)
    env[:att] = np.sin(np.linspace(0, np.pi / 2, att)) ** 2
    rel = int(fade * SR)
    env[-rel:] *= np.cos(np.linspace(0, np.pi / 2, rel)) ** 2
    chord = CHORDS[name]
    seg = sum(pad_note(hz(m), n) * (0.8 if j == 0 else 1.0) for j, m in enumerate(chord))
    pad[a:b] += seg * env
    tt = np.arange(n) / SR
    bass[a:b] += np.sin(2 * np.pi * hz(chord[0] - 12) * tt) * env

pad = lowpass_fft(pad, 1500)
# Movimiento lento del pad (respira)
pad *= 0.85 + 0.15 * np.sin(2 * np.pi * t_all / (BEAT * 8))

arp = np.zeros(N)
pattern = [0, 2, 1, 3, 2, 4, 1, 3]
step = BEAT / 2
k = 0
t = REVEAL_AT
while t < DUR - 1.2:
    chord = CHORDS[PROGRESSION[min(len(PROGRESSION) - 1, int(t // SEG))]]
    m = chord[pattern[k % len(pattern)]] + 12
    n = int(0.9 * SR)
    a = int(t * SR)
    b = min(N, a + n)
    tt = np.arange(b - a) / SR
    f = hz(m)
    note = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 5.5)
    accent = 1.0 if k % 2 == 0 else 0.7
    arp[a:b] += note * np.minimum(1, tt * 300) * accent
    k += 1
    t += step
arp = lowpass_fft(arp, 3800)

# Dinámica general
gain = np.interp(
    t_all,
    [0, 0.6, REVEAL_AT - 0.3, REVEAL_AT + 0.6, MESSAGE_AT - 0.5, MESSAGE_AT + 0.8, DUR - 2.2, DUR],
    [0, 0.55, 0.6, 1.0, 1.0, 1.15, 1.1, 0],
)
arp_gain = np.interp(t_all, [0, REVEAL_AT, REVEAL_AT + 1.5, DUR], [0, 0, 1, 1])

mix = (pad * 0.55 + bass * 0.35 + arp * arp_gain * 0.32) * gain
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-3 / 20)

# Estéreo sencillo: el arpegio se abre un poco a los lados
left = mix + arp * arp_gain * gain * 0.04
right = mix - arp * arp_gain * gain * 0.04
peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
stereo = np.stack([left, right], axis=1) / peak * 10 ** (-3 / 20)

out = Path(__file__).resolve().parent.parent / "public" / "music"
out.mkdir(parents=True, exist_ok=True)
with wave.open(str(out / "cama.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())
print("ok", out / "cama.wav")

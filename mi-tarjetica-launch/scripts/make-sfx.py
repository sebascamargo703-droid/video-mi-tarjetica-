"""Genera los efectos de sonido del video desde cero (síntesis, sin samples).
Uso: python3 scripts/make-sfx.py  → escribe public/sfx/*.wav
"""
import wave
import numpy as np

SR = 48000


def save(name, x):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.85
    pcm = (x * 32767).astype(np.int16)
    stereo = np.stack([pcm, pcm], axis=1).ravel()
    with wave.open(f"public/sfx/{name}.wav", "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())


def t(sec):
    return np.arange(int(SR * sec)) / SR


def lowpass(x, a):
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


rng = np.random.default_rng(7)

# Sello: golpe suave con caída de tono + click de cuerpo.
tt = t(0.22)
freq = 520 * np.exp(-tt * 18) + 160
phase = 2 * np.pi * np.cumsum(freq) / SR
body = np.sin(phase) * np.exp(-tt * 26)
click = lowpass(rng.standard_normal(len(tt)), 0.25) * np.exp(-tt * 180) * 0.5
save("stamp", body + click)

# Notificación: dos campanitas limpias.
def bell(f, dur, decay):
    tt = t(dur)
    return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * decay) * np.minimum(1, tt * 400)

a = bell(1318.5, 0.9, 6)
b = bell(1975.5, 0.9, 6)
x = np.zeros(int(SR * 1.1))
x[: len(a)] += a
off = int(SR * 0.12)
x[off : off + len(b)] += b * 0.9
save("chime", x)

# Premio: arpegio ascendente.
x = np.zeros(int(SR * 1.4))
for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
    n = bell(f, 1.0, 5)
    o = int(SR * 0.075 * i)
    x[o : o + len(n)] += n * (0.8 + 0.1 * i)
save("reward", x)

# Whoosh: ruido filtrado con envolvente suave.
tt = t(0.7)
env = np.sin(np.pi * np.clip(tt / 0.7, 0, 1)) ** 2
noise = rng.standard_normal(len(tt))
sweep = lowpass(noise, 0.04) * 0.6 + lowpass(noise, 0.12) * 0.4
save("whoosh", sweep * env)

# Tap del botón final.
tt = t(0.12)
save("tap", np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 60) + lowpass(rng.standard_normal(len(tt)), 0.3) * np.exp(-tt * 200) * 0.3)
print("ok")

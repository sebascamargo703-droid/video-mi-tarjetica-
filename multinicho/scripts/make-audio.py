"""Genera la música y los efectos de MultiNicho desde cero (síntesis, sin samples).

  public/music.mp3        pop/house a BPM de brand.ts (120), con un beat de silencio total
                          en el "drop" (beats B.drop → B.land de timeline.ts) y vuelta con todo
  public/sfx/swipe.mp3    cada cambio de tarjeta
  public/sfx/riser.mp3    subida antes del drop (dura exactamente B.riserFrom → B.drop)
  public/sfx/impact.mp3   aterrizaje en la tarjeta "Tu negocio"
  public/sfx/sparkle.mp3  entrada de la tarjeta, "Tu logo" y la URL del CTA
  public/sfx/pop.mp3      ciclo de colores, "Tu premio" y puntos del logo

Uso (desde multinicho/):  python3 scripts/make-audio.py
Lee BPM y FIRST_BEAT_OFFSET de src/brand.ts y los beats de src/timeline.ts, así que si
cambias el tempo, la música se vuelve a cuadrar sola. Requiere numpy y `npx remotion ffmpeg`.
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
rng = np.random.default_rng(120)

brand = (ROOT / "src" / "brand.ts").read_text()
timeline = (ROOT / "src" / "timeline.ts").read_text()
BPM = float(re.search(r"BPM\s*=\s*([\d.]+)", brand).group(1))
OFFSET = float(re.search(r"FIRST_BEAT_OFFSET\s*=\s*([\d.]+)", brand).group(1))
Bv = {k: float(v) for k, v in re.findall(r"(\w+):\s*([\d.]+),", timeline.split("export const B")[1].split("};")[0])}
BEAT = 60.0 / BPM


def bt(n):
    """Segundo del beat n."""
    return OFFSET + n * BEAT


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
def saw(f, tt, top=7000):
    out = np.zeros(len(tt))
    for h in range(1, int(top / f) + 1):
        out += np.sin(2 * np.pi * f * h * tt) / h
    return out


def kick(vel=1.0):
    tt = t(0.42)
    f = 46 + 110 * np.exp(-tt * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7.5)
    click = highpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 400) * 0.25
    return (body + click) * vel


def clap():
    x = np.zeros(int(SR * 0.3))
    for k, d in enumerate([0, 0.011, 0.023]):
        tt = t(0.3 - d)
        n = lowpass(highpass(rng.standard_normal(len(tt)), 900), 6000)
        add(x, n * np.exp(-tt * (90 if k < 2 else 16)) * 0.7, d)
    return x


def hat(open_=False):
    tt = t(0.2 if open_ else 0.05)
    return highpass(rng.standard_normal(len(tt)), 7500, 2000) * np.exp(-tt * (18 if open_ else 90)) * (0.28 if open_ else 0.2)


def snare():
    tt = t(0.18)
    tone = np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.5
    noise = highpass(rng.standard_normal(len(tt)), 1500) * np.exp(-tt * 22) * 0.6
    return tone + noise


def bass(m, dur):
    tt = t(dur)
    f = hz(m)
    x = lowpass(saw(f, tt, 2000) * 0.6 + np.sin(2 * np.pi * f * tt), 380)
    return x * np.minimum(1, tt * 300) * np.exp(-tt * 2.5) * np.clip((dur - tt) * 60, 0, 1)


def stab(notes, dur, cutoff=2600):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for det in (-0.09, 0.0, 0.09):
            out += saw(hz(m) * 2 ** (det / 12), tt, 6000)
    out = lowpass(out, cutoff)
    return out * np.minimum(1, tt * 400) * np.exp(-tt * 5) / len(notes)


def pad(notes, dur):
    tt = t(dur)
    out = np.zeros(len(tt))
    for m in notes:
        for det in (-0.12, 0.0, 0.12):
            out += saw(hz(m) * 2 ** (det / 12), tt, 3000)
    att, rel = int(0.25 * SR), int(min(0.6, dur / 3) * SR)
    env = np.ones(len(tt))
    env[:att] = np.linspace(0, 1, att)
    env[-rel:] *= np.linspace(1, 0, rel)
    return lowpass(out, 1500) * env / len(notes)


def pluck(m, dur=0.45, vel=1.0):
    tt = t(dur)
    f = hz(m)
    x = sum(np.sin(2 * np.pi * f * h * tt) * np.exp(-tt * (7 + 5 * h)) / h for h in range(1, 6))
    return x * np.minimum(1, tt * 800) * vel


# ---------------- Música: A mayor, I–V–vi–IV ----------------
N = int(SR * DUR)
drums = np.zeros(N)
low = np.zeros(N)
chords_buf = np.zeros(N)
pads = np.zeros(N)
lead = np.zeros(N)

CHORDS = [[57, 61, 64, 69], [56, 59, 64, 68], [57, 61, 66, 69], [57, 62, 66, 69]]  # A  E/G#  F#m  D
ROOTS = [45, 40, 42, 38]
ARP = [[69, 73, 76, 81], [68, 71, 76, 80], [69, 73, 78, 81], [69, 74, 78, 81]]
HOOK = [76, None, 78, 76, None, 73, 76, None]  # melodía del estribillo (corcheas)

drop_a, land = bt(Bv["drop"]), bt(Bv["land"])
groove_from = bt(Bv["cardIn"])
build_from = bt(18)
cta = bt(Bv["cta"])
kicks = []

n_beats = int(DUR / BEAT) + 2
for b in range(n_beats):
    at = bt(b)
    if at >= DUR:
        break
    if drop_a <= at < land:
        continue
    bar, beat_in_bar = divmod(b, 4)
    ch = bar % 4
    chorus = land <= at < cta
    building = build_from <= at < drop_a
    outro = at >= cta

    # Bombo en negras (en el intro y el cierre, más suave)
    vel = 0.55 if at < groove_from else 0.7 if outro else 1.0
    add(drums, kick(vel), at)
    kicks.append(at)
    if groove_from <= at < drop_a or chorus:
        if beat_in_bar in (1, 3):
            add(drums, clap() * 0.8, at)
        add(drums, hat(True), at + BEAT / 2)
        for k in range(4):
            add(drums, hat() * (0.9 if k == 2 else 0.5), at + k * BEAT / 4)
    if building:  # redoble que acelera: corcheas y luego semicorcheas
        p = (at - build_from) / (drop_a - build_from)
        div = 2 if p < 0.5 else 4
        for k in range(div):
            add(drums, snare() * (0.25 + 0.6 * p), at + k * BEAT / div)

    # Bajo en corcheas a contratiempo
    if at >= groove_from and not outro:
        for k, off in enumerate((0.5,) if not chorus else (0.0, 0.5)):
            add(low, bass(ROOTS[ch] + (12 if (chorus and k == 1 and beat_in_bar == 3) else 0), BEAT * 0.45), at + off * BEAT)
    elif outro and beat_in_bar == 0:
        add(low, bass(ROOTS[ch], BEAT * 3.5), at)

    # Acordes: stabs a contratiempo (groove/estribillo), pad en intro y cierre
    if beat_in_bar == 0:
        if at < groove_from or outro:
            add(pads, pad(CHORDS[ch], BEAT * 4 + 0.3), at)
        if building or chorus:
            add(pads, pad(CHORDS[ch], BEAT * 4 + 0.1) * (0.6 if building else 0.8), at)
    if (groove_from <= at < drop_a) or chorus:
        cutoff = 1800 if not building else 1800 + 3000 * (at - build_from) / (drop_a - build_from)
        add(chords_buf, stab(CHORDS[ch], BEAT * 0.4, 3200 if chorus else cutoff), at + BEAT / 2)

    # Arpegio pluck (intro, groove) y melodía (estribillo)
    if not chorus and not outro:
        for k in range(2):
            add(lead, pluck(ARP[ch][(beat_in_bar * 2 + k) % 4], 0.4, 0.5 if at < groove_from else 0.4), at + k * BEAT / 2)
    if chorus:
        for k in range(2):
            m = HOOK[(beat_in_bar * 2 + k) % 8]
            if m is not None:
                add(lead, pluck(m + (2 if ch == 1 else 0), 0.5, 0.75), at + k * BEAT / 2)

# Cierre: acorde largo para el CTA
add(pads, pad([57, 64, 69, 73, 76], DUR - cta) * 1.2, cta)
add(lead, pluck(81, 1.5, 0.6), cta)

# Sidechain: todo lo melódico respira con el bombo
env = np.ones(N)
tt_all = np.arange(N) / SR
for k in kicks:
    a = int(k * SR)
    seg = np.arange(min(N - a, int(0.3 * SR))) / SR
    env[a : a + len(seg)] = np.minimum(env[a : a + len(seg)], 1 - 0.55 * np.exp(-seg / 0.07))

intro = np.interp(tt_all, [0, groove_from - 0.05, groove_from], [1, 1, 0])
lead_f = lowpass(lead, 1600) * intro + lead * (1 - intro)
pads_f = lowpass(pads, 900) * intro + pads * (1 - intro)
mix = drums * 0.75 + low * 0.7 + (chords_buf * 0.32 + pads_f * 0.3) * env + lead_f * 0.38

# Silencio total del drop (con microfundidos de 5 ms para que no haga clic)
gate = np.ones(N)
f5 = int(0.005 * SR)
a, b = int(drop_a * SR), int(land * SR)
gate[a - f5 : a] = np.linspace(1, 0, f5)
gate[a:b] = 0
mix *= gate
wide = (chords_buf * 0.06 + lead_f * 0.05) * gate
to_mp3(np.stack([mix + wide, mix - wide], axis=1), ROOT / "public" / "music.mp3")

# ---------------- Efectos ----------------
SFX = ROOT / "public" / "sfx"
SFX.mkdir(parents=True, exist_ok=True)

# swipe: soplo corto que sube de tono
dur = 0.3
tt = t(dur)
p = tt / dur
noise = rng.standard_normal(len(tt))
w = lowpass(noise, 900) * (1 - p) + lowpass(highpass(noise, 1500), 6000) * p
to_mp3(w * np.sin(np.pi * p) ** 2, SFX / "swipe.mp3", peak=0.8)

# riser: ruido que se abre + tono que sube; termina en seco justo en el drop
dur = (Bv["drop"] - Bv["riserFrom"]) * BEAT
tt = t(dur)
p = tt / dur
noise = rng.standard_normal(len(tt))
bands = [lowpass(highpass(noise, c * 0.5), c) for c in (500, 1500, 4000, 9000)]
sweep = np.zeros(len(tt))
for i, bnd in enumerate(bands):
    sweep += bnd * np.clip(1 - np.abs(p * 3 - i), 0, 1)
tone = np.sin(2 * np.pi * np.cumsum(180 * 2 ** (p * 2.6)) / SR) * 0.35
x = (sweep + tone) * p**2
x[-int(0.008 * SR) :] *= np.linspace(1, 0, int(0.008 * SR))
to_mp3(x, SFX / "riser.mp3")

# impact: golpe grave + platillo
tt = t(2.0)
boom = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-tt * 18)) / SR) * np.exp(-tt * 2.6)
crack = lowpass(rng.standard_normal(len(tt)), 3500) * np.exp(-tt * 35) * 0.6
crash = highpass(rng.standard_normal(len(tt)), 5000, 3000) * np.exp(-tt * 2.2) * 0.22
to_mp3(boom + crack + crash, SFX / "impact.mp3")

# sparkle: campanitas
x = np.zeros(int(SR * 1.5))
for i, m in enumerate([93, 97, 100, 105, 100, 105, 109]):
    tt = t(0.6)
    add(x, np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 9) * np.minimum(1, tt * 500) * (0.5 + 0.1 * (i % 3)), 0.02 + i * 0.1 + rng.random() * 0.03)
x += highpass(rng.standard_normal(len(x)), 8000) * np.exp(-np.arange(len(x)) / SR * 3) * 0.05
to_mp3(x, SFX / "sparkle.mp3", peak=0.7)

# pop
tt = t(0.22)
f = 320 + 700 * (1 - np.exp(-tt * 60))
to_mp3(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22) + lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 250) * 0.3, SFX / "pop.mp3")
print(f"BPM {BPM:g} · offset {OFFSET:g} s · drop {drop_a:.2f}–{land:.2f} s")

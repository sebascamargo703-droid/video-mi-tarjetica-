"""Foto de grupo de WhatsApp de Mi Tarjetica (1080×1080; WhatsApp la recorta en círculo).

Usa los logos oficiales de public/brand/. Se dibuja a 3× y se reduce para bordes suaves.
Sin #FFFFFF: el claro de marca es #F6F4EB.
  python3 whatsapp-grupo/make.py   →   whatsapp-grupo/out/*.png
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(HERE, "..", "public", "brand")
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

SIZE, K = 1080, 3
S = SIZE * K
GREEN, GREEN_DEEP, GREEN_LIGHT = (20, 91, 68), (11, 58, 43), (31, 118, 89)
LIGHT, CARAMEL, MINT = (246, 244, 235), (200, 150, 62), (143, 227, 192)


def tinted(path, box, color):
    """Recorta `box` del PNG y lo pinta de un solo color conservando el alfa."""
    a = Image.open(path).convert("RGBA").crop(box).getchannel("A")
    im = Image.new("RGBA", a.size, color + (0,))
    im.putalpha(a)
    return im.crop(a.getbbox())


ICON = tinted(os.path.join(BRAND, "mi-tarjetica-logo-blanco.png"), (0, 0, 520, 528), LIGHT)
WORD = tinted(os.path.join(BRAND, "mi-tarjetica-logo-blanco.png"), (580, 0, 1908, 528), LIGHT)


def background():
    y, x = np.mgrid[0:S, 0:S].astype(np.float32) / S
    # luz arriba a la izquierda, borde más profundo
    d = np.sqrt((x - 0.42) ** 2 + (y - 0.36) ** 2) / 0.75
    t = np.clip(d, 0, 1)[..., None] ** 1.3
    c0, c1 = np.array(GREEN_LIGHT, np.float32), np.array(GREEN_DEEP, np.float32)
    rgb = c0 * (1 - t) + c1 * t
    rgb = rgb * 0.55 + np.array(GREEN, np.float32) * 0.45 * (1 - t) + rgb * 0.45 * t
    noise = np.random.default_rng(7).normal(0, 1.2, rgb.shape[:2])[..., None]  # evita bandas
    return Image.fromarray(np.clip(rgb + noise, 0, 255).astype(np.uint8)).convert("RGBA")


def stamps_ring(img, r, n, dot, color, alpha, filled_every=0):
    """Anillo de "sellos" (círculos) alrededor del centro, como una tarjeta de sellos."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = S / 2
    for i in range(n):
        a = -np.pi / 2 + 2 * np.pi * i / n
        x, y = c + r * np.cos(a), c + r * np.sin(a)
        box = (x - dot, y - dot, x + dot, y + dot)
        if filled_every and i % filled_every == 0:
            d.ellipse(box, fill=color + (alpha,))
        else:
            d.ellipse(box, outline=color + (alpha,), width=int(dot * 0.28))
    img.alpha_composite(layer)


def ring(img, r, width, color, alpha):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse((S / 2 - r, S / 2 - r, S / 2 + r, S / 2 + r), outline=color + (alpha,), width=width)
    img.alpha_composite(layer)


def place(img, logo, width, cy, shadow=True):
    h = round(logo.height * width / logo.width)
    lg = logo.resize((width, h), Image.LANCZOS)
    x, y = (S - width) // 2, round(cy - h / 2)
    if shadow:
        sh = Image.new("RGBA", lg.size, (4, 30, 22, 0))
        sh.putalpha(lg.getchannel("A").point(lambda v: v * 0.55))
        pad = Image.new("RGBA", img.size, (0, 0, 0, 0))
        pad.alpha_composite(sh, (x, y + S // 90))
        img.alpha_composite(pad.filter(ImageFilter.GaussianBlur(S / 110)))
    img.alpha_composite(lg, (x, y))


def glow(img, cx, cy, r, color, alpha):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(r * 0.6)))


def save(img, name):
    out = img.convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    arr = np.asarray(out).copy()
    arr[(arr == 255).all(2)] = LIGHT  # nunca blanco puro
    Image.fromarray(arr).save(os.path.join(OUT, name + ".png"), optimize=True)
    Image.fromarray(arr).save(os.path.join(OUT, name + ".jpg"), quality=95, subsampling=0)


# A · ícono + "Mi Tarjetica" (la principal)
img = background()
glow(img, S / 2, S * 0.43, S * 0.24, MINT, 40)
stamps_ring(img, S * 0.445, 30, S * 0.0105, CARAMEL, 150, filled_every=3)
place(img, ICON, round(S * 0.40), S * 0.415)
place(img, WORD, round(S * 0.54), S * 0.665)
save(img, "whatsapp-grupo-mi-tarjetica")

# B · solo el ícono (se lee mejor en la miniatura de la lista de chats)
img = background()
glow(img, S / 2, S / 2, S * 0.28, MINT, 44)
stamps_ring(img, S * 0.445, 30, S * 0.0105, CARAMEL, 150, filled_every=3)
place(img, ICON, round(S * 0.56), S * 0.5)
save(img, "whatsapp-grupo-mi-tarjetica-icono")
print("ok", os.listdir(OUT))

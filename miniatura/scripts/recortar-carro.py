"""Recorta el carro de la foto (BiRefNet vía rembg) para la parte "miniatura" y los efectos de luz.

Salidas en public/bmw/: carro.png (RGBA del tamaño de la foto) y mascara.png (alfa). Uso (desde miniatura/): python3 scripts/recortar-carro.py
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

D = Path(__file__).resolve().parent.parent / "public" / "bmw"
im = Image.open(D / "foto.jpg").convert("RGB")
W, H = im.size
# zona del carro con margen (coordenadas de la foto de 1449×2576)
box = (60, 1150, W - 30, 1850)
crop = im.crop(box)
k = 2
up = crop.resize((crop.width * k, crop.height * k), Image.LANCZOS)
sess = new_session("birefnet-general")
m = remove(up, session=sess, only_mask=True)
a = np.asarray(m.resize(crop.size, Image.LANCZOS)).astype(np.float32) / 255.0
a = np.clip((a - 0.05) / 0.9, 0, 1)
a = cv2.GaussianBlur(a, (0, 0), 0.6)
full = np.zeros((H, W), np.float32)
full[box[1] : box[3], box[0] : box[2]] = a

rgb = np.asarray(im).astype(np.float32)
# descontaminar bordes: estimar el fondo detrás del borde y restarlo
fg = (full > 0.02).astype(np.uint8) * 255
small = cv2.resize(rgb.astype(np.uint8), (W // 3, H // 3), interpolation=cv2.INTER_AREA)
msmall = cv2.dilate(cv2.resize(fg, (W // 3, H // 3), interpolation=cv2.INTER_NEAREST), np.ones((5, 5), np.uint8))
bgs = cv2.inpaint(small, msmall, 6, cv2.INPAINT_TELEA)
B = cv2.resize(bgs, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
al = full[..., None]
F = (rgb - (1 - al) * B) / np.maximum(al, 0.08)
edge = ((full > 0.01) & (full < 0.97))[..., None]
out = np.where(edge, np.clip(F, 0, 255), rgb).astype(np.uint8)
rgba = Image.fromarray(out).convert("RGBA")
rgba.putalpha(Image.fromarray((full * 255).astype(np.uint8)))
rgba.save(D / "carro.png")
Image.fromarray((full * 255).astype(np.uint8)).save(D / "mascara.png")

bb = Image.fromarray((full > 0.1).astype(np.uint8) * 255).getbbox()
print("carro bbox", bb)

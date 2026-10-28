# Camilo vuelve (reel)

Reel vertical 1080×1920 (~54 s) inspirado en "Comenta TARJETA", adaptado a Mi Tarjetica sin groserías
y con un cliente hombre (Camilo) de una barbería de ejemplo. Fotos realistas generadas con IA
(`public/fotos/`, sin marcas; al papel de la lavadora se le borró el texto inventado), tarjetas de
papel cayendo en 3D (`@remotion/three`), pantallas de la app en 2D, voz de ElevenLabs ("Lina")
partida por frases en `public/voz/` y música sintetizada.

```bash
npm install
python3 scripts/make-audio.py            # música + efectos (tiempos desde src/voiceover.json)
REMOTION_LOCAL_FONTS=1 npx remotion render CamiloVuelve out/camilo-vuelve.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/camilo-vuelve.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png
```

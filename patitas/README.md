# Patitas (reel 3D para negocios de mascotas)

Reel vertical 1080×1920 (~42 s) adaptado de un video de tarjetas de sellos para estéticas caninas.
Todo en 3D (`@remotion/three`): Rocky, un schnauzer hecho con primitivas (`src/three/Dog.tsx`: sentado
o caminando, cola, moñito, lengua, parpadeo, mojado), bañera con espuma, fachadas, celulares, tablet,
tarjetas y medallas (`src/three/Devices.tsx`). Las pantallas de la app se diseñan en `src/screens.tsx`
y se exportan como textura con `scripts/render-screens.mjs`.

La voz en `public/voz/` es **temporal** (Kokoro, local). Para poner la de ElevenLabs: genera el guion de
`src/voiceover.json` en una sola toma, pártelo por frases (h1, h2, …, k1) y corre
`python3 scripts/import-voice.py <carpeta>`; las escenas se reacomodan solas a las nuevas duraciones.

```bash
npm install
node scripts/render-screens.mjs
python3 scripts/make-audio.py
REMOTION_LOCAL_FONTS=1 npx remotion render Patitas out/patitas.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/patitas.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png --gl=angle --timeout=300000
```

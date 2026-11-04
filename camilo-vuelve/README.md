# Camilo vuelve (reel)

Reel vertical 1080×1920 (~54 s) inspirado en "Comenta TARJETA", adaptado a Mi Tarjetica sin groserías
y con un cliente hombre (Camilo) de una barbería de ejemplo. Todo en 3D (`@remotion/three`):
lavadora, celulares, tablet, mostrador, calle con la barbería, tarjetas y medallas
(`src/three/Devices.tsx`). Las pantallas de la app se diseñan en 2D (`src/screens.tsx`) y se
exportan como textura con `scripts/render-screens.mjs` a `public/screens/`. Voz de ElevenLabs
("Lina") partida por frases en `public/voz/` y música sintetizada. `public/fotos/` guarda las fotos
de la primera versión (ya no se usan en el video).

```bash
npm install
node scripts/render-screens.mjs           # pantallas → public/screens/*.png (si cambias src/screens.tsx)
python3 scripts/make-audio.py            # música + efectos (tiempos desde src/voiceover.json)
REMOTION_LOCAL_FONTS=1 npx remotion render CamiloVuelve out/camilo-vuelve.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/camilo-vuelve.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png --gl=angle --timeout=300000
```

Sin GPU el render 3D es lento: cuenta con ~1 hora.

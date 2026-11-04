# Miniatura

Videos verticales de 11 s estilo "carro a escala que se vuelve real".

- `MiniaturaBMWH` (`src/MiniaturaBMWH.tsx`, 1920×1080, igual a la referencia): BMW a escala en la ventana,
  luego andando por un túnel y por la autopista de noche (recorte de la foto sobre fondo 3D, ruedas girando).
  Audio: `python3 scripts/make-audio.py 10 3.9 7.3 audio-h.wav`.
- `MiniaturaBMW` (`src/MiniaturaBMW.tsx`, vertical): con la foto del BMW del cliente (`public/bmw/foto.jpg`).
  El recorte sale de `python3 scripts/recortar-carro.py` (BiRefNet vía rembg → `public/bmw/carro.png`).
- `Miniatura` (`src/Miniatura.tsx`): versión 3D con un Ferrari 458 Italia (modelo de vicent091036,
  CC BY 4.0, de los ejemplos de three.js) — ventana del tren, túnel y autopista de noche.

Audio: `python3 scripts/make-audio.py` → `public/audio.wav` (tren, impacto, ritmo y motor; sin canciones de terceros).

```bash
npm install
REMOTION_LOCAL_FONTS=1 npx remotion render MiniaturaBMW out/miniatura-bmw.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/miniatura-bmw.mp4
```

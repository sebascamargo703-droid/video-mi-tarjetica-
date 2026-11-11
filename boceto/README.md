# Boceto (del boceto al 3D: "la flecha lo trajo de vuelta")

Video vertical 1080×1920 (17 s, solo música) con el formato "boceto vs. versión final": a la izquierda
un panel pequeño dibujado a lápiz y a la derecha el mismo plano terminado en 3D, sincronizados.

Las dos versiones salen de la MISMA escena 3D (`src/three/City.tsx`): en modo boceto cada malla se
dibuja en blanco papel con contornos negros (`EdgesGeometry`) y el panel pasa por un filtro SVG que
hace "hervir" el trazo como dibujo a mano; los textos usan Caveat (OFL, `public/fonts/Caveat.ttf`).

Historia: ícono de Mi Tarjetica → zoom al mapa aéreo de un barrio → el cliente (punto azul) entra a la
zona del café → aviso "Estás cerca: te falta 1 sello" → ficha del café (7/8 sellos) → "Cómo llegar" →
baja a la calle → flecha y distancia (12 m … 3 m) → "Aquí" → vista cenital de la mesa con el pocillo →
"¡Completaste tu tarjeta! Tu café de hoy es gratis" → vuelve al ícono.

```bash
npm install
python3 scripts/make-audio.py
REMOTION_LOCAL_FONTS=1 npx remotion render Boceto out/boceto.mp4 --codec=h264 --crf=18 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/boceto.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png --gl=angle --timeout=300000
```

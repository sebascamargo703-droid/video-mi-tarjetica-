# El secreto (reel 3D + fotos realistas)

Reel vertical 1080×1920 (~51 s): "El secreto de Starbucks no es el café" adaptado a Mi Tarjetica.
Escenas 3D con `@remotion/three` (estrella dorada, vaso sin marca, personas que se iluminan, barras
de visitas), fotos realistas generadas con IA (`public/fotos/`, sin logos ni marcas), voz de
ElevenLabs ("Lina", colombiana) partida por frases en `public/voz/` y música sintetizada.

Dato: los miembros de Starbucks Rewards generaron casi el 60 % de los ingresos de las tiendas
propias de EE. UU. en el año fiscal 2025 (más de USD 13.000 millones). Fuentes:
https://about.starbucks.com/?p=275421 y el Q4 FY25 Digital IR Dashboard de Starbucks.

```bash
npm install
python3 scripts/make-audio.py            # música + efectos (tiempos desde src/voiceover.json)
REMOTION_LOCAL_FONTS=1 npx remotion render ElSecreto out/el-secreto.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/el-secreto.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png --gl=angle --timeout=300000
```

Sin GPU el render 3D es lento (por software): cuenta con 20–45 minutos.

# "Dos locales" — ¿por qué uno vive lleno y el otro no?

Reel/TikTok de **Mi Tarjetica** (1080×1920, 30 fps, ~53 s) con escenas en **3D real** (three.js dentro
de Remotion), locución de ElevenLabs (voz "Lina – Colombian Warm & Confident"), titulares, subtítulo
palabra por palabra, música y efectos. Cierra con **"Comenta TARJETICA"**.

Historia: dos cafés frente a frente en la misma calle — **Origen** (lleno, luz cálida) y **La Esquina**
(casi vacío, luz fría). Mismos productos y precios; la diferencia está en lo que pasa cuando el cliente
se va: Origen le da su tarjeta de sellos en el celular, días después a Valentina le llega el aviso por
cercanía ("te falta 1 sello") y vuelve. Luego Mi Tarjetica (tarjeta, premios, avisos y panel) y el CTA.
Los negocios y la clienta son de ejemplo.

| Escena | Frases |
|---|---|
| Plano aéreo de los dos cafés · "LLENO" / "CASI VACÍO" · "¿POR QUÉ?" | a1, a2 |
| Vista cenital + menús comparados con "=" | b1 |
| La cámara entra a Origen y sale: "Y NO ESTÁ ADENTRO." | b2 |
| Valentina sale con "+1 sello" | c1 |
| Wallet: la tarjeta suma el sello | c2 |
| "DÍAS DESPUÉS": entra a la geocerca de Origen | d1 |
| Pantalla de bloqueo con el aviso | d2 |
| Caminos a cada café: "7/8 SELLOS" vs "SIN TARJETA" · "¿A CUÁL VOLVERÁ?" | e1, e2 |
| Mi Tarjetica: tarjeta, premio, aviso y panel | f1, f2 |
| Plano aéreo final · "¿Y TÚ? ¿CUÁL QUIERES SER?" | g1 |
| COMENTA **TARJETICA** + comentario escribiéndose + logo | h1 |

## Renderizar

```bash
npm install
npx remotion studio
npx remotion render DosLocales out/dos-locales.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000 --concurrency=3
bash scripts/master-audio.sh out/dos-locales.mp4
npx remotion still Portada out/portada.png --gl=angle --timeout=300000   # portada (src/Portada.tsx)
```
Si solo cambias audio (volúmenes, efectos, voz con la misma duración), no hace falta volver a
renderizar el 3D: `python3 scripts/mix-audio.py out/audio-mezcla.wav` y luego
`ffmpeg -i out/dos-locales.mp4 -i out/audio-mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k out/final.mp4`.
El 3D necesita `--gl=angle` (en un servidor sin GPU se dibuja por software: ~25–40 min).
Sin internet: antepón `REMOTION_LOCAL_FONTS=1`. Para revisar cámaras sin renderizar todo:
`node scripts/preview-frames.mjs DosLocales out/prev 2 9.5 13` (segundos).

## Cambiar…
- **Textos, titulares, menús, negocios:** `src/copy.ts` (`headlines`: `[texto, palabra con la que entra]`).
- **Voz:** frases en `src/voiceover.json`. Para regrabar: genera en ElevenLabs con la misma voz, guarda
  cada frase como `<id>.mp3` y corre `python3 scripts/import-voice.py <carpeta>`; la línea de tiempo,
  cámaras, titulares y subtítulos se reacomodan solos. Luego `python3 scripts/make-audio.py` (música).
- **El mundo 3D:** `src/three/` — `City.tsx` (calle, edificios, postes, carros, geocerca, caminos),
  `Cafe.tsx` (cada café: mesas, gente, luces, letrero), `Props.tsx` (personas, mesas, lámparas…),
  `textures.ts` (letreros y ventanas dibujados), `Stage.tsx` (luz de luna, niebla, cámara).
- **Cámaras y caminatas:** `K` y `worldAt()` en `src/DosLocales.tsx`.
- **Colores y volúmenes:** `src/brand.ts`.

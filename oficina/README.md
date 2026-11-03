# Oficina (TikTok 3D: "me montó una oficina entera dentro del celular")

Video vertical 1080×1920 (~54 s) inspirado en el formato "le pedí a … y me montó una oficina entera".
Adaptado a Mi Tarjetica: el dueño de un café entra a su celular y encuentra a su "equipo", los
**Tarjeticos** (mascotas originales: cubos menta con herramienta), cada uno con su escritorio y su
monitor:

| Tarjetico | Herramienta | Qué hace |
|---|---|---|
| Sellos | sello | el sello le llega solito al celular del cliente cuando paga |
| Cumpleaños | gorrito de fiesta | se acuerda de los cumpleaños y manda un regalo |
| La cuadra | binoculares | aviso por cercanía: "te falta un sello" |
| Premios | estrella | cuenta los premios y le dice a cada cliente cuánto le falta |
| Datos | audífonos | si alguien lleva un mes sin venir, le manda una promo |

Escenas (`src/Oficina.tsx`): celular en la mesa del café → la cámara entra a la pantalla → oficina 3D
(planos de cada escritorio, pantalla gigante con los números, reloj a toda velocidad "¿cuándo
descansan? Nunca.") → el dueño atiende a su clienta mientras le llega "¡Laura volvió!" → chat con el
amigo de la tarjeta de papel → "Comenta TARJETICA".

Archivos clave:
- `src/three/Office.tsx`: Tarjetico, Desk, Room (gradas, ventana día/noche, neón), Clock, Gift, PaperPlane.
- `src/screens.tsx`: pantallas de monitores, pared, celular y chat (se exportan a `public/screens/`).
- `src/copy.ts`: titulares y negocio de ejemplo (Café Origen). Los números son "datos de ejemplo".
- En los planos de las filas de atrás, las filas de adelante se esconden a mitad del barrido
  (`hiddenDesk`) para que no tapen el monitor.

La voz en `public/voz/` es **temporal** (Kokoro, local). Para poner la de ElevenLabs (Lina): genera el
guion de `src/voiceover.json` en una sola toma, pártelo por frases (h1, h2, …, k2) y corre
`python3 scripts/import-voice.py <carpeta>`; las escenas se reacomodan solas a las nuevas duraciones.

```bash
npm install
node scripts/render-screens.mjs
python3 scripts/make-audio.py
REMOTION_LOCAL_FONTS=1 npx remotion render Oficina out/oficina.mp4 --codec=h264 --crf=16 --gl=angle --timeout=300000
bash scripts/master-audio.sh out/oficina.mp4
REMOTION_LOCAL_FONTS=1 npx remotion still Portada out/portada.png --gl=angle --timeout=300000
```

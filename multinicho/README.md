# MultiNicho — "Una tarjeta para cada negocio"

Reel de 18 s a 60 fps, en loop y sincronizado a la música (120 BPM). Una sola tarjeta de
fidelidad se transforma en cada beat: Barberías → Spas → Lavaderos → Heladerías → Gimnasios →
Veterinarias → Cafeterías, y luego acelera (un cambio por beat, después cada medio beat con
motion blur). Tras un beat de silencio aterriza en la tarjeta en blanco **"Tu negocio"**, que
se personaliza (logo → colores → premio) antes del CTA.

| Composición | Tamaño | Uso |
|---|---|---|
| `MultiNicho` | 1080×1920 | Reels / TikTok / Shorts. Respeta zonas seguras: 250 px arriba, 420 abajo, 120 a la derecha |
| `MultiNichoFeed` | 1080×1350 | Feed de Instagram/Facebook (4:5). Diseño propio, no es un recorte |

## Renderizar

```bash
npm install
npm run audio        # (opcional) regenera music.mp3 y los efectos a partir del BPM
npx remotion render MultiNicho out/multinicho-vertical.mp4 --codec=h264 --crf=16
npx remotion render MultiNichoFeed out/multinicho-feed.mp4 --codec=h264 --crf=16
bash scripts/master-audio.sh out/multinicho-vertical.mp4   # (opcional) audio a -14 LUFS para redes
```

Sin internet: antepón `REMOTION_LOCAL_FONTS=1` para usar las fuentes de `public/fonts`.
Vista previa en vivo: `npm run dev`.

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Nichos (nombre, negocio, color, ícono, sellos, premio) | `src/niches.ts` |
| Textos (gancho, frases, CTA, cliente, premio escrito) | `src/copy.ts` |
| Colores, música, volúmenes, BPM | `src/brand.ts` |
| En qué beat pasa cada cosa | `src/timeline.ts` |
| Íconos | `src/components/NicheIcon.tsx` |

### Nichos
Cada nicho es un objeto `{ categoria, negocio, color, icono, sellosTotales, sellosLlenos, premio }`.
El color del texto de la tarjeta se elige solo (blanco u oscuro) para cumplir contraste AA
(4.5:1); si ninguno alcanza, usa el verde casi negro `#061A13`. Los sellos se acomodan solos en
1 fila (hasta 6) o 2 filas (7 a 12). Para cambiar el orden o cuántos aparecen, edita la lista
`card` de `src/timeline.ts` (cada entrada es `{ beat, niche }`, con `niche` = índice en `niches`).

### Íconos
Disponibles: `scissors`, `lotus`, `car`, `cone`, `dumbbell`, `paw`, `cup`, `bread`, `polish`,
`dryer` y `logo` (el recuadro punteado "Tu logo"). Para uno nuevo, agrega su nombre al tipo
`IconName` y su dibujo (SVG 48×48, trazo 3) en `NicheIcon.tsx`.

### Colores
`palette` en `brand.ts`: fondo `#145B44` → `#0E4433`, texto `#FFFFFF`, secundario `#A7D7C5`,
acento `#8FE3C0`, sombra `#0A2E22` al 50 %. El verde de marca nunca va directo sobre el fondo
verde (solo sobre la tarjeta blanca). La tarjeta siempre lleva sombra y un borde claro de 2 px,
así los nichos oscuros (azul, café, violeta) se separan del fondo.

### Música, BPM y offset
- Reemplaza `public/music.mp3` por tu canción y ajusta en `brand.ts`:
  - `BPM`: tempo de la canción.
  - `FIRST_BEAT_OFFSET`: segundos desde el inicio del archivo hasta el primer golpe (beat 0).
- Todo el video usa `beat(n)` (n puede ser 20.5 = medio beat), así que los cambios, los
  efectos y el motion blur se mueven solos con el nuevo tempo.
- La coreografía espera un **beat de silencio** entre `B.drop` y `B.land` (11.0–11.5 s a 120 BPM)
  y un golpe fuerte en `B.land`. Si tu canción no lo tiene, mueve esos beats en `timeline.ts`.
- `npm run audio` vuelve a sintetizar la música de ejemplo y los efectos (`swipe`, `riser`,
  `impact`, `sparkle`, `pop`) leyendo el BPM, el offset y los beats de los archivos de código.
- Volúmenes: `music.volume` y `sfxVolume` en `brand.ts`.

## Estructura

```
src/
  brand.ts         BPM, offset, beatFrame(), paleta, contraste (textOn), volúmenes
  copy.ts          textos
  niches.ts        datos de los nichos + tarjeta "Tu negocio"
  timeline.ts      coreografía en beats
  cardState.ts     estado de la tarjeta en cada frame (color, golpe, giro, íconos, halos…)
  MultiNicho.tsx   escena, diseño por formato y audio
  components/      WalletCard, StampRow, SlotText, Sheen, NicheIcon, CategoryLabel,
                   BrandBackground, KineticText, Logo
scripts/
  make-audio.py    música + efectos (numpy)
  master-audio.sh  normaliza el audio del MP4 a -14 LUFS
  preview-frames.mjs  fotogramas sueltos para revisar
```

## Loop
El frame 0 es solo el fondo verde, y los últimos 10 frames se funden a ese mismo fondo: al
repetirse, el corte no se nota.

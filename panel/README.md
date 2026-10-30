# Panel — "Tu panel en un vistazo"

Video de 18 s a 60 fps, en loop, que le habla al dueño del negocio: un panel elegante se arma
pieza por pieza (indicadores de la semana, sparkline, lista de clientes) y el momento clave es
el cliente que no ha vuelto en 62 días. Mensaje: por fin sabes quiénes son tus clientes.

| Composición | Tamaño | Uso |
|---|---|---|
| `Panel` | 1080×1920 | Reels / TikTok. Respeta zonas seguras: 250 px arriba, 420 abajo, 120 a la derecha |
| `PanelFeed` | 1080×1350 | Feed y pauta (4:5). Diseño propio: KPI en fila y otro encuadre de cámara |

## Renderizar

```bash
npm install
npx remotion studio                    # vista previa
npx remotion render Panel out/panel-vertical.mp4 --codec=h264 --crf=16
npx remotion render PanelFeed out/panel-feed.mp4 --codec=h264 --crf=16
bash scripts/master-audio.sh out/panel-vertical.mp4   # (opcional) audio a -14 LUFS para redes
npm run audio                          # (opcional) regenera la música y los efectos
```

Sin internet: antepón `REMOTION_LOCAL_FONTS=1` para usar las fuentes de `public/fonts`.

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Negocio, periodo, KPI, sellos por día, clientes y etiquetas | `src/panelData.ts` |
| Textos (hook, frases, CTA, títulos del panel, "Datos de ejemplo") | `src/copy.ts` |
| Colores, música y volúmenes | `src/brand.ts` |
| En qué segundo pasa cada cosa | `src/timeline.ts` |
| Tamaño del panel, columnas y encuadres de cámara por formato | `src/layout.ts` |

- Los números ruedan con odómetro hasta el valor que pongas; el sparkline se reescala solo y
  el punto brillante va en el valor más alto.
- `lostClientIndex` marca el cliente del momento clave (zoom, resto atenuado al 40 %,
  "Hace 62 días" resaltado) y `returningClientIndex` el de "Quién vuelve."
- `*palabra*` en copy.ts pinta la palabra en `accent`; `\n` es salto de línea.

## Paleta y contraste
`brand`/`bg` #145B44 → `bgDeep` #0E4433, `textPrimary` #FFFFFF, `textSecondary` #A7D7C5,
`accent` #8FE3C0. Panel: `panelBg` #FFFFFF, `panelSurface` #F4F8F6, `panelBorder` #E2ECE7,
`panelText` #0A2E22, `panelTextSecondary` #5B7268. Alerta #B42318 sobre #FDE2DE.
El verde de marca solo va dentro del panel blanco; sobre el fondo verde los acentos van en
`accent` o blanco. Todos los pares de texto cumplen AA (los valores están en `brand.ts`).

## Audio
`public/music.mp3` es un placeholder sintetizado (electrónica minimal ~104 BPM) con fade in de
0.3 s y fade out en el último segundo. Efectos en `public/sfx/`: `whoosh-soft`, `tick-roll`,
`draw`, `row`, `alert-soft` y `pop`, cada uno en su `<Sequence>` al frame exacto (ver el final
de `src/Panel.tsx`). Para tu propia música, reemplaza el archivo y ajusta `music.volume`.

## Estructura

```
src/
  brand.ts  copy.ts  panelData.ts  timeline.ts  layout.ts
  Panel.tsx                    escena, cámara, halos, audio
  components/  BrandBackground, KineticText, PanelFrame, KpiCard, Odometer, Sparkline,
               ClientRow, StatusTag, StampProgress, ExampleBadge, Icons, Logo
scripts/  make-audio.py · master-audio.sh · preview-frames.mjs
```

## Loop
El frame 0 es solo el fondo verde y los últimos 10 frames se funden a ese mismo fondo.

# MiTarjetica · Comercial 40 s (Remotion)

Comercial vertical de 40 s (1200 frames a 30 fps) para [mitarjetica.com](https://www.mitarjetica.com/),
editado sobre la toma real de `public/video-base.mp4`, con look cinematográfico,
subtítulos palabra por palabra, gráficos en React y mezcla de audio con ducking.

| Composición       | Formato      | Resolución  | Uso                         |
| ----------------- | ------------ | ----------- | --------------------------- |
| `Vertical`        | 9:16         | 2160 × 3840 | Reels / TikTok / Shorts     |
| `Horizontal`      | 16:9         | 3840 × 2160 | YouTube / web               |
| `VerticalPreview` | 9:16         | 1080 × 1920 | Revisión rápida             |

Todo el diseño se mide en unidades `u` (lado corto / 1080), así que cualquier
`width`/`height` funciona sin tocar las escenas.

## Comandos

```bash
npm install

# Previsualizar
npx remotion studio

# Render 4K vertical (H.264, CRF 15, AAC 320 kbps — ya fijados en remotion.config.ts)
npx remotion render Vertical out/mitarjetica-4k.mp4 --codec=h264 --crf=15

# Render 4K horizontal
npx remotion render Horizontal out/mitarjetica-4k-16x9.mp4 --codec=h264 --crf=15

# Si reemplazas video-base.mp4, vuelve a normalizar la voz a -14 LUFS
npm run voice:normalize
```

## Assets en `public/`

| Archivo                                  | Obligatorio | Qué es |
| ---------------------------------------- | ----------- | ------ |
| `video-base.mp4`                         | ✅ | Toma a cámara (cualquier resolución 9:16). Su audio es la locución. |
| `voz-normalizada.wav`                    | ✅ | Audio de `video-base.mp4` a -14 LUFS. Se genera con `npm run voice:normalize`. |
| `musica.mp3`                             | ✅ | Música instrumental ambiental (≥ 40 s). |
| `sfx/whoosh.wav`                         | ✅ | Whoosh suave para transiciones. |
| `sfx/pop.wav`                            | ✅ | "Pop" de la notificación. |
| `sfx/tick.wav`                           | ✅ | "Tick" de contadores / cronómetro. |
| `sfx/chime.wav`                          | ✅ | Chime corto del check verde. |
| `assets/qr_mitarjetica.png`              | ✅ | QR del CTA (cuadrado, fondo transparente o blanco). |
| `brand/mi-tarjetica-logo-blanco.png`     | ✅ | Logo blanco para el cierre. |
| `fonts/Inter-Variable.woff2`             | ✅ | Tipografía (incluida, licencia OFL). |
| `broll-caminando.mp4`                    | opcional | B-roll de alguien caminando para la escena de proximidad → activa `USE_WALKING_BROLL`. |
| `dashboard.png`                          | opcional | Captura real del panel → activa `USE_DASHBOARD_SCREENSHOT`. |

Los flags opcionales están al final de `src/data/timeline.ts`.

## Qué ajustar a mano

1. **Subtítulos** — `src/data/subtitles.ts`.
   El inicio de cada frase está medido sobre las pausas reales de la voz; dentro
   de la frase las palabras se repartieron por sílabas, así que algunas pueden ir
   ±100 ms. Corrige los ms en el Studio, o genera tiempos exactos con Whisper:
   `pip install faster-whisper && python3 scripts/transcribe-words.py` y pega la salida.
   Las palabras clave en azul se definen en `ACCENT_KEYWORDS` (mismo archivo).
2. **Montaje / cortes** — `SEGMENTS` en `src/data/timeline.ts` (`at` = frame del
   corte, `entry` = tipo de transición, `framing` = plano abierto o 1.15x).
3. **Zoom y encuadre según tu toma** — `FRAMINGS` en `src/data/timeline.ts`:
   `originX/originY` = dónde está la cara (centro del zoom),
   `focus` = elipse que queda nítida (el resto recibe el falso desenfoque).
4. **Push-ins** en frases clave — `PUSH_INS` (frames absolutos).
5. **Tiempos internos de escenas** (contador, notificación, cronómetro) —
   `SCENE_TIMING`; los SFX se recalculan solos.
6. **Hook y CTA** — constantes al inicio de `src/scenes/Scene1Hook.tsx`
   (`PHRASE_IN`, `UNDERLINE_START/END`) y `src/scenes/Scene7CTA.tsx` (`QR_IN`, `BUTTON_IN`).
7. **Mezcla** — volúmenes de música en `src/components/AudioMix.tsx`
   (`MUSIC_BED` 10 %, `MUSIC_DUCKED` 6 %); volumen de cada SFX en `SFX`.

## Mapa de escenas (alineado a la locución real)

| Frames      | Escena                         | Lo que se dice |
| ----------- | ------------------------------ | -------------- |
| 0–128       | 1 · Hook (persona)             | "No necesitas clientes nuevos, necesitas que los que ya te compraron…" |
| 128–166     | persona 1.15x (whip pan)       | "Conseguir un cliente nuevo…" |
| 166–242     | 2 · Problema · gráfica 5x      | "…cuesta hasta 5 veces más que retener uno actual" |
| 242–446     | persona (con reencuadre)       | "Si no regresan… Haz que cada compra de hoy…" |
| 446–553     | 3 · Solución · iPhone 3D       | "Con MiTarjetica, una tarjeta digital…" |
| 553–610     | persona 1.15x                  | "Premia la fidelidad de tus clientes…" |
| 610–746     | Beneficio 01 · Cero descargas  | "…acumulan sellos y obtienen descuentos…" |
| 746–883     | Beneficio 02 · Proximidad      | "Con aviso de proximidad…" |
| 883–972     | Beneficio 03 · Base de datos   | "Y mantienes una base de datos real…" |
| 972–1142    | 7 · CTA (persona + QR)         | "Deja de perder clientes… comenta TARJETICA…" |
| 1142–1200   | Cierre · logo + URL            | — |

Los beneficios se numeran en el orden en que aparecen en la locución
(`BENEFIT_NUMBER`); los archivos conservan los nombres del brief
(`Scene4Benefit1` = Proximidad, `Scene5Benefit2` = Base de datos,
`Scene6Benefit3` = Cero descargas).

## Estructura

```
src/
  Root.tsx                 Composiciones (Vertical, Horizontal, VerticalPreview)
  MainVideo.tsx            TransitionSeries generada desde el timeline + capas globales
  theme.ts                 Colores, tipografía, springs, radios, sombras, márgenes seguros
  data/timeline.ts         Cortes, encuadres, push-ins, SFX, flags
  data/subtitles.ts        Palabras con timestamps (Caption de @remotion/captions)
  lib/layout.ts            useLayout(): unidad u, zonas seguras, layout 9:16 / 16:9
  lib/anim.ts              Entradas estándar (fade + 40u + blur 12u → 0)
  transitions/             Disolvencia, slide, whip pan y match cut por escala
  scenes/                  Scene1Hook … Scene7CTA (+ EndCard)
  components/              CinematicGrade, FilmGrain, Vignette, KineticTitle,
                           WordSubtitles, PhoneMockup, WalletCard, DashboardMock,
                           Counter, QRBadge, PersonShot, AudioMix, Backdrop, Icons…
```

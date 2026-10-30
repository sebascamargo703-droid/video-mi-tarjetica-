# Mi Tarjetica — Video de lanzamiento (Remotion v4)

Proyecto nuevo, hecho desde cero. Dos composiciones con la misma narrativa:

| Composición | Formato | Uso |
|---|---|---|
| `MiTarjeticaHero` | 1920×1080 · 60 fps · 45 s | Web, YouTube, presentaciones |
| `MiTarjeticaVertical` | 1080×1920 · 60 fps · 45 s | Reels, TikTok, Stories (el layout se recompone, no se recorta) |

**Todo lo exportado está en una sola carpeta: [`../PUBLICACIONES-MI-TARJETICA/`](../PUBLICACIONES-MI-TARJETICA/LEEME.md)**
- `01-video-lanzamiento/` → reel vertical y video horizontal (con voz).
- `02-carruseles-plan-5-dias/` → 5 carruseles de Instagram con `PLAN-5-DIAS.md` (carpetas *Carrusel-Dia-N* del Studio).
- `03-historias-instagram-con-voz/` → 8 historias con voz y `GUIA.md` (carpeta *Instagram* del Studio).
- `04-historias-animadas-sin-voz/` y `05-posts-sueltos/` (carpetas *Historias* y *Publicaciones* del Studio).

## Guion (45 s)

| # | Escena | Tono | Idea |
|---|---|---|---|
| 1 | Gancho | negro | "Tu cliente perdió la tarjeta de sellos." — la tarjeta de papel se cae del cuadro |
| 2 | Problema | blanco | "Y con ella, su próxima visita." |
| 3 | Revelación | negro | El logo se arma como si le pusieran sellos → "Tu tarjeta de sellos, ahora en el celular." |
| 4 | Wallet | blanco | Teléfono + Wallet: vive en el Wallet · sin app · no se pierde |
| 5 | Sellos | negro | Los sellos hacen "pop" uno a uno hasta el premio · "Se actualiza sola." |
| 6 | Cercanía | verde | Notificación en pantalla de bloqueo que sale del teléfono |
| 7 | Antifraude | negro | Registro: cajero, hora, caja, dispositivo · "Cada sello, firmado." |
| 8 | Negocios | blanco | Cintas con barberías, spas, cafeterías… · "Hecho para tu negocio." |
| 9 | Mensaje | verde | **"Tus clientes vuelven más seguido."** |
| 10 | Cierre | negro | Empieza gratis · desde $29.900 COP · mitarjetica.com · Hecho en Barranquilla |

## Comandos

```bash
npm install
npm run dev               # Remotion Studio
npm run render:hero       # ../PUBLICACIONES-MI-TARJETICA/01-video-lanzamiento/video-horizontal-16x9.mp4
npm run render:vertical   # ../PUBLICACIONES-MI-TARJETICA/01-video-lanzamiento/reel-vertical-9x16.mp4
npm run render:hero:4k    # 3840×2160 (todo está hecho con código, se ve nítido)
npm run render:social     # historias (PNG + MP4) y publicaciones (PNG)
```

Sin internet: `REMOTION_LOCAL_FONTS=1 npm run render:hero` usa las copias de Inter / Inter Tight / Fraunces de `public/fonts`.

## Dónde editar

- `src/copy.ts` — **todos los textos** (video y redes). `*palabra*` = color de acento, `\n` = salto de línea.
- `src/brand.ts` — colores, tonos de escena y audio (`audio.music` para agregar una pista con licencia).
- `src/timeline.ts` — duración de cada escena, transiciones y momentos clave (`cues`) compartidos por animación y sonido. La escena final se ajusta sola para que el total sea exactamente 45 s.
- `src/lib/motion.ts` — curvas y springs (ease-out expo `bezier(0.16, 1, 0.3, 1)`, `SPRING_SOFT`, `SPRING_POP`) y el helper `s(seg)`.

## Componentes

`KineticText`, `PhoneMockup`, `WalletCard`, `Stamp`, `LockScreenNotification`, `ActivityLog`, `Marquee`, `Logo` / `LogoMark`, más `PaperCard`, `Screens` (Wallet y pantalla de bloqueo) y `Stage` (fondo, cámara y sombras). Teléfono, tarjeta y logo están hechos con divs/SVG; no hay logos de Apple ni de Google.

## Colores

Sacados pixel a pixel de los archivos oficiales del logo: verde `#0E5244` y tinta `#1B1613`. Derivados del mismo tono: menta `#69D3BE` (acento sobre negro), verde profundo `#083A30`, verde medio `#16705D` y papel `#F6F2EA`.

## Voz, música y sonido

**Locución femenina** en español latino (voz "ef_dora" del modelo abierto Kokoro, fonética `es-419`, sin la "z" española), sincronizada frase por frase con cada escena:

| Escena | Frase |
|---|---|
| Gancho | ¿Tu cliente perdió otra vez la tarjeta de sellos? |
| Problema | Y con ella... su próxima visita. |
| Revelación | Por eso creamos Mi Tarjetica. Tu tarjeta de sellos, ahora en el celular. |
| Wallet | Vive en el Wallet de tu cliente. / No tiene que descargar ninguna app. / Y no se pierde. ¡Nunca! |
| Sellos | Cada visita, un sello. / Y al décimo... ¡premio! / Todo se actualiza solo. |
| Cercanía | Y cuando pasa cerca de tu negocio, le llega un aviso directo a su celular. |
| Antifraude | Cada sello queda firmado: cajero, hora y caja. ¡Cero trampa! |
| Negocios | Barberías, cafeterías, spas... hecho para tu negocio. |
| Mensaje | ¿El resultado? Tus clientes vuelven más seguido. |
| Cierre | Empieza gratis hoy, sin tarjeta de crédito, en mitarjetica.com. |

- Cambiar una frase: edita `src/voiceover.json` (texto, escena, segundo `at` y velocidad) y corre `npm run voice` (instrucciones de instalación al inicio de `scripts/make-voice.py`). El script avisa si una frase se pisa con la siguiente. Algunas palabras están escritas como suenan ("Uálet", "espás", "mi tarjetica punto com") para que la voz las pronuncie bien.
- ¿Prefieres una locutora profesional o una voz de ElevenLabs? Graba cada frase con el mismo nombre de archivo en `public/voz/` y actualiza `durationSec`: el video la usa sin tocar nada más.
- **Música**: cama suave sintetizada (`npm run music`) que baja automáticamente cuando habla la voz. Para una canción con licencia, cambia `audio.music` en `src/brand.ts`.
- **Efectos**: `scripts/make-sfx.py` (sello, notificación, premio, whoosh, tap).
- **Volumen final**: los renders pasan por `scripts/master-audio.sh` (−14 LUFS, el estándar de Instagram/TikTok/YouTube).
- Volúmenes y on/off de voz, música y efectos: objeto `audio` en `src/brand.ts`.

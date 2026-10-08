# Mi Tarjetica — Video de lanzamiento (Remotion v4)

Proyecto nuevo, hecho desde cero. Dos composiciones con la misma narrativa:

| Composición | Formato | Uso |
|---|---|---|
| `MiTarjeticaHero` | 1920×1080 · 60 fps · 45 s | Web, YouTube, presentaciones |
| `MiTarjeticaVertical` | 1080×1920 · 60 fps · 45 s | Reels, TikTok, Stories (el layout se recompone, no se recorta) |

Además: 6 historias (1080×1920) y 6 publicaciones (1080×1350), en las carpetas *Historias* y *Publicaciones* del Studio. Se exportan a `../historias-y-publicaciones/`.

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
npm run render:hero       # out/mi-tarjetica-hero.mp4
npm run render:vertical   # out/mi-tarjetica-vertical.mp4
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

## Sonido

`scripts/make-sfx.py` sintetiza los efectos (sello, notificación, premio, whoosh, tap) en `public/sfx/`. No hay música incluida: pon un archivo con licencia en `public/` y escribe su nombre en `audio.music` (en `src/brand.ts`).

# Publicaciones — Mi Tarjetica

Todo el material para redes en una sola carpeta, listo para subir.
Colores de marca: verde `#0E5244`, tinta `#1B1613`, papel `#F6F2EA`, menta `#69D3BE`.

| Carpeta | Qué hay | Formato | Dónde se publica |
|---|---|---|---|
| `01-video-lanzamiento/` | `reel-vertical-9x16.mp4` (45 s, con voz), `tap-sello-reel-9x16.mp4` (18 s, loop "Mira lo que le pasa al celular de tu cliente"), `paso-cerca-reel-9x16.mp4` (18 s, loop "Pasó por tu puerta": aviso por cercanía con promo 2x1), `cumpleanos-reel-9x16.mp4` (18 s, loop "Feliz cumpleaños, Laura": campaña de cumpleaños automática), `multinicho-reel-9x16.mp4` + `multinicho-feed-4x5.mp4` (18 s, loop "Una tarjeta para cada negocio": la tarjeta cambia de nicho en cada beat), `panel-reel-9x16.mp4` + `panel-feed-4x5.mp4` (18 s, loop "Tu panel en un vistazo": el panel del dueño y el cliente que no ha vuelto), `lavadero-reel-9x16.mp4` + `lavadero-feed-4x5.mp4` (18 s, loop "El premio que sí reclaman": 10 lavados, 10 gotas, 10 % de descuento) y `video-horizontal-16x9.mp4` | MP4 | Reels / TikTok / YouTube Shorts · YouTube, web y presentaciones |
| `02-carruseles-plan-5-dias/` | 5 carruseles × 7 imágenes (lunes a viernes) + `PLAN-5-DIAS.md` con textos, horarios y fuentes + `vista-general.jpg` | PNG 1080×1350 | Feed de Instagram (carrusel) |
| `03-historias-instagram-con-voz/` | 8 historias con voz y música (+ portada PNG) + `GUIA.md` con stickers | MP4 1080×1920 | Historias de Instagram |
| `04-historias-animadas-sin-voz/` | 6 historias animadas (MP4 + PNG) | MP4/PNG 1080×1920 | Historias (con música de Instagram si quieres) |
| `05-posts-sueltos/` | 6 posts de una imagen + `TEXTOS-POSTS-E-HISTORIAS.md` | PNG 1080×1350 | Feed de Instagram / Facebook |
| `07-carrusel-cafe-no-pagaste/` | Carrusel "SE BUSCA: Café Tres Granos" (bait-and-switch para cafeterías): 9 láminas + `caption.txt` | PNG 1080×1350 | Feed de Instagram (carrusel) |
| `08-historias-precios/` | Historias para la destacada "Precios": 8 historias (planes Gratis, Emprendedor, Profesional, Empresa, mensual vs. anual, a la medida y cierre) + `portada.png` de la destacada | PNG 1080×1920 | Historias de Instagram → destacada "Precios" (en la 8, pon el sticker de enlace en el espacio libre de abajo) |
| `06-carruseles-editoriales/` | 4 carruseles editoriales (verde #145B44 / blanco): cuánto vale un cliente, premios que funcionan, cartoncito vs. Mi Tarjetica, cómo funciona — cada uno con `caption.txt` | PNG 1080×1350 | Feed de Instagram (carrusel) |

**En total:** 11 videos, 71 imágenes de carrusel (10 carruseles), 14 historias y 6 posts, más 8 historias de precios con su portada de destacada.

## Calendario sugerido (2 semanas)

**Semana 1 — lanzamiento**

| Día | Feed | Historias |
|---|---|---|
| Domingo o día de lanzamiento | Reel: `01-video-lanzamiento/reel-vertical-9x16.mp4` | Comparte el reel en tus historias |
| Lunes | Carrusel día 1 · La cuenta que casi nadie hace | IG01 Pregunta (con encuesta) + IG02 Recordatorio |
| Martes | Carrusel día 2 · 5 problemas de la tarjeta de papel | IG06 Mito (con cuestionario) |
| Miércoles | Carrusel día 3 · Así funciona | IG03 Cómo funciona + IG04 Sellos |
| Jueves | Carrusel día 4 · Ideas de premios | IG05 Control |
| Viernes | Carrusel día 5 · Empieza gratis | IG07 Gratis + IG08 Link (con sticker de link) |

Extra: publica `tap-sello-reel-9x16.mp4` como Reel/TikTok el miércoles o jueves en la noche, y `paso-cerca-reel-9x16.mp4` el viernes en la noche (la promo de micheladas encaja con el plan de fin de semana). `cumpleanos-reel-9x16.mp4` funciona bien un domingo o lunes en la mañana. `multinicho-reel-9x16.mp4` es ideal para abrir la semana 2 (lunes en la noche) y `multinicho-feed-4x5.mp4` como post de video en el feed. `panel-reel-9x16.mp4` y `panel-feed-4x5.mp4` funcionan muy bien como pauta para dueños de negocio (mensaje de control y tranquilidad). `lavadero-reel-9x16.mp4` es el más divertido y "satisfactorio": ideal para un sábado en la mañana o como pauta para lavaderos de autos. Son videos cortos en loop pensados para verse dos veces.

**Semana 2 — refuerzo**

| Día | Feed | Historias |
|---|---|---|
| Lunes | Post01 Manifiesto | Historia01 Papel |
| Martes | Post02 Producto | Historia02 Sin app |
| Miércoles | Post03 Antes / Ahora | Historia03 Cerca |
| Jueves | Post04 Antifraude | Historia04 Sellos |
| Viernes | Post05 Negocios | Historia05 Plan gratis |
| Sábado | Post06 Precio | Historia06 CTA |

Las historias con voz también se pueden subir **las 8 seguidas el mismo día** como una sola secuencia (ver `03-historias-instagram-con-voz/GUIA.md`). Horarios, textos para pegar y hashtags: `02-carruseles-plan-5-dias/PLAN-5-DIAS.md` y `05-posts-sueltos/TEXTOS-POSTS-E-HISTORIAS.md`.

## Volver a exportar
Todo se genera desde el proyecto `../mi-tarjetica-launch/` (Remotion):
- `npm run render:vertical` / `npm run render:hero` → `01-video-lanzamiento/`
- Historias de precios: proyecto `../historias-precios/` → cambia los precios en `src/pricing.ts` y corre `node scripts/render-stories.mjs` (copiar `out/stories/precios/` a `08-historias-precios/`)
- Carrusel Café Tres Granos: proyecto `../carrusel-cafe/` → `node scripts/render-carousels.mjs` (y copiar `out/carousels/cafe-no-pagaste/` a `07-carrusel-cafe-no-pagaste/`)
- Lavadero: proyecto `../lavadero/` → `npx remotion render Lavadero out/lavadero-vertical.mp4 --codec=h264 --crf=16` y `npx remotion render LavaderoFeed out/lavadero-feed.mp4 --codec=h264 --crf=16` + `bash scripts/master-audio.sh <archivo>`
- Panel: proyecto `../panel/` → `npx remotion render Panel out/panel-vertical.mp4 --codec=h264 --crf=16` y `npx remotion render PanelFeed out/panel-feed.mp4 --codec=h264 --crf=16` + `bash scripts/master-audio.sh <archivo>`
- MultiNicho: proyecto `../multinicho/` → `npx remotion render MultiNicho out/multinicho-vertical.mp4 --codec=h264 --crf=16` y `npx remotion render MultiNichoFeed out/multinicho-feed.mp4 --codec=h264 --crf=16` + `bash scripts/master-audio.sh <archivo>`
- Cumpleanos: proyecto `../cumpleanos/` → `npx remotion render Cumpleanos out/cumpleanos.mp4 --codec=h264 --crf=16` + `bash scripts/master-audio.sh out/cumpleanos.mp4`
- PasoCerca: proyecto `../paso-cerca/` → `npx remotion render PasoCerca out/paso-cerca.mp4 --codec=h264 --crf=16` + `bash scripts/master-audio.sh out/paso-cerca.mp4`
- TapSello: proyecto `../tap-sello/` → `npx remotion render TapSello out/tap-sello.mp4 --codec=h264 --crf=16`
- Carruseles editoriales: proyecto `../tap-sello/` → `node scripts/render-carousels.mjs` (y copiar `out/carousels/` a `06-carruseles-editoriales/`)
- `npm run render:social` → carpetas 02 a 05 (o `node scripts/render-social.mjs --only=Carrusel`, `--only=IG`, etc.)

# La silla vacía — reel 3D para mitarjetica.com

Video vertical **1080×1920 · 30 fps · 22 s (660 frames)** para Reels y TikTok.
Una barbería de barrio de noche: una silla vacía bajo una luz ámbar ("Esta silla era de
Andrés… hace 2 meses que no viene"), Andrés pasa por la calle, le llega el **aviso por
cercanía**, se devuelve, entra y la silla se llena. Cierra con mitarjetica.com.

Hecho con **Remotion + @remotion/three (React Three Fiber)**. No usa assets externos: toda la
geometría es procedural (cajas, cilindros, planos) y los letreros se dibujan en `<canvas>`.
La tipografía (Inter y Fraunces) se carga de Google Fonts con `@remotion/google-fonts`.

## Comandos

```bash
npm install

# Previsualizar (Remotion Studio en el navegador)
npx remotion studio

# Renderizar a MP4 (H.264)
npx remotion render SillaVacia out/silla-vacia.mp4 --codec=h264 --crf=18 --audio-bitrate=192k

# Portada para la cuadrícula del perfil
npx remotion still Portada out/portada.png
```

- En un servidor **sin tarjeta gráfica** (Linux en la nube, Docker) agrega `--gl=swangle`
  (o `--gl=angle`) al render. Ahí tarda ~3 s por cuadro; en un computador con GPU es mucho más rápido.
- Para renderizar **sin internet**, pon `REMOTION_LOCAL_FONTS=1` delante del comando: usa las copias
  de las fuentes que hay en `public/fonts/`.
- `npm run audio` vuelve a generar el audio de relleno (necesita Python 3, numpy y ffmpeg).

## Estructura

```
src/
  index.ts            registro de Remotion
  Root.tsx            composiciones: SillaVacia (video) y Portada (imagen)
  constants.ts        ← TODO lo editable: textos, colores, tiempos, negocio, audio, guion de voz
  SillaVacia.tsx      composición principal: mundo 3D + capa 2D de cada escena + audio
  story.ts            coreografía: Andrés, luces, puerta, niebla, desenfoque, cámara
  Soundtrack.tsx      música, efectos y voz en off (con sus <Sequence> y volúmenes)
  motion.ts           easing y springs
  fonts.ts            Google Fonts
  scenes/             un componente por escena (cámara + capa 2D)
    Scene1Gancho.tsx  0–3,5 s   la silla vacía, texto con efecto de tipeo
    Scene2Calle.tsx   3,5–8 s   la cámara sale por la vidriera; Andrés pasa de largo
    Scene3Aviso.tsx   8–12 s    celular en primer plano: notificación + tarjeta 9/10
    Scene4Vuelta.tsx  12–16 s   mira atrás, se devuelve, la puerta se abre
    Scene5Silla.tsx   16–19 s   la silla se llena, se estampa el sello 10
    Scene6Cierre.tsx  19–22 s   texto final + mitarjetica.com
  three/              el mundo 3D low-poly
    Stage.tsx         lienzo, cámara, niebla, luces de ambiente, reflejo del piso mojado
    Barbershop.tsx    interior, lámpara con cono de luz, neón, fachada, puerta
    Chair.tsx         la silla de barbero (protagonista)
    Andres.tsx        el personaje: camina, mira el celular, gira, se sienta
    Street.tsx        andén, faroles, vecinos, charcos de luz
    primitives.tsx    cajas, cilindros y texturas en canvas
  ui/                 piezas 2D: celular, tarjeta de sellos, tipeo, subtítulo, isotipo
scripts/make-audio.py audio de relleno sintetizado
public/               music.mp3, notification.mp3, door.mp3, stamp.mp3, fonts/
```

## Audio

`public/` trae cuatro archivos **de relleno** generados por síntesis (sin derechos de autor):
`music.mp3`, `notification.mp3`, `door.mp3` y `stamp.mp3`. Para usar los tuyos, reemplázalos con el
**mismo nombre**; los momentos y volúmenes están en `AUDIO` y `MOMENTS` (`src/constants.ts`).
Si quitas alguno, pon su `enabled: false`. Para la voz en off: graba el guion que está al inicio de
`constants.ts`, guárdalo como `public/voz.mp3` y pon `AUDIO.voice.enabled = true`.

## Adaptarlo a otro negocio (peluquería, café, lavadero)

Todo esto está en `src/constants.ts`:

| Qué | Constante |
|---|---|
| Nombre, emoji, letrero de neón y aviso de la fachada | `BUSINESS.name`, `emoji`, `neonText`, `signText` |
| Nombre del cliente | `BUSINESS.customer` y los textos `TEXTS.hook1` / `hook2` |
| Notificación | `TEXTS.notifTitle`, `TEXTS.notifBody` |
| Sellos y premio | `BUSINESS.stampsTotal`, `stampsFilled`, `stampIcon` (`scissors`, `cup`, `drop`, `star`), `reward`, `rewardFooter`, `TEXTS.rewardBadge` |
| Texto final | `TEXTS.cta` (lo que va entre `[corchetes]` se resalta), `TEXTS.url`, `TEXTS.tagline` |
| Colores del local | `COLORS.leather`, `neon`, `facadeTrim`, `amber`, `wall` |
| Ritmo | `SCENES` y `MOMENTS` (segundos) |

Lo único que **no** sale de las constantes es el objeto protagonista: la silla de barbero vive en
`src/three/Chair.tsx`. Para un café o un lavadero hay que cambiar esa pieza (por ejemplo una mesa con
una taza, o un carro) y la pose sentada de `Andres.tsx`.

# Cumpleanos — "Feliz cumpleaños, Laura"

Reel/TikTok de **Mi Tarjetica** sobre la campaña de cumpleaños automática: el día exacto, a las 9:00 a. m., a la clienta le llega sola una notificación con su regalo.

- Composición `Cumpleanos` · 1080×1920 · 60 fps · 18 s
- Loop perfecto: el último frame es idéntico al primero (#0A0A0A).
- Zonas seguras Reels/TikTok respetadas: nada importante en los 250 px de arriba, los 420 px de abajo ni los 120 px del borde derecho (`src/layout.ts`).
- La notificación usa texto de 34–36 px a 1080 de ancho para que se lea completa.

## Comandos

```bash
npm install
npx remotion studio                                                    # vista previa
npx remotion render Cumpleanos out/cumpleanos.mp4 --codec=h264 --crf=16  # render final
bash scripts/master-audio.sh out/cumpleanos.mp4                        # opcional: volumen estándar de redes (−14 LUFS)
```

Sin internet: `REMOTION_LOCAL_FONTS=1 npx remotion render …` usa las copias de Inter/Fraunces de `public/fonts`.

## Sacar otra versión (spa, barbería, peluquería, cafetería…) sin tocar la animación

**`src/copy.ts`**

| Qué | Dónde |
|---|---|
| Nombre del negocio, ícono (`nail`, `scissors`, `coffee`, `spa`) e ilustración (`nail-polish` o `gift`) | `business` |
| Nombre de la clienta | `customer` |
| Fecha del cumpleaños (el calendario, el día de la semana y la fecha del bloqueo se calculan solos) | `birthday` |
| Servicio, descuento y texto del badge | `offer` |
| Hora de la notificación (el reloj rueda de `before` a `at`) | `clock` |
| Sellos y premio de la tarjeta | `card` |
| Gancho, textos de escena y cierre | `copy` |

**`src/brand.ts`** → `biz`: colores del negocio (rosa empolvado, vino, dorado) que solo se usan en la notificación, la tarjeta y la ilustración. `brand` son los colores de Mi Tarjetica (gancho y cierre).

En titulares, `*palabra*` sale en color de acento y `\n` es salto de línea.

## Cambiar música y sonido

- **Música:** reemplaza `public/music.mp3` (anota su BPM en `music.bpm`). Volúmenes en `music.volume` y `sfxVolume` (`src/brand.ts`).
- **Efectos:** `public/sfx/` (`tick`, `whoosh-soft`, `haptic`, `notification`, `sparkle`, `tap`, `pop` .mp3). El tick suena en cada día del calendario y baja de volumen cuando el resaltado acelera.
- Música y efectos incluidos se sintetizaron desde cero con `npm run audio` (`scripts/make-audio.py`): son un placeholder libre de derechos; para pauta pagada usa una pista con licencia.

## Contraste (AA)

- Sobre crema, el gris secundario es `#6E6E73` (4.75:1); `#86868B` no pasa en crema (3.4:1).
- En la banda dorada el texto va en `#4A1820` (6.2:1); el vino `#7A2E3A` sobre dorado no pasa (3.95:1).

## Estructura

- `src/Cumpleanos.tsx` — storyboard: gancho → calendario (resaltado día por día con easing in-out) → zoom al día que se funde con el celular → reloj 8:59→9:00, vibración y notificación de vidrio con destellos → toque y tarjeta del Wallet con esmalte y badge → cierre. Cada efecto de sonido en su `<Sequence>`.
- `src/components/` — `KineticText`, `Calendar` (+ `DayHighlight`), `Phone`, `LockScreen`, `RollingClock`, `Notification`, `WalletCard`, `Sparkles`, `NailPolish` (+ `GiftBox`), `OfferBadge`, `BizIcon`, `Logo`. Todo con divs/SVG, sin imágenes ni logos de Apple o Google.
- `src/motion.ts` — easing `bezier(0.16, 1, 0.3, 1)`, springs (`{ damping: 200 }` entradas, `{ damping: 11, stiffness: 200 }` pops) y el helper `s(seg)`.

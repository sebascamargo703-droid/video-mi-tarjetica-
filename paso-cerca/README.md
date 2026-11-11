# PasoCerca — "Pasó por tu puerta"

Reel/TikTok de **Mi Tarjetica** sobre el aviso por cercanía: un cliente camina con el celular en el bolsillo, entra en la geocerca del negocio y le aparece sola la notificación con la promo.

- Composición `PasoCerca` · 1080×1920 · 60 fps · 18 s
- Loop perfecto: el último frame es idéntico al primero (#0A0A0A).
- Zonas seguras Reels/TikTok respetadas: nada importante en los 250 px de arriba, los 420 px de abajo ni los 120 px del borde derecho (`src/layout.ts`).
- La notificación usa texto de 34–36 px a 1080 de ancho para que se lea completa.

## Comandos

```bash
npm install
npx remotion studio                                                   # vista previa
npx remotion render PasoCerca out/paso-cerca.mp4 --codec=h264 --crf=16  # render final
bash scripts/master-audio.sh out/paso-cerca.mp4                       # opcional: volumen estándar de redes (−14 LUFS)
```

Sin internet: `REMOTION_LOCAL_FONTS=1 npx remotion render …` usa las copias de Inter/Fraunces de `public/fonts`.

## Reusar el video con otro negocio o promo

Todo está en **`src/copy.ts`**:

| Qué | Dónde |
|---|---|
| Nombre del negocio, emoji de la etiqueta e ícono (`beer`, `coffee`, `scissors`, `star`) | `business` |
| Texto del badge ("2x1"), banda de la tarjeta y si se muestran las micheladas | `promo` (`showDrinks: false` para otros productos) |
| Texto de la notificación | `notification.body` |
| Sellos, cliente y premio de la tarjeta | `card` |
| Gancho, texto del mapa, hora/fecha del bloqueo, CTA | `copy` |

`*palabra*` sale en color de marca y `\n` es salto de línea.

## Cambiar…

- **Colores:** `src/brand.ts` → `brand.colors` (verde y tinta del logo oficial; menta derivada para contraste sobre negro), `brand.map` (mapa) y `brand.drink` (michelada).
- **Música:** reemplaza `public/music.mp3` (y anota su BPM en `music.bpm`). Volúmenes de música y efectos en `music.volume` y `sfxVolume`.
- **Efectos:** `public/sfx/` (`street`, `ring-pulse`, `whoosh-soft`, `haptic`, `notification`, `tap`, `pop` .mp3). Los incluidos se sintetizaron desde cero con `npm run audio` (`scripts/make-audio.py`): son un placeholder libre de derechos; para pauta pagada usa una pista con licencia.
- **Tiempos de escenas:** `src/timeline.ts`. El cliente camina a velocidad constante y cruza la geocerca exactamente en `T.enter`.
- **Mapa:** `src/layout.ts` (calles, posición del negocio `PIN`, radio `RING_R`, camino `PATH`).

## Estructura

- `src/PasoCerca.tsx` — storyboard: gancho → mapa 3D → entra a la zona (destello + zoom con `<CameraMotionBlur>`) → notificación (vibración + vidrio) → toque y tarjeta del Wallet con micheladas y badge 2x1 → CTA. Cada efecto de sonido en su `<Sequence>`.
- `src/components/` — `KineticText`, `StreetMap`, `WalkingDot`, `BusinessPin`, `GeofenceRing`, `Phone`, `LockScreen`, `Notification`, `WalletCard`, `Michelada`, `PromoBadge` (+ `Logo`). Todo con divs/SVG, sin imágenes ni logos de Apple o Google.
- `src/motion.ts` — easing `bezier(0.16, 1, 0.3, 1)`, springs (`{ damping: 200 }` entradas, `{ damping: 11, stiffness: 200 }` pops) y el helper `s(seg)`.

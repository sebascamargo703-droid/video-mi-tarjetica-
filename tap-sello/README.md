# TapSello — "Mira lo que le pasa al celular de tu cliente"

Reel/TikTok de **Mi Tarjetica** en Remotion v4: pantalla dividida con el celular del negocio (pone el sello) y el de la clienta (el sello le llega solo al Wallet), premio desbloqueado y notificación en la pantalla de bloqueo.

- Composición `TapSello` · 1080×1920 · 60 fps · 18 s
- Loop perfecto: el último frame es idéntico al primero (#0A0A0A).
- Zonas seguras Reels/TikTok respetadas: nada importante en los 250 px de arriba, los 420 px de abajo ni los 120 px del borde derecho (ver `src/layout.ts`).

## Comandos

```bash
npm install
npx remotion studio                                   # vista previa
npx remotion render TapSello out/tap-sello.mp4 --codec=h264 --crf=16   # render final
```

Sin internet: `REMOTION_LOCAL_FONTS=1 npx remotion render …` usa las copias de Inter/Fraunces de `public/fonts`.

## Cambiar…

| Qué | Dónde |
|---|---|
| **Textos** (gancho, nombres, número, premio, notificación, CTA) | `src/copy.ts` — `*palabra*` sale en color de acento, `\n` es salto de línea |
| **Colores** | `src/brand.ts` → `brand.colors` (verde y tinta del logo oficial; menta derivada para contraste sobre negro) |
| **Música** | Reemplaza `public/music.mp3` y pon su **BPM** en `src/brand.ts` → `music.bpm`. Los 3 toques caen en los beats de `music.tapBeats` y cada sello aterriza 1 beat después: todo se re-sincroniza solo. |
| **Efectos** | `public/sfx/` (`tap`, `whoosh-soft`, `pop`, `unlock`, `notification` .mp3) y sus volúmenes en `sfxVolume` |
| **Tiempos de escenas** | `src/timeline.ts` |
| **Posiciones / tamaños** | `src/layout.ts` (celulares, botón, círculos de la tarjeta) |

La música y los efectos incluidos se sintetizaron desde cero con `npm run audio` (`scripts/make-audio.py`, lee el BPM de `brand.ts`). Son un placeholder libre de derechos: para publicidad pagada, usa una pista con licencia.

## Estructura

- `src/TapSello.tsx` — el storyboard completo (gancho → presentación → 3 taps → premio → notificación → CTA) y el audio con cada `<Sequence>` en su frame.
- `src/components/` — `Phone`, `BusinessApp`, `WalletCard`, `Stamp`, `TapRipple`, `FlyingStamp`, `LockScreen`, `Notification`, `KineticText`, más `Odometer`, `Confetti` y `Logo`. Todo hecho con divs/SVG (nítido a cualquier tamaño), sin imágenes ni logos de Apple o Google.
- `src/motion.ts` — easing `bezier(0.16, 1, 0.3, 1)`, springs (`{ damping: 200 }` para entradas, `{ damping: 11, stiffness: 200 }` para el pop de los sellos) y el helper `s(seg)`.

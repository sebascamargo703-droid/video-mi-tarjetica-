# Lavadero — "El premio que sí reclaman"

Video de 18 s a 60 fps, en loop: un carro sucio pasa por un túnel de lavado y sale reluciente;
cada pasada suma una gota-sello en la tarjeta del Wallet. Las pasadas se aceleran (visitas 2–9
con motion blur), la décima va en cámara lenta y la tarjeta termina en "¡PREMIO DISPONIBLE!".
Todo es ilustración plana hecha con SVG/divs (sin imágenes) y se entiende sin sonido.

| Composición | Tamaño | Uso |
|---|---|---|
| `Lavadero` | 1080×1920 | Reels / TikTok. Respeta zonas seguras: 250 px arriba, 420 abajo, 120 a la derecha |
| `LavaderoFeed` | 1080×1350 | Feed y pauta (4:5): tarjeta compacta arriba, túnel en la mitad inferior |

## Renderizar

```bash
npm install
npx remotion studio                          # vista previa
npx remotion render Lavadero out/lavadero-vertical.mp4 --codec=h264 --crf=16
npx remotion render LavaderoFeed out/lavadero-feed.mp4 --codec=h264 --crf=16
bash scripts/master-audio.sh out/lavadero-vertical.mp4   # (opcional) audio a -14 LUFS
npm run audio                                # (opcional) regenera música y efectos
```

Sin internet: antepón `REMOTION_LOCAL_FONTS=1` para usar las fuentes de `public/fonts`.

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Negocio, cliente, premio, número de sellos y frases | `src/copy.ts` |
| Colores del carro, la suciedad, el túnel, el agua y la tarjeta | `src/brand.ts` (`art` y `card`) |
| Música y volúmenes de efectos | `src/brand.ts` (`music`, `sfxVolume`) y `public/` |
| Cuándo pasa cada cosa, duración de cada pasada del montaje | `src/timeline.ts` |
| Recorrido del carro | `src/track.ts` |
| Posiciones por formato | `src/layout.ts` |

- **Otro lavadero:** cambia `business`, `customer` y `reward` en `copy.ts`. Si cambias
  `stampsTotal`, ajusta también la lista `passes` de `timeline.ts` (una pasada por sello).
- **Otro carro:** `art.car` en `brand.ts` (carrocería, vidrios, llantas, rines).
- **Otra tarjeta:** `card` en `brand.ts`. Ojo con el contraste: el celeste #0EA5E9 con texto
  blanco da 2.77:1 y no cumple AA, por eso el fondo usa #0369A1 (5.93:1) y el #0EA5E9 queda en
  la franja superior, los cepillos y el agua.
- **Música:** reemplaza `public/music.mp3`. La coreografía espera una pausa suave a los 11 s
  (`T.slowFrom`) y un golpe a los 13.5 s (`T.prize`); si tu canción los tiene en otro momento,
  mueve esos valores en `timeline.ts`.
- **Efectos** (`public/sfx/`): `engine`, `water`, `brush`, `bubble-pop`, `sparkle`, `drop`,
  `unlock`, `reverse-beep`. Cada uno va en su `<Sequence>` al final de `src/Lavadero.tsx`; en el
  montaje el agua suena más bajo (`sfxVolume.waterMontage`).

## Estructura

```
src/
  brand.ts  copy.ts  timeline.ts  track.ts  layout.ts
  Lavadero.tsx      escena, tarjeta, gotas voladoras, CTA y audio
  components/  BrandBackground, KineticText, Car, DirtSpots, WashTunnel, SpinningBrush,
               WaterJets, Bubbles, Sparkle, WalletCard, StampRow, FlyingStamp, VisitCounter,
               RollNumber, Drop, Logo
scripts/  make-audio.py · master-audio.sh · preview-frames.mjs
```

## Loop
El frame 0 es solo el fondo verde y los últimos 10 frames se funden a ese mismo fondo.

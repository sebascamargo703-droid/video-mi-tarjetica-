# Mi Tarjetica — TapSello (Reel) + carruseles de Instagram

Este proyecto tiene dos cosas que comparten los mismos tokens de marca (`src/brand.ts`):
1. **TapSello**, el Reel "Mira lo que le pasa al celular de tu cliente".
2. **Un sistema de carruseles** editoriales para Instagram (láminas estáticas 1080×1350).

---

## TapSello — "Mira lo que le pasa al celular de tu cliente"

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

---

## Carruseles de Instagram

Láminas estáticas 1080×1350 (4:5), un `<Still>` por lámina con id `<carrusel>-<n>`.

```bash
node scripts/render-carousels.mjs                  # exporta todos
node scripts/render-carousels.mjs como-funciona    # solo uno
```

Resultado: `out/carousels/<id>/01.png, 02.png…` + `caption.txt` (el texto para pegar en Instagram). El script avisa si alguna lámina pasa de 25 palabras.

### Agregar un carrusel nuevo (solo editando `src/carousels.ts`)

Agrega un objeto al arreglo `carousels`:

```ts
{
  id: "mi-carrusel",            // minúsculas y guiones: será la carpeta y el id de cada lámina
  theme: "dark",                // "dark" (negro) o "light" (blanco)
  caption: "Texto de la publicación 👇",
  slides: [
    { type: "cover", title: "Titular de\nhasta 4 líneas con\nuna palabra *clave*", subtitle: "Opcional" },
    { type: "point", number: "01", title: "Título", text: "Texto corto, máximo 25 palabras por lámina." },
    { type: "stat", value: "$425.000", context: "Una línea de contexto.", note: "Nota pequeña opcional." },
    { type: "compare", before: "Lo de antes", after: "Lo de ahora" },
    { type: "card", title: "Texto sobre la *tarjeta.*" },
    { type: "cta" },
  ],
}
```

Listo: aparece en Studio (`npx remotion studio`, una carpeta por carrusel) y el script lo exporta. No hay que tocar `Root.tsx` ni las plantillas.

| Tipo | Qué muestra |
|---|---|
| `cover` | Titular enorme (hasta 4 líneas; se achica solo si una línea no cabe), subtítulo gris opcional y "Desliza →" |
| `point` | Número grande en color de marca (opcional), título y texto corto |
| `stat` | Cifra gigante (todas las cifras de un carrusel miden igual), línea de contexto y nota gris opcional |
| `compare` | "Antes" en gris tachado vs. "Con Mi Tarjetica" en color de marca |
| `card` | Texto arriba y el mockup de la tarjeta de Wallet (datos en `cardCopy`) |
| `cta` | Logo, "Créala gratis en mitarjetica.com" y "Gratis hasta 20 clientes · Sin tarjeta de crédito" (en `ctaCopy`) |

Reglas de texto: `*palabra*` = color de marca, `\n` = salto de línea.

Diseño (en `src/carousel/CarouselSlide.tsx`): márgenes de 96 px, logo arriba a la izquierda, puntos de página abajo, misma escala tipográfica por tipo de lámina. Contraste AA: sobre negro el gris es `#86868B` (5.5:1) y el acento menta (11:1); sobre blanco el gris es `#6E6E73` (5.1:1) y el acento verde de marca (9.1:1).

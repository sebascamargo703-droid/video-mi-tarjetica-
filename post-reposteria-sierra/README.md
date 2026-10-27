# Post "Repostería Sierra ya usa Mi Tarjetica"

Carrusel de Instagram de 5 láminas (1080×1350) hecho con las fotos reales del negocio
(`public/photos/`) y su etiqueta (`public/sierra-logo.png`, extraída de ETIQUETA_NEGOCIO.pdf).

1. Portada: red velvet a sangre + etiqueta de Sierra + "Repostería Sierra ya tiene su tarjeta de sellos."
2. "Cada brownie, un sello." con dos fotos en arco.
3. La tarjeta de sellos de Sierra (mantequilla y cacao, como su etiqueta) en el celular.
4. La mesa llena de brownies + "Al décimo sello, el premio llega solo."
5. CTA para otras reposterías: "Crea tu tarjeta gratis en 5 minutos."

Las fotos se editan con código (`components/Photo.tsx`): recorte 4:5, un poco más de contraste,
saturación y calidez, y viñeta suave.

## Exportar
```bash
npm install
node scripts/render-post.mjs     # → out/post/reposteria-sierra/01.png … 05.png + caption.txt
```
Sin internet: `REMOTION_LOCAL_FONTS=1`. Navegador propio: `REMOTION_BROWSER=/ruta/a/chrome`.

## Qué editar
- Textos, cuenta de Instagram, cliente, premio y sellos de ejemplo: `src/post.ts`.
  **El premio "Un brownie gratis" es de ejemplo**: cámbialo por el real de Sierra antes de publicar.
- Colores: `src/brand.ts`. Fotos: reemplaza los archivos de `public/photos/` con el mismo nombre.
- Logo de Mi Tarjetica: si existen `public/logo.svg` / `public/logo-light.svg` se usan; si no,
  se ve el wordmark provisional "MiTarjetica" en Inter 800.

# Post "Tu brownie favorito ahora te da premio" (Repostería Sierra × Mi Tarjetica)

Carrusel de Instagram de 5 láminas (1080×1350) para que lo publique Repostería Sierra: le habla
a SUS clientes para que se les antoje, compren y guarden su tarjeta de sellos. Usa las fotos
reales del negocio (`public/photos/`) y su etiqueta (`public/sierra-logo.png`, de ETIQUETA_NEGOCIO.pdf).

1. Portada: red velvet a sangre + "Tu brownie favorito ahora te da premio."
2. "Red velvet, con Oreo o con galleta." con dos fotos en arco: cada brownie suma un sello.
3. Cómo se usa en 3 pasos + la tarjeta de sellos de Sierra en el celular.
4. La mesa llena de brownies + "Al décimo sello, el brownie va por nuestra cuenta."
5. "¿Se te antojó?": pide hoy, escríbenos por DM y aparta los tuyos.

Las fotos se editan con código (`components/Photo.tsx`): recorte 4:5, un poco más de contraste,
saturación y calidez, y viñeta suave.

## Exportar
```bash
npm install
node scripts/render-post.mjs     # → out/post/reposteria-sierra/01.png … 05.png + caption.txt
```
Sin internet: `REMOTION_LOCAL_FONTS=1`. Navegador propio: `REMOTION_BROWSER=/ruta/a/chrome`.

## Qué editar
- Textos, cuenta de Instagram, premio y sellos de ejemplo: `src/post.ts`.
  **El premio "Un brownie gratis" es de ejemplo**: cámbialo por el real de Sierra antes de publicar.
- Colores: `src/brand.ts`. Fotos: reemplaza los archivos de `public/photos/` con el mismo nombre.
- Logo de Mi Tarjetica: si existen `public/logo.svg` / `public/logo-light.svg` se usan; si no,
  se ve el wordmark provisional "MiTarjetica" en Inter 800.

## Cartel de mostrador (A5 para imprimir)
`Still` `mostrador` (1748×2480 = A5 a 300 ppp), estilo "pop retro" que combina con la etiqueta de
Sierra: fondo cacao con rayos de sol, fotos como stickers circulares, sello estrellado "5 visitas = 1
gratis", "BROWNIE ¡GRATIS!" gigante con sombra sólida, ticket de 5 sellos, el **QR real** del
comercio y 3 pasos para registrarse.
- El QR está en `src/qr.ts` como matriz de módulos, sacada del "Cartel para imprimir — Mi Tarjetica.pdf"
  y verificada: abre `https://app.mitarjetica.com/reposteria-sierra`. Si cambia el enlace, reemplázala
  con la del nuevo cartel.
- El logo de Mi Tarjetica (`public/mitarjetica-logo.png`) también sale de ese PDF.
- Textos: `src/mostrador.ts`. Diseño: `src/Mostrador.tsx`.
- PDF para imprenta: `python3 -c "from PIL import Image; Image.open('out/mostrador.png').convert('RGB').save('out/mostrador.pdf','PDF',resolution=300.0)"`

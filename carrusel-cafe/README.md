# Carrusel "Café Tres Granos" (bait-and-switch)

Carrusel de Instagram de 8 láminas (1080×1350) para dueños de cafeterías y panaderías:
la lámina 1 provoca con un "SE BUSCA" a una cafetería que "no pagó", las láminas 2–6 listan
"Lo que usaste:" (las funciones reales de Mi Tarjetica) y la 8 revela que la cafetería no existe.

## Exportar

```bash
npm install
node scripts/render-carousels.mjs                  # todos los carruseles
node scripts/render-carousels.mjs cafe-no-pagaste  # solo este
```

Sale en `out/carousels/cafe-no-pagaste/01.png … 08.png` + `caption.txt`. El script avisa si
una lámina pasa de 30 palabras (sin contar el texto dentro de los mockups).
Vista previa en vivo: `npx remotion studio` (cada lámina es una `<Still>` `cafe-no-pagaste-1…8`).
Sin internet: antepón `REMOTION_LOCAL_FONTS=1` (usa las fuentes de `public/fonts`; la de
Fraunces es la variable con eje óptico). Navegador propio: `REMOTION_BROWSER=/ruta/a/chrome`.

## Qué editar

| Quiero cambiar… | Dónde |
|---|---|
| Nombre de la cafetería ficticia, cliente, premio, sellos | `fake` en `src/carousels.ts` (los textos que lo mencionan se arman solos) |
| Cifras de la lámina 4 (ticket, visitas por semana, semanas) | `math` en `src/carousels.ts` (el total se calcula solo) |
| Cualquier texto o el caption | `slides` y `caption` en `src/carousels.ts` |
| Colores | `palette` en `src/brand.ts` |
| Márgenes, posiciones de título, notas y puntos | `grid` en `src/brand.ts` |

### Logo
Si existen `public/logo.svg` (fondos claros) y `public/logo-white.svg` (fondos verdes), se usan
automáticamente. **Ahora no existen**, así que las láminas muestran un wordmark provisional
"MiTarjetica" en Inter 800: copia ahí los archivos reales del logo y vuelve a exportar.

### Foto de la lámina 1
Si pones `public/photos/cafe-1.jpg`, aparece dentro del arco del "SE BUSCA"; si no, se dibuja la
fachada ilustrada de la cafetería.

### Colores y contraste
`brand` #145B44, `bgCream` #FAF7F5, `latte` #E9DCCB, `coffee` #6B4423, `caramel` #C8963E,
`ink` #2B1D14, `inkSecondary` #6E5B4E; sobre verde: blanco, #A7D7C5 y #8FE3C0.
El caramelo #C8963E no cumple AA como texto sobre crema/latte (2.5:1 y 1.97:1), así que se usa
solo en líneas y adornos; los números "01"–"05" usan `caramelText` #7A531A en láminas claras y
`caramelOnGreen` #E4C17E en las verdes. Todos los pares están documentados en `brand.ts`.

## Estructura

```
src/
  carousels.ts   copy y datos (id "cafe-no-pagaste")
  brand.ts       paleta, contraste y grilla
  Root.tsx       una <Still> por lámina
  Slide.tsx      elige la plantilla de cada lámina
  slides/        WantedSlide · PhoneSlides (tarjeta, notificación) · LightSlides (clientes,
                 cuenta, wallet, chat) · RevealSlide
  components/    SlideFrame (fondo, logo, título, nota, "Lo que usaste:"), Arch, Phone,
                 CoffeeCard, QrCode, Ornaments (rama, granos, taza), BrandLogo, Dots
scripts/render-carousels.mjs
```

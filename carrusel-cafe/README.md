# Carrusel "Café Tres Granos" (bait-and-switch)

Carrusel de Instagram de 9 láminas (1080×1350) para dueños de cafeterías y panaderías:
la lámina 1 provoca con un "SE BUSCA" a una cafetería que "no pagó", las láminas 2–7 listan
"Lo que usaste: 01–06" (tarjeta, aviso por cercanía, cumpleaños, clientes, cuenta y Wallet), la 8
es el chat "Lo intentamos en privado" y la 9 revela que la cafetería no existe.

## Exportar

```bash
npm install
node scripts/render-carousels.mjs                  # todos los carruseles
node scripts/render-carousels.mjs cafe-no-pagaste  # solo este
```

Sale en `out/carousels/cafe-no-pagaste/01.png … 09.png` + `caption.txt`. El script avisa si
una lámina pasa de 30 palabras (sin contar el texto dentro de los mockups).
Vista previa en vivo: `npx remotion studio` (cada lámina es una `<Still>` `cafe-no-pagaste-1…9`).
Sin internet: antepón `REMOTION_LOCAL_FONTS=1` (usa las fuentes de `public/fonts`; la de
Fraunces es la variable con eje óptico). Navegador propio: `REMOTION_BROWSER=/ruta/a/chrome`.

## Qué editar

| Quiero cambiar… | Dónde |
|---|---|
| Nombre de la cafetería ficticia, cliente, premio, sellos | `fake` en `src/carousels.ts` (los textos que lo mencionan se arman solos, incluido "Te faltan 2 sellos") |
| Cifras de la lámina 4 (ticket, visitas por semana, semanas) | `math` en `src/carousels.ts` (el total se calcula solo) |
| Cualquier texto o el caption | `slides` y `caption` en `src/carousels.ts` |
| Colores | `palette` en `src/brand.ts` |
| Márgenes, posiciones de título, notas y puntos | `grid` en `src/brand.ts` |

### Logo
Si existen `public/logo.svg` (fondos claros) y `public/logo-light.svg` (en #F6F4EB, para fondos
verdes), se usan automáticamente. **Ahora no existen**, así que las láminas muestran un wordmark provisional
"MiTarjetica" en Inter 800: copia ahí los archivos reales del logo y vuelve a exportar.

### Foto de la lámina 1
Si pones `public/photos/cafe-1.jpg`, aparece dentro del arco del "SE BUSCA"; si no, se dibuja la
fachada ilustrada de la cafetería.

### Colores y contraste
`brand` #145B44, `light` #F6F4EB, `latte` #E9DCCB, `coffee` #6B4423, `caramel` #C8963E,
`ink` #2B1D14, `inkSecondary` #6E5B4E; sobre verde: `light`, #A7D7C5 y #8FE3C0.
**No se usa #FFFFFF en ninguna parte**: el color más claro es `light` #F6F4EB (también en vidrios,
bordes y brillos, vía `lightA()`); hasta los emoji se oscurecen un 4 % (`components/Emoji.tsx`).
Paneles, burbujas y tarjetas claras van sobre latte o verde, nunca `light` sobre `light`.
El caramelo #C8963E no cumple AA como texto sobre crema/latte (2.5:1 y 1.97:1), así que se usa
solo en líneas y adornos; los números "01"–"06" usan `caramelText` #7A531A en láminas claras y
`caramelOnGreen` #E4C17E en las verdes. Todos los pares están documentados en `brand.ts`.

## Estructura

```
src/
  carousels.ts   copy y datos (id "cafe-no-pagaste")
  brand.ts       paleta, contraste y grilla
  Root.tsx       una <Still> por lámina
  Slide.tsx      elige la plantilla de cada lámina
  slides/        WantedSlide · PhoneSlides (tarjeta, cumpleaños) · NearbySlide (mapa + aviso)
                 · LightSlides (clientes, cuenta, wallet, chat) · RevealSlide
  components/    SlideFrame (fondo, logo, título, nota, "Lo que usaste:"), Arch, Phone,
                 LockNotification, CoffeeCard, QrCode, Ornaments (rama, granos, taza),
                 BrandLogo, Dots, Emoji
scripts/render-carousels.mjs
```

## Comprobar que no hay blanco puro

```bash
python3 -c "import numpy as np,PIL.Image as I,glob;[print(f,int(((np.asarray(I.open(f).convert('RGB'))==255).all(2)).sum())) for f in sorted(glob.glob('out/carousels/cafe-no-pagaste/*.png'))]"
```
Cada lámina debe dar 0.

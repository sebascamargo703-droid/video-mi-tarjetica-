# Historias "Precios" (destacada de Instagram)

8 historias 1080×1920 + la portada de la destacada, como imágenes estáticas:

| # | Historia | Fondo |
|---|---|---|
| 1 | Precios claros. Sin letra pequeña. | verde |
| 2 | Plan Gratis | latte |
| 3 | Plan Emprendedor | verde |
| 4 | Plan Profesional ("El más escogido", con borde) | latte |
| 5 | Plan Empresa | verde |
| 6 | Mensual vs. anual (2 meses gratis) | light |
| 7 | Plan a la medida ("Hablemos") | latte |
| 8 | Garantías + CTA (con espacio libre para el sticker de enlace) | verde |
| portada | Etiqueta de precio sobre verde plano (cabe en el círculo de 600 px) | verde |

## Actualizar precios y volver a renderizar

1. Abre `src/pricing.ts` y cambia los números de `plans` (`monthly`, `yearly`), los nombres,
   descripciones o lo que incluye cada plan (máximo 5 líneas; la primera "Todo lo de…" va en gris).
   Los precios van en pesos, sin puntos: `29900`.
2. Se recalculan solos: el ahorro anual ("Te ahorras $59.800" = 12 × mensual − anual), el
   "Desde $29.900 al mes." de la portada y la tabla de la historia 6. El formato siempre es
   `$29.900` (separador de miles colombiano, cifras tabulares).
3. Exporta:

```bash
npm install
node scripts/render-stories.mjs
```

Sale en `out/stories/precios/01.png … 08.png` y `out/stories/precios/portada.png`.
Vista previa: `npx remotion studio` (`precios-1` … `precios-8` y `precios-portada`).
Sin internet: antepón `REMOTION_LOCAL_FONTS=1`. Navegador propio: `REMOTION_BROWSER=/ruta/a/chrome`.

Si cambias el descuento anual, ajusta también el titular de la historia 6 en `copy.yearly.title`
("2 meses gratis" es correcto mientras el anual sea 10 × el mensual).

## Logo
Si existen `public/logo.svg` (fondos claros) y `public/logo-light.svg` (#F6F4EB, fondos verdes) se
usan solos. **Ahora no existen**, así que se ve un wordmark provisional "MiTarjetica" en Inter 800.

## Reglas de diseño que ya cumple
- Zonas seguras: nada importante en los 250 px de arriba ni en los 340 px de abajo; márgenes de 96 px.
- Logo arriba a la izquierda e indicador "Precios · n/8" en todas las historias.
- En la 8, el rectángulo de 900×220 px entre los 1.250 y 1.500 px queda vacío para el sticker de enlace.
- Sin #FFFFFF: el color más claro es `light` #F6F4EB. Tarjetas light solo sobre verde o latte.
- Contraste AA en todo el texto (pares documentados en `src/brand.ts`). La etiqueta de ahorro usa
  fondo caramelo #C8963E con texto ink (6.1:1), porque el caramelo como texto no alcanza AA.

Comprobar que no hay blanco puro (debe dar 0 en cada archivo):

```bash
python3 -c "import numpy as np,PIL.Image as I,glob;[print(f,int(((np.asarray(I.open(f).convert('RGB'))==255).all(2)).sum())) for f in sorted(glob.glob('out/stories/precios/*.png'))]"
```

## Estructura
```
src/
  pricing.ts      precios, planes y copy (lo único que hay que tocar para actualizar)
  brand.ts        paleta, contraste y zonas seguras
  Root.tsx        <Still> precios-1…8 y precios-portada
  Story.tsx       fondo de cada historia y su contenido
  stories/        portada, planes, anual, a la medida, cierre, portada de destacada
  components/     PlanCard, StoryFrame (logo + indicador + titular), Icons, BrandLogo
scripts/render-stories.mjs
```

# Cenefa "En este lavadero usamos Meguiar's"

Imagen horizontal 4:1 (6000×1500 px) para poner como cenefa en un lavadero de carros que usa
productos Meguiar's: fondo negro con franjas racing doradas y rojas, banderas a cuadros, gotas de
cera perladas, destellos, el logo y la línea de productos a los lados y, al centro,
"EN ESTE LAVADERO · USAMOS · PRODUCTOS PROFESIONALES · LAVADO · ENCERADO · BRILLO · INTERIORES".

## Versión de venta (`CenefaVenta`)
Diseño sobrio y premium para el punto de venta: negro con luz de estudio, marco dorado fino,
logo a la izquierda, "DE VENTA AQUÍ · Aquí puedes comprar **tus productos Meguiar's**", tres
mensajes con íconos (Calidad profesional · Los mismos que usamos en tu carro · Pídelos en caja)
y los productos en vitrina con reflejo. Archivos: `cenefa-venta-meguiars-*`.

## Versión sin texto (`CenefaLogo`)
Solo el logo y los productos, sin ninguna palabra: luz de estudio, rayos dorados detrás del logo,
cintas de "cera líquida" dorada y roja que cruzan la cenefa, bokeh dorado, destellos y vitrina
con reflejo. El logo y los productos van recortados del fondo negro
(`public/meguiars-logo-cutout.png`, `public/meguiars-productos-cutout.png`).
Archivos: `cenefa-solo-logo-meguiars-*`.

## Versión sin texto con los productos de referencia (`CenefaProductos`)
Logo al centro con rayos dorados; a la izquierda All Wheel Cleaner, Cleaner Wax y el kit
Polish + Compound + Hybrid Ceramic Wax; a la derecha la línea de limpieza (Wash & Wax, Quik
Detailer, Quik Wax, Interior, Hot Rims, Glass) y Ultimate Compound. Los productos están en
`public/productos/` recortados de su fondo blanco. Archivos: `cenefa-productos-meguiars-*`.

## Exportar
```bash
npm install
REMOTION_LOCAL_FONTS=1 npx remotion still src/index.ts Cenefa out/cenefa-meguiars.png --image-format=png
REMOTION_LOCAL_FONTS=1 npx remotion still src/index.ts CenefaVenta out/cenefa-venta.png --image-format=png
REMOTION_LOCAL_FONTS=1 npx remotion still src/index.ts CenefaLogo out/cenefa-logo.png --image-format=png
REMOTION_LOCAL_FONTS=1 npx remotion still src/index.ts CenefaProductos out/cenefa-productos.png --image-format=png
```
Textos: `src/copy.ts` (`copy` y `venta`). Diseño: `src/Cenefa.tsx` y `src/CenefaVenta.tsx`.

## Tamaños de impresión
6000×1500 px = 200×50 cm a 76 ppp (bien para verse a distancia) o 120×30 cm a 127 ppp.
Para otra proporción de cenefa, cambia `SIZE` en `src/Cenefa.tsx` (mantén 4:1 o ajusta posiciones).

## Importante: logo y fotos de producto
- `public/meguiars-logo.png` y `public/meguiars-productos.png` salen de la imagen de referencia
  (1136×279 px) ampliados ×4, así que de cerca se ven algo suaves. Para la versión final pide al
  distribuidor de Meguiar's el **logo en vector (AI/EPS/SVG)** y fotos de producto en alta, y
  reemplaza esos dos archivos con el mismo nombre.
- Meguiar's es una marca registrada: antes de imprimir, confirma con el distribuidor que el
  lavadero puede usar su logo en la señalización (muchas veces ellos mismos entregan material POP).

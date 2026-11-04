# Banner de YouTube — Meguiar's

La cenefa de productos adaptada al banner de YouTube: 2560×1440 px (recomendado; el mínimo es
2048×1152 y máximo 6 MB). YouTube muestra un recorte distinto en cada dispositivo, así que el logo,
el kit de pulido, la Cleaner Wax en pasta, el Ultimate Compound y los Air Re-Fresher van en la
**zona segura central de 1546×423** (lo único que se ve en celular). Los demás productos completan
la franja de 2560×423 del computador, y el fondo (rayos, cintas, marco) llena la pantalla completa en TV.
Sube `banner-youtube-meguiars-2560x1440.jpg` (0.6 MB) en YouTube Studio → Personalización →
Perfil → Imagen del banner → Subir, y deja el recuadro de recorte como viene (toda la imagen).
`guia-recorte-youtube.jpg` muestra qué se ve en TV, computador, tablet y celular.

Se genera desde `../../cenefa-meguiars/` con
`REMOTION_LOCAL_FONTS=1 npx remotion still src/index.ts BannerYouTube out/banner-youtube.png`.


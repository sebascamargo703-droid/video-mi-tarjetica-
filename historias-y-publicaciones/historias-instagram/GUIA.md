# Serie de historias para Instagram — Mi Tarjetica

8 historias en video (1080×1920, MP4 con voz femenina + música suave) que cuentan una historia completa:
**pregunta → problema → solución → cómo funciona → confianza → objeción → oferta → link**.
Cada una trae también su portada en PNG por si prefieres publicarla como imagen.

Súbelas **en este orden, el mismo día** (las historias duran 24 h; después guárdalas en un *Destacado* llamado "Mi Tarjetica").

| # | Archivo | Duración | Qué dice la voz | Sticker nativo que debes agregar en Instagram |
|---|---------|----------|-----------------|-----------------------------------------------|
| 1 | `IG01-Pregunta.mp4` | 9 s | ¿Sabes cuántos clientes no volvieron este mes? Muchas veces no es el servicio... es que se les olvida volver. | **Encuesta** abajo de las figuras (zona libre ~ a ¾ de la pantalla): "¿Te ha pasado?" → *Sí, mucho* / *A veces* |
| 2 | `IG02-Recordatorio.mp4` | 9,5 s | Mi Tarjetica se lo recuerda. Cuando pasa cerca de tu negocio, le llega un aviso directo a su celular. | **Deslizador de emoji** 😍 arriba del teléfono, a un lado: "¿Te gustaría que tus clientes reciban esto?" |
| 3 | `IG03-ComoFunciona.mp4` | 11 s | Así de fácil: tu cliente guarda la tarjeta en su celular, sin descargar apps. Cada visita, le pones un sello. Y al completarla, gana su premio. | Ninguno (deja que se lea). Opcional: **Pregunta** "¿Qué premio darías?" |
| 4 | `IG04-Sellos.mp4` | 7 s | Cada sello lo acerca a su premio... y a volver a tu negocio. | Ninguno — es la historia "satisfactoria" (los sellos suenan uno a uno). |
| 5 | `IG05-Control.mp4` | 8,5 s | Y tú lo controlas todo. Cada sello queda firmado con cajero, hora y caja. ¡Cero trampa! | Opcional: **Cuestionario** "¿Alguna vez te regalaron sellos de más?" |
| 6 | `IG06-Mito.mp4` | 8 s | ¿Crees que tus clientes no van a descargar otra app? Tranqui: no tienen que descargar nada. | **Cuestionario** antes de publicar: "¿El cliente tiene que descargar una app?" → *Sí* / *No* ✅ |
| 7 | `IG07-Gratis.mp4` | 10 s | Empieza gratis, hasta veinte clientes. No necesitas tarjeta de crédito. Y cuando crezcas, desde $29.900 al mes. | **Cuenta regresiva** en la zona libre de abajo (si tienes una fecha de campaña) o **Link** a mitarjetica.com |
| 8 | `IG08-Link.mp4` | 8 s | Toca el enlace y crea tu tarjeta hoy. Tus clientes van a volver más seguido. | **Link** → `https://www.mitarjetica.com` justo debajo de la flecha "TOCA EL LINK" |

## Consejos
- Deja la **música de Instagram apagada**: cada historia ya trae voz y música mezcladas al volumen estándar de Instagram.
- Las zonas de arriba (nombre de la cuenta) y de abajo (barra de respuesta) quedaron libres; no tapes los textos con stickers.
- Publica entre **11 a. m.–1 p. m. o 6–8 p. m.**, cuando los dueños de negocio suelen revisar el celular (ajústalo con las estadísticas de tu cuenta).
- Responde rápido a quien vote en la encuesta o conteste el cuestionario: es el mejor momento para escribirle por DM.

## Editar
- Textos en pantalla: `mi-tarjetica-launch/src/social/instagram/copy.ts`
- Voz (texto, momento y velocidad): `mi-tarjetica-launch/src/social/instagram/voice.json` → `python scripts/make-voice.py --models … --stories`
- Exportar de nuevo: `npm run render:social -- --only=IG` (o `node scripts/render-social.mjs --only=IG`)

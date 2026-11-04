/**
 * Textos en pantalla de la serie de historias de Instagram.
 * (La voz de cada historia está en ./voice.json.)
 * `*palabra*` = color de acento · `\n` = salto de línea.
 */
export const copyIG = {
  pregunta: {
    kicker: "Pregunta rápida",
    title: "¿Cuántos clientes\nno volvieron\n*este mes?*",
    sub: "Muchas veces, simplemente\n*se les olvida volver.*",
  },
  recordatorio: {
    title: "Mi Tarjetica\nse lo *recuerda.*",
    sub: "Cuando pasa cerca de tu negocio.",
  },
  comoFunciona: {
    kicker: "Así de fácil",
    title: "3 pasos.\nCero *enredos.*",
    steps: [
      { title: "La guarda", sub: "En su Wallet, sin apps." },
      { title: "Suma sellos", sub: "Uno por cada visita." },
      { title: "Gana su premio", sub: "Y vuelve por más." },
    ],
  },
  sellos: {
    title: "Cada sello\nlo *acerca.*",
    sub: "…y lo hace *volver.*",
  },
  control: {
    title: "Tú lo controlas\n*todo.*",
    sub: "Cajero, hora, caja y dispositivo.",
    badge: "¡Cero trampa!",
  },
  mito: {
    mythLabel: "MITO",
    myth: "“Mis clientes no van a\ndescargar otra app.”",
    realityLabel: "REALIDAD",
    reality: "No tienen que\ndescargar *nada.*",
  },
  gratis: {
    kicker: "Plan gratis",
    title: "clientes *gratis.*",
    bullets: ["Sin tarjeta de crédito", "Luego, desde $29.900 COP/mes"],
  },
  link: {
    title: "Crea tu tarjeta\n*hoy.*",
    sub: "Tus clientes van a volver más seguido.",
    tap: "Toca el link",
  },
} as const;

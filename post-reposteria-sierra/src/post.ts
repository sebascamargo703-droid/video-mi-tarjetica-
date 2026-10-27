/**
 * Copy del post (solo datos), dirigido a los CLIENTES de Repostería Sierra: que se les antoje,
 * compren y guarden su tarjeta de sellos. Cambia aquí textos, cuenta, premio o sellos.
 */
export const business = {
  name: "Repostería Sierra",
  handle: "@reposteria_.sierra",
  since: "2021",
  /** Tarjeta de ejemplo (confirma el premio real con el negocio antes de publicar). */
  customer: "Tu nombre",
  reward: "Un brownie gratis",
  stamps: 7,
  total: 10,
};

export const slides = {
  cover: {
    eyebrow: "NUEVO EN REPOSTERÍA SIERRA",
    title: "Tu brownie favorito ahora te da premio.",
    swipe: "Desliza →",
  },
  brownies: {
    title: "Red velvet, con Oreo o con galleta.",
    text: "Elige tu favorito: cada brownie que compres suma un sello.",
  },
  card: {
    title: "Tu tarjeta de sellos, siempre en tu celular.",
    steps: ["Pide tu brownie", "Escanea el QR al pagar", "Guárdala y suma sellos"],
    note: "Apple Wallet o Google Wallet · Gratis · Sin apps",
  },
  table: {
    title: "Al décimo sello, el brownie va por nuestra cuenta.",
    text: "Sin cartón que se pierda: tus sellos quedan guardados.",
  },
  cta: {
    title: "¿Se te antojó?",
    cta: "Pide hoy y empieza a sumar sellos.",
    how: `Escríbenos por DM a ${"@reposteria_.sierra"} y aparta los tuyos.`,
    sub: "Tarjeta de sellos con Mi Tarjetica · Gratis para ti",
  },
};

export const caption = `¡Tus brownies favoritos ahora tienen premio! 🍫✨

En ${business.name} cada brownie que compras suma un sello en tu celular. Al completar ${business.total} sellos, el siguiente va por nuestra cuenta 🎁

¿Cómo empiezo?
1️⃣ Pide tu brownie (red velvet, con Oreo o con galleta)
2️⃣ Escanea el QR al pagar
3️⃣ Guarda tu tarjeta en Apple Wallet o Google Wallet

Sin apps y sin cartón que se pierda. Escríbenos por DM y aparta los tuyos 👉 ${business.handle}

#brownies #reposteria #redvelvet #antojos #postres #emprendimientocolombiano`;

export const TOTAL = 5;

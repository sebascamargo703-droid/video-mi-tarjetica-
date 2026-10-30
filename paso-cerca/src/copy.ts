/**
 * Textos del video. Cambia el negocio, la promo y la notificación aquí para
 * reusar el video con otros negocios y promos (no hay que tocar animaciones).
 * En los titulares, `*palabra*` sale en color de marca y `\n` es salto de línea.
 */
export const business = {
  /** Nombre del negocio (pin del mapa, notificación y tarjeta). */
  name: "La Terraza",
  /** Emoji que acompaña el nombre en la etiqueta del mapa. */
  emoji: "🍻",
  /** Ícono del negocio: "beer" | "coffee" | "scissors" | "star". */
  icon: "beer" as "beer" | "coffee" | "scissors" | "star",
};

export const promo = {
  /** Texto del badge circular grande. */
  badge: "2x1",
  /** Banda destacada en la tarjeta del Wallet. */
  band: `PROMO HOY · 2x1 en micheladas`,
  /** Mostrar las micheladas ilustradas junto a la tarjeta (ponlo en false para otros productos). */
  showDrinks: true,
};

export const notification = {
  app: business.name,
  when: "ahora",
  body: "🍻 Hoy 2x1 en micheladas. Estás a media cuadra: muestra tu tarjeta en caja.",
};

export const card = {
  stampsLabel: "SELLOS",
  stamps: 4,
  total: 8,
  customerLabel: "CLIENTE",
  customer: "Laura Gómez",
  rewardLabel: "PREMIO",
  reward: "Una michelada gratis",
};

export const copy = {
  hook: "Tu cliente va\npasando por\ntu *negocio* 📍",
  mapTop: "Con el celular en el *bolsillo.*",
  lockTime: "7:42",
  lockDate: "viernes 9 de octubre",
  outside: "Le aparece *solo,* al pasar cerca.",
  cta: {
    title: "Tus promos, en el\nbolsillo de tus *clientes.*",
    url: "mitarjetica.com",
    sub: "Aviso por cercanía desde $29.900 al mes",
  },
};

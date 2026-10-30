/**
 * Textos y datos del video. Cambia negocio, clienta, fecha, servicio y descuento aquí
 * (y los colores del negocio en brand.ts → `biz`) para sacar otras versiones sin tocar
 * la animación. En titulares, `*palabra*` = color de acento y `\n` = salto de línea.
 */
export const business = {
  name: "Bella Nails",
  /** Ícono del negocio: "nail" | "scissors" | "coffee" | "spa". */
  icon: "nail" as "nail" | "scissors" | "coffee" | "spa",
  /** Ilustración junto a la tarjeta: "nail-polish" (esmalte) | "gift" (regalo, sirve para cualquier negocio). */
  product: "nail-polish" as "nail-polish" | "gift",
};

export const customer = {
  firstName: "Laura",
  fullName: "Laura Gómez",
};

/** Día del cumpleaños (el calendario, el día de la semana y la fecha del bloqueo se calculan solos). */
export const birthday = { year: 2026, month: 10, day: 14 };

export const offer = {
  service: "manicure",
  discount: "20\u00A0%",
  /** Badge circular. */
  badge: "-20\u00A0%",
};

/** Hora en que llega la notificación (el reloj rueda desde `before` hasta `at`). */
export const clock = { before: "8:59", at: "9:00" };

export const card = {
  stamps: 5,
  total: 8,
  reward: "Una manicure gratis",
};

/* ---------- Textos derivados (normalmente no hace falta tocarlos) ---------- */
export const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
const bdayDate = new Date(birthday.year, birthday.month - 1, birthday.day);

export const notification = {
  app: business.name,
  when: "ahora",
  body: `🎂 Feliz cumpleaños, ${customer.firstName}. Hoy tu ${offer.service} tiene un ${offer.discount} de descuento.`,
};

export const copy = {
  hook: "Tu negocio se acuerda\ndel cumpleaños\nde tus *clientes.*",
  hookSub: "Tú no tienes que hacer nada.",
  calendarTop: "Llega el *día.*",
  calendarTitle: `${cap(MONTHS[birthday.month - 1])} ${birthday.year}`,
  calendarLegend: `Cumpleaños de ${customer.firstName}`,
  lockDate: `${WEEKDAYS[bdayDate.getDay()]} ${birthday.day} de ${MONTHS[birthday.month - 1]}`,
  outside: "Llega *sola,* el día exacto.",
  cardBandTitle: "🎂 REGALO DE CUMPLEAÑOS",
  cardBandText: `${offer.discount} en tu ${offer.service} · Válido hoy`,
  cta: {
    title: "Campaña de cumpleaños\n*automática.*",
    url: "mitarjetica.com",
    sub: "Incluida en el plan Profesional",
  },
};

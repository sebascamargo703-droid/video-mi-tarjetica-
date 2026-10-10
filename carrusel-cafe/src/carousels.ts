/**
 * Copy de los carruseles (solo datos). Cada lámina se registra en Root.tsx como
 * `<Still id={`${carousel.id}-${n}`} />` y se exporta con scripts/render-carousels.mjs.
 *
 * Para cambiar la cafetería ficticia, el cliente, las cifras o el premio, edita `fake` y
 * `math`: los textos que los mencionan se arman solos.
 */

/** La cafetería que "no pagó" (no existe). */
export const fake = {
  name: "Café Tres Granos",
  customer: "Laura Gómez",
  reward: "Un café gratis",
  stamps: 8,
  total: 10,
};

/** Cifras de la lámina 4 (en pesos colombianos). */
export const math = {
  ticket: 12000,
  visitsPerWeek: 2,
  weeks: 52,
};

/** "$12.000" con separador de miles colombiano. */
export const cop = (n: number) => `$${n.toLocaleString("es-CO").replace(/,/g, ".")}`;

export type Bg = "green" | "light" | "latte";

export type Slide =
  | { type: "wanted"; bg: Bg; title: string; business: string; text: string; swipe: string }
  | { type: "card"; bg: Bg; number: string; title: string; note: string }
  | {
      type: "nearby";
      bg: Bg;
      number: string;
      title: string;
      pinLabel: string;
      time: string;
      app: string;
      when: string;
      message: string;
      text: string;
      note: string;
    }
  | { type: "notification"; bg: Bg; number: string; title: string; date: string; time: string; app: string; when: string; message: string; note: string }
  | {
      type: "clients";
      bg: Bg;
      number: string;
      title: string;
      panelTitle: string;
      badge: string;
      rows: { name: string; phone: string; lastVisit: string; stamps: number; total: number; tag?: string }[];
    }
  | { type: "math"; bg: Bg; number: string; title: string; lines: { value: string; label: string }[]; total: { value: string; label: string }; per: string; note: string }
  | { type: "wallet"; bg: Bg; number: string; title: string; text: string }
  | { type: "chat"; bg: Bg; title: string; contact: string; messages: { text: string; day: string }[]; seen: string }
  | { type: "reveal"; bg: Bg; title: string; text: string; cta: string; url: string; sub: string };

export type Carousel = { id: string; chargeHeader: string; caption: string; slides: Slide[] };

const yearly = math.ticket * math.visitsPerWeek * math.weeks;

export const carousels: Carousel[] = [
  {
    id: "cafe-no-pagaste",
    /** Encabezado fijo de las láminas 2 a 7 (se leen como una lista de cargos). */
    chargeHeader: "Lo que usaste:",
    caption: `${fake.name} no existe y nadie nos debe nada ☕ Pero todo lo que usó sí es real: una tarjeta de sellos que vive en el celular de tus clientes, un aviso cuando pasan cerca de tu local, mensajes de cumpleaños que llegan solos y el nombre de cada cliente que vuelve. Créala gratis en 5 minutos 👉 mitarjetica.com
#cafeteria #cafecolombiano #cafedeespecialidad #fidelizaciondeclientes #barranquilla #emprendimiento`,
    slides: [
      {
        type: "wanted",
        bg: "latte",
        title: "SE BUSCA",
        business: fake.name.toUpperCase(),
        text: "Usaste todo lo que te dimos y nunca nos pagaste. Van tres meses. Lo intentamos por las buenas.",
        swipe: "Desliza →",
      },
      {
        type: "card",
        bg: "green",
        number: "01",
        title: "Una tarjeta de sellos que tus clientes nunca perdieron.",
        note: "Sin apps. Sin cartón. Escanean un QR y queda en su celular.",
      },
      {
        type: "nearby",
        bg: "latte",
        number: "02",
        title: "Les avisaba cuando pasaban cerca.",
        pinLabel: `${fake.name} ☕`,
        time: "4:12",
        app: fake.name,
        when: "ahora",
        message: `☕ Estás a media cuadra. Te faltan ${fake.total - fake.stamps} sellos para tu café gratis.`,
        text: "En la pantalla de bloqueo, sin abrir ninguna app.",
        note: "Aviso por cercanía desde el plan Emprendedor.",
      },
      {
        type: "notification",
        bg: "green",
        number: "03",
        title: "Y les escribía solo el día de su cumpleaños.",
        date: "miércoles 14 de octubre",
        time: "9:00",
        app: fake.name,
        when: "ahora",
        message: `🎂 Feliz cumpleaños, ${fake.customer.split(" ")[0]}. Hoy tu bebida favorita tiene un 20 % de descuento.`,
        note: "Campaña de cumpleaños incluida en el plan Profesional.",
      },
      {
        type: "clients",
        bg: "latte",
        number: "04",
        title: "El nombre y teléfono de cada cliente.",
        panelTitle: "Clientes",
        badge: "Datos de ejemplo",
        rows: [
          { name: fake.customer, phone: "300 ••• 4512", lastVisit: "Hoy", stamps: 8, total: 10 },
          { name: "Andrés Pérez", phone: "315 ••• 8820", lastVisit: "Ayer", stamps: 5, total: 10 },
          { name: "Camila Ortiz", phone: "301 ••• 1093", lastVisit: "Hace 62 días", stamps: 3, total: 10, tag: "No ha vuelto" },
        ],
      },
      {
        type: "math",
        bg: "light",
        number: "05",
        title: "Clientes que volvían más seguido.",
        lines: [
          { value: cop(math.ticket), label: "por visita" },
          { value: `× ${math.visitsPerWeek}`, label: "visitas por semana" },
        ],
        total: { value: `= ${cop(yearly)}`, label: "al año" },
        per: "Por cada cliente fiel.",
        note: `Ejemplo con ${math.weeks} semanas al año.`,
      },
      {
        type: "wallet",
        bg: "latte",
        number: "06",
        title: "Y todo vivía en el celular de tus clientes.",
        text: "En el mismo Wallet donde guardan lo importante. iPhone y Android.",
      },
      {
        type: "chat",
        bg: "light",
        title: "Lo intentamos en privado.",
        contact: fake.name,
        messages: [
          { text: `Hola, ${fake.name} ☕ ¿Hablamos de lo de la tarjeta?`, day: "lunes" },
          { text: "¿Sigues por ahí?", day: "miércoles" },
          { text: "Último intento 🙏", day: "viernes" },
        ],
        seen: "Visto",
      },
      {
        type: "reveal",
        bg: "green",
        title: `Tómate un tinto: ${fake.name} no existe.`,
        text: "Nadie nos debe nada. Pero todo lo que viste es real, y tu cafetería puede tenerlo hoy.",
        cta: "Crea tu tarjeta gratis en 5 minutos",
        url: "mitarjetica.com",
        sub: "Gratis hasta 20 clientes · Sin tarjeta de crédito",
      },
    ],
  },
];

/** Textos de la tarjeta de sellos que aparece en las láminas 2 y 6. */
export const cardCopy = { business: fake.name, stampsLabel: "SELLOS", customerLabel: "CLIENTE", rewardLabel: "PREMIO", customer: fake.customer, reward: fake.reward, stamps: fake.stamps, total: fake.total };

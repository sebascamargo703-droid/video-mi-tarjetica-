/**
 * Precios y copy de las historias "Precios" (solo datos). Cambia aquí un precio y vuelve a
 * renderizar: el ahorro anual, "Desde $X al mes" y la tabla de la historia 6 se recalculan solos.
 * Precios en pesos colombianos, sin decimales.
 */
export type Plan = {
  id: "gratis" | "emprendedor" | "profesional" | "empresa";
  name: string;
  description: string;
  /** Precio mensual (0 = gratis). */
  monthly: number;
  /** Precio pagando el año completo. */
  yearly?: number;
  /** Etiqueta opcional arriba a la derecha de la tarjeta. */
  badge?: string;
  /** La primera línea ("Todo lo del plan…, más:") va en gris. Máximo 5 líneas. */
  includes: string[];
};

export const plans: Plan[] = [
  {
    id: "gratis",
    name: "Gratis",
    description: "Para probar sin compromiso",
    monthly: 0,
    includes: ["Hasta 20 clientes", "Tarjeta en Apple y Google Wallet", "Sellos y canje de premios"],
  },
  {
    id: "emprendedor",
    name: "Emprendedor",
    description: "Para el que va empezando",
    monthly: 29900,
    yearly: 299000,
    includes: ["Todo lo del plan Gratis, más:", "Hasta 2.000 clientes", "2 usuarios", "Aviso cuando el cliente pasa cerca"],
  },
  {
    id: "profesional",
    name: "Profesional",
    description: "Para un negocio funcionando",
    monthly: 49900,
    yearly: 499000,
    badge: "El más escogido",
    includes: ["Todo lo de Emprendedor, más:", "Clientes ilimitados", "5 usuarios", "Campaña de cumpleaños automática"],
  },
  {
    id: "empresa",
    name: "Empresa",
    description: "Para operaciones grandes",
    monthly: 149900,
    yearly: 1499000,
    includes: ["Todo lo de Profesional, más:", "15 usuarios", "Correos ilimitados"],
  },
];

/** "$29.900": separador de miles colombiano, siempre igual. */
export const cop = (n: number) => `$${Math.round(n).toLocaleString("en-US").replace(/,/g, ".")}`;
/** Ahorro de pagar anual frente a 12 meses. */
export const savings = (p: Plan) => (p.yearly ? p.monthly * 12 - p.yearly : 0);
export const plan = (id: Plan["id"]) => plans.find((p) => p.id === id) as Plan;
export const paidPlans = plans.filter((p) => p.monthly > 0);
const cheapest = Math.min(...paidPlans.map((p) => p.monthly));

export const copy = {
  indicator: (n: number, total: number) => `Precios · ${n}/${total}`,
  perMonth: "/mes",
  perYear: "/año",
  orYearly: (p: Plan) => `o ${cop(p.yearly ?? 0)} al año`,
  saveTag: (p: Plan) => `Te ahorras ${cop(savings(p))}`,
  freeWord: "Gratis",

  cover: {
    title: "Precios claros.\nSin letra pequeña.",
    from: `Desde ${cop(cheapest)} al mes.`,
    free: "Y un plan gratis para empezar hoy.",
    tap: "Toca para ver los planes →",
  },
  below: {
    gratis: "Hasta 20 clientes · Sin tarjeta de crédito",
    emprendedor: "Ideal para negocios que están arrancando.",
    profesional: "El favorito de los negocios que ya tienen clientela fija.",
    empresa: "Para negocios con varias sedes o mucho equipo.",
  },
  yearly: {
    title: "Paga anual y llévate 2\u00a0meses gratis.",
    monthly: "Mensual",
    annual: "Anual",
    save: (p: Plan) => `Ahorras ${cop(savings(p))}`,
  },
  custom: {
    title: "¿Tu operación es más grande?",
    text: "Si necesitas más usuarios, más mensajes o algo que no ves acá, escríbenos y armamos el plan a la medida.",
    button: "Hablemos",
  },
  close: {
    guarantees: ["Sin contratos.", "Sin permanencia.", "Cancelas cuando quieras."],
    cta: "Crea tu tarjeta gratis en 5 minutos.",
    url: "mitarjetica.com",
  },
};

/** Orden de las 8 historias (n = posición). */
export const stories = ["cover", "gratis", "emprendedor", "profesional", "empresa", "yearly", "custom", "close"] as const;
export type StoryKind = (typeof stories)[number];

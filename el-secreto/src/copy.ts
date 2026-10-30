/**
 * Textos del video "El secreto". Starbucks solo se nombra (dato público); no se usa su logo ni su imagen.
 * Titulares: `[palabra]` → resaltador · `\n` → salto. Cada titular: [texto, palabra con la que entra].
 */
export const business = { name: "Tu negocio", short: "Tu negocio", emoji: "☕", icon: "coffee" as "beer" | "coffee" | "scissors" | "star" };
export const card = { stamps: 7, total: 8, customer: "Tu cliente", reward: "Un café gratis" };
export const notification = { app: "TU NEGOCIO", when: "Cerca", title: "Estás a media cuadra ☕", body: "Te falta 1 sello para tu premio. ¡Te esperamos!" };

export const copy = {
  lockTime: "9:41",
  lockDate: "jueves 6 de noviembre",
  stat1: { value: 13000, prefix: "+$", unit: "MILLONES DE DÓLARES", label: "gastados por los miembros de Starbucks Rewards en un solo año" },
  stat2: { value: 60, label: "de las ventas de sus tiendas propias en EE. UU." },
  source: "Fuente: Starbucks, año fiscal 2025",
  today: "HOY",
  tomorrow: "MAÑANA",
  reward: "PREMIO",
  visits: ["Visita 1", "Visita 2", "Visita 3", "Visita 5", "Visita 8"],
  chips: ["Sin crear una app", "Sellos en el celular", "Premios que hacen volver"],
  cta: { top: "COMENTA", word: "TARJETICA", sub: "y te mostramos cómo aplicarlo en tu negocio.", comment: "Añade un comentario…" },
};

export const headlines: Record<string, [string, string][]> = {
  h1: [
    ["EL SECRETO DE\n[STARBUCKS]", "secreto"],
    ["NO ES EL\n[CAFÉ.]", "no"],
  ],
  h2: [["ES UNA\n[ESTRELLA.]", "estrella"]],
  s2: [["ESPERA…", "espera"]],
  w1: [["¿POR\n[QUÉ?]", "qué"]],
  w2: [["UNA RAZÓN PARA\n[VOLVER MAÑANA]", "razón"]],
  m1: [["CADA ESTRELLA\n[TE ACERCA]", "cada"]],
  m2: [["ENTRE MÁS VUELVES,\n[MÁS VUELVES.]", "entre"]],
  y2: [["SIN SER STARBUCKS.\n[SIN CREAR UNA APP.]", "necesitas"]],
};

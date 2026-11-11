/**
 * Textos del video "Camilo vuelve" (barbería de ejemplo). El cliente se llama Camilo.
 * Titulares: `[palabra]` → resaltador · `\n` → salto. Cada titular: [texto, palabra con la que entra].
 */
export const business = { name: "Barbería Bravo", short: "Bravo", emoji: "✂️", icon: "scissors" as "beer" | "coffee" | "scissors" | "star" };
export const card = { stamps: 4, total: 5, customer: "Camilo", reward: "Corte gratis" };
export const notification = { app: "BARBERÍA BRAVO", when: "ahora", title: "Estás cerca de Barbería Bravo", body: "Te falta 1 sello para tu corte gratis." };

export const copy = {
  lockTime: "6:42",
  lockDate: "jueves 6 de noviembre",
  qrSign: { top: "Escanea y", bottom: "suma sellos" },
  addPass: "Añadir a la billetera",
  register: { who: "Camilo · corte", where: "Caja · Barbería Bravo", button: "Sellar" },
  stampNotif: { title: "Barbería Bravo", body: "+1 sello · llevas 4 de 5" },
  days: "días sin venir",
  panel: {
    title: "Barbería Bravo",
    section: "DEJARON DE VENIR",
    rows: [
      { name: "Camilo Rojas", detail: "Le falta 1 sello", days: 47, color: "#69D3BE" },
      { name: "Luis Gómez", detail: "Le faltan 3 sellos", days: 45, color: "#8DB4FF" },
      { name: "Marco Díaz", detail: "Le faltan 2 sellos", days: 60, color: "#FFB866" },
    ],
    back: "Volvió hoy",
    badge: ["CAMILO", "VOLVIÓ"],
  },
  push: { title: "Avisos", to: "PARA: LUIS Y MARCO", msg: "Hoy 2x1 en cortes ✂️", button: "Enviar aviso", sent: "Entregado", names: ["Luis", "Marco"] },
  brands: [
    { name: "Barbería Bravo", color: "#1F2A33", icon: "scissors" as const, stamps: 4, total: 5 },
    { name: "Café Origen", color: "#6E4327", icon: "coffee" as const, stamps: 6, total: 8 },
    { name: "La Terraza", color: "#0E5244", icon: "beer" as const, stamps: 3, total: 6 },
    { name: "Uñas Nova", color: "#8A3B62", icon: "star" as const, stamps: 7, total: 10 },
  ],
  free: { chips: ["Hasta 20 clientes", "Sin tarjeta de crédito"], url: "mitarjetica.com" },
  cta: { top: "COMENTA", word: "TARJETICA", comment: "Añade un comentario…", users: ["barberia.elite", "cafe.sanjuan"], reply: "Mi Tarjetica", replyBody: "¡Hola! Aquí tienes el link 👉 mitarjetica.com" },
};

export const headlines: Record<string, [string, string][]> = {
  h1: [["A TU CLIENTE\nLE FALTABA [UNO.]", "cliente"]],
  h2: [["Y TERMINÓ EN LA\n[LAVADORA.]", "terminó"]],
  p1: [
    ["SE [PIERDE.]", "pierde"],
    ["SE [MOJA.]", "moja"],
    ["SE [OLVIDA.]", "olvida"],
  ],
  p2: [["Y NO\n[VUELVE.]", "no"]],
  p3: [["NI TE\n[AVISA.]", "ni"]],
  g1: [["¿ADIVINA QUIÉN\n[SÍ VUELVE?]", "adivina"]],
  m1: [["TU TARJETA DE SELLOS,\n[EN SU CELULAR]", "tarjeta"]],
  q1: [
    ["ESCANEA\nTU [QR]", "escanea"],
    ["SIN DESCARGAR\n[NINGUNA APP]", "sin"],
  ],
  c1: [["[CAMILO] PAGA…", "camilo"], ["Y EL SELLO\n[LLEGA SOLO]", "sello"]],
  c2: [["A LOS 5 SELLOS,\n[CORTE GRATIS]", "cinco"]],
  d1: [["PERO UN DÍA, CAMILO\n[DEJA DE VENIR…]", "pero"]],
  d2: [["Y TÚ NI TE\n[ENTERAS.]", "tú"]],
  n1: [["PASA CERCA\nDE TU [BARBERÍA]", "pasa"]],
  n2: [["“TE FALTA\n[UNO”]", "falta"]],
  v1: [["Y [VUELVE.]", "vuelve"]],
  v2: [["Y TÚ LO VES\nEN TU [PANEL]", "tú"]],
  a1: [["¿LOS QUE AÚN\n[NO VUELVEN?]", "los"]],
  a2: [["LES MANDAS\n[UN AVISO]", "mandas"]],
  a3: [["SIN LLAMAR\n[A NADIE.]", "sin"]],
  t1: [["CON TU LOGO\n[Y TUS COLORES]", "tarjeta"]],
  f1: [["EMPIEZA\n[GRATIS]", "empieza"]],
};

/**
 * Textos del video "Patitas" (peluquería canina de ejemplo: Patitas Spa). El perro se llama Rocky.
 * Titulares: `[palabra]` → resaltador · `\n` → salto. Cada titular: [texto, palabra con la que entra].
 */
export type Icon = "beer" | "coffee" | "scissors" | "star" | "paw";
export const business = { name: "Patitas Spa", short: "Patitas", emoji: "🐾", icon: "paw" as Icon };
export const card = { stamps: 3, total: 8, customer: "Rocky", reward: "10% de descuento" };
export const notification = { app: "PATITAS SPA", when: "ahora", title: "Rocky está cerca 🐾", body: "Le falta 1 patita para su premio." };

export const copy = {
  lockTime: "5:18",
  lockDate: "sábado 8 de noviembre",
  qrSign: { top: "Escanea y", bottom: "suma patitas" },
  addPass: "Añadir a la billetera",
  register: { who: "Rocky · baño", where: "Caja · Patitas Spa", button: "Sellar" },
  stampNotif: { title: "Patitas Spa", body: "+1 patita 🐾 · Rocky lleva 7 de 8" },
  checklist: { title: "ROCKY · SERVICIO DE HOY", items: ["Baño", "Uñas", "Moñito"] },
  doors: { mine: "Patitas Spa", other: "Otra peluquería" },
  calendar: { month: "DICIEMBRE", from: "8", to: "+30", label: "días después" },
  themes: [
    { name: "Patitas Spa", color: "#0E5244" },
    { name: "Patitas Spa", color: "#E0607E" },
    { name: "Patitas Spa", color: "#2F6FB3" },
  ],
  niches: [
    { name: "Patitas Spa", label: "Peluquería canina", color: "#0E5244", icon: "paw" as Icon, stamps: 6, total: 8 },
    { name: "Vet Patitas", label: "Veterinaria", color: "#F26B5B", icon: "star" as Icon, stamps: 4, total: 8 },
    { name: "Michi & Can", label: "Tienda de mascotas", color: "#2F6FB3", icon: "paw" as Icon, stamps: 7, total: 10 },
  ],
  rewardChips: ["10% de descuento", "o el premio que tú elijas"],
  free: { chips: ["Hasta 20 clientes", "Sin tarjeta de crédito"] },
  cta: { top: "COMENTA", word: "TARJETICA", comment: "Añade un comentario…", users: ["peluqueria.firulais", "vet.huellitas"], reply: "Mi Tarjetica", replyBody: "¡Hola! Aquí tienes el link 👉 mitarjetica.com" },
};

export const headlines: Record<string, [string, string][]> = {
  h1: [
    ["ESTE CLIENTE\nNO [HABLA…]", "este"],
    ["PERO SÍ PUEDE\n[VOLVER]", "pero"],
  ],
  h2: [
    ["[BAÑO]", "baño"],
    ["[UÑAS]", "uñas"],
    ["[MOÑITO]", "moñito"],
    ["Y SE VA\n[FELIZ]", "feliz"],
  ],
  h3: [
    ["¿Y EL PRÓXIMO\n[MES?]", "próximo"],
    ["¿VUELVE\n[CONTIGO?]", "vuelve"],
  ],
  s1: [["TU TARJETA DE SELLOS,\n[EN SU CELULAR]", "tarjeta"]],
  s2: [
    ["ESCANEA\nTU [QR]", "escanea"],
    ["SIN DESCARGAR\n[NINGUNA APP]", "sin"],
  ],
  s3: [
    ["TU LOGO,\n[TUS COLORES]", "logo"],
    ["Y [PATITAS]\nCOMO SELLOS", "patitas"],
  ],
  s4: [["CADA VISITA,\n[UNA PATITA]", "cada"]],
  s5: [["8 PATITAS =\n[SU PREMIO]", "ocho"]],
  s6: [["PASA CERCA…\n[Y LE AVISA]", "pasa"]],
  s7: [["PARA [MASCOTAS]", "sirve"]],
  f1: [["EMPIEZA\n[GRATIS]", "empieza"]],
};

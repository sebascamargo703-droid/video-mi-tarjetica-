/**
 * Textos del video. Los negocios son de ejemplo (inventados).
 *  Titulares: `[palabra]` → resaltador menta · `*palabra*` → cursiva serif menta · `\n` → salto.
 */
export const origen = { name: "Origen", tag: "CAFÉ · PANADERÍA", short: "Origen" };
export const esquina = { name: "La Esquina", tag: "CAFÉ" };
export const customer = "Valentina";

/** Lo que usan los componentes compartidos (tarjeta, notificación). */
export const business = { name: "Origen", short: "Origen", emoji: "☕", icon: "coffee" as "beer" | "coffee" | "scissors" | "star" };
export const card = { stamps: 7, total: 8, customer: "Valentina R.", reward: "Un café gratis" };
export const notification = {
  app: "ORIGEN",
  when: "Cerca",
  title: "Estás a media cuadra ☕",
  body: "Te falta 1 sello para tu café gratis. ¡Te esperamos!",
};

export const copy = {
  lockTime: "9:41",
  lockDate: "jueves 6 de noviembre",
  sameStreet: "MISMA CALLE · FRENTE A FRENTE",
  full: "LLENO",
  empty: "CASI VACÍO",
  withCard: "7/8 SELLOS",
  noCard: "SIN TARJETA",
  daysLater: "MISMA CLIENTA · DÍAS DESPUÉS",
  zone: "Zona cercana a Origen",
  stampAdded: "+1 sello",
  steps: ["Escanea el QR", "La guarda en su Wallet", "Suma sellos y gana premios"],
  reward: "🎁 Café gratis",
  cta: { top: "COMENTA", word: "TARJETICA", sub: "y te mostramos cómo quedaría la tuya.", comment: "Añade un comentario…" },
};

/** Menús para "Productos parecidos. Precios parecidos." (precios en pesos). */
export const menus = {
  origen: [
    ["Tinto", 3000],
    ["Capuchino", 6500],
    ["Pandebono", 3500],
    ["Croissant", 7000],
  ],
  esquina: [
    ["Tinto", 3000],
    ["Capuchino", 6000],
    ["Pandebono", 3500],
    ["Croissant", 7500],
  ],
} as const;

/**
 * Titulares grandes (arriba). Cada uno: [texto, palabra de la locución con la que entra].
 * El subtítulo palabra por palabra va abajo.
 */
export const headlines: Record<string, [string, string][]> = {
  a2: [["¿POR\n[QUÉ?]", "por"]],
  b1: [
    ["MISMA\nCALLE.", "misma"],
    ["PRODUCTOS\n[PARECIDOS.]", "productos"],
    ["PRECIOS\n[PARECIDOS.]", "precios"],
  ],
  b2: [
    ["PERO HAY\n[UNA DIFERENCIA]", "pero"],
    ["Y NO ESTÁ\n[ADENTRO.]", "y"],
  ],
  c1: [["CUANDO EL\nCLIENTE [SE VA]", "cuando"]],
  c2: [["UNA RAZÓN\n[PARA VOLVER]", "razón"]],
  d1: [["[DÍAS DESPUÉS]", "días"]],
  d2: [["LE FALTA\n[1 SELLO]", "falta"]],
  e1: [["UN MOTIVO\n[PARA REGRESAR]", "motivo"]],
  e2: [["¿A CUÁL\n[VOLVERÁ?]", "cuál"]],
  g1: [
    ["¿Y TÚ?", "tú"],
    ["¿CUÁL QUIERES\n[SER?]", "cuál"],
  ],
};

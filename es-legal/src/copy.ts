/**
 * Textos del video. Los subtítulos van sincronizados con la locución (`src/voiceover.json`):
 * cada clave de `captions` es el id de una frase.
 *  `*palabra*` → cursiva serif en menta · `[palabra]` → resaltador menta · `\n` → salto de línea.
 */
export const business = {
  name: "Café Tres Granos",
  short: "Tres Granos",
  emoji: "☕",
  icon: "coffee" as "beer" | "coffee" | "scissors" | "star",
};

export const notification = {
  app: business.name.toUpperCase(),
  when: "Cerca",
  title: "Estás al lado ☕",
  body: "Te falta 1 sello para tu café gratis. ¡Pasa por él!",
};

export const card = {
  stamps: 4,
  total: 5,
  customer: "Laura Gómez",
  reward: "Un café gratis",
};

export const captions: Record<string, string> = {
  q1: "¿Es legal\nque un negocio\nte mande *esto?*",
  q2: "solo por pasar\npor el *frente?*",
  calm: "Tranquilo.\nNadie te está\n*siguiendo.*",
  card: "Es su [tarjeta de sellos,]\nguardada en tu *Wallet.*",
  scan: "La guardaste *tú,*\nescaneando su *QR.*",
  loc: "Y trae guardada\n[la ubicación]\n*del negocio.*",
  near: "Cuando pasas *cerca,*\nes tu propio [celular]\nel que te la muestra.",
  nosabe: "El negocio\n*no sabe*\ndónde estás.",
  off: "Y la puedes [apagar]\n*cuando quieras.*",
  biz: "¿Y para el\n*negocio?*",
  door: "Aparece en el celular\nde su cliente, justo\nfrente a su *puerta,*",
  stamp: "cuando le falta\n[un sello]\n*para el premio.*",
  want: "¿Quieres una *así*\npara tu negocio?",
};

export const copy = {
  big: "¿ESTO ES\n[LEGAL?]",
  tracking: "RASTREANDO UBICACIÓN…",
  noTracking: "SIN RASTREO",
  savedLocation: "📍 Ubicación guardada en la tarjeta",
  bizSees: "LO QUE VE EL NEGOCIO",
  bizSeesValue: "Ubicación del cliente",
  bizSeesNone: "No disponible",
  lockTime: "9:41",
  lockDate: "martes 28 de octubre",
  scanHint: "Escanea y guarda tu tarjeta",
  added: "Agregada a tu Wallet",
  settingsTitle: "Detalles de la tarjeta",
  settings: ["Actualización automática", "Sugerir en pantalla bloqueada", "Permitir notificaciones"],
  settingsNote: "El aviso lo decide tu celular con la ubicación guardada en la tarjeta. El negocio no recibe tu ubicación.",
  cta: { top: "COMENTA", word: "TARJETA", sub: "y te mostramos cómo quedaría la tuya.", comment: "Añade un comentario…" },
};

/** Otras tarjetas para la escena "¿Quieres una así?" (negocios de ejemplo). */
export const fan = [
  { name: "Lavadero Brillo", color: "#0369A1", icon: "star" as const, stamps: 7, total: 10 },
  { name: "Repostería Sierra", color: "#9A3412", icon: "star" as const, stamps: 3, total: 5 },
  { name: business.name, color: "#0E5244", icon: "coffee" as const, stamps: 4, total: 5 },
  { name: "Barbería Don Leo", color: "#1F2937", icon: "scissors" as const, stamps: 5, total: 8 },
  { name: "La Terraza", color: "#7C2D12", icon: "beer" as const, stamps: 2, total: 6 },
];

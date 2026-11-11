/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONSTANTES EDITABLES — "La silla vacía" (mitarjetica.com)
 *  Todo lo que normalmente querrás cambiar está aquí: textos, colores, tiempos,
 *  datos del negocio y volúmenes de audio. La lógica vive en el resto de /src.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  GUION DE VOZ EN OFF (español colombiano, tono cercano, 35 palabras)
 *  Sincronizado con las escenas; grábalo y agrégalo como public/voz.mp3
 *  (ver AUDIO.voice más abajo):
 *
 *   0,3 s  (Gancho)   "Esta silla era de Andrés. Hace dos meses que no viene."
 *   8,2 s  (Aviso)    "Hasta que pasó cerca… y su celular le avisó:
 *                      le falta un corte para su premio."
 *  16,2 s  (Silla)    "Y volvió."
 *  19,3 s  (Cierre)   "Con Mi Tarjetica, tus clientes vuelven."
 */

export type V3 = [number, number, number];

/* ───────────── Formato ───────────── */
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSec: 22, // 660 frames
} as const;

/** Zona segura para la interfaz de TikTok / Reels (px). */
export const SAFE = { top: 120, bottom: 250, side: 72 } as const;

/* ───────────── Escenas (segundos absolutos) ───────────── */
export const SCENES = {
  gancho: { from: 0, to: 3.5 },
  calle: { from: 3.5, to: 8 },
  aviso: { from: 8, to: 12 },
  vuelta: { from: 12, to: 16 },
  silla: { from: 16, to: 19 },
  cierre: { from: 19, to: 22 },
} as const;

/** Momentos clave (segundos absolutos). Mueve estos para afinar el ritmo. */
export const MOMENTS = {
  // 1 · Gancho
  hookLine1: 0.35, // empieza a escribirse "Esta silla era de Andrés…"
  flicker: 1.15, // parpadeo de la lámpara
  hookLine2: 2.0, // segundo renglón
  // 3 · Aviso
  phoneIn: 8.75, // aparece el celular en primer plano
  notification: 9.4, // entra la notificación (spring + vibración)
  phoneOut: 11.55,
  // 4 · La vuelta
  lookBack: 12.15, // Andrés mira hacia atrás
  turn: 12.6, // empieza a girar
  walkBack: 13.3, // camina hacia la puerta
  doorOpen: 14.5, // se abre la puerta y sale la luz
  fadeOut: 15.72, // fundido corto a negro
  // 5 · La silla se llena
  lightsUp: 16.25, // la luz pasa de ámbar tenue a cálida plena
  cardIn: 16.45, // entra la tarjeta de sellos
  stamp: 17.35, // se estampa el sello 10
  rewardBadge: 17.85, // "¡Corte gratis!"
  // 6 · Cierre
  ctaText: 19.25,
  ctaUrl: 20.15,
  ctaTagline: 20.6,
} as const;

/* ───────────── Negocio (cámbialo para otro local) ───────────── */
export const BUSINESS = {
  name: "Barbería El Corte",
  emoji: "💈",
  neonText: "Barbería", // letrero de neón de la vidriera
  signText: "BARBERÍA EL CORTE", // aviso sobre la fachada
  customer: "Andrés",
  stampsTotal: 10,
  stampsFilled: 9,
  /** Ícono del sello: "scissors" | "cup" | "drop" | "star" */
  stampIcon: "scissors" as "scissors" | "cup" | "drop" | "star",
  reward: "Corte gratis",
  rewardFooter: "Corte gratis al completar",
  clock: "8:47",
  date: "viernes, 13 de noviembre",
} as const;

/* ───────────── Textos en pantalla ───────────── */
export const TEXTS = {
  hook1: "Esta silla era de Andrés…",
  hook2: "hace 2 meses que no viene.",
  /** Subtítulos opcionales de apoyo (déjalos en "" para quitarlos). */
  calle: "Hasta que una noche pasó cerca…",
  vuelta: "…y se devolvió.",
  notifApp: "MI TARJETICA",
  notifTime: "ahora",
  notifTitle: "💈 Barbería El Corte",
  notifBody: "Te falta 1 corte para tu premio 🎁",
  cardSubtitle: "Tarjeta de sellos",
  rewardBadge: "¡Corte gratis! 🎁",
  /** Texto principal del cierre. Lo que va entre [corchetes] se resalta. */
  cta: "El [aviso por cercanía] recupera a los clientes que se te van.",
  url: "mitarjetica.com",
  tagline: "Tarjeta de sellos digital para tu negocio",
} as const;

/* ───────────── Paleta ───────────── */
export const COLORS = {
  // ambiente
  night: "#050A18", // azul noche profundo (fondo y niebla)
  fog: "#081028",
  moon: "#5E7BC8",
  amber: "#FFB25A", // cono de luz sobre la silla
  warm: "#FFD9A6", // luz cálida plena
  neon: "#FF4D7E", // neón de la vidriera
  neonCore: "#FFE3EC",
  // barbería
  wall: "#16233F",
  wallDark: "#0E1830",
  floorA: "#D8D1C2",
  floorB: "#1A2030",
  wood: "#5B3A24",
  facade: "#1B2A4A",
  facadeTrim: "#7A1F26",
  // silla
  leather: "#641114", // cuero rojo oscuro
  leatherDark: "#3D090B",
  chrome: "#D9DEE5",
  // Andrés
  jacket: "#C96F22",
  jacketDark: "#A65B1B",
  pants: "#22304F",
  shoes: "#EDEDED",
  skin: "#DBA47A",
  hair: "#17110D",
  headphones: "#111318",
  headphonesGlow: "#39E1D7",
  // interfaz
  white: "#FFFFFF",
  ink: "#0B1226",
  card: "#101A36",
  cardEdge: "#24345F",
  gold: "#FFC24B",
  goldDeep: "#E8962B",
  brandGreen: "#0E5244", // verde de Mi Tarjetica
  brandMint: "#8FE3C0",
  textSoft: "#B9C4E0",
} as const;

/* ───────────── Audio ─────────────
 * Los archivos van en /public. El proyecto trae versiones de relleno generadas
 * con `npm run audio` (síntesis propia, sin derechos de autor). Reemplázalos
 * por los tuyos con el MISMO nombre y listo. Si borras alguno, pon su
 * `enabled` en false para que el render no falle.
 */
export const AUDIO = {
  music: { file: "music.mp3", enabled: true, volume: 0.55, duckTo: 0.3 },
  notification: { file: "notification.mp3", enabled: true, volume: 0.85, at: MOMENTS.notification },
  door: { file: "door.mp3", enabled: true, volume: 0.7, at: MOMENTS.doorOpen },
  stamp: { file: "stamp.mp3", enabled: true, volume: 0.9, at: MOMENTS.stamp },
  /** Voz en off: pon tu grabación en public/voz.mp3 y activa `enabled`. */
  voice: { file: "voz.mp3", enabled: false, volume: 1 },
} as const;

/* ───────────── Mundo 3D (metros) ─────────────
 * Solo toca esto si quieres mover la escenografía.
 */
export const WORLD = {
  room: { halfW: 3.5, depth: 6.5, height: 3.3 }, // interior: x ±3.5, z de -6.5 a 0
  window: { x0: -3.0, x1: 1.2, y0: 0.7, y1: 2.7 }, // vidriera
  door: { x0: 1.6, x1: 2.6, height: 2.3 },
  chair: { pos: [-0.7, 0, -3.2] as V3, yaw: 0.3 },
  lampY: 2.2,
  sidewalkZ: 1.5, // por donde camina Andrés
  walkSpeed: 1.5, // m/s
} as const;

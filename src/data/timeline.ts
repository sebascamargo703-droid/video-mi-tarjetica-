/**
 * LÍNEA DE TIEMPO MAESTRA (30 fps · 1200 frames)
 * ─────────────────────────────────────────────────────────────────────────────
 * Única fuente de verdad del montaje. Todo está en frames ABSOLUTOS del video
 * final (frame 0 = inicio de la locución / de public/video-base.mp4).
 *
 * IMAGEN: sale de las 8 tomas originales (public/user_clips/take*.mp4) y NO de
 * video-base.mp4, porque éste se armó con fundidos de 0.15 s entre tomas y
 * dejaba ~5 fotogramas mezclados (flash frames) en cada cambio. Con TAKES cada
 * cambio de toma es un corte seco al fotograma exacto.
 * AUDIO: la locución sale de voz-normalizada.wav (= audio de video-base.mp4).
 *
 * Cambios de toma (frames): 130 · 242 · 355 · 556 · 749 · 885 · 974
 * (fin de la locución ≈ 1134, fin de la última toma ≈ 1151). Las escenas se
 * alinean a lo que realmente se dice en cada tramo.
 *
 * ⚠️ AJUSTE MANUAL
 *   - FRAMINGS: origen del zoom (dónde está la cara) y máscara de enfoque.
 *   - SEGMENTS[].at: frame donde ocurre cada corte/transición.
 *   - PUSH_INS: frames de las frases clave donde la cámara empuja un poco.
 */

export type Framing = {
  /** Escala base del plano (1 = plano abierto, 1.15 = "segundo ángulo"). */
  scale: number;
  /** Origen del zoom en % del cuadro (ponlo sobre la cara). */
  originX: number;
  originY: number;
  /** Elipse que se mantiene nítida (falso desenfoque de fondo), en %. */
  focus: { x: number; y: number; rx: number; ry: number };
};

export const FRAMINGS = {
  /** Plano A: abierto, cara a ~38% de alto. */
  wide: {
    scale: 1,
    originX: 50,
    originY: 38,
    focus: { x: 50, y: 64, rx: 40, ry: 50 },
  },
  /** Plano B: reencuadre 1.15x para simular segundo ángulo de cámara. */
  tight: {
    scale: 1.15,
    originX: 50,
    originY: 33,
    focus: { x: 50, y: 64, rx: 40, ry: 50 },
  },
} satisfies Record<string, Framing>;

export type FramingName = keyof typeof FRAMINGS;

/**
 * cut   → corte seco.
 * punch → corte seco + el plano entrante "aterriza" con un zoom 1.08 → 1 en
 *         `entryFrames` (sin solapar planos: nada de la capa anterior se filtra).
 * slide → push lateral rápido (los dos planos se desplazan juntos, opacos).
 */
export type TransitionKind = "cut" | "punch" | "slide";

/**
 * Tomas originales y su posición en la locución.
 * `start` = segundo de la locución en el que empieza la toma (medido: cada
 * toma coincide al fotograma con video-base.mp4, PSNR ≈ 54 dB).
 * `cut`   = frame donde la imagen pasa a esta toma (centro del antiguo fundido).
 */
export type Take = { file: string; start: number; cut: number };

export const TAKES: Take[] = [
  { file: "user_clips/take1_gancho.mp4", start: 0, cut: 0 },
  { file: "user_clips/take2_costo5x.mp4", start: 4.254, cut: 130 },
  { file: "user_clips/take3_razon_volver.mp4", start: 8.008, cut: 242 },
  { file: "user_clips/take4_solucion_celular.mp4", start: 11.762, cut: 355 },
  { file: "user_clips/take5_sellos_premios.mp4", start: 18.452, cut: 556 },
  { file: "user_clips/take6_proximidad.mp4", start: 24.876, cut: 749 },
  { file: "user_clips/take7_base_datos.mp4", start: 29.431, cut: 885 },
  { file: "user_clips/take8_cta_cierre.mp4", start: 32.384, cut: 974 },
];

export type SceneKind =
  | "hook"
  | "person"
  | "problem"
  | "solution"
  | "wallet"
  | "proximity"
  | "database"
  | "cta"
  | "endcard";

export type Segment = {
  /** Frame absoluto del corte (en un slide, centro del push). */
  at: number;
  scene: SceneKind;
  /** Transición con la que ENTRA este segmento. */
  entry: TransitionKind;
  /** Duración del punch / slide (frames). 0 en cortes secos. */
  entryFrames: number;
  framing?: FramingName;
};

/** Duración total de la composición. */
export const DURATION = 1200;
export const FPS = 30;

/**
 * Montaje. Cada segmento dura hasta el `at` del siguiente.
 * Ritmo: cortes secos entre planos de la persona (coinciden con el cambio de
 * toma), punch-in de 7 frames al entrar a un gráfico y push lateral de 8
 * frames solo entre gráficos consecutivos. Sin disolvencias.
 *
 *   0–130    "No necesitas clientes nuevos, necesitas que los que ya te compraron…"
 *   130–242  "Conseguir un cliente nuevo cuesta hasta 5 veces más que retener uno actual."
 *   242–355  "Si no regresan, no es tu servicio, es que no le estás dando una razón…"
 *   355–556  "Haz que cada compra de hoy sea una visita asegurada… Con MiTarjetica…"
 *   556–749  "Premia la fidelidad… acumulan sellos y obtienen descuentos…"
 *   749–885  "Con aviso de proximidad, le avisa a tu cliente cada vez que pasa cerca…"
 *   885–974  "Y mantienes una base de datos real y actualizada de tu negocio."
 *   974–1134 "Deja de perder clientes… comenta la palabra TARJETICA…"
 */
export const SEGMENTS: Segment[] = [
  { at: 0, scene: "hook", entry: "cut", entryFrames: 0, framing: "wide" },
  // Escena 2 · problema: cambio de toma + reencuadre 1.15x
  { at: 130, scene: "person", entry: "cut", entryFrames: 0, framing: "tight" },
  // "…cuesta hasta 5 veces más…" → gráfica 5x
  { at: 166, scene: "problem", entry: "punch", entryFrames: 7 },
  // "Si no regresan…" vuelve la persona (cambio de toma)
  { at: 242, scene: "person", entry: "cut", entryFrames: 0, framing: "wide" },
  // Corte seco dentro de la misma toma: segundo ángulo
  { at: 296, scene: "person", entry: "cut", entryFrames: 0, framing: "tight" },
  // "Haz que cada compra de hoy…" (cambio de toma)
  { at: 355, scene: "person", entry: "cut", entryFrames: 0, framing: "wide" },
  // Escena 3 · "Con MiTarjetica, una tarjeta digital…"
  { at: 446, scene: "solution", entry: "punch", entryFrames: 7 },
  // "Premia la fidelidad de tus clientes…" (cambio de toma)
  { at: 556, scene: "person", entry: "cut", entryFrames: 0, framing: "tight" },
  // Escena 6 · "…una tarjeta en la que acumulan sellos…" → Cero descargas / Wallet
  { at: 610, scene: "wallet", entry: "punch", entryFrames: 7 },
  // Escena 4 · "Con aviso de proximidad…"
  { at: 749, scene: "proximity", entry: "slide", entryFrames: 8 },
  // Escena 5 · "Y mantienes una base de datos…"
  { at: 885, scene: "database", entry: "slide", entryFrames: 8 },
  // Escena 7 · CTA, vuelve la persona (cambio de toma)
  { at: 974, scene: "cta", entry: "cut", entryFrames: 0, framing: "wide" },
  // Cierre: negro + logo
  { at: 1142, scene: "endcard", entry: "cut", entryFrames: 0 },
];

/** Número que aparece en cada beneficio (orden en que se dicen en la locución). */
export const BENEFIT_NUMBER = { wallet: 1, proximity: 2, database: 3 } as const;

/** Push-ins de cámara (+3.5%) en frases clave. */
export const PUSH_INS: number[] = [
  66, // "los que ya te compraron"
  186, // "cuesta hasta 5 veces más"
  318, // "una razón para volver"
  392, // "visita asegurada para mañana"
  566, // "premia la fidelidad"
  1036, // "comenta la palabra TARJETICA"
];

/** Rango en el que NO se muestran subtítulos (el titular cinético ya los cubre). */
export const SUBTITLE_MUTES: [number, number][] = [
  [0, 130],
  [1140, DURATION],
];

/**
 * Tiempos internos de cada escena, en frames LOCALES (0 = inicio del segmento,
 * que arranca media transición antes de `at`). Los SFX se calculan con ellos,
 * así que si cambias una animación aquí, el sonido la sigue.
 */
export const SCENE_TIMING = {
  problem: { counterStart: 26, counterStep: 9 },
  proximity: { notificationDrop: 30 },
  wallet: { stopwatchStart: 44, stopwatchFrames: 60 },
  database: { visitsStart: 34, visitsStep: 12 },
} as const;

/** Efectos de sonido. `file` relativo a public/sfx/. */
export type SfxCue = { at: number; file: string; volume: number };

export const segmentIndex = (scene: SceneKind) => SEGMENTS.findIndex((s) => s.scene === scene);

/** Frames en que un segmento se solapa con el anterior (solo en slides). */
export function segmentOverlap(i: number) {
  return SEGMENTS[i].entry === "slide" ? SEGMENTS[i].entryFrames : 0;
}

/** Inicio absoluto de cada segmento dentro de la TransitionSeries. */
export function segmentStart(i: number) {
  return SEGMENTS[i].at - Math.floor(segmentOverlap(i) / 2);
}

/** Duración de cada segmento dentro de la TransitionSeries (incluye solapes). */
export function segmentDuration(i: number) {
  const next = SEGMENTS[i + 1];
  const end = next ? segmentStart(i + 1) + segmentOverlap(i + 1) : DURATION;
  return end - segmentStart(i);
}

const sceneStart = (scene: SceneKind) => segmentStart(segmentIndex(scene));
const T = SCENE_TIMING;

export const SFX: SfxCue[] = [
  // (sin whoosh: los cambios de plano van en silencio)
  // contador 1x → 5x: un tick por número
  ...[1, 2, 3, 4].map((i) => ({
    at: sceneStart("problem") + T.problem.counterStart + i * T.problem.counterStep,
    file: "tick.wav",
    volume: 0.28,
  })),
  // notificación de proximidad
  { at: sceneStart("proximity") + T.proximity.notificationDrop, file: "pop.wav", volume: 0.45 },
  // cronómetro 0.0 → 2.0 s y check final
  ...[0, 1, 2, 3, 4, 5].map((i) => ({
    at: sceneStart("wallet") + T.wallet.stopwatchStart + i * (T.wallet.stopwatchFrames / 6),
    file: "tick.wav",
    volume: 0.16,
  })),
  {
    at: sceneStart("wallet") + T.wallet.stopwatchStart + T.wallet.stopwatchFrames + 2,
    file: "chime.wav",
    volume: 0.22,
  },
  // contador de visitas en el dashboard
  ...[0, 1, 2].map((i) => ({
    at: sceneStart("database") + T.database.visitsStart + i * T.database.visitsStep,
    file: "tick.wav",
    volume: 0.16,
  })),
];

/** Activa si colocas un b-roll de alguien caminando en public/broll-caminando.mp4 */
export const USE_WALKING_BROLL = false;
/** Activa si colocas una captura real del panel en public/dashboard.png */
export const USE_DASHBOARD_SCREENSHOT = false;
/**
 * true  → usa public/voz-normalizada.wav (-14 LUFS, generado con
 *         scripts/normalize-voice.sh a partir del audio ORIGINAL del video).
 * false → usa directamente el audio de public/video-base.mp4.
 */
export const USE_NORMALIZED_VOICE = true;

/**
 * SUBTÍTULOS PALABRA POR PALABRA
 * ─────────────────────────────────────────────────────────────────────────────
 * Tiempos en milisegundos sobre la línea de tiempo del video final
 * (= tiempo de public/video-base.mp4, que arranca en el frame 0).
 *
 * ⚠️ AJUSTE MANUAL: los inicios de cada frase están medidos sobre las pausas
 * reales de la locución; dentro de cada frase las palabras se repartieron por
 * sílabas. Revisa en `npx remotion studio` y corrige los ms que se vean
 * adelantados/atrasados. Para obtener tiempos exactos con Whisper:
 *   python3 scripts/transcribe-words.py   (imprime este mismo formato)
 *
 * w(texto, inicioMs, finMs, acento?)  → acento = color de marca (palabra clave)
 * Una coma o punto al final fuerza el cambio de "página" de subtítulos.
 */
import type { Caption } from "@remotion/captions";

export type SubtitleWord = Caption & { accent: boolean };

const w = (
  text: string,
  startMs: number,
  endMs: number,
  accent = false,
): SubtitleWord => ({
  text,
  startMs,
  endMs,
  timestampMs: Math.round((startMs + endMs) / 2),
  confidence: 1,
  accent,
});

export const SUBTITLE_WORDS: SubtitleWord[] = [
  // 0.24s · No necesitas clientes nuevos,
  w("No", 240, 438),
  w("necesitas", 438, 1007),
  w("clientes", 1007, 1328, true),
  w("nuevos,", 1328, 1650),
  // 1.86s · necesitas que los que ya
  w("necesitas", 1860, 2165),
  w("que", 2165, 2271),
  w("los", 2271, 2378),
  w("que", 2378, 2484),
  w("ya", 2484, 2590),
  // 2.70s · te compraron
  w("te", 2700, 2934),
  w("compraron", 2934, 3460),
  // 3.56s · te vuelvan a elegir.
  w("te", 3560, 3686),
  w("vuelvan", 3686, 3891),
  w("a", 3891, 4017),
  w("elegir.", 4017, 4300),
  // 4.45s · Conseguir un cliente nuevo
  w("Conseguir", 4450, 4855),
  w("un", 4855, 5035),
  w("cliente", 5035, 5328, true),
  w("nuevo", 5328, 5620),
  // 5.62s · cuesta hasta 5 veces más
  w("cuesta", 5620, 5939),
  w("hasta", 5939, 6259),
  w("5", 6259, 6504, true),
  w("veces", 6504, 6824, true),
  w("más", 6824, 7020),
  // 7.18s · que retener un actual.
  w("que", 7180, 7311),
  w("retener", 7311, 7606),
  w("un", 7606, 7737),
  w("actual.", 7737, 7950),
  // 8.05s · Si no regresan, no es tu servicio,
  w("Si", 8050, 8226),
  w("no", 8226, 8402),
  w("regresan,", 8402, 8797),
  w("no", 8797, 8973),
  w("es", 8973, 9149),
  w("tu", 9149, 9324),
  w("servicio,", 9324, 9720),
  // 9.87s · es que no le estás dando una razón para volver.
  w("es", 9870, 10007),
  w("que", 10007, 10143),
  w("no", 10143, 10280),
  w("le", 10280, 10417),
  w("estás", 10417, 10639),
  w("dando", 10639, 10861),
  w("una", 10861, 11083),
  w("razón", 11083, 11306),
  w("para", 11306, 11528),
  w("volver.", 11528, 11750),
  // 11.93s · Haz que cada compra de hoy
  w("Haz", 11930, 12098),
  w("que", 12098, 12267),
  w("cada", 12267, 12540),
  w("compra", 12540, 12813),
  w("de", 12813, 12982),
  w("hoy", 12982, 13150, true),
  // 13.15s · sea una visita asegurada para mañana.
  w("sea", 13150, 13277),
  w("una", 13277, 13484),
  w("visita", 13484, 13771),
  w("asegurada", 13771, 14217),
  w("para", 14217, 14423),
  w("mañana.", 14423, 14710),
  // 14.99s · Con MiTarjetica,
  w("Con", 14990, 15163),
  w("MiTarjetica,", 15163, 15770, true),
  // 16.12s · una tarjeta digital que vive en el celular de tus clientes.
  w("una", 16120, 16343),
  w("tarjeta", 16343, 16651),
  w("digital", 16651, 16960),
  w("que", 16960, 17097),
  w("vive", 17097, 17320),
  w("en", 17320, 17457),
  w("el", 17457, 17594),
  w("celular", 17594, 17903),
  w("de", 17903, 18040),
  w("tus", 18040, 18177),
  w("clientes.", 18177, 18400, true),
  // 18.52s · Premia la fidelidad de tus clientes
  w("Premia", 18520, 18835),
  w("la", 18835, 19029),
  w("fidelidad", 19029, 19587),
  w("de", 19587, 19781),
  w("tus", 19781, 19975),
  w("clientes", 19975, 20290, true),
  // 20.41s · con una tarjeta en la que acumulan sellos
  w("con", 20410, 20595),
  w("una", 20595, 20896),
  w("tarjeta", 20896, 21312),
  w("en", 21312, 21497),
  w("la", 21497, 21682),
  w("que", 21682, 21867),
  w("acumulan", 21867, 22399),
  w("sellos", 22399, 22700),
  // 22.82s · y obtienen descuentos y recompensas.
  w("y", 22820, 23033),
  w("obtienen", 23033, 23513),
  w("descuentos", 23513, 23993),
  w("y", 23993, 24207),
  w("recompensas.", 24207, 24820),
  // 25.03s · Con aviso de proximidad,
  w("Con", 25030, 25200),
  w("aviso", 25200, 25582),
  w("de", 25582, 25752),
  w("proximidad,", 25752, 26240),
  // 26.56s · le avisa a tu cliente
  w("le", 26560, 26730),
  w("avisa", 26730, 27113),
  w("a", 27113, 27283),
  w("tu", 27283, 27453),
  w("cliente", 27453, 27730, true),
  // 27.85s · cada vez que pasa cerca de tu negocio.
  w("cada", 27850, 28076),
  w("vez", 28076, 28216),
  w("que", 28216, 28355),
  w("pasa", 28355, 28581),
  w("cerca", 28581, 28808),
  w("de", 28808, 28947),
  w("tu", 28947, 29087),
  w("negocio.", 29087, 29400),
  // 29.55s · Y mantienes una base de datos real y actualizada de tu negocio.
  w("Y", 29550, 29698),
  w("mantienes", 29698, 30032),
  w("una", 30032, 30273),
  w("base", 30273, 30514, true),
  w("de", 30514, 30663, true),
  w("datos", 30663, 30904, true),
  w("real", 30904, 31052),
  w("y", 31052, 31200),
  w("actualizada", 31200, 31720),
  w("de", 31720, 31868),
  w("tu", 31868, 32016),
  w("negocio.", 32016, 32350),
  // 32.73s · Deja de perder clientes todos los días.
  w("Deja", 32730, 33021),
  w("de", 33021, 33200),
  w("perder", 33200, 33491),
  w("clientes", 33491, 33781, true),
  w("todos", 33781, 34072),
  w("los", 34072, 34251),
  w("días.", 34251, 34430),
  // 34.54s · Comenta la palabra TARJETICA
  w("Comenta", 34540, 34975),
  w("la", 34975, 35169),
  w("palabra", 35169, 35604),
  w("TARJETICA", 35604, 36160, true),
  // 36.36s · y te enviamos toda la información.
  w("y", 36360, 36506),
  w("te", 36506, 36651),
  w("enviamos", 36651, 36979),
  w("toda", 36979, 37216),
  w("la", 37216, 37361),
  w("información.", 37361, 37780),
];

/** Palabras/frases que se pintan en color acento aunque no estén marcadas. */
export const ACCENT_KEYWORDS = [
  "clientes",
  "5 veces",
  "base de datos",
  "Apple Wallet",
  "Google Wallet",
  "hoy",
];

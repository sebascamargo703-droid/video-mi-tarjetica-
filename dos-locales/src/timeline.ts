import vo from "./voiceover.json";

/**
 * La línea de tiempo sale de la locución (src/voiceover.json; `dur` lo escribe
 * scripts/import-voice.py): cada frase empieza cuando termina la anterior + su `pause`.
 */
export const FPS = 30;
export const LEAD = 0.3;
export const TAIL = 2.8;

export const V: Record<string, { at: number; end: number; dur: number; say: string }> = {};
let t = LEAD;
for (const it of vo) {
  V[it.id] = { at: t, end: t + it.dur, dur: it.dur, say: it.say };
  t += it.dur + it.pause;
}
export const VOICE = vo;
export const DURATION_SEC = Math.ceil((V.h1.end + TAIL) * 10) / 10;

/** Momento (segundos) en que se dice la palabra n.º `k` de la frase `id` (reparto por letras). */
export const wordAt = (id: string, k: number) => {
  const words = V[id].say.split(/\s+/);
  const w = words.map((x) => x.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5);
  const total = w.reduce((a, b) => a + b, 0);
  const before = w.slice(0, Math.max(0, Math.min(k, words.length))).reduce((a, b) => a + b, 0);
  return V[id].at + (before / total) * V[id].dur * 0.96;
};
/** Momento en que empieza la primera palabra que contiene `needle` en la frase `id`. */
export const wordTime = (id: string, needle: string) => {
  const words = V[id].say.toLowerCase().split(/\s+/).map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""));
  const n = needle.toLowerCase();
  let k = words.findIndex((w) => w === n);
  if (k < 0) k = words.findIndex((w) => w.includes(n));
  return wordAt(id, Math.max(0, k));
};

const pre = 0.12;
export const SCENES = {
  hook: { from: 0, to: V.b1.at - pre },
  same: { from: V.b1.at - pre, to: V.b2.at - pre },
  diff: { from: V.b2.at - pre, to: V.c1.at - pre },
  leave: { from: V.c1.at - pre, to: V.c2.at - pre },
  card: { from: V.c2.at - pre, to: V.d1.at - pre },
  days: { from: V.d1.at - pre, to: wordTime("d2", "recuerda") - 0.1 },
  notif: { from: wordTime("d2", "recuerda") - 0.1, to: V.e1.at - pre },
  choice: { from: V.e1.at - pre, to: V.f1.at - pre },
  product: { from: V.f1.at - pre, to: V.g1.at - pre },
  you: { from: V.g1.at - pre, to: V.h1.at - pre },
  cta: { from: V.h1.at - pre, to: DURATION_SEC },
};
export type SceneId = keyof typeof SCENES;

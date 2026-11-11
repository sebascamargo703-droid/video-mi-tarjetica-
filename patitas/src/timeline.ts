import vo from "./voiceover.json";

/** Línea de tiempo desde la locución (src/voiceover.json; `dur` lo escribe scripts/import-voice.py). */
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
export const DURATION_SEC = Math.ceil((V.k1.end + TAIL) * 10) / 10;

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
/** Momento en que se dice la palabra n.º `k` de la frase `id` (reparto por letras). */
export const wordAt = (id: string, k: number) => {
  const words = V[id].say.split(/\s+/);
  const w = words.map((x) => clean(x).length + 1.5);
  const total = w.reduce((a, b) => a + b, 0);
  const before = w.slice(0, Math.max(0, Math.min(k, words.length))).reduce((a, b) => a + b, 0);
  return V[id].at + (before / total) * V[id].dur * 0.96;
};
export const wordTime = (id: string, needle: string) => {
  const words = V[id].say.split(/\s+/).map(clean);
  const n = needle.toLowerCase();
  let k = words.findIndex((w) => w === n);
  if (k < 0) k = words.findIndex((w) => w.includes(n));
  return wordAt(id, Math.max(0, k));
};

const pre = 0.12;
export const SCENES = {
  hook: { from: 0, to: V.h2.at - pre },
  spa: { from: V.h2.at - pre, to: V.h3.at - pre },
  doubt: { from: V.h3.at - pre, to: V.s1.at - pre },
  card: { from: V.s1.at - pre, to: V.s2.at - pre },
  scan: { from: V.s2.at - pre, to: V.s3.at - pre },
  custom: { from: V.s3.at - pre, to: V.s4.at - pre },
  stamp: { from: V.s4.at - pre, to: V.s5.at - pre },
  reward: { from: V.s5.at - pre, to: V.s6.at - pre },
  near: { from: V.s6.at - pre, to: V.s7.at - pre },
  niches: { from: V.s7.at - pre, to: V.f1.at - pre },
  free: { from: V.f1.at - pre, to: V.k1.at - pre },
  cta: { from: V.k1.at - pre, to: DURATION_SEC },
};
export type SceneId = keyof typeof SCENES;

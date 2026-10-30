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
export const DURATION_SEC = Math.ceil((V.c1.end + TAIL) * 10) / 10;

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
  hook: { from: 0, to: V.s1.at - pre },
  stat1: { from: V.s1.at - pre, to: V.s2.at - pre },
  stat2: { from: V.s2.at - pre, to: V.w1.at - pre },
  why: { from: V.w1.at - pre, to: V.m1.at - pre },
  mech: { from: V.m1.at - pre, to: V.y1.at - pre },
  biz: { from: V.y1.at - pre, to: V.y2.at - pre },
  app: { from: V.y2.at - pre, to: V.c1.at - pre },
  cta: { from: V.c1.at - pre, to: DURATION_SEC },
};
export type SceneId = keyof typeof SCENES;

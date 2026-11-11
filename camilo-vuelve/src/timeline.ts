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
  wash: { from: 0, to: V.p1.at - pre },
  lost: { from: V.p1.at - pre, to: V.g1.at - pre },
  guess: { from: V.g1.at - pre, to: V.m0.at - pre },
  brand: { from: V.m0.at - pre, to: V.q1.at - pre },
  qr: { from: V.q1.at - pre, to: V.c1.at - pre },
  pay: { from: V.c1.at - pre, to: V.d1.at - pre },
  gone: { from: V.d1.at - pre, to: V.n1.at - pre },
  near: { from: V.n1.at - pre, to: V.v1.at - pre },
  back: { from: V.v1.at - pre, to: V.a1.at - pre },
  push: { from: V.a1.at - pre, to: V.t1.at - pre },
  colors: { from: V.t1.at - pre, to: V.f1.at - pre },
  free: { from: V.f1.at - pre, to: V.k1.at - pre },
  cta: { from: V.k1.at - pre, to: DURATION_SEC },
};
export type SceneId = keyof typeof SCENES;

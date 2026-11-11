import vo from "./voiceover.json";

/**
 * La línea de tiempo sale de la locución: cada frase empieza cuando termina la anterior
 * más su `pause` (src/voiceover.json, lo escribe scripts/make-voice.py).
 */
export const FPS = 30;
export const LEAD = 0.3;
export const TAIL = 2.6;

export type VoiceId = (typeof vo)[number]["id"];
export const V: Record<string, { at: number; end: number; dur: number; say: string }> = {};
let t = LEAD;
for (const it of vo) {
  V[it.id] = { at: t, end: t + it.dur, dur: it.dur, say: it.say };
  t += it.dur + it.pause;
}
export const VOICE = vo;
export const DURATION_SEC = Math.ceil((V.cta.end + TAIL) * 10) / 10;

/** Escenas (segundos). Cada una arranca un poco antes de su primera frase. */
const pre = 0.12;
export const SCENES = {
  hook: { from: 0, to: V.calm.at - pre },
  map1: { from: V.calm.at - pre, to: V.card.at - pre },
  card: { from: V.card.at - pre, to: V.loc.at - pre },
  map2: { from: V.loc.at - pre, to: V.off.at - pre },
  settings: { from: V.off.at - pre, to: V.biz.at - pre },
  store: { from: V.biz.at - pre, to: V.want.at - pre },
  fan: { from: V.want.at - pre, to: V.cta.at - pre },
  cta: { from: V.cta.at - pre, to: DURATION_SEC },
};
export type SceneId = keyof typeof SCENES;

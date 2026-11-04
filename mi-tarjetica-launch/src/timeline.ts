/**
 * Guion de tiempos (en segundos). La última escena (CTA) se calcula sola
 * para que el total sea exactamente TOTAL_SEC, descontando los solapes
 * de las transiciones.
 */
export const TOTAL_SEC = 45;

export type TransitionKind = "circle" | "slideUp" | "slideLeft" | "fade";
export type Transition = { kind: TransitionKind; sec: number } | null;

export type SceneId =
  | "hook"
  | "problem"
  | "reveal"
  | "wallet"
  | "stamps"
  | "nearby"
  | "fraud"
  | "business"
  | "message"
  | "cta";

export const timeline: { id: SceneId; sec: number; out: Transition }[] = [
  { id: "hook", sec: 3.4, out: null },
  { id: "problem", sec: 3.0, out: { kind: "circle", sec: 0.7 } },
  { id: "reveal", sec: 5.6, out: { kind: "slideUp", sec: 0.6 } },
  { id: "wallet", sec: 7.6, out: { kind: "circle", sec: 0.7 } },
  { id: "stamps", sec: 6.6, out: { kind: "slideLeft", sec: 0.6 } },
  { id: "nearby", sec: 5.4, out: { kind: "fade", sec: 0.4 } },
  { id: "fraud", sec: 5.0, out: null },
  { id: "business", sec: 4.2, out: { kind: "circle", sec: 0.7 } },
  { id: "message", sec: 3.6, out: { kind: "fade", sec: 0.5 } },
  { id: "cta", sec: 0, out: null }, // calculada
];

/** Duraciones en frames, con la escena final ajustada al total exacto. */
export const resolveTimeline = (fps: number) => {
  const f = (sec: number) => Math.round(sec * fps);
  const items = timeline.map((t) => ({
    ...t,
    dur: f(t.sec),
    outFrames: t.out ? f(t.out.sec) : 0,
  }));
  const last = items[items.length - 1];
  const others = items.slice(0, -1);
  const used =
    others.reduce((a, b) => a + b.dur, 0) -
    others.reduce((a, b) => a + b.outFrames, 0);
  last.dur = f(TOTAL_SEC) - used;
  return items;
};

/** Momentos clave dentro de cada escena (segundos) — compartidos por animación y sonido. */
export const cues = {
  revealLogoAt: 0.35,
  walletCardAt: 0.95,
  stampsAt: [1.1, 1.45, 1.8, 3.05],
  rewardAt: 3.3,
  notifyAt: 1.2,
  fraudRowsAt: 0.7,
  ctaTapAt: 3.0,
};

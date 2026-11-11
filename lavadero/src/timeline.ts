/** Momentos del video en SEGUNDOS (se convierten con `s(sec)`). */
export const DURATION_SEC = 18;
export const FPS = 60;

export const T = {
  hookIn: 0.08,
  hookOut: 1.65,

  cardIn: 1.85,
  tunnel: 2.0, // estructura → cepillos → chorros (pop escalonado)
  brushes: 2.2,
  jets: 2.38,
  carIn: 2.45, // entra sucio por la izquierda…
  carStop: 3.35, // …y frena frente al túnel

  text1: 4.3,
  text1Out: 6.85,
  montage: 7.0,
  text2: 7.25,
  text2Out: 10.85,

  /** Cámara lenta de la décima pasada (velocidad 0.35×). */
  slowFrom: 11.0,
  slowTo: 13.5,
  prize: 13.5, // la décima gota llega: golpe de música, sheen, 10/10, premio
  weekOut: 13.7,

  reverse: 14.05, // reversa con rebote, vuelve hacia el túnel
  reverseEnd: 15.3,
  text3: 14.15,
  text3Out: 15.35,

  sceneOut: 15.5,
  cta: 15.75,
  ctaLogo: 16.2,
  ctaUrl: 16.6,
  ctaSub: 16.85,
  loopFadeFrames: 10,
};

export type Pass = {
  n: number;
  /** El carro aparece (sucio). */
  start: number;
  /** Las manchas desaparecen entre washFrom y washTo. */
  washFrom: number;
  washTo: number;
  /** Sale limpio: destellos y brillo. */
  shine: number;
  /** La gota vuela del túnel a la tarjeta. */
  dropFrom: number;
  dropTo: number;
  /** Pasada del montaje: cruza de lado a lado en `dur`. */
  dur?: number;
};

/** Duración de cada pasada del montaje (visitas 2–9): de ~0.8 s a ~0.3 s. */
export const montageDurations = [0.72, 0.65, 0.58, 0.51, 0.45, 0.39, 0.33, 0.28];

const montage: Pass[] = (() => {
  let t = T.montage;
  return montageDurations.map((dur, i) => {
    const flight = Math.max(0.28, Math.min(0.45, dur * 0.6));
    const p: Pass = {
      n: i + 2,
      start: t,
      dur,
      washFrom: t + dur * 0.4,
      washTo: t + dur * 0.58,
      shine: t + dur * 0.64,
      dropFrom: t + dur * 0.62,
      dropTo: t + dur * 0.62 + flight,
    };
    t += dur;
    return p;
  });
})();

export const passes: Pass[] = [
  { n: 1, start: T.carIn, washFrom: 4.7, washTo: 5.5, shine: 6.05, dropFrom: 6.15, dropTo: 6.68 },
  ...montage,
  { n: 10, start: T.slowFrom, washFrom: 11.95, washTo: 12.7, shine: 13.2, dropFrom: 12.85, dropTo: T.prize },
];

/** Velocidad del tiempo de la escena (cámara lenta en la décima). */
export const timeSpeed = (t: number) => {
  const ramp = (a: number, b: number, x: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  const slow = 0.35;
  if (t < T.slowFrom) return 1;
  if (t < T.slowFrom + 0.3) return 1 - (1 - slow) * ramp(T.slowFrom, T.slowFrom + 0.3, t);
  if (t < T.slowTo - 0.15) return slow;
  if (t < T.slowTo) return slow + (1 - slow) * ramp(T.slowTo - 0.15, T.slowTo, t);
  return 1;
};

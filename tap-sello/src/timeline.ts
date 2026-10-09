import { music } from "./brand";

/** Duración total y momentos clave (segundos). Los taps salen del BPM de la música. */
export const DURATION_SEC = 18;
export const FPS = 60;

const beat = 60 / music.bpm;
const taps = music.tapBeats.map((b) => b * beat);
const lands = taps.map((t) => t + beat);

export const T = {
  beat,
  hookExit: 1.72,
  phonesIn: 2.0,
  labelsIn: 2.55,
  fingerIn: 3.55,
  underFirst: 3.75,
  /** Momento de cada toque en "+1 sello". */
  taps,
  /** Momento en que cada sello aterriza en la tarjeta (1 beat después del toque). */
  lands,
  /** Premio desbloqueado: justo después del décimo sello. */
  unlock: Math.min(10.6, lands[2] + 0.28),
  underOut: 10.9,
  swap: 11.25,
  lock: 13.0,
  outsideText: 13.25,
  notif: 13.6,
  ctaOut: 15.65,
  cta: 16.0,
  /** Los últimos 10 frames funden a negro idéntico al frame 0 (loop). */
  loopFadeFrames: 10,
};

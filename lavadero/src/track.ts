/**
 * Recorrido del carro y estado de la escena en cada momento (coordenadas del "escenario":
 * 1080 de ancho, piso en y = 440, túnel centrado en x = 540).
 */
import { Easing, interpolate } from "remotion";
import { EASE, EASE_INOUT, clamp } from "./motion";
import { T, montageDurations, passes, timeSpeed } from "./timeline";

export const STAGE = { w: 1080, h: 560, ground: 440 };
export const TUNNEL = { x: 540, half: 190, top: 96 };
export const CAR = { w: 300, h: 150, wheelR: 28 };
export const X = { offLeft: -190, wait: 176, inside: 540, exit: 904, offRight: 1290 };

type Seg = { t0: number; t1: number; x0: number; x1: number; easing?: (t: number) => number };

const segments: Seg[] = (() => {
  const segs: Seg[] = [
    { t0: T.carIn, t1: T.carStop, x0: X.offLeft, x1: X.wait },
    { t0: 3.9, t1: 4.55, x0: X.wait, x1: X.inside },
    { t0: 5.6, t1: 6.15, x0: X.inside, x1: X.exit },
    { t0: 6.7, t1: T.montage, x0: X.exit, x1: X.offRight, easing: Easing.bezier(0.5, 0, 0.9, 0.6) },
  ];
  let t = T.montage;
  for (const d of montageDurations) {
    segs.push({ t0: t, t1: t + d, x0: X.offLeft, x1: X.offRight });
    t += d;
  }
  segs.push({ t0: T.slowFrom, t1: 11.9, x0: X.offLeft, x1: X.inside, easing: EASE });
  segs.push({ t0: 12.7, t1: 13.3, x0: X.inside, x1: X.exit });
  segs.push({ t0: T.reverse, t1: T.reverseEnd, x0: X.exit, x1: X.inside });
  return segs;
})();

/** Posición x del centro del carro. */
export const carX = (t: number) => {
  let seg: Seg | null = null;
  for (const sg of segments) if (sg.t0 <= t) seg = sg;
  if (!seg) return X.offLeft;
  return interpolate(t, [seg.t0, seg.t1], [seg.x0, seg.x1], { ...clamp, easing: seg.easing ?? EASE_INOUT });
};

/** Suspensión: la carrocería responde a la aceleración (rebote leve al arrancar y frenar). */
export const suspension = (frame: number, fps: number) => {
  const x = (f: number) => carX(f / fps);
  let acc = 0;
  for (let j = 0; j < 45; j++) {
    const f = frame - j;
    const v1 = x(f + 1) - x(f);
    const v0 = x(f) - x(f - 1);
    if (Math.abs(v1) > 300 || Math.abs(v0) > 300) continue; // salto fuera de cuadro (montaje)
    acc += (v1 - v0) * Math.exp(-j / 7) * Math.sin(j * 0.5 + 0.4);
  }
  return { y: 4 * Math.tanh(acc * 0.35), rotate: -1.8 * Math.tanh(acc * 0.3) };
};

/** Tiempo de la escena: corre más lento en la cámara lenta (cepillos, agua, burbujas). */
const tauCache = new Map<number, Float64Array>();
export const sceneTime = (frame: number, fps: number) => {
  let arr = tauCache.get(fps);
  if (!arr) {
    const n = Math.ceil(fps * 20);
    arr = new Float64Array(n);
    for (let f = 1; f < n; f++) arr[f] = arr[f - 1] + timeSpeed((f - 1) / fps) / fps;
    tauCache.set(fps, arr);
  }
  const f = Math.max(0, Math.min(arr.length - 1, frame));
  return arr[Math.floor(f)];
};

export const currentPass = (t: number) => {
  let p = passes[0];
  for (const ps of passes) if (ps.start <= t) p = ps;
  return p;
};

export const SPOTS = 8;

/** Nivel de suciedad de cada mancha (1 = sucia, 0 = limpia). */
export const dirtLevels = (t: number) => {
  const p = currentPass(t);
  const w = p.washTo - p.washFrom;
  const d = Math.min(0.18, w / 2);
  return Array.from({ length: SPOTS }, (_, j) => {
    const from = p.washFrom + (j / SPOTS) * (w - d);
    return 1 - interpolate(t, [from, from + d], [0, 1], { ...clamp, easing: EASE });
  });
};

/** Espuma sobre el carro durante el lavado. */
export const foamLevel = (t: number) => {
  const p = currentPass(t);
  const w = p.washTo - p.washFrom;
  return interpolate(t, [p.washFrom - 0.1, p.washFrom + 0.12 * w, p.washTo, p.washTo + 0.15], [0, 1, 1, 0], clamp);
};

/** 0–1: qué tanto está el carro dentro del túnel (agua y cepillos a toda marcha). */
export const insideTunnel = (t: number) => 1 - Math.min(1, Math.max(0, (Math.abs(carX(t) - TUNNEL.x) - 40) / 170));

/** Cuántas gotas han llegado a la tarjeta en `t` (con el momento de la última). */
export const stampsAt = (t: number) => passes.filter((p) => p.dropTo <= t).length;

/** Giro acumulado de los cepillos (vueltas): lentos en reposo, rápidos con el carro adentro. */
const brushCache = new Map<number, Float64Array>();
export const brushTurns = (frame: number, fps: number) => {
  let arr = brushCache.get(fps);
  if (!arr) {
    const n = Math.ceil(fps * 20);
    arr = new Float64Array(n);
    for (let f = 1; f < n; f++) {
      const t = (f - 1) / fps;
      arr[f] = arr[f - 1] + (timeSpeed(t) * (0.5 + 2.4 * insideTunnel(t))) / fps;
    }
    brushCache.set(fps, arr);
  }
  return arr[Math.max(0, Math.min(arr.length - 1, Math.floor(frame)))];
};

/** Velocidad del carro (px por frame, con signo). */
export const carVelocity = (frame: number, fps: number) => carX((frame + 1) / fps) - carX(frame / fps);

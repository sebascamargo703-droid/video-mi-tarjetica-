import { Easing } from "remotion";
import { MOMENTS as M, SCENES as S, WORLD, type V3 } from "./constants";
import { EASE, lerp, seg } from "./motion";

/**
 * Coreografía del mundo 3D en función del tiempo absoluto T (segundos):
 * dónde está Andrés, cuánta luz hay, qué tan abierta está la puerta, etc.
 * Las escenas (src/scenes) solo aportan la cámara y la capa 2D.
 */

export type AndresState = {
  pos: V3;
  yaw: number; // 0 = mira hacia +z; π/2 = hacia +x
  phase: number; // fase del ciclo de caminata
  walk: number; // 0 quieto → 1 caminando
  headYaw: number;
  headPitch: number;
  phoneRaise: number; // 0 brazo abajo → 1 mirando el celular
  phoneGlow: number; // brillo extra de la pantalla (notificación)
  seated: number; // 0 de pie → 1 sentado
  sitDrop: number; // pequeño rebote al sentarse
};

const Z = WORLD.sidewalkZ;
const V = WORLD.walkSpeed;
const STRIDE = 1.45; // metros por ciclo completo

/* ── Tramo A: camina frente a la barbería (hacia +x) ── */
const X_START = -6.5;
const T_BRAKE = 9.6; // empieza a frenar tras el aviso
const X_BRAKE = X_START + V * (T_BRAKE - S.calle.from);
const DECEL = 0.643;
const T_STOP = T_BRAKE + V / DECEL;
const X_STOP = X_BRAKE + (V * V) / (2 * DECEL);

/* ── Tramo C: se devuelve y entra por la puerta ── */
const P0: [number, number] = [X_STOP, Z];
const P1: [number, number] = [2.25, 0.5]; // frente a la puerta
const P2: [number, number] = [1.95, -1.3]; // ya adentro
const L1 = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
const L2 = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]);
const yawOf = (a: [number, number], b: [number, number]) => Math.atan2(b[0] - a[0], b[1] - a[1]);
const unwrapUp = (yaw: number, from: number) => {
  let y = yaw;
  while (y < from) y += Math.PI * 2;
  return y;
};
const YAW_A = Math.PI / 2;
const YAW_1 = unwrapUp(yawOf(P0, P1), YAW_A); // gira hacia la barbería
const YAW_2 = YAW_1 + (((yawOf(P1, P2) - YAW_1 + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
const T_ENTER = S.silla.from; // a esa hora ya está adentro
const WALK_T = T_ENTER - M.walkBack;
const ACC = 0.2;
const V_BACK = (L1 + L2) / (WALK_T - ACC);

export const andresAt = (T: number): AndresState => {
  // 5–6 · sentado en la silla
  if (T >= S.silla.from) {
    const k = T - S.silla.from;
    return {
      pos: WORLD.chair.pos,
      yaw: WORLD.chair.yaw,
      phase: 0,
      walk: 0,
      headYaw: Math.sin(T * 0.9) * 0.06,
      headPitch: -0.04,
      phoneRaise: 0,
      phoneGlow: 0,
      seated: 1,
      sitDrop: Math.exp(-k * 5) * Math.cos(k * 14) * 0.035,
    };
  }

  const phoneRaise = seg(T, M.notification - 0.15, M.notification + 0.45, EASE.out) * (1 - 0.75 * seg(T, M.lookBack, M.lookBack + 0.6));
  const headDown = seg(T, M.notification, M.notification + 0.4, EASE.out) * (1 - seg(T, M.lookBack - 0.1, M.lookBack + 0.35));
  const phoneGlow = seg(T, M.notification - 0.05, M.notification + 0.1, EASE.out);

  // 2–3 · camina y frena
  if (T < M.turn) {
    let x: number;
    let speed: number;
    if (T < T_BRAKE) {
      x = X_START + V * (T - S.calle.from);
      speed = V;
    } else if (T < T_STOP) {
      const tau = T - T_BRAKE;
      x = X_BRAKE + V * tau - 0.5 * DECEL * tau * tau;
      speed = V - DECEL * tau;
    } else {
      x = X_STOP;
      speed = 0;
    }
    const lookBack = seg(T, M.lookBack, M.lookBack + 0.45, EASE.out);
    return {
      pos: [x, 0, Z],
      yaw: YAW_A,
      phase: ((x - X_START) / STRIDE) * Math.PI * 2,
      walk: Math.min(1, speed / V),
      headYaw: lookBack * 1.15,
      headPitch: 0.06 + headDown * 0.34,
      phoneRaise,
      phoneGlow,
      seated: 0,
      sitDrop: 0,
    };
  }

  // 4 · gira, camina a la puerta y entra
  const turnK = seg(T, M.turn, M.walkBack + 0.15, EASE.inOut);
  const tau = Math.max(0, T - M.walkBack);
  const s = Math.min(L1 + L2, V_BACK * (tau - ACC * (1 - Math.exp(-tau / ACC))));
  const speed = tau <= 0 ? 0 : V_BACK * (1 - Math.exp(-tau / ACC));
  let x: number;
  let z: number;
  if (s < L1) {
    x = lerp(P0[0], P1[0], s / L1);
    z = lerp(P0[1], P1[1], s / L1);
  } else {
    x = lerp(P1[0], P2[0], (s - L1) / L2);
    z = lerp(P1[1], P2[1], (s - L1) / L2);
  }
  const bend = seg(s, L1 - 0.45, L1 + 0.35, EASE.inOut);
  return {
    pos: [x, 0, z],
    yaw: lerp(lerp(YAW_A, YAW_1, turnK), YAW_2, bend),
    phase: (s / STRIDE) * Math.PI * 2 + 0.6,
    walk: Math.min(1, speed / V),
    headYaw: 1.15 * (1 - seg(T, M.turn + 0.1, M.walkBack, EASE.inOut)),
    headPitch: 0.04,
    phoneRaise,
    phoneGlow,
    seated: 0,
    sitDrop: 0,
  };
};

/** Intensidad de la lámpara sobre la silla (1 = ámbar tenue del inicio). */
export const lampAt = (T: number) => {
  // parpadeo único del gancho
  const f = T - M.flicker;
  const flicker = f > 0 && f < 0.36 ? (f < 0.07 ? 0.15 : f < 0.14 ? 0.9 : f < 0.2 ? 0.25 : f < 0.27 ? 1 : 0.6) : 1;
  const full = seg(T, M.lightsUp, M.lightsUp + 1.3, EASE.out);
  return (0.55 + 0.8 * full) * flicker;
};

/** Luces generales de la barbería (0 apagadas → 1 encendidas). */
export const interiorAt = (T: number) => 0.32 * seg(T, M.doorOpen, M.doorOpen + 0.9, EASE.out) + 0.68 * seg(T, M.lightsUp, M.lightsUp + 1.3, EASE.out);

/** Apertura de la puerta (0 cerrada → 1 abierta). */
export const doorAt = (T: number) => seg(T, M.doorOpen, M.doorOpen + 0.75, Easing.bezier(0.3, 0, 0.2, 1));

/** Densidad de la niebla: más densa en la calle. */
export const fogAt = (T: number) => {
  const outside = seg(T, S.calle.from + 0.6, S.calle.from + 2, EASE.inOut) * (1 - (T >= S.silla.from ? 1 : 0));
  return lerp(0.03, 0.05, outside);
};

/** Desenfoque del 3D (px) para dar protagonismo a la capa 2D. */
export const blurAt = (T: number) =>
  9 * seg(T, M.phoneIn - 0.1, M.phoneIn + 0.5, EASE.out) * (1 - seg(T, M.phoneOut, M.phoneOut + 0.4, EASE.inOut)) +
  14 * seg(T, S.cierre.from, S.cierre.from + 0.7, EASE.out);

/** Oscurecimiento del 3D (0..1). */
export const dimAt = (T: number) =>
  0.45 * seg(T, M.phoneIn - 0.1, M.phoneIn + 0.5, EASE.out) * (1 - seg(T, M.phoneOut, M.phoneOut + 0.4, EASE.inOut)) +
  0.62 * seg(T, S.cierre.from, S.cierre.from + 0.7, EASE.out);

/** Fundidos a negro: entrada del video y el corte corto entre las escenas 4 y 5. */
export const fadeAt = (T: number) => {
  const intro = 1 - seg(T, 0, 0.45, EASE.soft);
  const cut = T < S.silla.from ? seg(T, M.fadeOut, S.silla.from, EASE.soft) : 1 - seg(T, S.silla.from, S.silla.from + 0.3, EASE.soft);
  return Math.max(intro, cut);
};

/* ───────────── Cámara ───────────── */
export type CamKey = {
  t: number; // segundo absoluto
  pos: V3;
  target: V3;
  fov: number;
  /** pos/target relativos a la posición de Andrés (la cámara lo sigue). */
  follow?: boolean;
  /** corte directo: no interpola desde la clave anterior. */
  cut?: boolean;
  /** easing del tramo que LLEGA a esta clave. */
  ease?: (x: number) => number;
};
export type Cam = { pos: V3; target: V3; fov: number };

const resolve = (k: CamKey, T: number): Cam => {
  if (!k.follow) return { pos: k.pos, target: k.target, fov: k.fov };
  const a = andresAt(T).pos;
  return {
    pos: [a[0] + k.pos[0], k.pos[1], a[2] + k.pos[2]],
    target: [a[0] + k.target[0], k.target[1], a[2] + k.target[2]],
    fov: k.fov,
  };
};

/** Interpola la cámara entre claves; siempre con easing y un leve "respirar". */
export const cameraAt = (keys: CamKey[], T: number): Cam => {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= T) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  let cam: Cam;
  if (a === b || T <= a.t || b.cut) {
    cam = resolve(a, T);
  } else {
    const k = seg(T, a.t, b.t, b.ease ?? EASE.inOut);
    const ca = resolve(a, T);
    const cb = resolve(b, T);
    cam = {
      pos: [lerp(ca.pos[0], cb.pos[0], k), lerp(ca.pos[1], cb.pos[1], k), lerp(ca.pos[2], cb.pos[2], k)],
      target: [lerp(ca.target[0], cb.target[0], k), lerp(ca.target[1], cb.target[1], k), lerp(ca.target[2], cb.target[2], k)],
      fov: lerp(ca.fov, cb.fov, k),
    };
  }
  // deriva mínima para que la cámara nunca quede congelada
  const dx = Math.sin(T * 0.7) * 0.012;
  const dy = Math.sin(T * 0.9 + 1.3) * 0.008;
  return { pos: [cam.pos[0] + dx, cam.pos[1] + dy, cam.pos[2]], target: cam.target, fov: cam.fov };
};

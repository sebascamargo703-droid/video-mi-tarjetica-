/**
 * Estado de la tarjeta en un frame: qué nicho muestra, de cuál viene y cómo va cada
 * parte de la transformación. Todo sale de timeline.ts (beats) → no hay frames sueltos.
 */
import { interpolate, interpolateColors, spring } from "remotion";
import { beatFrame, palette, textOn } from "./brand";
import { copy } from "./copy";
import { EASE_INOUT, clamp, ease, mix } from "./motion";
import { type Niche, niches, yourBusiness } from "./niches";
import { B, card, colorCycle } from "./timeline";

/** Duración de cada transformación (frames). */
export const CHANGE = 12;
const PUNCH = { damping: 14, stiffness: 260 } as const;

/** La tarjeta final usa el verde de marca sobre blanco (7.6:1); los nichos, blanco u oscuro según AA. */
export const inkFor = (n: Niche) => (n === yourBusiness ? palette.brand : textOn(n.color));

export const getCardState = (frame: number, fps: number) => {
  const beat = (n: number) => beatFrame(n, fps);
  const states = card.map((c) => ({ at: beat(c.beat), niche: c.niche === "final" ? yourBusiness : niches[c.niche] }));
  let i = 0;
  states.forEach((st, k) => {
    if (st.at <= frame) i = k;
  });
  const cur = states[i];
  const prev = i > 0 ? states[i - 1] : null;
  const from = prev?.niche ?? cur.niche;
  const at = cur.at;
  const dt = frame - at;
  const isFinal = cur.niche === yourBusiness;
  const p = prev ? ease(frame, at, CHANGE) : 1;

  /* ---- color (con el ciclo de "Tus colores" encima) ---- */
  // el aterrizaje en "Tu negocio" es seco (3 frames); los demás cambios, 8 frames
  const colorDur = isFinal ? 3 : 8;
  let bg = interpolateColors(frame, [at, at + colorDur], [from.color, cur.niche.color]);
  let ink = interpolateColors(frame, [at, at + colorDur], [inkFor(from), inkFor(cur.niche)]);
  const cyc = [yourBusiness, ...colorCycle.niches.map((n) => niches[n]), yourBusiness];
  const cycAt = cyc.slice(1).map((_, j) => beat(colorCycle.from + j * colorCycle.step));
  if (isFinal && frame >= cycAt[0] && frame <= cycAt[cycAt.length - 1] + 4) {
    const input = cycAt.flatMap((t) => [t, t + 3]);
    bg = interpolateColors(frame, input, cycAt.flatMap((_, j) => [cyc[j].color, cyc[j + 1].color]));
    ink = interpolateColors(frame, input, cycAt.flatMap((_, j) => [inkFor(cyc[j]), inkFor(cyc[j + 1])]));
  }

  /* ---- golpe de escala 1 → 1.05 → 1 en cada cambio (spring damping 14 / stiffness 260) ---- */
  const hits = [
    ...states.slice(1).map((st) => ({ at: st.at, amp: st.niche === yourBusiness ? 0.1 : 0.05 })),
    { at: beat(B.logo), amp: 0.03 },
    ...cycAt.map((t) => ({ at: t, amp: 0.025 })),
    { at: beat(B.reward), amp: 0.03 },
  ].sort((a, b) => a.at - b.at);
  let punch = 0;
  for (const h of hits) {
    if (frame >= h.at) punch = h.amp * (1 - spring({ frame: frame - h.at, fps, config: PUNCH }));
    // ataque: 3 frames antes del golpe la tarjeta ya empieza a crecer
    else if (frame >= h.at - 3) punch = Math.max(punch, interpolate(frame, [h.at - 3, h.at], [0, h.amp * 0.6]));
  }
  // el "drop": la tarjeta se recoge en el silencio y aterriza de golpe en el beat siguiente
  const drop = frame >= beat(B.drop) && frame < beat(B.land) ? interpolate(frame, [beat(B.drop) + 6, beat(B.land)], [1, 0.93], { ...clamp, easing: EASE_INOUT }) : 1;
  const scale = (1 + punch) * drop;

  /* ---- giro alterno ±6° ---- */
  const target = (k: number) => (states[k].niche === yourBusiness ? 0 : k % 2 === 0 ? -6 : 6);
  const rotY = mix(prev ? target(i - 1) : target(i), target(i), spring({ frame: dt, fps, config: PUNCH }));

  /* ---- íconos ---- */
  const iconOut = prev ? ease(frame, at, 6) : 1;
  const iconIn = prev ? spring({ frame: dt - 2, fps, config: { damping: 12, stiffness: 220 } }) : 1;
  const iconInOpacity = prev ? ease(frame, at + 2, 5) : 1;

  /* ---- halo y brillo ---- */
  const glowColor = isFinal ? palette.accent : bg;
  const glowOpacity = (0.17 + 0.08 * (1 - ease(frame, at, 18))) * (frame >= beat(B.drop) && frame < beat(B.land) ? 1 - ease(frame, beat(B.drop), 10) : 1);
  const sheen = interpolate(dt, [0, 16], [0, 1], clamp);

  /* ---- personalización ---- */
  const pulse = (b: number, len = 1.6) => (frame < beat(b) ? 0 : interpolate(frame, [beat(b), beat(b) + 6, beat(b + len)], [0, 1, 0.55], clamp));
  const haloLogo = isFinal && frame < beat(B.colors) ? pulse(B.logo) : 0;
  const haloCard = isFinal && frame < beat(B.reward) ? pulse(B.colors) : 0;
  const haloReward = isFinal ? pulse(B.reward) : 0;

  // máquina de escribir: borra el premio y escribe uno nuevo
  let reward = cur.niche.premio;
  let caret = false;
  const r0 = beat(B.reward);
  const typing = isFinal && frame >= r0;
  if (typing) {
    const old = yourBusiness.premio;
    const erased = Math.round(interpolate(frame, [r0 + 2, r0 + 10], [0, old.length], clamp));
    const typed = Math.round(interpolate(frame, [r0 + 12, r0 + 12 + copy.rewardTyped.length * 0.9], [0, copy.rewardTyped.length], clamp));
    reward = typed > 0 ? copy.rewardTyped.slice(0, typed) : old.slice(0, old.length - erased);
    caret = frame < r0 + 12 + copy.rewardTyped.length * 0.9 + 14 && Math.floor((frame - r0) / 8) % 2 === 0;
  }

  return {
    i,
    at,
    dt,
    cur: cur.niche,
    from,
    prevNiche: prev?.niche ?? null,
    isFinal,
    p,
    bg,
    ink,
    scale,
    rotY,
    iconOut,
    iconIn,
    iconInOpacity,
    glowColor,
    glowOpacity,
    sheen,
    haloLogo,
    haloCard,
    haloReward,
    reward,
    caret,
    typing,
    stamps: {
      total: cur.niche.sellosTotales,
      prevTotal: prev ? from.sellosTotales : 0,
      filled: cur.niche.sellosLlenos,
      prevFilled: prev ? from.sellosLlenos : 0,
    },
  };
};

export type CardState = ReturnType<typeof getCardState>;

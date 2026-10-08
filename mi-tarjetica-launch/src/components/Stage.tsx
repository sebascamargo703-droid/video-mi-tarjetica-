import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Tone, tones } from "../brand";
import { EASE_INOUT, clamp } from "../lib/motion";

/** Fondo plano con un degradado radial muy sutil. */
export const Backdrop: React.FC<{
  tone: Tone;
  glowAt?: string;
  glowSize?: number;
}> = ({ tone, glowAt = "50% 42%", glowSize = 62 }) => {
  const t = tones[tone];
  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${glowAt}, ${t.glow} 0%, rgba(0,0,0,0) ${glowSize}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Micro‑movimiento de cámara continuo: escala 1 → 1.035 y una deriva
 * mínima para que ningún plano se sienta congelado.
 */
export const Camera: React.FC<{
  dur: number;
  from?: number;
  to?: number;
  drift?: number;
  children: React.ReactNode;
}> = ({ dur, from = 1, to = 1.035, drift = 0, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {
    ...clamp,
    easing: EASE_INOUT,
  });
  const scale = from + (to - from) * p;
  const x = drift * (p - 0.5);
  return (
    <AbsoluteFill
      style={{ transform: `translateX(${x}px) scale(${scale})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Sombra amplia y suave para objetos (teléfono, tarjeta). */
export const softShadow = (u: number, strength = 1, onDark = false) =>
  onDark
    ? `0 ${60 * u}px ${140 * u}px rgba(0,0,0,${0.55 * strength}), 0 ${18 * u}px ${40 * u}px rgba(0,0,0,${0.35 * strength})`
    : `0 ${60 * u}px ${120 * u}px rgba(10,30,25,${0.18 * strength}), 0 ${16 * u}px ${36 * u}px rgba(10,30,25,${0.12 * strength})`;

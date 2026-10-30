import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { EASE, clamp, popSpring } from "../lib/motion";

/**
 * Un sello. Vacío = anillo punteado. Lleno = disco con check que hace "pop"
 * (spring damping 12 / stiffness 180) y suelta una onda.
 *
 * `filledAt`: frame en que se pone el sello. `null` = sigue vacío.
 * Un valor muy negativo = ya estaba puesto (sin animación).
 */
export const Stamp: React.FC<{
  size: number;
  filledAt: number | null;
  fill?: string;
  ink?: string;
  ring?: string;
}> = ({
  size,
  filledAt,
  fill = brand.colors.white,
  ink = brand.colors.green,
  ring = "rgba(255,255,255,0.32)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = filledAt === null ? -1 : frame - filledAt;
  const filled = local >= 0;
  const pop = filled ? popSpring(frame, fps, filledAt ?? 0) : 0;
  const ripple = filled
    ? interpolate(local, [0, fps * 0.7], [0, 1], { ...clamp, easing: EASE })
    : 0;
  const check = filled
    ? interpolate(local, [fps * 0.08, fps * 0.4], [0, 1], {
        ...clamp,
        easing: EASE,
      })
    : 0;

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${Math.max(1.5, size * 0.035)}px dashed ${ring}`,
          opacity: 1 - pop * 0.9,
        }}
      />
      {filled && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${size * 0.04}px solid ${fill}`,
            transform: `scale(${1 + ripple * 0.9})`,
            opacity: (1 - ripple) * 0.7,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: fill,
          transform: `scale(${pop})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(0,0,0,0.18)`,
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
          <path
            d="M5 12.5l4.2 4.2L19 7"
            fill="none"
            stroke={ink}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - check}
          />
        </svg>
      </div>
    </div>
  );
};

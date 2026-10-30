import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { EASE, clamp, pop } from "../motion";

const Check: React.FC<{ size: number; color: string; draw?: number }> = ({ size, color, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 12.5l4.2 4.2L19 7"
      fill="none"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

/**
 * Círculo de sello. `filledAt` = frame en que se llena (pop con spring 0 → 1.15 → 1
 * y anillo expansivo). `null` = vacío. Negativo = ya estaba lleno.
 */
export const Stamp: React.FC<{ size: number; filledAt: number | null; fill?: string; ink?: string }> = ({
  size,
  filledAt,
  fill = brand.colors.white,
  ink = brand.colors.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pre = filledAt !== null && filledAt < 0;
  const p = pre ? 1 : filledAt === null ? 0 : pop(frame, fps, filledAt);
  const local = filledAt === null ? -1 : frame - filledAt;
  const ring = !pre && local >= 0 ? interpolate(local, [0, fps * 0.7], [0, 1], { ...clamp, easing: EASE }) : 1;
  const check = pre ? 1 : local >= 0 ? interpolate(local, [fps * 0.06, fps * 0.35], [0, 1], { ...clamp, easing: EASE }) : 0;
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${size * 0.045}px dashed rgba(255,255,255,0.35)`,
          opacity: 1 - Math.min(1, p),
        }}
      />
      {ring < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${size * 0.06}px solid ${brand.colors.mint}`,
            transform: `scale(${1 + ring * 1.1})`,
            opacity: (1 - ring) * 0.9,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: fill,
          transform: `scale(${p})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: ring < 1 ? `0 0 ${size * 0.6 * (1 - ring)}px ${brand.colors.mint}` : `0 ${size * 0.06}px ${size * 0.18}px rgba(0,0,0,0.2)`,
        }}
      >
        <Check size={size * 0.52} color={ink} draw={check} />
      </div>
    </div>
  );
};

export { Check };

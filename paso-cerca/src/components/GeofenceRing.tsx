import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { EASE, clamp, ease } from "../motion";

/**
 * Anillo de geocerca sobre el plano del mapa: pulsa suave (1 → 1.08) y, cuando el
 * cliente entra (`enterAt`), destella en color de marca y suelta una onda expansiva.
 */
export const GeofenceRing: React.FC<{ x: number; y: number; r: number; appearAt: number; enterAt: number; frameOffset?: number }> = ({
  x,
  y,
  r,
  appearAt,
  enterAt,
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const appear = ease(frame, appearAt, Math.round(fps * 0.9));
  const pulse = (Math.sin(((frame - appearAt) / fps) * Math.PI * 2 * 0.55) + 1) / 2; // ~0.55 Hz
  const flash = frame >= enterAt ? interpolate(frame - enterAt, [0, fps * 0.12, fps * 0.9], [0, 1, 0], { ...clamp, easing: EASE }) : 0;
  const wave = frame >= enterAt ? interpolate(frame - enterAt, [0, fps * 1.1], [0, 1], { ...clamp, easing: EASE }) : 0;
  const scale = (0.6 + 0.4 * appear) * (1 + 0.08 * pulse);
  const d = r * 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: d,
          height: d,
          borderRadius: "50%",
          transform: `scale(${scale})`,
          opacity: appear,
          background: `radial-gradient(circle, rgba(105,211,190,${0.06 + 0.05 * pulse + 0.3 * flash}) 0%, rgba(105,211,190,${0.16 + 0.06 * pulse + 0.35 * flash}) 70%, rgba(105,211,190,${0.03}) 100%)`,
          border: `${4 + 6 * flash}px solid rgba(105,211,190,${0.45 + 0.25 * (1 - pulse) + 0.3 * flash})`,
          boxShadow: flash > 0 ? `0 0 ${120 * flash}px rgba(105,211,190,${0.8 * flash})` : undefined,
        }}
      />
      {wave > 0 && wave < 1 ? (
        <div
          style={{
            position: "absolute",
            left: x - r,
            top: y - r,
            width: d,
            height: d,
            borderRadius: "50%",
            border: `6px solid ${brand.colors.mint}`,
            transform: `scale(${1 + wave * 1.1})`,
            opacity: (1 - wave) * 0.9,
          }}
        />
      ) : null}
    </>
  );
};

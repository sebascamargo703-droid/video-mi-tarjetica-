import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { enterProgress, enterStyle } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, fonts, springs, weights } from "../theme";
import { KineticTitle, TitleToken } from "./KineticTitle";

/**
 * Cabecera de beneficio: número grande y tenue a un costado + titular.
 */
export const BenefitHeader: React.FC<{
  number: number;
  title: TitleToken[][];
  delay?: number;
  align?: "left" | "center";
}> = ({ number, title, delay = 4, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical } = useLayout();
  const p = enterProgress(frame, fps, delay, springs.soft);
  const size = (isVertical ? 84 : 80) * u;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: isVertical ? -20 * u : -30 * u,
          top: -70 * u,
          fontFamily: fonts.display,
          fontWeight: weights.heavy,
          fontSize: 420 * u,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: `${2 * u}px rgba(255,255,255,0.14)`,
          backgroundImage: "linear-gradient(180deg, rgba(47,107,255,0.22) 0%, rgba(47,107,255,0) 80%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          opacity: interpolate(p, [0, 1], [0, 1]),
          transform: `translateX(${(1 - p) * -30 * u}px)`,
          filter: `blur(${(1 - p) * 12 * u}px)`,
        }}
      >
        {number}
      </div>
      <div style={{ position: "relative", paddingTop: 70 * u }}>
        <div
          style={{
            ...enterStyle(p, u),
            fontFamily: fonts.text,
            fontWeight: weights.semibold,
            fontSize: 26 * u,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: colors.blueText,
            marginBottom: 22 * u,
            textAlign: align,
          }}
        >
          Beneficio {String(number).padStart(2, "0")}
        </div>
        <KineticTitle lines={title} size={size} u={u} delay={delay + 4} stagger={4} align={align} />
      </div>
    </div>
  );
};

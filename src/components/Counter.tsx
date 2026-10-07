import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

interface CounterProps {
  from: number;
  to: number;
  startFrame: number;
  durationFrames: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: string;
  gradient?: string;
}

/**
 * High-precision animated KPI counter
 * Smooth easing, optional decimal precision, gradient and subtle glow.
 */
export const Counter: React.FC<CounterProps> = ({
  from,
  to,
  startFrame,
  durationFrames,
  decimals = 0,
  prefix = "",
  suffix = "",
  fontSize = "160px",
  gradient = theme.colors.gradientBrand,
}) => {
  const frame = useCurrentFrame();

  const relFrame = Math.max(0, frame - startFrame);

  const value = interpolate(relFrame, [0, durationFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const formattedValue =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString("en-US");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.weights.black,
        fontSize,
        letterSpacing: "-0.04em",
        lineHeight: 0.9,
      }}
    >
      {prefix && (
        <span
          style={{
            fontSize: "0.55em",
            fontWeight: theme.typography.weights.heavy,
            color: theme.colors.textSecondary,
            marginRight: "8px",
          }}
        >
          {prefix}
        </span>
      )}
      <span
        style={{
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 45px rgba(47, 107, 255, 0.45))",
        }}
      >
        {formattedValue}
      </span>
      {suffix && (
        <span
          style={{
            fontSize: "0.55em",
            fontWeight: theme.typography.weights.heavy,
            background: gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginLeft: "6px",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

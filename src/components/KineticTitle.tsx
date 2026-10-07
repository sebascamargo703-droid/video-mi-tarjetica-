import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface KineticTitleProps {
  line1: string;
  line2?: string;
  icon?: React.ReactNode;
  underlinePhrase?: string;
  underlineProgress?: number; // 0 to 1
  startFrame?: number;
  highlightColor?: string;
  badge?: string;
}

/**
 * Editorial Apple/Linear style Kinetic Headline
 * Clean typography, blur-to-sharp entrance, high damping, optional animated line underline.
 */
export const KineticTitle: React.FC<KineticTitleProps> = ({
  line1,
  line2,
  icon,
  underlineProgress = 0,
  startFrame = 0,
  highlightColor = theme.colors.accentBlue,
  badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const entrance = spring({
    frame: relFrame,
    fps,
    config: theme.springs.smooth,
  });

  const blurVal = interpolate(entrance, [0, 1], [16, 0]);
  const translateY = interpolate(entrance, [0, 1], [40, 0]);
  const opacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: "14%",
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        filter: `blur(${blurVal}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 50,
        width: "90%",
        maxWidth: "1400px",
        pointerEvents: "none",
      }}
    >
      {/* Optional Top Badge */}
      {badge && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 24px",
            borderRadius: theme.radii.full,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            backdropFilter: "blur(20px)",
            color: theme.colors.textSecondary,
            fontSize: "26px",
            fontWeight: theme.typography.weights.semibold,
            letterSpacing: theme.typography.letterSpacing,
            marginBottom: "20px",
          }}
        >
          {badge}
        </div>
      )}

      {/* Main Headline */}
      <h1
        style={{
          margin: 0,
          fontFamily: theme.typography.fontFamily,
          fontSize: "76px",
          fontWeight: theme.typography.weights.heavy,
          letterSpacing: theme.typography.letterSpacing,
          color: theme.colors.textPrimary,
          lineHeight: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <span>{line1}</span>
        {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      </h1>

      {line2 && (
        <div
          style={{
            position: "relative",
            marginTop: "12px",
            fontFamily: theme.typography.fontFamily,
            fontSize: "64px",
            fontWeight: theme.typography.weights.bold,
            letterSpacing: theme.typography.letterSpacing,
            color: theme.colors.textPrimary,
          }}
        >
          <span>{line2}</span>

          {/* Animated underline from left to right */}
          {underlineProgress > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: 0,
                width: `${underlineProgress * 100}%`,
                height: "6px",
                borderRadius: "3px",
                background: highlightColor,
                boxShadow: `0 0 16px ${highlightColor}`,
                transition: "width 0.05s linear",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

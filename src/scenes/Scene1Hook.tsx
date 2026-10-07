import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the hook headline
  const titleEntrance = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const titleTranslateY = interpolate(titleEntrance, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleEntrance, [0, 0.4, 1], [0, 0.9, 1]);

  // Underline animation on "te vuelvan a elegir"
  const underlineProgress = interpolate(frame, [50, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "5%", // Stays strictly in the sky, far above his head
        zIndex: 50,
      }}
    >
      {/* Category Pill */}
      <div
        style={{
          transform: `translateY(${titleTranslateY * 0.7}px)`,
          opacity: titleOpacity,
          padding: "10px 32px",
          borderRadius: 9999,
          background: "rgba(255, 59, 48, 0.95)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          color: "#FFFFFF",
          fontFamily: theme.typography.fontFamily,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
          boxShadow: "0 10px 30px rgba(255, 59, 48, 0.5)",
        }}
      >
        FIDELIZACIÓN DIGITAL INTELIGENTE 🛑
      </div>

      {/* Headline in compact frosted glass scrim in the sky */}
      <div
        style={{
          transform: `translateY(${titleTranslateY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          maxWidth: "88%",
          padding: "24px 44px",
          borderRadius: 36,
          backgroundColor: "rgba(10, 12, 22, 0.88)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: theme.typography.fontFamily,
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <span>No necesitas clientes nuevos</span>
        </h1>

        {/* Highlight Sub-phrase */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: 14,
            fontFamily: theme.typography.fontFamily,
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#70A1FF",
          }}
        >
          <span>...necesitas que te vuelvan a elegir ⚡</span>

          {underlineProgress > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: -6,
                left: 0,
                width: `${underlineProgress * 100}%`,
                height: 6,
                borderRadius: 3,
                background: "linear-gradient(90deg, #2F6BFF 0%, #34C759 100%)",
                boxShadow: "0 0 20px rgba(47, 107, 255, 0.8)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

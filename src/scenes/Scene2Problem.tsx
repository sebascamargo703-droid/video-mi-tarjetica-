import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const titleTranslateY = interpolate(entrance, [0, 1], [30, 0]);
  const titleOpacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* ─── TOP HEADER (STRICTLY IN SKY, Y: 4% - 18%) ─── */}
      <div
        style={{
          position: "absolute",
          top: "4.5%",
          left: "50%",
          transform: `translateX(-50%) translateY(${titleTranslateY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "8px 28px",
            borderRadius: 9999,
            background: "rgba(15, 23, 42, 0.92)",
            border: "2px solid #FF5252",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
            boxShadow: "0 10px 30px rgba(255, 82, 82, 0.4)",
          }}
        >
          CONSEGUIR CLIENTE NUEVO: <span style={{ color: "#FF5252" }}>5X MÁS CARO</span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.fontFamily,
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          }}
        >
          Retener clientes cuesta{" "}
          <span
            style={{
              color: "#30D158",
              textShadow: "0 0 25px rgba(48, 209, 88, 0.7)",
            }}
          >
            5 veces menos
          </span>
        </h2>
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene6Benefit3: React.FC = () => {
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
      {/* ─── TOP HEADER & WALLET BADGES (STRICTLY IN SKY, Y: 4% - 20%) ─── */}
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
            border: "2px solid #FFE600",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
            boxShadow: "0 10px 30px rgba(255, 230, 0, 0.35)",
          }}
        >
          CERO DESCARGAS • <span style={{ color: "#FFE600" }}>LISTO EN SEGUNDOS ⚡</span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.fontFamily,
            fontSize: 66,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
            marginBottom: 14,
          }}
        >
          Directo en su celular
        </h2>

        {/* Apple & Google Wallet Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 9999,
              background: "rgba(0, 0, 0, 0.88)",
              border: "1.5px solid rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
             Apple Wallet
          </div>
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 9999,
              background: "rgba(0, 0, 0, 0.88)",
              border: "1.5px solid rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            Google Wallet
          </div>
        </div>
      </div>
    </div>
  );
};

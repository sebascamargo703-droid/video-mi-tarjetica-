import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { DashboardMock } from "../components/DashboardMock";

export const Scene5Benefit2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const titleTranslateY = interpolate(entrance, [0, 1], [40, 0]);
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
      {/* ─── 1. TOP HEADER (STRICTLY IN SKY, Y: 4% - 18%) ─── */}
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
            border: "2px solid #00E676",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
            boxShadow: "0 10px 30px rgba(0, 230, 118, 0.35)",
          }}
        >
          BASE DE DATOS REAL • <span style={{ color: "#00E676" }}>NOMBRES Y VISITAS 📊</span>
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
          }}
        >
          Tu propia base de datos actualizada
        </h2>
      </div>

      {/* ─── 2. CRM DASHBOARD (PLACED IN LOWER TORSO, Y: 52% - 80%) ─── */}
      {/* Leaves face (Y: 28% - 48%) 100% UNCOVERED! */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "50%",
          transform: `translateX(-50%) scale(${entrance * 0.72})`,
          transformOrigin: "center top",
          width: "92%",
          maxWidth: 1300,
        }}
      >
        <DashboardMock startFrame={5} />
      </div>
    </div>
  );
};

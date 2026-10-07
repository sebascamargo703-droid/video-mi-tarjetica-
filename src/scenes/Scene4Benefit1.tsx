import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene4Benefit1: React.FC = () => {
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

  // iOS Notification Drop Spring in the sky area
  const notifSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 140 },
  });

  const notifTranslateY = interpolate(notifSpring, [0, 1], [-160, 0]);

  // Radar ping phase
  const waveCycle = (frame * 0.05) % 1;
  const waveSize = interpolate(waveCycle, [0, 1], [40, 240]);
  const waveOpacity = interpolate(waveCycle, [0, 0.2, 1], [0, 0.8, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* ─── 1. TOP HEADER (STRICTLY IN SKY, Y: 4% - 13%) ─── */}
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
            border: "2px solid #2F6BFF",
            color: "#70A1FF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
            boxShadow: "0 10px 30px rgba(47, 107, 255, 0.35)",
          }}
        >
          AVISO DE PROXIMIDAD • <span style={{ color: "#34C759" }}>GPS & BEACON 📍</span>
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
          Le avisa a tu cliente cuando pasa cerca
        </h2>
      </div>

      {/* ─── 2. iOS LOCKSCREEN NOTIFICATION BANNER (STRICTLY IN SKY, Y: 14% - 24%) ─── */}
      {/* Positioned right above the speaker's head so face & gesture are 100% visible! */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: `translateX(-50%) translateY(${notifTranslateY}px)`,
          width: "88%",
          maxWidth: 1200,
          background: "rgba(18, 22, 34, 0.94)",
          borderRadius: 36,
          padding: "24px 36px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: `
            0 25px 70px -10px rgba(0, 0, 0, 0.95),
            0 0 50px -10px rgba(47, 107, 255, 0.4)
          `,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Radar Location Pin */}
        <div
          style={{
            position: "relative",
            width: 70,
            height: 70,
            borderRadius: 20,
            background: "linear-gradient(135deg, #2F6BFF 0%, #7A5CFF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 20px rgba(47, 107, 255, 0.6)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 34 }}>☕</span>

          {/* Radar Ring */}
          <div
            style={{
              position: "absolute",
              width: waveSize,
              height: waveSize,
              borderRadius: "50%",
              border: "2px solid #2F6BFF",
              opacity: waveOpacity,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: 22,
                fontWeight: 800,
                color: "#70A1FF",
                letterSpacing: "0.04em",
              }}
            >
              APPLE WALLET • AHORA
            </span>
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: 18,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              A 50 metros
            </span>
          </div>

          <div
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: 32,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            ¡Estás cerca! Tu café favorito te espera ☕
          </div>

          <div
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: 22,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 4,
            }}
          >
            Tienes <span style={{ color: "#34C759" }}>9 de 10 sellos</span>. ¡Tu próxima bebida es gratis!
          </div>
        </div>
      </div>
    </div>
  );
};

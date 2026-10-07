import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene4Benefit1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for top header
  const entrance = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const titleTranslateY = interpolate(entrance, [0, 1], [30, 0]);
  const titleOpacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);

  // iOS Notification Drop Spring
  const notifSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 140 },
  });

  const notifTranslateY = interpolate(notifSpring, [0, 1], [-80, 0]);
  const notifOpacity = interpolate(notifSpring, [0, 0.3, 1], [0, 0.9, 1]);

  // Radar ping phase
  const waveCycle = (frame * 0.05) % 1;
  const waveSize = interpolate(waveCycle, [0, 1], [30, 160]);
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
      {/* ─── UNIFIED SKY CONTAINER (Header + iOS Banner with ZERO collision) ─── */}
      <div
        style={{
          position: "absolute",
          top: "3.5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "92%",
          maxWidth: 1040,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            transform: `translateY(${titleTranslateY}px)`,
            opacity: titleOpacity,
            padding: "6px 24px",
            borderRadius: 9999,
            background: "rgba(15, 23, 42, 0.94)",
            border: "1.5px solid #2F6BFF",
            color: "#70A1FF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            boxShadow: "0 8px 24px rgba(47, 107, 255, 0.35)",
          }}
        >
          AVISO DE PROXIMIDAD • <span style={{ color: "#34C759" }}>GPS & BEACON 📍</span>
        </div>

        {/* Clean Headline (Single Line, Crisp, Never Collides) */}
        <h2
          style={{
            margin: 0,
            transform: `translateY(${titleTranslateY}px)`,
            opacity: titleOpacity,
            fontFamily: theme.typography.fontFamily,
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          Le avisa a tu cliente cuando pasa cerca
        </h2>

        {/* iOS Lockscreen Notification Banner (Directly below headline with 12px gap) */}
        <div
          style={{
            transform: `translateY(${notifTranslateY}px)`,
            opacity: notifOpacity,
            width: "100%",
            background: "rgba(18, 22, 34, 0.95)",
            borderRadius: 30,
            padding: "16px 24px",
            border: "1.5px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(47, 107, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxSizing: "border-box",
          }}
        >
          {/* Radar Location Icon */}
          <div
            style={{
              position: "relative",
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2F6BFF 0%, #7A5CFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(47, 107, 255, 0.6)",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 28 }}>☕</span>

            {/* Radar Wave */}
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

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: 16,
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
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                A 50 metros
              </span>
            </div>

            <div
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: 24,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ¡Estás cerca! Tu café favorito te espera ☕
            </div>

            <div
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.75)",
                marginTop: 2,
              }}
            >
              Tienes <span style={{ color: "#34C759", fontWeight: 800 }}>9 de 10 sellos</span>. ¡Tu próxima bebida es gratis!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

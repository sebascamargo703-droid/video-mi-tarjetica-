import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Scene7CTA: React.FC = () => {
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

  // Final blackout transition (frames 125 - 145)
  const fadeToBlack = interpolate(frame, [125, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoEntrance = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: theme.springs.smooth,
  });

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
          opacity: titleOpacity * (1 - fadeToBlack),
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
            background: "rgba(255, 23, 68, 0.95)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
            boxShadow: "0 10px 30px rgba(255, 23, 68, 0.5)",
          }}
        >
          🛑 DEJA DE PERDER CLIENTES
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
          Comienza hoy en tu negocio
        </h2>
      </div>

      {/* ─── 2. SLEEK MINIMAL CTA PILL (BOTTOM SAFE AREA, LEAVES FACE 100% FREE) ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          left: "50%",
          transform: `translateX(-50%) scale(${entrance})`,
          opacity: (1 - fadeToBlack) * titleOpacity,
        }}
      >
        <div
          style={{
            padding: "20px 48px",
            borderRadius: 9999,
            background:
              "linear-gradient(135deg, rgba(0, 168, 107, 0.96) 0%, rgba(0, 77, 64, 0.96) 100%)",
            border: "2.5px solid rgba(255, 255, 255, 0.5)",
            boxShadow:
              "0 20px 50px rgba(0, 168, 107, 0.6), 0 0 30px rgba(0, 230, 118, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <span style={{ fontSize: 44 }}>💬</span>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Envíanos un mensaje
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Comenta la palabra <span style={{ color: "#FFE600" }}>TARJETICA</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. FINAL CINEMATIC ENDPLATE WITH OFFICIAL BRAND LOGO ─── */}
      {fadeToBlack > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#05090C",
            opacity: fadeToBlack,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {/* Subtle Emerald Brand Aura */}
          <div
            style={{
              position: "absolute",
              width: 900,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(0, 168, 107, 0.28) 0%, rgba(0, 77, 64, 0.08) 50%, transparent 75%)",
              pointerEvents: "none",
            }}
          />

          {/* Official White Brand Logo (Clean, High-Res Vector PNG) */}
          <div
            style={{
              position: "relative",
              transform: `scale(${logoEntrance})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("brand/mi-tarjetica-logo-blanco.png")}
              style={{
                width: 720,
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Clean Website Pill */}
          <div
            style={{
              position: "relative",
              transform: `scale(${logoEntrance})`,
              padding: "16px 48px",
              borderRadius: 9999,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                fontFamily: theme.typography.fontFamily,
              }}
            >
              www.mitarjetica.com
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

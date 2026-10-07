import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Subtitles } from "./Subtitles";

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crumpled Card Falling & Tossing Animation
  const cardEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const fallStart = 70;
  const fallProgress = interpolate(frame, [fallStart, fallStart + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardY = (1 - cardEnter) * -120 + fallProgress * 650;
  const cardRotate = (1 - cardEnter) * -15 + fallProgress * 48;
  const cardOpacity = Math.min(1, cardEnter) * (1 - fallProgress * 0.95);
  const cardScale = 1 - fallProgress * 0.35;

  // Comparison Metric Card Entrance (at frame 40)
  const metricSpring = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [168, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#07090e",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.4) 60%, #030712 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Voiceover & SFX Audio */}
      <Audio src={staticFile("audio/vo_scene2.wav")} startFrom={0} volume={1.0} />
      {frame >= 68 && (
        <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.65} />
      )}

      {/* TOP HEADER BADGE */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 28px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1.5px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "999px",
            color: "#FF5252",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "16px",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
          }}
        >
          <span>📉</span>
          <span>EL PROBLEMA DEL CARTONCITO</span>
        </div>
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "56px",
            lineHeight: "1.15",
            textTransform: "uppercase",
            textShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          El Cartón Se Pierde <br />
          <span style={{ color: "#FF5252" }}>Y Con Él, Tu Cliente</span>
        </h1>
      </div>

      {/* CRUMPLED PAPER CARD ANIMATION (Falling into Discard) */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, ${cardY}px) rotate(${cardRotate}deg) scale(${cardScale})`,
          opacity: cardOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: 480,
            height: 290,
            backgroundColor: "#dfd5c3",
            backgroundImage:
              "linear-gradient(135deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(225deg, rgba(0,0,0,0.06) 25%, transparent 25%)",
            borderRadius: "16px",
            border: "3px dashed #8c7853",
            boxShadow: "0 25px 50px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.15)",
            padding: "24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Crumple effect stamp & X marks */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #8c7853",
              paddingBottom: "10px",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: "20px", color: "#4a3b2c" }}>
              TARJETA DE PUNTOS
            </span>
            <span style={{ fontSize: "16px", color: "#8c7853", fontWeight: 700 }}>
              SE PIERDE FÁCIL 🗑️
            </span>
          </div>

          {/* Stamp slots crossed out */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                style={{
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: "2px dashed #8c7853",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "18px",
                  color: n <= 3 ? "#d32f2f" : "#8c7853",
                  fontWeight: 900,
                }}
              >
                {n <= 3 ? "✕" : ""}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#6b583e",
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            Nombre: Cliente Olvidado _________________
          </div>

          {/* Giant Red Stamp: PERDIDA */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "15%",
              transform: "rotate(-18deg)",
              border: "5px solid #d32f2f",
              color: "#d32f2f",
              padding: "8px 24px",
              borderRadius: "12px",
              fontWeight: 900,
              fontSize: "36px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              backgroundColor: "rgba(255, 235, 238, 0.8)",
              boxShadow: "0 0 20px rgba(211, 47, 47, 0.4)",
            }}
          >
            ¡DESECHADA!
          </div>
        </div>
      </div>

      {/* 5X COST COMPARISON CARD (Appears at mid-point) */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${metricSpring})`,
          width: "90%",
          maxWidth: "920px",
          backgroundColor: "rgba(20, 26, 40, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "32px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(239, 68, 68, 0.3)",
          padding: "36px",
          boxSizing: "border-box",
          zIndex: 35,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              color: "#FF5252",
              fontSize: "22px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            DATO CLAVE DE RENTABILIDAD
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "42px",
              fontWeight: 900,
              marginTop: "6px",
              fontFamily: "var(--font-montserrat, sans-serif)",
            }}
          >
            Retener Cuesta <span style={{ color: "#00E676" }}>5x Menos</span>
          </div>
        </div>

        {/* Cost comparison bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#e2e8f0",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              <span>Conseguir cliente nuevo (Ads / Publicidad)</span>
              <span style={{ color: "#FF5252", fontWeight: 900 }}>500% Más Costoso</span>
            </div>
            <div
              style={{
                height: "22px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, #FF1744 0%, #FF5252 100%)",
                  borderRadius: "12px",
                  boxShadow: "0 0 20px rgba(255, 23, 68, 0.6)",
                }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#e2e8f0",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              <span>Hacer que vuelva quien ya te compró</span>
              <span style={{ color: "#00E676", fontWeight: 900 }}>Máximo Retorno</span>
            </div>
            <div
              style={{
                height: "22px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "20%",
                  height: "100%",
                  background: "linear-gradient(90deg, #00E676 0%, #00F5D4 100%)",
                  borderRadius: "12px",
                  boxShadow: "0 0 20px rgba(0, 230, 118, 0.6)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hormozi Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={90}
        words={[
          { text: "RETENER", highlight: true, highlightColor: "yellow" },
          { text: "CUESTA", highlight: false },
          { text: "5X MENOS 📉", highlight: true, highlightColor: "green" },
        ]}
        yOffset={300}
      />

      <Subtitles
        startFrame={91}
        endFrame={180}
        words={[
          { text: "DALES UN MOTIVO" },
          { text: "PARA VOLVER", highlight: true, highlightColor: "yellow", emoji: "🎁" },
        ]}
        yOffset={300}
      />
    </div>
  );
};

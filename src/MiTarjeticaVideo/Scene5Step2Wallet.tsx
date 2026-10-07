import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Subtitles } from "./Subtitles";

export const Scene5Step2Wallet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slide-down into Apple Wallet stack
  const cardStackSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 120 },
  });

  const cardY = (1 - cardStackSpring) * -240;

  // Wallet Add Prompt Click at frame 40
  const isAdded = frame >= 40;
  const addBadgeSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
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
        backgroundColor: "#070b14",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, rgba(14, 165, 233, 0.2) 0%, rgba(15, 23, 42, 0.5) 60%, #030712 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Voiceover */}
      <Audio src={staticFile("audio/vo_scene5.wav")} startFrom={0} volume={1.0} />
      {frame >= 40 && (
        <Audio src={staticFile("audio/click_pop.wav")} startFrom={0} volume={0.8} />
      )}

      {/* TOP HEADER */}
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
            padding: "8px 26px",
            background: "rgba(14, 165, 233, 0.2)",
            border: "1.5px solid #38bdf8",
            borderRadius: "999px",
            color: "#38bdf8",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "14px",
            boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)",
          }}
        >
          <span>⚡</span>
          <span>PASO 2: CERO FRICCIÓN</span>
        </div>
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "56px",
            lineHeight: "1.12",
            textTransform: "uppercase",
            textShadow: "0 10px 40px rgba(0,0,0,0.9)",
          }}
        >
          Sin Apps Pesadas <br />
          <span
            style={{
              background: "linear-gradient(90deg, #38bdf8 0%, #00E676 50%, #FFE600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Apple & Google Wallet
          </span>
        </h1>
      </div>

      {/* WALLET STACK VISUAL SHOWCASE */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "88%",
          maxWidth: "880px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        {/* Pass Card Being Added into Wallet */}
        <div
          style={{
            width: "100%",
            transform: `translateY(${cardY}px)`,
            background: "linear-gradient(145deg, #064e3b 0%, #022c22 60%, #0f172a 100%)",
            borderRadius: "32px",
            padding: "32px",
            boxSizing: "border-box",
            border: "2px solid #00E676",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(0, 230, 118, 0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div>
            <div style={{ color: "#6ee7b7", fontSize: "14px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
              PASS NATIVO DE FIDELIZACIÓN
            </div>
            <div style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: 900, fontFamily: "var(--font-montserrat, sans-serif)", marginTop: "4px" }}>
              Café & Bistró ☕
            </div>
            <div style={{ color: "#cbd5e1", fontSize: "18px", fontWeight: 700, marginTop: "8px" }}>
              Acumula sellos en cada compra
            </div>
          </div>

          <div
            style={{
              backgroundColor: isAdded ? "#00E676" : "#FFFFFF",
              color: "#000000",
              fontWeight: 900,
              fontSize: "18px",
              padding: "14px 28px",
              borderRadius: "20px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              transform: isAdded ? `scale(${addBadgeSpring})` : "scale(1)",
            }}
          >
            <span>{isAdded ? "✓ Guardado" : "Añadir +"}</span>
          </div>
        </div>

        {/* Feature Comparison Grid Below */}
        <div
          style={{
            marginTop: "36px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              padding: "24px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "38px", marginBottom: "8px" }}>🚀</div>
            <div style={{ color: "#FFFFFF", fontWeight: 900, fontSize: "20px" }}>En 3 Segundos</div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Escanean el QR y listo</div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0, 230, 118, 0.4)",
              borderRadius: "24px",
              padding: "24px 16px",
              textAlign: "center",
              boxShadow: "0 0 25px rgba(0, 230, 118, 0.2)",
            }}
          >
            <div style={{ fontSize: "38px", marginBottom: "8px" }}>🚫</div>
            <div style={{ color: "#00E676", fontWeight: 900, fontSize: "20px" }}>Cero Apps</div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>No ocupa memoria</div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              padding: "24px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "38px", marginBottom: "8px" }}>🔒</div>
            <div style={{ color: "#FFFFFF", fontWeight: 900, fontSize: "20px" }}>100% Seguro</div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Apple & Google Wallet</div>
          </div>
        </div>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={90}
        words={[
          { text: "2. SIN APPS" },
          { text: "PESADAS ⚡", highlight: true, highlightColor: "cyan" },
        ]}
        yOffset={320}
      />

      <Subtitles
        startFrame={91}
        endFrame={180}
        words={[
          { text: "EN APPLE & GOOGLE" },
          { text: "WALLET EN 3 SEGUNDOS", highlight: true, highlightColor: "green", emoji: "📲" },
        ]}
        yOffset={320}
      />
    </div>
  );
};
